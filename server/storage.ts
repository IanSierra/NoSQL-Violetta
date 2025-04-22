import { 
  MongoCollection, InsertMongoCollection, 
  Neo4jNodeType, InsertNeo4jNodeType,
  IntegrationMapping, InsertIntegrationMapping,
  SyncHistory, InsertSyncHistory,
  PerformanceMetric, InsertPerformanceMetric,
  mongoCollections, neo4jNodeTypes, integrationMappings, syncHistories, performanceMetrics
} from "@shared/schema";

// Interface for database storage operations
export interface IStorage {
  // MongoDB Collections operations
  getMongoCollections(): Promise<MongoCollection[]>;
  getMongoCollection(id: number): Promise<MongoCollection | undefined>;
  getMongoCollectionByName(name: string): Promise<MongoCollection | undefined>;
  createMongoCollection(collection: InsertMongoCollection): Promise<MongoCollection>;
  updateMongoCollection(id: number, collection: Partial<InsertMongoCollection>): Promise<MongoCollection | undefined>;
  deleteMongoCollection(id: number): Promise<boolean>;

  // Neo4j Node Types operations
  getNeo4jNodeTypes(): Promise<Neo4jNodeType[]>;
  getNeo4jNodeType(id: number): Promise<Neo4jNodeType | undefined>;
  getNeo4jNodeTypeByName(name: string): Promise<Neo4jNodeType | undefined>;
  createNeo4jNodeType(nodeType: InsertNeo4jNodeType): Promise<Neo4jNodeType>;
  updateNeo4jNodeType(id: number, nodeType: Partial<InsertNeo4jNodeType>): Promise<Neo4jNodeType | undefined>;
  deleteNeo4jNodeType(id: number): Promise<boolean>;

  // Integration Mappings operations
  getIntegrationMappings(): Promise<IntegrationMapping[]>;
  getIntegrationMapping(id: number): Promise<IntegrationMapping | undefined>;
  createIntegrationMapping(mapping: InsertIntegrationMapping): Promise<IntegrationMapping>;
  updateIntegrationMapping(id: number, mapping: Partial<InsertIntegrationMapping>): Promise<IntegrationMapping | undefined>;
  updateIntegrationMappingSync(id: number): Promise<IntegrationMapping | undefined>;
  deleteIntegrationMapping(id: number): Promise<boolean>;

  // Sync History operations
  getSyncHistories(): Promise<SyncHistory[]>;
  getSyncHistoriesByMappingId(mappingId: number): Promise<SyncHistory[]>;
  createSyncHistory(history: InsertSyncHistory): Promise<SyncHistory>;
  completeSyncHistory(id: number, recordsUpdated: number, recordsCreated: number, status: string, message?: string): Promise<SyncHistory | undefined>;

  // Performance Metrics operations
  getPerformanceMetrics(): Promise<PerformanceMetric[]>;
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
}

export class MemStorage implements IStorage {
  private mongoCollectionsData: Map<number, MongoCollection>;
  private neo4jNodeTypesData: Map<number, Neo4jNodeType>;
  private integrationMappingsData: Map<number, IntegrationMapping>;
  private syncHistoriesData: Map<number, SyncHistory>;
  private performanceMetricsData: Map<number, PerformanceMetric>;
  
  private collectionId: number;
  private nodeTypeId: number;
  private mappingId: number;
  private syncHistoryId: number;
  private metricId: number;

