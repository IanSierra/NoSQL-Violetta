import { apiRequest } from "./queryClient";
import type { Neo4jNodeType, InsertNeo4jNodeType } from "@shared/schema";

// Neo4j API service
export const neo4jService = {
  // Get all node types
  getNodeTypes: async (): Promise<Neo4jNodeType[]> => {
    const response = await apiRequest("GET", "/api/neo4j-node-types", undefined);
    return response.json();
  },
  
  // Get node type by ID
  getNodeType: async (id: number): Promise<Neo4jNodeType> => {
    const response = await apiRequest("GET", `/api/neo4j-node-types/${id}`, undefined);
    return response.json();
  },
  
  // Create node type
  createNodeType: async (nodeType: InsertNeo4jNodeType): Promise<Neo4jNodeType> => {
    const response = await apiRequest("POST", "/api/neo4j-node-types", nodeType);
    return response.json();
  },
  
  // Update node type
  updateNodeType: async (id: number, nodeType: Partial<InsertNeo4jNodeType>): Promise<Neo4jNodeType> => {
    const response = await apiRequest("PUT", `/api/neo4j-node-types/${id}`, nodeType);
    return response.json();
  },
  
  // Delete node type
  deleteNodeType: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/neo4j-node-types/${id}`, undefined);
  },
  
  // Execute a Cypher query (mock function - in a real app, this would send the query to the server)
  executeCypher: async (query: string): Promise<any> => {
    // This is a mock implementation
    // In a real application, this would send the query to the server
    return new Promise((resolve) => {
      setTimeout(() => {
        // Parse the query to determine what kind of operation it is
        if (query.includes("MATCH") && query.includes("User") && query.includes("PURCHASED")) {
          resolve([
            {
              type: "node",
              id: "u1",
              labels: ["User"],
              properties: { name: "John Smith", email: "john@example.com" }
            },
            {
              type: "relationship",
              id: "r1",
              type: "PURCHASED",
              startNodeId: "u1",
              endNodeId: "p1",
              properties: { date: "2023-11-15", amount: 699.99 }
            },
            {
              type: "node",
              id: "p1",
              labels: ["Product"],
              properties: { name: "Smartphone X", price: 699.99 }
            }
          ]);
        } else if (query.includes("CREATE") && query.includes("User")) {
          resolve([
            {
              type: "node",
              id: "u5",
              labels: ["User"],
              properties: { id: "u5", name: "Emily Johnson", email: "emily@example.com", age: 29 }
            }
          ]);
        } else if (query.includes("shortestPath")) {
          resolve([
            {
              type: "path",
              nodes: [
                { id: "u1", labels: ["User"], properties: { name: "John Smith" } },
                { id: "o1", labels: ["Order"], properties: { orderId: "ORD-123" } },
                { id: "p2", labels: ["Product"], properties: { name: "Laptop Pro" } }
              ],
              relationships: [
                { id: "r1", type: "PLACED", startNodeId: "u1", endNodeId: "o1" },
                { id: "r2", type: "CONTAINS", startNodeId: "o1", endNodeId: "p2" }
              ]
            }
          ]);
        } else if (query.includes("RECOMMEND") || query.includes("recommendation")) {
          resolve([
            { RecommendedProduct: "Wireless Earbuds", CommonPurchasers: 3 },
            { RecommendedProduct: "Phone Case", CommonPurchasers: 2 },
            { RecommendedProduct: "Screen Protector", CommonPurchasers: 2 }
          ]);
        } else {
          resolve([
            {
              type: "result",
              message: "Query executed successfully",
              rows: 0
            }
          ]);
        }
      }, 600);
    });
  },
  
  // Get relationship types (mock function)
  getRelationshipTypes: async (): Promise<string[]> => {
    return ["PURCHASED", "REVIEWED", "VIEWED", "WISHLIST", "RECOMMENDED"];
  },
  
  // Get graph data (mock function)
  getGraphData: async (graphType: string): Promise<any> => {
    const graphData = {
      userProductGraph: {
        nodes: [
          { id: "u1", label: "User", name: "John Smith", group: "User" },
          { id: "u2", label: "User", name: "Sarah Jones", group: "User" },
          { id: "u3", label: "User", name: "Mike Johnson", group: "User" },
          { id: "p1", label: "Product", name: "Smartphone X", group: "Product" },
          { id: "p2", label: "Product", name: "Laptop Pro", group: "Product" },
          { id: "p3", label: "Product", name: "Wireless Earbuds", group: "Product" },
        ],
        links: [
          { source: "u1", target: "p1", label: "PURCHASED" },
          { source: "u1", target: "p3", label: "PURCHASED" },
          { source: "u2", target: "p1", label: "VIEWED" },
          { source: "u2", target: "p2", label: "PURCHASED" },
          { source: "u3", target: "p2", label: "VIEWED" },
          { source: "u3", target: "p3", label: "PURCHASED" },
        ]
      },
      socialGraph: {
        nodes: [
          { id: "u1", label: "User", name: "John Smith", group: "User" },
          { id: "u2", label: "User", name: "Sarah Jones", group: "User" },
          { id: "u3", label: "User", name: "Mike Johnson", group: "User" },
          { id: "u4", label: "User", name: "Emily Brown", group: "User" },
          { id: "u5", label: "User", name: "David Wilson", group: "User" },
        ],
        links: [
          { source: "u1", target: "u2", label: "FRIEND" },
          { source: "u1", target: "u3", label: "COLLEAGUE" },
          { source: "u2", target: "u4", label: "FRIEND" },
          { source: "u3", target: "u4", label: "FRIEND" },
          { source: "u4", target: "u5", label: "RELATIVE" },
          { source: "u5", target: "u1", label: "COLLEAGUE" },
        ]
      },
      supplyChain: {
        nodes: [
          { id: "s1", label: "Supplier", name: "RawMaterials Inc", group: "Supplier" },
          { id: "s2", label: "Supplier", name: "Components Ltd", group: "Supplier" },
          { id: "m1", label: "Manufacturer", name: "BuildCorp", group: "Manufacturer" },
          { id: "d1", label: "Distributor", name: "Global Distribution", group: "Distributor" },
          { id: "r1", label: "Retailer", name: "TechShop", group: "Retailer" },
          { id: "r2", label: "Retailer", name: "ElectroMart", group: "Retailer" },
        ],
        links: [
          { source: "s1", target: "m1", label: "SUPPLIES" },
          { source: "s2", target: "m1", label: "SUPPLIES" },
          { source: "m1", target: "d1", label: "SHIPS_TO" },
          { source: "d1", target: "r1", label: "DISTRIBUTES" },
          { source: "d1", target: "r2", label: "DISTRIBUTES" },
        ]
      }
    };
    
    return graphData[graphType as keyof typeof graphData] || graphData.userProductGraph;
  }
};
