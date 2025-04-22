import { apiRequest } from "./queryClient";
import type { MongoCollection, InsertMongoCollection } from "@shared/schema";

// MongoDB Collections API
export const mongoService = {
  // Get all collections
  getCollections: async (): Promise<MongoCollection[]> => {
    const response = await apiRequest("GET", "/api/mongo-collections", undefined);
    return response.json();
  },
  
  // Get collection by ID
  getCollection: async (id: number): Promise<MongoCollection> => {
    const response = await apiRequest("GET", `/api/mongo-collections/${id}`, undefined);
    return response.json();
  },
  
  // Create collection
  createCollection: async (collection: InsertMongoCollection): Promise<MongoCollection> => {
    const response = await apiRequest("POST", "/api/mongo-collections", collection);
    return response.json();
  },
  
  // Update collection
  updateCollection: async (id: number, collection: Partial<InsertMongoCollection>): Promise<MongoCollection> => {
    const response = await apiRequest("PUT", `/api/mongo-collections/${id}`, collection);
    return response.json();
  },
  
  // Delete collection
  deleteCollection: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/mongo-collections/${id}`, undefined);
  },
  
  // Execute a MongoDB query (mock function - in a real app, this would send the query to the server)
  executeQuery: async (query: string): Promise<any> => {
    // This is a mock implementation
    // In a real application, this would send the query to the server
    return new Promise((resolve) => {
      setTimeout(() => {
        // Parse the query to determine what kind of operation it is
        if (query.includes("find")) {
          resolve([
            { _id: "617a2bdc5acb25178f16b8e1", username: "john_doe", email: "john@example.com", age: 32, status: "active" },
            { _id: "617a2bdc5acb25178f16b8e2", username: "jane_smith", email: "jane@example.com", age: 28, status: "active" },
            { _id: "617a2bdc5acb25178f16b8e3", username: "alex_wilson", email: "alex@example.com", age: 35, status: "active" },
          ]);
        } else if (query.includes("aggregate")) {
          resolve([
            { _id: "user1", orderCount: 12, totalSpent: 1245.50 },
            { _id: "user2", orderCount: 8, totalSpent: 872.30 },
            { _id: "user3", orderCount: 5, totalSpent: 645.80 },
          ]);
        } else if (query.includes("update")) {
          resolve({ matchedCount: 5, modifiedCount: 5 });
        } else if (query.includes("delete")) {
          resolve({ deletedCount: 8 });
        } else {
          resolve({ result: "Query executed successfully", operation: "unknown" });
        }
      }, 600);
    });
  },
  
  // Execute a MongoDB aggregation (mock function)
  executeAggregation: async (aggregation: string): Promise<any> => {
    // This is a mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (aggregation.includes("category")) {
          resolve([
            { _id: "electronics", count: 1243, totalSales: 89520.43, avgOrderValue: 72.02 },
            { _id: "clothing", count: 987, totalSales: 45237.89, avgOrderValue: 45.83 },
            { _id: "books", count: 643, totalSales: 12876.45, avgOrderValue: 20.03 },
            { _id: "home", count: 421, totalSales: 35642.87, avgOrderValue: 84.66 },
            { _id: "beauty", count: 328, totalSales: 18942.32, avgOrderValue: 57.75 },
          ]);
        } else if (aggregation.includes("lookup")) {
          resolve({
            orderId: "60d5ec7ac9e24120581d7663",
            products: [
              { productId: "p123", name: "Wireless Headphones", price: 79.99, qty: 1 },
              { productId: "p456", name: "USB-C Cable", price: 12.99, qty: 2 }
            ],
            total: 105.97,
            user: {
              name: "John Smith",
              email: "john.smith@example.com"
            }
          });
        } else if (aggregation.includes("statistical")) {
          resolve([
            {
              _id: null,
              count: 156,
              avgPrice: 324.87,
              minPrice: 12.99,
              maxPrice: 1299.99,
              stdDevPrice: 245.32
            }
          ]);
        } else if (aggregation.includes("time-series")) {
          resolve([
            { _id: "2023-01", sales: 12543.87, count: 187 },
            { _id: "2023-02", sales: 14327.65, count: 215 },
            { _id: "2023-03", sales: 19854.32, count: 278 },
            { _id: "2023-04", sales: 21432.76, count: 302 },
            { _id: "2023-05", sales: 18765.43, count: 267 },
            { _id: "2023-06", sales: 23456.78, count: 321 },
            { _id: "2023-07", sales: 26789.12, count: 356 },
            { _id: "2023-08", sales: 21345.67, count: 289 },
            { _id: "2023-09", sales: 19876.54, count: 276 },
            { _id: "2023-10", sales: 24567.89, count: 334 },
            { _id: "2023-11", sales: 29876.54, count: 412 },
            { _id: "2023-12", sales: 35678.90, count: 487 }
          ]);
        } else {
          resolve([
            { result: "Aggregation executed successfully", count: 10 }
          ]);
        }
      }, 800);
    });
  }
};