  constructor() {
    this.mongoCollectionsData = new Map();
    this.neo4jNodeTypesData = new Map();
    this.integrationMappingsData = new Map();
    this.syncHistoriesData = new Map();
    this.performanceMetricsData = new Map();
    
    this.collectionId = 1;
    this.nodeTypeId = 1;
    this.mappingId = 1;
    this.syncHistoryId = 1;
    this.metricId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample MongoDB collections
    const collections = [
      { name: "users", documentCount: 12458, storageSize: 42800, status: "active" },
      { name: "products", documentCount: 3721, storageSize: 18300, status: "active" },
      { name: "orders", documentCount: 28935, storageSize: 156200, status: "active" },
      { name: "reviews", documentCount: 8142, storageSize: 23700, status: "active" }
    ];
    
    collections.forEach(collection => {
      this.createMongoCollection(collection);
    });

    // Add sample Neo4j node types
    const nodeTypes = [
      { name: "User", nodeCount: 785, color: "#1F4F9E", status: "active" },
      { name: "Order", nodeCount: 2415, color: "#4A77D6", status: "active" },
      { name: "Product", nodeCount: 158, color: "#13AA52", status: "active" }
    ];
    
    nodeTypes.forEach(nodeType => {
      this.createNeo4jNodeType(nodeType);
    });

    // Add sample integration mappings
    const mappings = [
      { sourceCollection: "users", targetNodeType: "User", syncType: "Bidirectional", status: "active" },
      { sourceCollection: "products", targetNodeType: "Product", syncType: "MongoDB → Neo4j", status: "active" },
      { sourceCollection: "orders", targetNodeType: "Order", syncType: "MongoDB → Neo4j", status: "active" }
    ];
    
    mappings.forEach(mapping => {
      this.createIntegrationMapping(mapping);
    });

    // Add sample sync histories
    const histories = [
      { mappingId: 1, recordsUpdated: 23, recordsCreated: 2, status: "success", message: "Sync completed successfully" },
      { mappingId: 2, recordsUpdated: 5, recordsCreated: 0, status: "success", message: "Sync completed successfully" },
      { mappingId: 3, recordsUpdated: 86, recordsCreated: 12, status: "success", message: "Sync completed successfully" }
    ];
    
    histories.forEach(history => {
      this.createSyncHistory(history);
    });

    // Add sample performance metrics
    const metrics = [
      { operationType: "Simple CRUD operations", mongoDbTime: 12, neo4jTime: 28, sqlTime: 18, bestPerformer: "MongoDB" },
      { operationType: "Multi-level relationships", mongoDbTime: 156, neo4jTime: 45, sqlTime: 320, bestPerformer: "Neo4j" },
      { operationType: "Complex aggregations", mongoDbTime: 87, neo4jTime: 134, sqlTime: 95, bestPerformer: "MongoDB" },
      { operationType: "Path finding", mongoDbTime: 245, neo4jTime: 38, sqlTime: 352, bestPerformer: "Neo4j" },
      { operationType: "Full-text search", mongoDbTime: 42, neo4jTime: 68, sqlTime: 112, bestPerformer: "MongoDB" }
    ];
    
    metrics.forEach(metric => {
      this.createPerformanceMetric(metric);
    });
  }

  // MongoDB Collections operations
  async getMongoCollections(): Promise<MongoCollection[]> {
    return Array.from(this.mongoCollectionsData.values());
  }

  async getMongoCollection(id: number): Promise<MongoCollection | undefined> {
    return this.mongoCollectionsData.get(id);
  }

  async getMongoCollectionByName(name: string): Promise<MongoCollection | undefined> {
    return Array.from(this.mongoCollectionsData.values()).find(
      collection => collection.name === name
    );
  }

