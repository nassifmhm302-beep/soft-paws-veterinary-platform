import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { orderSchema } from "@/lib/validation";
import { generateBookingNumber } from "@/lib/booking-number";
import { sendOrderNotification } from "@/lib/email";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const SHIPPING_FLAT_RATE = 20;
const FREE_SHIPPING_THRESHOLD = 250;

export async function POST(req: Request) {
  const clientKey = getClientKey(req);
  const limit = rateLimit(`order:${clientKey}`, 8, 10 * 60 * 1000);
  if (!limit.allowed) {
    return Response.json({ ok: false, error: "عدد محاولات كبير، يرجى المحاولة لاحقًا." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "طلب غير صالح." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "البيانات المُرسلة غير صحيحة.";
    return Response.json({ ok: false, error: firstError, fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const input = parsed.data;

  const existingByKey = await db.select().from(orders).where(eq(orders.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existingByKey.length > 0) {
    return Response.json({ ok: true, order: serializeOrder(existingByKey[0]), reused: true });
  }

  const productIds = input.items.map((i) => i.productId);
  const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  const lineItems: { productId: number; name: string; unitPrice: number; quantity: number }[] = [];
  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.active) {
      return Response.json({ ok: false, error: "أحد المنتجات لم يعد متاحًا، يرجى تحديث السلة." }, { status: 422 });
    }
    if (product.stock < item.quantity) {
      return Response.json(
        { ok: false, error: `الكمية المطلوبة من "${product.name}" غير متوفرة حاليًا.` },
        { status: 422 }
      );
    }
    lineItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: Number(product.price),
      quantity: item.quantity,
    });
  }

  const subtotal = lineItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;
  const orderNumber = generateBookingNumber("ORD");

  let insertedId: number;
  try {
    const created = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          status: "pending",
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerWhatsapp: input.customerWhatsapp || null,
          customerEmail: input.customerEmail || null,
          address: input.address,
          city: input.city,
          notes: input.notes || null,
          paymentMethod: input.paymentMethod,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
          idempotencyKey: input.idempotencyKey,
        })
        .returning();

      await tx.insert(orderItems).values(
        lineItems.map((i) => ({
          orderId: order.id,
          productId: i.productId,
          productName: i.name,
          unitPrice: i.unitPrice.toFixed(2),
          quantity: i.quantity,
        }))
      );

      for (const item of lineItems) {
        await tx
          .update(products)
          .set({ stock: (productMap.get(item.productId)!.stock - item.quantity) })
          .where(eq(products.id, item.productId));
      }

      return order;
    });
    insertedId = created.id;
  } catch (error) {
    console.error("Order insert failed", error);
    return Response.json({ ok: false, error: "تعذر إنشاء الطلب، يرجى المحاولة مرة أخرى." }, { status: 500 });
  }

  const [persisted] = await db.select().from(orders).where(eq(orders.id, insertedId)).limit(1);

  await sendOrderNotification({
    orderNumber: persisted.orderNumber,
    customerName: persisted.customerName,
    customerPhone: persisted.customerPhone,
    total: persisted.total,
    city: persisted.city,
    items: lineItems.map((i) => ({ name: i.name, quantity: i.quantity })),
  });

  return Response.json({ ok: true, order: serializeOrder(persisted) });
}

function serializeOrder(order: typeof orders.$inferSelect) {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
  };
}
