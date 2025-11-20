import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Student details
  studentName: text("student_name").notNull(),
  collegeName: text("college_name").notNull(),
  usn: text("usn").notNull(),
  department: text("department").notNull(),
  semester: text("semester").notNull(),
  class: text("class").notNull(),
  year: text("year").notNull(),
  
  // File information
  fileNames: text("file_names").array().notNull(),
  filePaths: text("file_paths").array().notNull(),
  
  // Print options
  printType: text("print_type").notNull(), // "bw" or "color"
  copies: integer("copies").notNull().default(1),
  sides: text("sides").notNull(), // "single" or "double"
  pageCount: integer("page_count").notNull(),
  
  // Additional services
  stapling: boolean("stapling").notNull().default(false),
  spiralBinding: boolean("spiral_binding").notNull().default(false),
  graphSheet: boolean("graph_sheet").notNull().default(false),
  recordSheet: boolean("record_sheet").notNull().default(false),
  
  // Delivery
  deliverySpeed: text("delivery_speed").notNull().default("normal"), // "normal", "fast", "express"
  
  // Pricing
  subtotal: real("subtotal").notNull(),
  extras: real("extras").notNull(),
  total: real("total").notNull(),
  
  // Shop assignment
  assignedShop: text("assigned_shop").notNull(),
  shopQueue: integer("shop_queue").notNull(),
  
  // Status and tracking
  status: text("status").notNull().default("pending"), // "pending", "printing", "delivered"
  expectedDeliveryTime: text("expected_delivery_time").notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Pricing constants
export const PRICING = {
  BW_PER_PAGE: 3,
  COLOR_PER_PAGE: 11,
  STAPLING: 2,
  SPIRAL_BINDING: 20,
  GRAPH_SHEET: 5,
  RECORD_SHEET: 10,
  FAST_DELIVERY: 5,
  EXPRESS_DELIVERY: 10,
} as const;

// Shop data
export const SHOPS = [
  { id: "techprint", name: "TechPrint Xerox", baseQueue: 2 },
  { id: "smartcopy", name: "SmartCopy Center", baseQueue: 5 },
  { id: "quickprint", name: "QuickPrint Hub", baseQueue: 1 },
] as const;

// Delivery time estimates
export const DELIVERY_TIMES = {
  normal: "2 hours",
  fast: "1 hour",
  express: "30 minutes",
} as const;
