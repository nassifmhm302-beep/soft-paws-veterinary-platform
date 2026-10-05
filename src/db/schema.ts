import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ======================================================================
   CLINICS
   ====================================================================== */
export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 40 }),
  email: varchar("email", { length: 180 }),
  whatsappNumber: varchar("whatsapp_number", { length: 40 }),
  whatsappLink: text("whatsapp_link"),
  instagramLink: text("instagram_link"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ======================================================================
   BRANCHES
   ====================================================================== */
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  whatsapp: varchar("whatsapp", { length: 40 }),
  googleMapsUrl: text("google_maps_url"),
  /** { "0": [["10:00","20:00"]], ... } keyed by day-of-week (0=Sun..6=Sat), empty array = closed */
  openingHours: jsonb("opening_hours").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 6 }),
  longitude: numeric("longitude", { precision: 10, scale: 6 }),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("branches_slug_idx").on(table.slug),
]);

/* ======================================================================
   DOCTORS
   ====================================================================== */
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  specialty: varchar("specialty", { length: 180 }).notNull(),
  bio: text("bio").notNull(),
  experience: varchar("experience", { length: 120 }),
  certificates: jsonb("certificates").$type<string[]>().default([]),
  imageUrl: text("image_url").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("doctors_slug_idx").on(table.slug),
]);

/* ======================================================================
   SERVICES
   ====================================================================== */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  whatWeProvide: jsonb("what_we_provide").$type<string[]>().default([]),
  whenNeeded: jsonb("when_needed").$type<string[]>().default([]),
  process: jsonb("process").$type<{ title: string; description: string }[]>().default([]),
  faq: jsonb("faq").$type<{ question: string; answer: string }[]>().default([]),
  imageUrl: text("image_url").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("services_slug_idx").on(table.slug),
]);

/* ======================================================================
   PRODUCT CATEGORIES
   ====================================================================== */
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
}, (table) => [
  uniqueIndex("product_categories_slug_idx").on(table.slug),
]);

/* ======================================================================
   PRODUCTS
   ====================================================================== */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => productCategories.id),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  brand: varchar("brand", { length: 120 }).notNull(),
  description: text("description").notNull(),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  ingredients: jsonb("ingredients").$type<string[]>().default([]),
  usage: text("usage"),
  warnings: text("warnings"),
  specifications: jsonb("specifications").$type<{ label: string; value: string }[]>().default([]),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("4.5"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  petType: varchar("pet_type", { length: 40 }).notNull().default("both"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("products_slug_idx").on(table.slug),
  index("products_category_idx").on(table.categoryId),
]);

/* ======================================================================
   JUNCTION TABLES
   ====================================================================== */
export const doctorServices = pgTable("doctor_services", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
}, (table) => [
  uniqueIndex("doctor_services_unique_idx").on(table.doctorId, table.serviceId),
]);

export const doctorBranches = pgTable("doctor_branches", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
}, (table) => [
  uniqueIndex("doctor_branches_unique_idx").on(table.doctorId, table.branchId),
]);

export const serviceProducts = pgTable("service_products", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
}, (table) => [
  uniqueIndex("service_products_unique_idx").on(table.serviceId, table.productId),
]);

/* ======================================================================
   BOOKINGS
   ====================================================================== */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingNumber: varchar("booking_number", { length: 40 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),

  petType: varchar("pet_type", { length: 20 }).notNull(),
  petName: varchar("pet_name", { length: 120 }).notNull(),
  petAge: varchar("pet_age", { length: 40 }),
  petGender: varchar("pet_gender", { length: 20 }),
  petNotes: text("pet_notes"),

  serviceId: integer("service_id").references(() => services.id),
  serviceName: varchar("service_name", { length: 180 }).notNull(),

  branchId: integer("branch_id").references(() => branches.id),
  branchName: varchar("branch_name", { length: 180 }).notNull(),

  doctorId: integer("doctor_id").references(() => doctors.id),
  doctorName: varchar("doctor_name", { length: 180 }).notNull(),

  appointmentDate: varchar("appointment_date", { length: 10 }).notNull(),
  appointmentTime: varchar("appointment_time", { length: 5 }).notNull(),

  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  customerWhatsapp: varchar("customer_whatsapp", { length: 40 }),
  customerEmail: varchar("customer_email", { length: 180 }),
  customerAddress: text("customer_address"),
  customerCity: varchar("customer_city", { length: 120 }),
  customerNotes: text("customer_notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  emailStatus: varchar("email_status", { length: 20 }).notNull().default("pending"),
  whatsappStatus: varchar("whatsapp_status", { length: 20 }).notNull().default("not_sent"),
  idempotencyKey: varchar("idempotency_key", { length: 120 }).notNull(),
}, (table) => [
  uniqueIndex("bookings_booking_number_idx").on(table.bookingNumber),
  uniqueIndex("bookings_idempotency_key_idx").on(table.idempotencyKey),
  index("bookings_customer_phone_idx").on(table.customerPhone),
  index("bookings_customer_email_idx").on(table.customerEmail),
  index("bookings_appointment_date_idx").on(table.appointmentDate),
  index("bookings_doctor_idx").on(table.doctorId),
  index("bookings_branch_idx").on(table.branchId),
  index("bookings_status_idx").on(table.status),
  index("bookings_created_at_idx").on(table.createdAt),
  check(
    "bookings_status_check",
    sql`${table.status} in ('pending','contacted','confirmed','completed','cancelled','failed')`
  ),
  check(
    "bookings_pet_type_check",
    sql`${table.petType} in ('dog','cat','other')`
  ),
]);

/* ======================================================================
   BOOKING EVENTS
   ====================================================================== */
export const bookingEvents = pgTable("booking_events", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 40 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("booking_events_booking_idx").on(table.bookingId),
  index("booking_events_type_idx").on(table.eventType),
]);

/* ======================================================================
   ORDERS (Shop checkout)
   ====================================================================== */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),

  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  customerWhatsapp: varchar("customer_whatsapp", { length: 40 }),
  customerEmail: varchar("customer_email", { length: 180 }),
  address: text("address").notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  notes: text("notes"),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull().default("cash_on_delivery"),

  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),

  idempotencyKey: varchar("idempotency_key", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("orders_order_number_idx").on(table.orderNumber),
  uniqueIndex("orders_idempotency_key_idx").on(table.idempotencyKey),
  index("orders_customer_phone_idx").on(table.customerPhone),
  index("orders_status_idx").on(table.status),
]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 200 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
}, (table) => [
  index("order_items_order_idx").on(table.orderId),
]);
