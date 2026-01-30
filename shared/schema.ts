import { isAscii } from "buffer";
import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deals = pgTable("deals", {
   id: serial("id").primaryKey(),
  destination: text("destination").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("originalPrice"),
  departureDate: date("departure_date").notNull(),
  returnDate: date("return_date").notNull(),
  imageUrl: text("image_url").notNull(),
  bookingLink: text("booking_link").notNull(),
  description: text("description"),
  airline: text("airline"),
  airport: text("airport"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
});

export type DealImage = {
  title: string;
  eyebrow: string;
  price: number;
  route?: string;
  background: string;
  backgroundSize?: string;
  dates: string;
  airport: string;
  airline?: string;
  size?: string;
};

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
