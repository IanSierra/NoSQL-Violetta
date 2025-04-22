import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// MongoDB Collection Schema
export const mongoCollections = pgTable("mongo_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  documentCount: integer("document_count").notNull().default(0),
  storageSize: integer("storage_size").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMongoCollectionSchema = createInsertSchema(mongoCollections).pick({
  name: true,
  documentCount: true,
  storageSize: true,
  status: true,
});

// Neo4j Node Types Schema
export const neo4jNodeTypes = pgTable("neo4j_node_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  nodeCount: integer("node_count").notNull().default(0),
  color: text("color").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNeo4jNodeTypeSchema = createInsertSchema(neo4jNodeTypes).pick({
  name: true,
  nodeCount: true,
  color: true,
  status: true,
});

// Integration Mappings Schema
export const integrationMappings = pgTable("integration_mappings", {
  id: serial("id").primaryKey(),
  sourceCollection: text("source_collection").notNull(),
  targetNodeType: text("target_node_type").notNull(),
  syncType: text("sync_type").notNull(),
  lastSync: timestamp("last_sync"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertIntegrationMappingSchema = createInsertSchema(integrationMappings).pick({
  sourceCollection: true,
  targetNodeType: true,
  syncType: true,
  status: true,
});

// Sync History Schema
export const syncHistories = pgTable("sync_histories", {
  id: serial("id").primaryKey(),
  mappingId: integer("mapping_id").notNull(),
  recordsUpdated: integer("records_updated").notNull().default(0),
  recordsCreated: integer("records_created").notNull().default(0),
  status: text("status").notNull(),
  message: text("message"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSyncHistorySchema = createInsertSchema(syncHistories).pick({
  mappingId: true,
  recordsUpdated: true,
  recordsCreated: true,
  status: true,
  message: true,
});

// Performance Metrics Schema
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  operationType: text("operation_type").notNull(),
  mongoDbTime: integer("mongodb_time").notNull(),
  neo4jTime: integer("neo4j_time").notNull(),
  sqlTime: integer("sql_time").notNull(),
  bestPerformer: text("best_performer").notNull(),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).pick({
  operationType: true,
  mongoDbTime: true,
  neo4jTime: true,
  sqlTime: true,
  bestPerformer: true,
});

// Define types using schema inference
export type MongoCollection = typeof mongoCollections.$inferSelect;
export type InsertMongoCollection = z.infer<typeof insertMongoCollectionSchema>;

export type Neo4jNodeType = typeof neo4jNodeTypes.$inferSelect;
export type InsertNeo4jNodeType = z.infer<typeof insertNeo4jNodeTypeSchema>;

export type IntegrationMapping = typeof integrationMappings.$inferSelect;
export type InsertIntegrationMapping = z.infer<typeof insertIntegrationMappingSchema>;

export type SyncHistory = typeof syncHistories.$inferSelect;
export type InsertSyncHistory = z.infer<typeof insertSyncHistorySchema>;

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
