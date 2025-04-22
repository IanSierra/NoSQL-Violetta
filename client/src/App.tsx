import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/ui/Layout";
import Dashboard from "@/pages/Dashboard";
import MongoCollections from "@/pages/MongoCollections";
import MongoQueries from "@/pages/MongoQueries";
import MongoAggregations from "@/pages/MongoAggregations";
import Neo4jGraphs from "@/pages/Neo4jGraphs";
import Neo4jRelationships from "@/pages/Neo4jRelationships";
import Neo4jCypher from "@/pages/Neo4jCypher";
import DataBridge from "@/pages/DataBridge";
import SyncHistory from "@/pages/SyncHistory";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mongodb/collections" component={MongoCollections} />
        <Route path="/mongodb/queries" component={MongoQueries} />
        <Route path="/mongodb/aggregations" component={MongoAggregations} />
        <Route path="/neo4j/graphs" component={Neo4jGraphs} />
        <Route path="/neo4j/relationships" component={Neo4jRelationships} />
        <Route path="/neo4j/cypher" component={Neo4jCypher} />
        <Route path="/integration/data-bridge" component={DataBridge} />
        <Route path="/integration/sync-history" component={SyncHistory} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