  async createMongoCollection(collection: InsertMongoCollection): Promise<MongoCollection> {
    const id = this.collectionId++;
    const now = new Date();
    const newCollection: MongoCollection = {
      ...collection,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.mongoCollectionsData.set(id, newCollection);
    return newCollection;
  }

  async updateMongoCollection(id: number, collection: Partial<InsertMongoCollection>): Promise<MongoCollection | undefined> {
    const existingCollection = this.mongoCollectionsData.get(id);
    if (!existingCollection) return undefined;

    const updatedCollection: MongoCollection = {
      ...existingCollection,
      ...collection,
      updatedAt: new Date()
    };
    this.mongoCollectionsData.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteMongoCollection(id: number): Promise<boolean> {
    return this.mongoCollectionsData.delete(id);
  }

  // Neo4j Node Types operations
  async getNeo4jNodeTypes(): Promise<Neo4jNodeType[]> {
    return Array.from(this.neo4jNodeTypesData.values());
  }

  async getNeo4jNodeType(id: number): Promise<Neo4jNodeType | undefined> {
    return this.neo4jNodeTypesData.get(id);
  }

  async getNeo4jNodeTypeByName(name: string): Promise<Neo4jNodeType | undefined> {
    return Array.from(this.neo4jNodeTypesData.values()).find(
      nodeType => nodeType.name === name
    );
  }

  async createNeo4jNodeType(nodeType: InsertNeo4jNodeType): Promise<Neo4jNodeType> {
    const id = this.nodeTypeId++;
    const now = new Date();
    const newNodeType: Neo4jNodeType = {
      ...nodeType,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.neo4jNodeTypesData.set(id, newNodeType);
    return newNodeType;
  }

  async updateNeo4jNodeType(id: number, nodeType: Partial<InsertNeo4jNodeType>): Promise<Neo4jNodeType | undefined> {
    const existingNodeType = this.neo4jNodeTypesData.get(id);
    if (!existingNodeType) return undefined;

    const updatedNodeType: Neo4jNodeType = {
      ...existingNodeType,
      ...nodeType,
      updatedAt: new Date()
    };
    this.neo4jNodeTypesData.set(id, updatedNodeType);
    return updatedNodeType;
  }

  async deleteNeo4jNodeType(id: number): Promise<boolean> {
    return this.neo4jNodeTypesData.delete(id);
  }

  // Integration Mappings operations
  async getIntegrationMappings(): Promise<IntegrationMapping[]> {
    return Array.from(this.integrationMappingsData.values());
  }

  async getIntegrationMapping(id: number): Promise<IntegrationMapping | undefined> {
    return this.integrationMappingsData.get(id);
  }

  async createIntegrationMapping(mapping: InsertIntegrationMapping): Promise<IntegrationMapping> {
    const id = this.mappingId++;
    const now = new Date();
    const newMapping: IntegrationMapping = {
      ...mapping,
      id,
      lastSync: null,
      createdAt: now,
      updatedAt: now
    };
    this.integrationMappingsData.set(id, newMapping);
    return newMapping;
  }

  async updateIntegrationMapping(id: number, mapping: Partial<InsertIntegrationMapping>): Promise<IntegrationMapping | undefined> {
    const existingMapping = this.integrationMappingsData.get(id);
    if (!existingMapping) return undefined;

    const updatedMapping: IntegrationMapping = {
      ...existingMapping,
      ...mapping,
      updatedAt: new Date()
    };
    this.integrationMappingsData.set(id, updatedMapping);
    return updatedMapping;
  }

  async updateIntegrationMappingSync(id: number): Promise<IntegrationMapping | undefined> {
    const existingMapping = this.integrationMappingsData.get(id);
    if (!existingMapping) return undefined;

    const updatedMapping: IntegrationMapping = {
      ...existingMapping,
      lastSync: new Date(),
      updatedAt: new Date()
    };
    this.integrationMappingsData.set(id, updatedMapping);
    return updatedMapping;
  }

  async deleteIntegrationMapping(id: number): Promise<boolean> {
    return this.integrationMappingsData.delete(id);
  }

  // Sync History operations
  async getSyncHistories(): Promise<SyncHistory[]> {
    return Array.from(this.syncHistoriesData.values());
  }

  async getSyncHistoriesByMappingId(mappingId: number): Promise<SyncHistory[]> {
    return Array.from(this.syncHistoriesData.values()).filter(
      history => history.mappingId === mappingId
    );
  }

  async createSyncHistory(history: InsertSyncHistory): Promise<SyncHistory> {
    const id = this.syncHistoryId++;
    const now = new Date();
    const newHistory: SyncHistory = {
      ...history,
      id,
      startedAt: now,
      completedAt: null
    };
    this.syncHistoriesData.set(id, newHistory);
    return newHistory;
  }

  async completeSyncHistory(id: number, recordsUpdated: number, recordsCreated: number, status: string, message?: string): Promise<SyncHistory | undefined> {
    const existingHistory = this.syncHistoriesData.get(id);
    if (!existingHistory) return undefined;

    const updatedHistory: SyncHistory = {
      ...existingHistory,
      recordsUpdated,
      recordsCreated,
      status,
      message: message || existingHistory.message,
      completedAt: new Date()
    };
    this.syncHistoriesData.set(id, updatedHistory);
    return updatedHistory;
  }

  // Performance Metrics operations
  async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return Array.from(this.performanceMetricsData.values());
  }

  async createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const id = this.metricId++;
    const newMetric: PerformanceMetric = {
      ...metric,
      id,
      recordedAt: new Date()
    };
    this.performanceMetricsData.set(id, newMetric);
    return newMetric;
  }
}

// Create and export a single instance of the storage
export const storage = new MemStorage();
