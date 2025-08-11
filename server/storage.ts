import { type SelectionList, type InsertSelectionList, type UpdateSelectionList } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSelectionList(id: string): Promise<SelectionList | undefined>;
  getSelectionListByName(name: string): Promise<SelectionList | undefined>;
  getAllSelectionLists(): Promise<SelectionList[]>;
  createSelectionList(list: InsertSelectionList): Promise<SelectionList>;
  updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined>;
  deleteSelectionList(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private lists: Map<string, SelectionList>;

  constructor() {
    this.lists = new Map();
    
    // Initialize with two default lists
    const list1: SelectionList = {
      id: "list-1",
      name: "سور/آيات قصيرة",
      items: []
    };
    
    const list2: SelectionList = {
      id: "list-2", 
      name: "سور/آيات طويلة",
      items: []
    };
    
    const list3: SelectionList = {
      id: "list-3",
      name: "أيات مقترحة للحفظ",
      items: []
    };
    
    this.lists.set(list1.id, list1);
    this.lists.set(list2.id, list2);
    this.lists.set(list3.id, list3);
  }

  async getSelectionList(id: string): Promise<SelectionList | undefined> {
    return this.lists.get(id);
  }

  async getSelectionListByName(name: string): Promise<SelectionList | undefined> {
    return Array.from(this.lists.values()).find(
      (list) => list.name === name,
    );
  }

  async getAllSelectionLists(): Promise<SelectionList[]> {
    return Array.from(this.lists.values());
  }

  async createSelectionList(insertList: InsertSelectionList): Promise<SelectionList> {
    const id = randomUUID();
    const list: SelectionList = { 
      id, 
      name: insertList.name, 
      items: insertList.items || [] 
    };
    this.lists.set(id, list);
    return list;
  }

  async updateSelectionList(id: string, updates: UpdateSelectionList): Promise<SelectionList | undefined> {
    const existingList = this.lists.get(id);
    if (!existingList) {
      return undefined;
    }
    
    const updatedList: SelectionList = { 
      ...existingList, 
      ...(updates.name && { name: updates.name }),
      ...(updates.items && { items: updates.items })
    };
    this.lists.set(id, updatedList);
    return updatedList;
  }

  async deleteSelectionList(id: string): Promise<boolean> {
    return this.lists.delete(id);
  }
}

export const storage = new MemStorage();
