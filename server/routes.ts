import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMongoCollectionSchema, 
  insertNeo4jNodeTypeSchema, 
  insertIntegrationMappingSchema, 
  insertSyncHistorySchema, 
  insertPerformanceMetricSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // MongoDB Collections routes
  app.get("/api/mongo-collections", async (req: Request, res: Response) => {
    try {
      const collections = await storage.getMongoCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch MongoDB collections", error: String(error) });
    }
  });

  app.get("/api/mongo-collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const collection = await storage.getMongoCollection(id);
      
      if (!collection) {
        return res.status(404).json({ message: "MongoDB collection not found" });
      }
      
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch MongoDB collection", error: String(error) });
    }
  });

  app.post("/api/mongo-collections", async (req: Request, res: Response) => {
    try {
      const parsed = insertMongoCollectionSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid collection data", errors: parsed.error.format() });
      }
      
      const collection = await storage.createMongoCollection(parsed.data);
      res.status(201).json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to create MongoDB collection", error: String(error) });
    }
  });

  app.put("/api/mongo-collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertMongoCollectionSchema.partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid collection update data", errors: parsed.error.format() });
      }
      
      const updatedCollection = await storage.updateMongoCollection(id, parsed.data);
      
      if (!updatedCollection) {
        return res.status(404).json({ message: "MongoDB collection not found" });
      }
      
      res.json(updatedCollection);
    } catch (error) {
      res.status(500).json({ message: "Failed to update MongoDB collection", error: String(error) });
    }
  });

  app.delete("/api/mongo-collections/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMongoCollection(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "MongoDB collection not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete MongoDB collection", error: String(error) });
    }
  });

  // Neo4j Node Types routes
  app.get("/api/neo4j-node-types", async (req: Request, res: Response) => {
    try {
      const nodeTypes = await storage.getNeo4jNodeTypes();
      res.json(nodeTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Neo4j node types", error: String(error) });
    }
  });

  app.get("/api/neo4j-node-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const nodeType = await storage.getNeo4jNodeType(id);
      
      if (!nodeType) {
        return res.status(404).json({ message: "Neo4j node type not found" });
      }
      
      res.json(nodeType);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Neo4j node type", error: String(error) });
    }
  });

  app.post("/api/neo4j-node-types", async (req: Request, res: Response) => {
    try {
      const parsed = insertNeo4jNodeTypeSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid node type data", errors: parsed.error.format() });
      }
      
      const nodeType = await storage.createNeo4jNodeType(parsed.data);
      res.status(201).json(nodeType);
    } catch (error) {
      res.status(500).json({ message: "Failed to create Neo4j node type", error: String(error) });
    }
  });

  app.put("/api/neo4j-node-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertNeo4jNodeTypeSchema.partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid node type update data", errors: parsed.error.format() });
      }
      
      const updatedNodeType = await storage.updateNeo4jNodeType(id, parsed.data);
      
      if (!updatedNodeType) {
        return res.status(404).json({ message: "Neo4j node type not found" });
      }
      
      res.json(updatedNodeType);
    } catch (error) {
      res.status(500).json({ message: "Failed to update Neo4j node type", error: String(error) });
    }
  });

  app.delete("/api/neo4j-node-types/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNeo4jNodeType(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Neo4j node type not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete Neo4j node type", error: String(error) });
    }
  });

  // Integration Mappings routes
  app.get("/api/integration-mappings", async (req: Request, res: Response) => {
    try {
      const mappings = await storage.getIntegrationMappings();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration mappings", error: String(error) });
    }
  });

  app.get("/api/integration-mappings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const mapping = await storage.getIntegrationMapping(id);
      
      if (!mapping) {
        return res.status(404).json({ message: "Integration mapping not found" });
      }
      
      res.json(mapping);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration mapping", error: String(error) });
    }
  });

  app.post("/api/integration-mappings", async (req: Request, res: Response) => {
    try {
      const parsed = insertIntegrationMappingSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid mapping data", errors: parsed.error.format() });
      }
      
      const mapping = await storage.createIntegrationMapping(parsed.data);
      res.status(201).json(mapping);
    } catch (error) {
      res.status(500).json({ message: "Failed to create integration mapping", error: String(error) });
    }
  });

  app.put("/api/integration-mappings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertIntegrationMappingSchema.partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid mapping update data", errors: parsed.error.format() });
      }
      
      const updatedMapping = await storage.updateIntegrationMapping(id, parsed.data);
      
      if (!updatedMapping) {
        return res.status(404).json({ message: "Integration mapping not found" });
      }
      
      res.json(updatedMapping);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration mapping", error: String(error) });
    }
  });

  app.post("/api/integration-mappings/:id/sync", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const mapping = await storage.getIntegrationMapping(id);
      
      if (!mapping) {
        return res.status(404).json({ message: "Integration mapping not found" });
      }
      
      // Create a sync history record for this operation
      const syncHistory = await storage.createSyncHistory({
        mappingId: id,
        recordsUpdated: 0,
        recordsCreated: 0,
        status: "started",
        message: "Data synchronization started"
      });
      
      // Simulate successful synchronization
      // In a real application, this would involve actual data transfer between databases
      const recordsUpdated = Math.floor(Math.random() * 100) + 1;
      const recordsCreated = Math.floor(Math.random() * 20);
      
      // Update the sync history to indicate completion
      const completedSync = await storage.completeSyncHistory(
        syncHistory.id,
        recordsUpdated,
        recordsCreated,
        "success",
        "Data synchronization completed successfully"
      );
      
      // Update the mapping's last sync timestamp
      const updatedMapping = await storage.updateIntegrationMappingSync(id);
      
      res.json({
        mapping: updatedMapping,
        syncOperation: completedSync
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to synchronize data", error: String(error) });
    }
  });

  app.delete("/api/integration-mappings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteIntegrationMapping(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Integration mapping not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete integration mapping", error: String(error) });
    }
  });

  // Sync History routes
  app.get("/api/sync-histories", async (req: Request, res: Response) => {
    try {
      const mappingId = req.query.mappingId ? parseInt(req.query.mappingId as string) : undefined;
      
      let histories;
      if (mappingId) {
        histories = await storage.getSyncHistoriesByMappingId(mappingId);
      } else {
        histories = await storage.getSyncHistories();
      }
      
      res.json(histories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sync histories", error: String(error) });
    }
  });

  // Performance Metrics routes
  app.get("/api/performance-metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getPerformanceMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance metrics", error: String(error) });
    }
  });

  app.post("/api/performance-metrics", async (req: Request, res: Response) => {
    try {
      const parsed = insertPerformanceMetricSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid performance metric data", errors: parsed.error.format() });
      }
      
      const metric = await storage.createPerformanceMetric(parsed.data);
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ message: "Failed to create performance metric", error: String(error) });
    }
  });

  return httpServer;
}
