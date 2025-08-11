import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const selectionLists = pgTable("selection_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  items: json("items").$type<string[]>().notNull().default([]),
});

export const insertSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true,
});

export const updateSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true,
}).partial();

export type InsertSelectionList = z.infer<typeof insertSelectionListSchema>;
export type UpdateSelectionList = z.infer<typeof updateSelectionListSchema>;
export type SelectionList = typeof selectionLists.$inferSelect;
