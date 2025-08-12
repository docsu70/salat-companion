import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const selectionLists = pgTable("selection_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  items: json("items").$type<string[]>().notNull().default([]),
});

export const selectionHistory = pgTable("selection_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listId: varchar("list_id").notNull(),
  selectedItem: text("selected_item").notNull(),
  selectionCycle: varchar("selection_cycle").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const selectionCycle = pgTable("selection_cycle", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentCycle: varchar("current_cycle").notNull().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true,
});

export const updateSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true,
}).partial();

export const insertSelectionHistorySchema = createInsertSchema(selectionHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertSelectionList = z.infer<typeof insertSelectionListSchema>;
export type UpdateSelectionList = z.infer<typeof updateSelectionListSchema>;
export type SelectionList = typeof selectionLists.$inferSelect;
export type SelectionHistory = typeof selectionHistory.$inferSelect;
export type InsertSelectionHistory = z.infer<typeof insertSelectionHistorySchema>;
export type SelectionCycle = typeof selectionCycle.$inferSelect;
