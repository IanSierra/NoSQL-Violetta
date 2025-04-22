import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraphVisualization from "@/components/Database/GraphVisualization";

const Neo4jGraphs = () => {
  const [selectedGraph, setSelectedGraph] = useState("userProductGraph");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: nodeTypes, isLoading } = useQuery({
    queryKey: ["/api/neo4j-node-types"],
  });

  // Sample node and relationship data for different graph types
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

  if (isLoading) {
    return (
      <div className="p-6 bg-neutral-lightest">
        <h2 className="text-2xl font-semibold mb-6">Neo4j Graphs</h2>
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">Neo4j Graphs</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Graph Visualization</CardTitle>
                  <CardDescription>Explore nodes and relationships</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // This would typically trigger a refresh from the database
                      setSelectedGraph(selectedGraph);
                    }}
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    Export
                  </Button>
                </div>
              </div>
              
              <Tabs 
                defaultValue="userProductGraph" 
                className="w-full mt-2" 
                onValueChange={setSelectedGraph}
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="userProductGraph">User-Product</TabsTrigger>
                  <TabsTrigger value="socialGraph">Social Network</TabsTrigger>
                  <TabsTrigger value="supplyChain">Supply Chain</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="min-h-[500px] flex items-center justify-center">
              <GraphVisualization 
                data={graphData[selectedGraph as keyof typeof graphData]} 
                height={500}
                width="100%"
              />
            </CardContent>
            
            <CardFooter className="border-t pt-4 text-sm text-neutral-medium">
              Click on nodes to explore relationships • Drag to reposition • Scroll to zoom
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Node Types</CardTitle>
              <CardDescription>Database node categories</CardDescription>
              
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Search node types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {nodeTypes
                  ?.filter(type => 
                    type.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((type) => (
                    <div 
                      key={type.id} 
                      className="flex items-center justify-between bg-neutral-lightest p-3 rounded-md"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: type.color }}
                        ></div>
                        <span>{type.name}</span>
                      </div>
                      <span className="text-sm font-medium">{type.nodeCount.toLocaleString()} nodes</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Graph Operations</CardTitle>
              <CardDescription>Neo4j graph operations</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>Create New Node</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 9l2 2 4-4"></path>
                      <path d="M5 15l2 2 4-4"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    <span>Create Relationship</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <span>Delete Selection</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between w-full bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                      <line x1="12" y1="22" x2="12" y2="15.5"></line>
                      <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                      <line x1="2" y1="15.5" x2="12" y2="8.5"></line>
                      <line x1="22" y1="15.5" x2="12" y2="8.5"></line>
                    </svg>
                    <span>Run Graph Algorithm</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Neo4jGraphs;
