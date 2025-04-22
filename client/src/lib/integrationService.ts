import { apiRequest } from "./queryClient";
import type { IntegrationMapping, InsertIntegrationMapping, SyncHistory } from "@shared/schema";

// Integration API service
export const integrationService = {
  // Get all integration mappings
  getMappings: async (): Promise<IntegrationMapping[]> => {
    const response = await apiRequest("GET", "/api/integration-mappings", undefined);
    return response.json();
  },
  
  // Get integration mapping by ID
  getMapping: async (id: number): Promise<IntegrationMapping> => {
    const response = await apiRequest("GET", `/api/integration-mappings/${id}`, undefined);
    return response.json();
  },
  
  // Create integration mapping
  createMapping: async (mapping: InsertIntegrationMapping): Promise<IntegrationMapping> => {
    const response = await apiRequest("POST", "/api/integration-mappings", mapping);
    return response.json();
  },
  
  // Update integration mapping
  updateMapping: async (id: number, mapping: Partial<InsertIntegrationMapping>): Promise<IntegrationMapping> => {
    const response = await apiRequest("PUT", `/api/integration-mappings/${id}`, mapping);
    return response.json();
  },
  
  // Delete integration mapping
  deleteMapping: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/integration-mappings/${id}`, undefined);
  },
  
  // Trigger synchronization for a mapping
  syncData: async (mappingId: number): Promise<{mapping: IntegrationMapping, syncOperation: SyncHistory}> => {
    const response = await apiRequest("POST", `/api/integration-mappings/${mappingId}/sync`, undefined);
    return response.json();
  },
  
  // Get sync histories
  getSyncHistories: async (mappingId?: number): Promise<SyncHistory[]> => {
    let url = "/api/sync-histories";
    if (mappingId) {
      url += `?mappingId=${mappingId}`;
    }
    const response = await apiRequest("GET", url, undefined);
    return response.json();
  },
  
  // Create sync history
  createSyncHistory: async (syncHistory: any): Promise<SyncHistory> => {
    const response = await apiRequest("POST", "/api/sync-histories", syncHistory);
    return response.json();
  },
  
  // Get performance metrics
  getPerformanceMetrics: async (): Promise<any[]> => {
    const response = await apiRequest("GET", "/api/performance-metrics", undefined);
    return response.json();
  },
  
  // Create performance metric
  createPerformanceMetric: async (metric: any): Promise<any> => {
    const response = await apiRequest("POST", "/api/performance-metrics", metric);
    return response.json();
  },
  
  // Sync all mappings (convenience method)
  syncAllMappings: async (): Promise<{succeeded: number, failed: number}> => {
    const mappings = await integrationService.getMappings();
    const results = await Promise.allSettled(
      mappings.map(mapping => integrationService.syncData(mapping.id))
    );
    
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return { succeeded, failed };
  }
};
