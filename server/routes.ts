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
        return res.status(400).json({ message: "Invalid item index" });
      }

      const list = await storage.getSelectionList(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      if (index >= list.items.length) {
        return res.status(400).json({ message: "Item index out of bounds" });
      }

      const updatedItems = list.items.filter((_, i) => i !== index);
      const updatedList = await storage.updateSelectionList(req.params.id, { items: updatedItems });
      res.json(updatedList);
    } catch (error) {
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
      const lists = await storage.getAllSelectionLists();
      const list1 = lists.find(l => l.name === "سور/آيات قصيرة");
      const list2 = lists.find(l => l.name === "سور/آيات طويلة");
      const list3 = lists.find(l => l.name === "أيات مقترحة للحفظ");

      if (!list1 || !list2 || !list3) {
        return res.status(404).json({ message: "Required lists not found" });
      }

      if (list1.items.length === 0 || list2.items.length === 0 || list3.items.length === 0) {
        return res.status(400).json({ message: "حدث خطأ" });
      }

      // Get current selection cycle
      const currentCycle = await storage.getCurrentCycle();

      // Get unselected items from all three lists
      const unselectedList1 = await storage.getUnselectedItems(list1.id, currentCycle);
      const unselectedList2 = await storage.getUnselectedItems(list2.id, currentCycle);
      const unselectedList3 = await storage.getUnselectedItems(list3.id, currentCycle);

      // If any list has no unselected items, reset the cycle and start fresh
      if (unselectedList1.length === 0 || unselectedList2.length === 0 || unselectedList3.length === 0) {
        const newCycle = await storage.resetSelectionCycle();
        const freshList1 = [...list1.items];
        const freshList2 = [...list2.items];
        const freshList3 = [...list3.items];

        // Make selections from fresh lists
        const list1Selection = freshList1[Math.floor(Math.random() * freshList1.length)];
        const list2Selection = freshList2[Math.floor(Math.random() * freshList2.length)];
        const list3Selection = freshList3[Math.floor(Math.random() * freshList3.length)];

        // Record the selections in the new cycle
        await storage.addSelectionToHistory({
          listId: list1.id,
          selectedItem: list1Selection,
          selectionCycle: newCycle
        });

        await storage.addSelectionToHistory({
          listId: list2.id,
          selectedItem: list2Selection,
          selectionCycle: newCycle
        });

        await storage.addSelectionToHistory({
          listId: list3.id,
          selectedItem: list3Selection,
          selectionCycle: newCycle
        });

        return res.json({
          list1: list1Selection,
          list2: list2Selection,
          list3: list3Selection
        });
      }

      // Make selections from unselected items
      const list1Selection = unselectedList1[Math.floor(Math.random() * unselectedList1.length)];
      const list2Selection = unselectedList2[Math.floor(Math.random() * unselectedList2.length)];
      const list3Selection = unselectedList3[Math.floor(Math.random() * unselectedList3.length)];

      // Record the selections in the current cycle
      await storage.addSelectionToHistory({
        listId: list1.id,
        selectedItem: list1Selection,
        selectionCycle: currentCycle
      });

      await storage.addSelectionToHistory({
        listId: list2.id,
        selectedItem: list2Selection,
        selectionCycle: currentCycle
      });

      await storage.addSelectionToHistory({
        listId: list3.id,
        selectedItem: list3Selection,
        selectionCycle: currentCycle
      });

      res.json({
        list1: list1Selection,
        list2: list2Selection,
        list3: list3Selection
      });
    } catch (error) {
      console.error("Selection generation error:", error);
      res.status(500).json({ message: "Failed to generate selections" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
