import { 
  type SelectionList, 
  type InsertSelectionList, 
  type UpdateSelectionList,
  type SelectionHistory,
  type InsertSelectionHistory,
  type SelectionCycle,
  selectionLists,
  selectionHistory,
  selectionCycle
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getSelectionList(id: string): Promise<SelectionList | undefined>;
  getSelectionListByName(name: string): Promise<SelectionList | undefined>;
  getAllSelectionLists(): Promise<SelectionList[]>;
  createSelectionList(list: InsertSelectionList): Promise<SelectionList>;
  updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined>;
  deleteSelectionList(id: string): Promise<boolean>;
  getCurrentCycle(): Promise<string>;
  getSelectionHistory(cycle: string): Promise<SelectionHistory[]>;
  addSelectionToHistory(selection: InsertSelectionHistory): Promise<SelectionHistory>;
  resetSelectionCycle(): Promise<string>;
  getUnselectedItems(listId: string, cycle: string): Promise<string[]>;
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
          await db.insert(selectionLists).values({
            name: list.name,
            items: list.items
          });
        }
      }

      // Ensure we have a selection cycle entry
      const existingCycle = await db.select().from(selectionCycle).limit(1);
      if (existingCycle.length === 0) {
        await db.insert(selectionCycle).values({
          currentCycle: randomUUID()
        });
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
      .values({
        name: insertList.name,
        items: insertList.items || []
      } as any)
      .returning();
    return list;
  }

  async updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined> {
    const updateData: any = { ...updates };
    if (updates.items) {
      updateData.items = Array.from(updates.items);
    }
    
    const [list] = await db
      .update(selectionLists)
      .set(updateData)
      .where(eq(selectionLists.id, id))
      .returning();
    return list || undefined;
  }

  async deleteSelectionList(id: string): Promise<boolean> {
    const result = await db
      .delete(selectionLists)
      .where(eq(selectionLists.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getCurrentCycle(): Promise<string> {
    const [cycle] = await db.select().from(selectionCycle).limit(1);
    if (!cycle) {
      // Create a new cycle if none exists
      const newCycleId = randomUUID();
      await db.insert(selectionCycle).values({
        currentCycle: newCycleId
      });
      return newCycleId;
    }
    return cycle.currentCycle;
  }

  async getSelectionHistory(cycle: string): Promise<SelectionHistory[]> {
    return await db.select()
      .from(selectionHistory)
      .where(eq(selectionHistory.selectionCycle, cycle));
  }

  async addSelectionToHistory(selection: InsertSelectionHistory): Promise<SelectionHistory> {
    const [history] = await db.insert(selectionHistory).values(selection).returning();
    return history;
  }

  async resetSelectionCycle(): Promise<string> {
    const newCycleId = randomUUID();
    const [cycle] = await db.select().from(selectionCycle).limit(1);
    
    if (cycle) {
      await db
        .update(selectionCycle)
        .set({ 
          currentCycle: newCycleId, 
          updatedAt: sql`now()` 
        })
        .where(eq(selectionCycle.id, cycle.id));
    } else {
      await db.insert(selectionCycle).values({
        currentCycle: newCycleId
      });
    }
    
    return newCycleId;
  }

  async getUnselectedItems(listId: string, cycle: string): Promise<string[]> {
    const list = await this.getSelectionList(listId);
    if (!list) return [];

    const selectedItems = await db.select()
      .from(selectionHistory)
      .where(and(
        eq(selectionHistory.listId, listId),
        eq(selectionHistory.selectionCycle, cycle)
      ));

    const selectedItemNames = selectedItems.map(h => h.selectedItem);
    return list.items.filter(item => !selectedItemNames.includes(item));
  }
}

// Create and initialize the database storage instance
const databaseStorage = new DatabaseStorage();

// Initialize the database with default lists on startup
databaseStorage.initializeDefaultLists().catch(console.error);

export const storage = databaseStorage;
