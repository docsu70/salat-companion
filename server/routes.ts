import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSelectionListSchema, updateSelectionListSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all selection lists
  app.get("/api/lists", async (_req, res) => {
    try {
      const lists = await storage.getAllSelectionLists();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lists" });
    }
  });

  // Get a specific selection list
  app.get("/api/lists/:id", async (req, res) => {
    try {
      const list = await storage.getSelectionList(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch list" });
    }
  });

  // Create a new selection list
  app.post("/api/lists", async (req, res) => {
    try {
      const validatedData = insertSelectionListSchema.parse(req.body);
      const list = await storage.createSelectionList(validatedData);
      res.status(201).json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid list data" });
    }
  });

  // Update a selection list
  app.patch("/api/lists/:id", async (req, res) => {
    try {
      const validatedData = updateSelectionListSchema.parse(req.body);
      const updatedList = await storage.updateSelectionList(req.params.id, validatedData);
      if (!updatedList) {
        return res.status(404).json({ message: "List not found" });
      }
      res.json(updatedList);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Add item to a list
  app.post("/api/lists/:id/items", async (req, res) => {
    try {
      const { item } = req.body;
      if (!item || typeof item !== 'string' || item.trim().length === 0) {
        return res.status(400).json({ message: "Item is required and must be a non-empty string" });
      }

      const list = await storage.getSelectionList(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      const updatedItems = [...list.items, item.trim()];
      const updatedList = await storage.updateSelectionList(req.params.id, { items: updatedItems });
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item" });
    }
  });

  // Remove item from a list
  app.delete("/api/lists/:id/items/:index", async (req, res) => {
    try {
      const index = parseInt(req.params.index);
      if (isNaN(index) || index < 0) {
        console.log("Invalid index:", req.params.index, "parsed:", index);
        return res.status(400).json({ message: "Invalid item index" });
      }

      const list = await storage.getSelectionList(req.params.id);
      if (!list) {
        console.log("List not found:", req.params.id);
        return res.status(404).json({ message: "List not found" });
      }

      if (index >= list.items.length) {
        console.log("Index out of bounds:", index, "list length:", list.items.length);
        return res.status(400).json({ message: "Item index out of bounds" });
      }

      const updatedItems = list.items.filter((_, i) => i !== index);
      const updatedList = await storage.updateSelectionList(req.params.id, { items: updatedItems });
      res.json(updatedList);
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ message: "Failed to remove item" });
    }
  });

  // Clear all items from a list
  app.delete("/api/lists/:id/items", async (req, res) => {
    try {
      const list = await storage.getSelectionList(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      const updatedList = await storage.updateSelectionList(req.params.id, { items: [] });
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: "Failed to clear list" });
    }
  });

  // Generate random selections with "select once until all selected" logic
  app.post("/api/generate-selections", async (_req, res) => {
    try {
      // Optimize by getting lists and cycle in parallel
      const [lists, currentCycle] = await Promise.all([
        storage.getAllSelectionLists(),
        storage.getCurrentCycle()
      ]);

      const list1 = lists.find(l => l.name === "سور/آيات قصيرة");
      const list2 = lists.find(l => l.name === "سور/آيات طويلة");
      const list3 = lists.find(l => l.name === "أيات مقترحة للحفظ");

      if (!list1 || !list2 || !list3) {
        return res.status(404).json({ message: "Required lists not found" });
      }

      if (list1.items.length === 0 || list2.items.length === 0 || list3.items.length === 0) {
        console.log("Empty lists detected:", {
          list1Count: list1.items.length,
          list2Count: list2.items.length,
          list3Count: list3.items.length
        });
        return res.status(400).json({ message: "حدث خطأ" });
      }

      // Get unselected items from all three lists in parallel
      const [unselectedList1, unselectedList2, unselectedList3] = await Promise.all([
        storage.getUnselectedItems(list1.id, currentCycle),
        storage.getUnselectedItems(list2.id, currentCycle),
        storage.getUnselectedItems(list3.id, currentCycle)
      ]);

      let list1Selection: string, list2Selection: string, list3Selection: string;
      let cycleToUse = currentCycle;

      // If any list has no unselected items, reset the cycle and start fresh
      if (unselectedList1.length === 0 || unselectedList2.length === 0 || unselectedList3.length === 0) {
        cycleToUse = await storage.resetSelectionCycle();
        
        // Make selections from fresh lists
        list1Selection = list1.items[Math.floor(Math.random() * list1.items.length)];
        list2Selection = list2.items[Math.floor(Math.random() * list2.items.length)];
        list3Selection = list3.items[Math.floor(Math.random() * list3.items.length)];
      } else {
        // Make selections from unselected items
        list1Selection = unselectedList1[Math.floor(Math.random() * unselectedList1.length)];
        list2Selection = unselectedList2[Math.floor(Math.random() * unselectedList2.length)];
        list3Selection = unselectedList3[Math.floor(Math.random() * unselectedList3.length)];
      }

      // Record the selections in parallel
      await Promise.all([
        storage.addSelectionToHistory({
          listId: list1.id,
          selectedItem: list1Selection,
          selectionCycle: cycleToUse
        }),
        storage.addSelectionToHistory({
          listId: list2.id,
          selectedItem: list2Selection,
          selectionCycle: cycleToUse
        }),
        storage.addSelectionToHistory({
          listId: list3.id,
          selectedItem: list3Selection,
          selectionCycle: cycleToUse
        })
      ]);

      res.json({
        list1: list1Selection,
        list2: list2Selection,
        list3: list3Selection
      });
    } catch (error) {
      console.error("Selection generation error:", error);
      res.status(400).json({ message: "حدث خطأ" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
