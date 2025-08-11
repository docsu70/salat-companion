import { type SelectionList, type InsertSelectionList, type UpdateSelectionList, selectionLists } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSelectionList(id: string): Promise<SelectionList | undefined>;
  getSelectionListByName(name: string): Promise<SelectionList | undefined>;
  getAllSelectionLists(): Promise<SelectionList[]>;
  createSelectionList(list: InsertSelectionList): Promise<SelectionList>;
  updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined>;
  deleteSelectionList(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultLists() {
    try {
      // Check if we already have the default lists
      const existingLists = await db.select().from(selectionLists);
      
      if (existingLists.length === 0) {
        // Create the three default lists
        const defaultLists = [
          { name: "سور/آيات قصيرة", items: [] },
          { name: "سور/آيات طويلة", items: [] },
          { name: "أيات مقترحة للحفظ", items: [] }
        ];
        
        for (const list of defaultLists) {
          await db.insert(selectionLists).values(list);
        }
      }
    } catch (error) {
      console.error("Error initializing default lists:", error);
    }
  }

  async getSelectionList(id: string): Promise<SelectionList | undefined> {
    const [list] = await db.select().from(selectionLists).where(eq(selectionLists.id, id));
    return list || undefined;
  }

  async getSelectionListByName(name: string): Promise<SelectionList | undefined> {
    const [list] = await db.select().from(selectionLists).where(eq(selectionLists.name, name));
    return list || undefined;
  }

  async getAllSelectionLists(): Promise<SelectionList[]> {
    return await db.select().from(selectionLists);
  }

  async createSelectionList(insertList: InsertSelectionList): Promise<SelectionList> {
    const [list] = await db
      .insert(selectionLists)
      .values(insertList)
      .returning();
    return list;
  }

  async updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined> {
    const [list] = await db
      .update(selectionLists)
      .set(updates)
      .where(eq(selectionLists.id, id))
      .returning();
    return list || undefined;
  }

  async deleteSelectionList(id: string): Promise<boolean> {
    const result = await db
      .delete(selectionLists)
      .where(eq(selectionLists.id, id));
    return result.rowCount > 0;
  }
}

// Create and initialize the database storage instance
const databaseStorage = new DatabaseStorage();

// Initialize the database with default lists on startup
databaseStorage.initializeDefaultLists().catch(console.error);

export const storage = databaseStorage;
