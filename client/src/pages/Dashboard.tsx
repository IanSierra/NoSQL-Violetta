import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/Dashboard/StatsCard";
import MongoDBPanel from "@/components/Dashboard/MongoDBPanel";
import Neo4jPanel from "@/components/Dashboard/Neo4jPanel";
import IntegrationSection from "@/components/Dashboard/IntegrationSection";
import PerformanceComparison from "@/components/Dashboard/PerformanceComparison";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["/api/mongo-collections"],
  });

  const { data: nodeTypes, isLoading: isLoadingNodeTypes } = useQuery({
    queryKey: ["/api/neo4j-node-types"],
  });

  const { data: mappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ["/api/integration-mappings"],
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["/api/performance-metrics"],
  });

  if (isLoadingCollections || isLoadingNodeTypes || isLoadingMappings || isLoadingMetrics) {
    return (
      <div className="p-6 bg-neutral-lightest">
        <h2 className="text-2xl font-semibold mb-6">System Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[146px] rounded-lg" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="xl:col-span-2 h-[600px] rounded-lg" />
          <Skeleton className="h-[600px] rounded-lg" />
        </div>
        
        <Skeleton className="h-[500px] rounded-lg mt-8" />
        <Skeleton className="h-[600px] rounded-lg mt-8" />
      </div>
    );
  }

  // Calculate totals for stats cards
  const mongoCollectionCount = collections?.length || 0;
  const neo4jNodeCount = nodeTypes?.reduce((total, type) => total + type.nodeCount, 0) || 0;
  
  // Find a specific node type for relationships count
  const orderNodeType = nodeTypes?.find(type => type.name === "Order");
  const relationshipsCount = orderNodeType ? orderNodeType.nodeCount * 2 : 0; // Just an estimate
  
  // Latest sync time
  const lastSyncMapping = mappings?.reduce((latest, mapping) => {
    if (!latest || !latest.lastSync) return mapping;
    if (!mapping.lastSync) return latest;
    return new Date(mapping.lastSync) > new Date(latest.lastSync) ? mapping : latest;
  }, null);
  
  const lastSyncTime = lastSyncMapping?.lastSync ? new Date(lastSyncMapping.lastSync) : null;
  const timeAgoText = lastSyncTime ? getTimeAgo(lastSyncTime) : "N/A";

  return (
    <div className="p-6 bg-neutral-lightest">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">System Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="MongoDB Collections"
            value={mongoCollectionCount}
            icon="database-2"
            color="mongodb"
            trend="+2"
            trendText="since last week"
          />
          
          <StatsCard
            title="Neo4j Nodes"
            value={neo4jNodeCount}
            icon="bubble-chart"
            color="neodb"
            trend={"+126"}
            trendText="since last week"
          />
          
          <StatsCard
            title="Neo4j Relationships"
            value={relationshipsCount}
            icon="git-branch"
            color="neodb-secondary"
            trend={"+512"}
            trendText="since last week"
          />
          
          <StatsCard
            title="Data Sync Status"
            value="Active"
            icon="link"
            color="status-info"
            statusIndicator={true}
            statusText={`Last sync: ${timeAgoText}`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <MongoDBPanel collections={collections || []} />
        <Neo4jPanel nodeTypes={nodeTypes || []} />
      </div>
      
      <IntegrationSection mappings={mappings || []} />
      
      <PerformanceComparison metrics={metrics || []} />
    </div>
  );
}

// Helper function to format time ago
const getTimeAgo = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

export default Dashboard;
