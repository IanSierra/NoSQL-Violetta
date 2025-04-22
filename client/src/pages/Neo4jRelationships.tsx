import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const Neo4jRelationships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sample relationship data
  const relationships = [
    { 
      id: 1, 
      type: "PURCHASED", 
      startNode: { 
        id: "u1", 
        labels: ["User"], 
        properties: { name: "John Smith", email: "john@example.com" } 
      },
      endNode: { 
        id: "p1", 
        labels: ["Product"], 
        properties: { name: "Smartphone X", price: 699.99 } 
      },
      properties: { 
        date: "2023-11-15", 
        amount: 699.99,
        quantity: 1
      }
    },
    { 
      id: 2, 
      type: "REVIEWED", 
      startNode: { 
        id: "u1", 
        labels: ["User"], 
        properties: { name: "John Smith", email: "john@example.com" } 
      },
      endNode: { 
        id: "p1", 
        labels: ["Product"], 
        properties: { name: "Smartphone X", price: 699.99 } 
      },
      properties: { 
        date: "2023-11-18", 
        rating: 4.5,
        comment: "Great phone, excellent camera!"
      }
    },
    { 
      id: 3, 
      type: "PURCHASED", 
      startNode: { 
        id: "u2", 
        labels: ["User"], 
        properties: { name: "Sarah Jones", email: "sarah@example.com" } 
      },
      endNode: { 
        id: "p2", 
        labels: ["Product"], 
        properties: { name: "Laptop Pro", price: 1299.99 } 
      },
      properties: { 
        date: "2023-11-10", 
        amount: 1299.99,
        quantity: 1
      }
    },
    { 
      id: 4, 
      type: "VIEWED", 
      startNode: { 
        id: "u3", 
        labels: ["User"], 
        properties: { name: "Mike Johnson", email: "mike@example.com" } 
      },
      endNode: { 
        id: "p1", 
        labels: ["Product"], 
        properties: { name: "Smartphone X", price: 699.99 } 
      },
      properties: { 
        date: "2023-11-20", 
        viewDuration: 120,
        fromReferer: "google.com"
      }
    },
    { 
      id: 5, 
      type: "WISHLIST", 
      startNode: { 
        id: "u3", 
        labels: ["User"], 
        properties: { name: "Mike Johnson", email: "mike@example.com" } 
      },
      endNode: { 
        id: "p2", 
        labels: ["Product"], 
        properties: { name: "Laptop Pro", price: 1299.99 } 
      },
      properties: { 
        date: "2023-11-19", 
        priority: "high"
      }
    },
    { 
      id: 6, 
      type: "RECOMMENDED", 
      startNode: { 
        id: "p1", 
        labels: ["Product"], 
        properties: { name: "Smartphone X", price: 699.99 } 
      },
      endNode: { 
        id: "p3", 
        labels: ["Product"], 
        properties: { name: "Wireless Earbuds", price: 129.99 } 
      },
      properties: { 
        strength: 0.85,
        reason: "frequently_bought_together"
      }
    },
  ];

  // Get unique relationship types
  const relationshipTypes = Array.from(new Set(relationships.map(rel => rel.type)));

  // Filter relationships based on search and type filter
  const filteredRelationships = relationships.filter(rel => {
    const matchesSearch = 
      searchQuery === "" || 
      rel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.startNode.properties.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.endNode.properties.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === null || rel.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">Neo4j Relationships</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relationship Management</CardTitle>
              <CardDescription>Manage relationships between nodes in the graph database</CardDescription>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1F4F9E] hover:bg-[#4A77D6] text-white">
                  Create Relationship
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Relationship</DialogTitle>
                  <DialogDescription>
                    Connect two nodes with a defined relationship type
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sourceNode" className="text-right">
                      Source Node
                    </Label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source node" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="u1">User: John Smith</SelectItem>
                          <SelectItem value="u2">User: Sarah Jones</SelectItem>
                          <SelectItem value="u3">User: Mike Johnson</SelectItem>
                          <SelectItem value="p1">Product: Smartphone X</SelectItem>
                          <SelectItem value="p2">Product: Laptop Pro</SelectItem>
                          <SelectItem value="p3">Product: Wireless Earbuds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="relationshipType" className="text-right">
                      Relationship Type
                    </Label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PURCHASED">PURCHASED</SelectItem>
                          <SelectItem value="REVIEWED">REVIEWED</SelectItem>
                          <SelectItem value="VIEWED">VIEWED</SelectItem>
                          <SelectItem value="WISHLIST">WISHLIST</SelectItem>
                          <SelectItem value="RECOMMENDED">RECOMMENDED</SelectItem>
                          <SelectItem value="custom">Custom Type...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetNode" className="text-right">
                      Target Node
                    </Label>
                    <div className="col-span-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target node" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="u1">User: John Smith</SelectItem>
                          <SelectItem value="u2">User: Sarah Jones</SelectItem>
                          <SelectItem value="u3">User: Mike Johnson</SelectItem>
                          <SelectItem value="p1">Product: Smartphone X</SelectItem>
                          <SelectItem value="p2">Product: Laptop Pro</SelectItem>
                          <SelectItem value="p3">Product: Wireless Earbuds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="properties" className="text-right">
                      Properties
                    </Label>
                    <Input
                      id="properties"
                      placeholder='{"key1": "value1", "key2": "value2"}'
                      className="col-span-3"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1F4F9E] hover:bg-[#4A77D6] text-white">
                    Create Relationship
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search relationships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-medium" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedType ? `Type: ${selectedType}` : "Filter by Type"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Relationship Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedType(null)}>
                  All Types
                </DropdownMenuItem>
                {relationshipTypes.map((type) => (
                  <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRelationships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-medium py-6">
                      No relationships found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRelationships.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-[#EBF1FF] text-[#1F4F9E] border-[#4A77D6]/20">
                          {rel.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{rel.startNode.properties.name}</span>
                          <span className="text-xs text-neutral-medium">
                            {rel.startNode.labels.join(', ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{rel.endNode.properties.name}</span>
                          <span className="text-xs text-neutral-medium">
                            {rel.endNode.labels.join(', ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {Object.entries(rel.properties).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-mono text-neutral-medium">{key}:</span>{" "}
                              <span className="font-medium">{value.toString()}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-medium hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Neo4jRelationships;
