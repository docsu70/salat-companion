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

  // Generate random selections
  app.post("/api/generate-selections", async (_req, res) => {
    try {
      const lists = await storage.getAllSelectionLists();
      const list1 = lists.find(l => l.name === "سور/آيات قصيرة");
      const list2 = lists.find(l => l.name === "سور/آيات طويلة");

      if (!list1 || !list2) {
        return res.status(404).json({ message: "Required lists not found" });
      }

      if (list1.items.length === 0 || list2.items.length === 0) {
        return res.status(400).json({ message: "Both lists must contain at least one item" });
      }

      const list1Selection = list1.items[Math.floor(Math.random() * list1.items.length)];
      const list2Selection = list2.items[Math.floor(Math.random() * list2.items.length)];

      res.json({
        list1: list1Selection,
        list2: list2Selection
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate selections" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
