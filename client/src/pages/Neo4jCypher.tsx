import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QueryEditor from "@/components/Database/QueryEditor";
import { Badge } from "@/components/ui/badge";
import { neo4jService } from "@/lib/neo4jService";

const Neo4jCypher = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sample Cypher query templates
  const queryTemplates = {
    match: `// Match all Users who purchased Products
MATCH (u:User)-[r:PURCHASED]->(p:Product)
RETURN u.name AS User, p.name AS Product, r.date AS PurchaseDate
ORDER BY r.date DESC
LIMIT 10`,
    create: `// Create a new User node
CREATE (u:User {
  id: "u5",
  name: "Emily Johnson",
  email: "emily@example.com",
  age: 29
})
RETURN u`,
    path: `// Find the shortest path between two nodes
MATCH p=shortestPath(
  (u:User {name: "John Smith"})-[*]-(p:Product {name: "Laptop Pro"})
)
RETURN p`,
    recommend: `// Product recommendation based on common purchases
MATCH (u:User)-[:PURCHASED]->(p:Product)<-[:PURCHASED]-(similar:User)-[:PURCHASED]->(rec:Product)
WHERE u.name = "John Smith"
  AND NOT (u)-[:PURCHASED]->(rec)
RETURN rec.name AS RecommendedProduct, 
  COUNT(similar) AS CommonPurchasers
ORDER BY CommonPurchasers DESC
LIMIT 5`
  };

  const [currentTemplate, setCurrentTemplate] = useState<string>(queryTemplates.match);

  const handleTemplateChange = (tab: string) => {
    switch (tab) {
      case "match":
        setQuery(queryTemplates.match);
        break;
      case "create":
        setQuery(queryTemplates.create);
        break;
      case "path":
        setQuery(queryTemplates.path);
        break;
      case "recommend":
        setQuery(queryTemplates.recommend);
        break;
      default:
        setQuery(queryTemplates.match);
    }
  };

  const handleQueryExecution = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const startTime = performance.now();
      const result = await neo4jService.executeCypher(query);
      const endTime = performance.now();
      
      setResults(result);
      setExecutionTime(Math.round(endTime - startTime));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred during query execution");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNodeResult = (node: any) => {
    return (
      <div key={node.id} className="bg-neutral-lightest p-3 rounded-md mb-2">
        <div className="flex items-center mb-1">
          <Badge className="bg-[#1F4F9E] text-white mr-2">{node.labels?.join(':') || 'Node'}</Badge>
          <span className="font-mono text-sm">id: {node.id}</span>
        </div>
        <div className="mt-1">
          {node.properties && Object.entries(node.properties).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-mono text-neutral-medium">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatRelationshipResult = (rel: any) => {
    return (
      <div key={rel.id} className="bg-neutral-lightest p-3 rounded-md mb-2">
        <div className="flex items-center mb-1">
          <Badge className="bg-[#13AA52] text-white mr-2">{rel.type || 'RELATIONSHIP'}</Badge>
          <span className="font-mono text-sm">id: {rel.id}</span>
        </div>
        <div className="flex items-center text-sm mb-1">
          <span className="text-neutral-medium">From: </span>
          <span className="ml-1 font-mono">{rel.startNodeId}</span>
          <span className="mx-2 text-neutral-medium">To: </span>
          <span className="font-mono">{rel.endNodeId}</span>
        </div>
        <div className="mt-1">
          {rel.properties && Object.entries(rel.properties).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-mono text-neutral-medium">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (errorMessage) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
          <h4 className="font-medium mb-2">Error</h4>
          <p className="text-sm">{errorMessage}</p>
        </div>
      );
    }

    if (!results) {
      return (
        <div className="text-center py-8 text-neutral-medium">
          Execute a query to see results
        </div>
      );
    }

    return (
      <div>
        {Array.isArray(results) ? (
          <div>
            <div className="mb-3 text-neutral-medium text-sm">
              {results.length} result{results.length !== 1 ? 's' : ''} returned
            </div>
            
            {results.map((result, index) => {
              if (result.type === 'node') {
                return formatNodeResult(result);
              } else if (result.type === 'relationship') {
                return formatRelationshipResult(result);
              } else {
                return (
                  <div key={index} className="bg-neutral-lightest p-3 rounded-md mb-2">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <pre className="p-4 bg-neutral-lightest rounded-md text-sm font-mono overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">Neo4j Cypher</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Cypher Query Editor</CardTitle>
              <CardDescription>Write and execute Neo4j Cypher queries</CardDescription>
              
              <div className="mt-2">
                <Tabs 
                  defaultValue="match" 
                  className="w-full" 
                  onValueChange={handleTemplateChange}
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="match">Match</TabsTrigger>
                    <TabsTrigger value="create">Create</TabsTrigger>
                    <TabsTrigger value="path">Path Finding</TabsTrigger>
                    <TabsTrigger value="recommend">Recommendations</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <QueryEditor
                language="cypher"
                value={query || currentTemplate}
                onChange={setQuery}
                height="240px"
              />
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-neutral-medium">
                {executionTime !== null && `Query executed in ${executionTime}ms`}
              </div>
              <Button 
                className="bg-[#1F4F9E] hover:bg-[#4A77D6] text-white"
                onClick={handleQueryExecution}
                disabled={isLoading}
              >
                {isLoading ? "Executing..." : "Execute Query"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Query execution output</CardDescription>
            </CardHeader>
            
            <CardContent>
              {renderResults()}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Cypher Reference</CardTitle>
              <CardDescription>Neo4j Cypher query syntax</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Node Patterns</h4>
                  <p className="text-sm text-neutral-medium mb-2">Match nodes using patterns.</p>
                  <pre className="p-3 bg-neutral-lightest rounded-md text-xs font-mono">
                    {"MATCH (n:Label {\"prop\": \"value\"})"}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Relationships</h4>
                  <ul className="space-y-1 text-sm text-neutral-medium">
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">-[]→</code> - Directed relationship
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">-[]-</code> - Undirected relationship
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">-[r:TYPE]→</code> - With type and variable
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">-[*1..5]→</code> - Variable length path
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Common Clauses</h4>
                  <ul className="space-y-1 text-sm text-neutral-medium">
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">MATCH</code> - Pattern matching
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">WHERE</code> - Filtering results
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">RETURN</code> - Return results
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">CREATE</code> - Create nodes/relationships
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">DELETE</code> - Delete nodes/relationships
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">SET</code> - Set properties
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                <li 
                  className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md cursor-pointer hover:bg-neutral-light transition-colors"
                  onClick={() => setQuery("MATCH (u:User)-[:PURCHASED]->(p)\nRETURN u.name, COUNT(p) as purchases\nORDER BY purchases DESC LIMIT 5")}
                >
                  <div className="font-medium text-neutral-dark mb-1">Top users by purchases</div>
                  <code className="text-xs font-mono">{"MATCH (u:User)-[:PURCHASED]->(p) RETURN..."}</code>
                  <div className="text-xs mt-1">2 hours ago • 48ms</div>
                </li>
                <li 
                  className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md cursor-pointer hover:bg-neutral-light transition-colors"
                  onClick={() => setQuery("MATCH (p:Product)<-[:PURCHASED]-(u)\nRETURN p.name, COUNT(u) as buyers\nORDER BY buyers DESC LIMIT 5")}
                >
                  <div className="font-medium text-neutral-dark mb-1">Popular products</div>
                  <code className="text-xs font-mono">{"MATCH (p:Product)"}&lt;{"-[:PURCHASED]-(u) RETURN..."}</code>
                  <div className="text-xs mt-1">4 hours ago • 35ms</div>
                </li>
                <li 
                  className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md cursor-pointer hover:bg-neutral-light transition-colors"
                  onClick={() => setQuery("MATCH p=shortestPath((u1:User {name: \"John Smith\"})-[*]-(u2:User {name: \"Sarah Jones\"}))\nRETURN p")}
                >
                  <div className="font-medium text-neutral-dark mb-1">Find shortest path</div>
                  <code className="text-xs font-mono">{"MATCH p=shortestPath((u1:User)-[*]-(u2:User)) RETURN p"}</code>
                  <div className="text-xs mt-1">Yesterday • 87ms</div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Neo4jCypher;
