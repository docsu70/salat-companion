var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertSelectionHistorySchema: () => insertSelectionHistorySchema,
  insertSelectionListSchema: () => insertSelectionListSchema,
  selectionCycle: () => selectionCycle,
  selectionHistory: () => selectionHistory,
  selectionLists: () => selectionLists,
  updateSelectionListSchema: () => updateSelectionListSchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var selectionLists = pgTable("selection_lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  items: json("items").$type().notNull().default([])
});
var selectionHistory = pgTable("selection_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listId: varchar("list_id").notNull(),
  selectedItem: text("selected_item").notNull(),
  selectionCycle: varchar("selection_cycle").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var selectionCycle = pgTable("selection_cycle", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentCycle: varchar("current_cycle").notNull().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});
var insertSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true
});
var updateSelectionListSchema = createInsertSchema(selectionLists).omit({
  id: true
}).partial();
var insertSelectionHistorySchema = createInsertSchema(selectionHistory).omit({
  id: true,
  createdAt: true
});

// server/storage.ts
import { randomUUID } from "crypto";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async initializeDefaultLists() {
    try {
      const existingLists = await db.select().from(selectionLists);
      if (existingLists.length === 0) {
        const defaultLists = [
          { name: "\u0633\u0648\u0631/\u0622\u064A\u0627\u062A \u0642\u0635\u064A\u0631\u0629", items: [] },
          { name: "\u0633\u0648\u0631/\u0622\u064A\u0627\u062A \u0637\u0648\u064A\u0644\u0629", items: [] },
          { name: "\u0623\u064A\u0627\u062A \u0645\u0642\u062A\u0631\u062D\u0629 \u0644\u0644\u062D\u0641\u0638", items: [] }
        ];
        for (const list of defaultLists) {
          await db.insert(selectionLists).values({
            name: list.name,
            items: list.items
          });
        }
      }
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
  async getSelectionList(id) {
    const [list] = await db.select().from(selectionLists).where(eq(selectionLists.id, id));
    return list || void 0;
  }
  async getSelectionListByName(name) {
    const [list] = await db.select().from(selectionLists).where(eq(selectionLists.name, name));
    return list || void 0;
  }
  async getAllSelectionLists() {
    return await db.select().from(selectionLists);
  }
  async createSelectionList(insertList) {
    const [list] = await db.insert(selectionLists).values({
      name: insertList.name,
      items: insertList.items || []
    }).returning();
    return list;
  }
  async updateSelectionList(id, updates) {
    const updateData = { ...updates };
    if (updates.items) {
      updateData.items = Array.from(updates.items);
    }
    const [list] = await db.update(selectionLists).set(updateData).where(eq(selectionLists.id, id)).returning();
    return list || void 0;
  }
  async deleteSelectionList(id) {
    const result = await db.delete(selectionLists).where(eq(selectionLists.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async getCurrentCycle() {
    const [cycle] = await db.select().from(selectionCycle).limit(1);
    if (!cycle) {
      const newCycleId = randomUUID();
      await db.insert(selectionCycle).values({
        currentCycle: newCycleId
      });
      return newCycleId;
    }
    return cycle.currentCycle;
  }
  async getSelectionHistory(cycle) {
    return await db.select().from(selectionHistory).where(eq(selectionHistory.selectionCycle, cycle));
  }
  async addSelectionToHistory(selection) {
    const [history] = await db.insert(selectionHistory).values(selection).returning();
    return history;
  }
  async resetSelectionCycle() {
    const newCycleId = randomUUID();
    const [cycle] = await db.select().from(selectionCycle).limit(1);
    if (cycle) {
      await db.update(selectionCycle).set({
        currentCycle: newCycleId,
        updatedAt: sql2`now()`
      }).where(eq(selectionCycle.id, cycle.id));
    } else {
      await db.insert(selectionCycle).values({
        currentCycle: newCycleId
      });
    }
    return newCycleId;
  }
  async getUnselectedItems(listId, cycle) {
    const list = await this.getSelectionList(listId);
    if (!list) return [];
    const selectedItems = await db.select().from(selectionHistory).where(and(
      eq(selectionHistory.listId, listId),
      eq(selectionHistory.selectionCycle, cycle)
    ));
    const selectedItemNames = selectedItems.map((h) => h.selectedItem);
    return list.items.filter((item) => !selectedItemNames.includes(item));
  }
};
var databaseStorage = new DatabaseStorage();
databaseStorage.initializeDefaultLists().catch(console.error);
var storage = databaseStorage;

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/lists", async (_req, res) => {
    try {
      const lists = await storage.getAllSelectionLists();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lists" });
    }
  });
  app2.get("/api/lists/:id", async (req, res) => {
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
  app2.post("/api/lists", async (req, res) => {
    try {
      const validatedData = insertSelectionListSchema.parse(req.body);
      const list = await storage.createSelectionList(validatedData);
      res.status(201).json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid list data" });
    }
  });
  app2.patch("/api/lists/:id", async (req, res) => {
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
  app2.post("/api/lists/:id/items", async (req, res) => {
    try {
      const { item } = req.body;
      if (!item || typeof item !== "string" || item.trim().length === 0) {
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
  app2.delete("/api/lists/:id/items/:index", async (req, res) => {
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
  app2.delete("/api/lists/:id/items", async (req, res) => {
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
  app2.post("/api/generate-selections", async (_req, res) => {
    try {
      const [lists, currentCycle] = await Promise.all([
        storage.getAllSelectionLists(),
        storage.getCurrentCycle()
      ]);
      const list1 = lists.find((l) => l.name === "\u0633\u0648\u0631/\u0622\u064A\u0627\u062A \u0642\u0635\u064A\u0631\u0629");
      const list2 = lists.find((l) => l.name === "\u0633\u0648\u0631/\u0622\u064A\u0627\u062A \u0637\u0648\u064A\u0644\u0629");
      const list3 = lists.find((l) => l.name === "\u0623\u064A\u0627\u062A \u0645\u0642\u062A\u0631\u062D\u0629 \u0644\u0644\u062D\u0641\u0638");
      if (!list1 || !list2 || !list3) {
        return res.status(404).json({ message: "Required lists not found" });
      }
      if (list1.items.length === 0 || list2.items.length === 0 || list3.items.length === 0) {
        console.log("Empty lists detected:", {
          list1Count: list1.items.length,
          list2Count: list2.items.length,
          list3Count: list3.items.length
        });
        return res.status(400).json({ message: "\u062D\u062F\u062B \u062E\u0637\u0623" });
      }
      const [unselectedList1, unselectedList2, unselectedList3] = await Promise.all([
        storage.getUnselectedItems(list1.id, currentCycle),
        storage.getUnselectedItems(list2.id, currentCycle),
        storage.getUnselectedItems(list3.id, currentCycle)
      ]);
      let list1Selection, list2Selection, list3Selection;
      let cycleToUse = currentCycle;
      if (unselectedList1.length === 0 || unselectedList2.length === 0 || unselectedList3.length === 0) {
        cycleToUse = await storage.resetSelectionCycle();
        list1Selection = list1.items[Math.floor(Math.random() * list1.items.length)];
        list2Selection = list2.items[Math.floor(Math.random() * list2.items.length)];
        list3Selection = list3.items[Math.floor(Math.random() * list3.items.length)];
      } else {
        list1Selection = unselectedList1[Math.floor(Math.random() * unselectedList1.length)];
        list2Selection = unselectedList2[Math.floor(Math.random() * unselectedList2.length)];
        list3Selection = unselectedList3[Math.floor(Math.random() * unselectedList3.length)];
      }
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
      res.status(400).json({ message: "\u062D\u062F\u062B \u062E\u0637\u0623" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
