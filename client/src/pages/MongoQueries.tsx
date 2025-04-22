import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QueryEditor from "@/components/Database/QueryEditor";

const MongoQueries = () => {
  const [results, setResults] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Sample query templates
  const queryTemplates = {
    find: `// Example find query
db.users.find({ 
  age: { $gt: 25 },
  status: "active" 
})`,
    aggregate: `// Example aggregation pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$userId",
      orderCount: { $sum: 1 },
      totalSpent: { $sum: "$total" }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
])`,
    update: `// Example update operation
db.products.updateMany(
  { stock: { $lt: 10 } },
  { $set: { status: "low_stock" } }
)`,
    delete: `// Example delete operation
db.reviews.deleteMany({
  createdAt: { $lt: ISODate("2022-01-01") }
})`,
  };

  const [currentQuery, setCurrentQuery] = useState(queryTemplates.find);

  const handleExecution = () => {
    setIsLoading(true);
    
    // Mock execution time between 20-150ms
    const executionTime = Math.floor(Math.random() * 130) + 20;
    
    setTimeout(() => {
      // Generate mock results based on query type
      let mockResults;
      
      if (currentQuery.includes("find")) {
        mockResults = [
          { _id: "617a2bdc5acb25178f16b8e1", username: "john_doe", email: "john@example.com", age: 32, status: "active" },
          { _id: "617a2bdc5acb25178f16b8e2", username: "jane_smith", email: "jane@example.com", age: 28, status: "active" },
          { _id: "617a2bdc5acb25178f16b8e3", username: "alex_wilson", email: "alex@example.com", age: 35, status: "active" },
        ];
      } else if (currentQuery.includes("aggregate")) {
        mockResults = [
          { _id: "user1", orderCount: 12, totalSpent: 1245.50 },
          { _id: "user2", orderCount: 8, totalSpent: 872.30 },
          { _id: "user3", orderCount: 5, totalSpent: 645.80 },
        ];
      } else if (currentQuery.includes("update")) {
        mockResults = { matchedCount: 5, modifiedCount: 5 };
      } else if (currentQuery.includes("delete")) {
        mockResults = { deletedCount: 8 };
      }
      
      setResults(mockResults);
      setExecutionTime(executionTime);
      setIsLoading(false);
    }, 600); // Simulate network delay
  };

  const handleTemplateChange = (template: keyof typeof queryTemplates) => {
    setCurrentQuery(queryTemplates[template]);
    setResults([]);
    setExecutionTime(null);
  };

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">MongoDB Queries</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Query Editor</CardTitle>
              <CardDescription>Write and execute MongoDB queries</CardDescription>
              
              <div className="mt-2">
                <Tabs defaultValue="find" className="w-full" onValueChange={(value) => handleTemplateChange(value as keyof typeof queryTemplates)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="find">Find</TabsTrigger>
                    <TabsTrigger value="aggregate">Aggregate</TabsTrigger>
                    <TabsTrigger value="update">Update</TabsTrigger>
                    <TabsTrigger value="delete">Delete</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <QueryEditor
                language="javascript"
                value={currentQuery}
                onChange={setCurrentQuery}
                height="240px"
              />
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-neutral-medium">
                {executionTime !== null && `Query executed in ${executionTime}ms`}
              </div>
              <Button 
                className="bg-[#00684A] hover:bg-[#13AA52] text-white"
                onClick={handleExecution}
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
              {results.length === 0 && !executionTime ? (
                <div className="text-center py-8 text-neutral-medium">
                  Execute a query to see results
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <pre className="p-4 bg-neutral-lightest rounded-md font-mono text-sm">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Query Help</CardTitle>
              <CardDescription>MongoDB query syntax reference</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Find Operations</h4>
                  <p className="text-sm text-neutral-medium mb-2">Basic structure for finding documents.</p>
                  <pre className="p-3 bg-neutral-lightest rounded-md text-xs font-mono">
                    db.collection.find(query, projection)
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Comparison Operators</h4>
                  <ul className="space-y-1 text-sm text-neutral-medium">
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$eq</code> - Equal to
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$gt</code> - Greater than
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$lt</code> - Less than
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$in</code> - In array
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Aggregation Stages</h4>
                  <ul className="space-y-1 text-sm text-neutral-medium">
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$match</code> - Filter documents
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$group</code> - Group documents
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$sort</code> - Sort documents
                    </li>
                    <li>
                      <code className="text-xs bg-neutral-lightest px-1 rounded">$limit</code> - Limit results
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
                <li className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md">
                  <div className="font-medium text-neutral-dark mb-1">Find active users</div>
                  <code className="text-xs font-mono">{"db.users.find({status: \"active\"})"}</code>
                  <div className="text-xs mt-1">1 hour ago • 32ms</div>
                </li>
                <li className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md">
                  <div className="font-medium text-neutral-dark mb-1">Top orders by value</div>
                  <code className="text-xs font-mono">{"db.orders.find().sort({total: -1}).limit(10)"}</code>
                  <div className="text-xs mt-1">3 hours ago • 48ms</div>
                </li>
                <li className="text-sm text-neutral-medium bg-neutral-lightest p-3 rounded-md">
                  <div className="font-medium text-neutral-dark mb-1">Update product status</div>
                  <code className="text-xs font-mono">{"db.products.updateMany({stock: 0}, {$set: {status: \"out_of_stock\"}})"}</code>
                  <div className="text-xs mt-1">Yesterday • 76ms</div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MongoQueries;
