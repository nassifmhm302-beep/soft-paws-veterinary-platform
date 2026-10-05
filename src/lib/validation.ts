import { z } from "zod";

const phoneRegex = /^[+0-9][0-9\s-]{7,20}$/;

export const bookingSchema = z.object({
  petType: z.enum(["dog", "cat", "other"], { message: "يرجى اختيار نوع الحيوان." }),
  petName: z.string().trim().min(1, "يرجى إدخال اسم الحيوان."),
  petAge: z.string().trim().optional().default(""),
  petGender: z.enum(["male", "female", "unknown"]).optional().default("unknown"),
  petNotes: z.string().trim().optional().default(""),

  serviceSlug: z.string().trim().min(1, "يرجى اختيار الخدمة."),
  branchSlug: z.string().trim().min(1, "يرجى اختيار الفرع."),
  doctorSlug: z.string().trim().min(1, "يرجى اختيار الطبيب."),

  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "يرجى اختيار تاريخ صحيح."),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "يرجى اختيار وقت صحيح."),

  customerName: z.string().trim().min(2, "يرجى إدخال الاسم الكامل."),
  customerPhone: z.string().trim().regex(phoneRegex, "يرجى إدخال رقم هاتف صحيح."),
  customerWhatsapp: z.string().trim().optional().default(""),
  customerEmail: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "يرجى إدخال بريد إلكتروني صحيح."),
  customerAddress: z.string().trim().optional().default(""),
  customerCity: z.string().trim().optional().default(""),
  customerNotes: z.string().trim().optional().default(""),

  idempotencyKey: z.string().trim().min(8).max(120),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "السلة فارغة."),
  customerName: z.string().trim().min(2, "يرجى إدخال الاسم الكامل."),
  customerPhone: z.string().trim().regex(phoneRegex, "يرجى إدخال رقم هاتف صحيح."),
  customerWhatsapp: z.string().trim().optional().default(""),
  customerEmail: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "يرجى إدخال بريد إلكتروني صحيح."),
  address: z.string().trim().min(5, "يرجى إدخال عنوان مفصل."),
  city: z.string().trim().min(2, "يرجى إدخال المدينة."),
  notes: z.string().trim().optional().default(""),
  paymentMethod: z.enum(["cash_on_delivery", "bank_transfer"]).default("cash_on_delivery"),
  idempotencyKey: z.string().trim().min(8).max(120),
});

export type OrderInput = z.infer<typeof orderSchema>;
