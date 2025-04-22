import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { integrationService } from "@/lib/integrationService";
import { Badge } from "@/components/ui/badge";

const DataBridge = () => {
  const [isNewMappingOpen, setIsNewMappingOpen] = useState(false);
  const [syncType, setSyncType] = useState<string>("MongoDB → Neo4j");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const { toast } = useToast();

  // Get MongoDB collections
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["/api/mongo-collections"],
  });

  // Get Neo4j node types
  const { data: nodeTypes, isLoading: isLoadingNodeTypes } = useQuery({
    queryKey: ["/api/neo4j-node-types"],
  });

  // Get existing integration mappings
  const { data: mappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ["/api/integration-mappings"],
  });
  
  // Para confirmar eliminación
  const [mappingToDelete, setMappingToDelete] = useState<number | null>(null);

  // Create new integration mapping
  const createMappingMutation = useMutation({
    mutationFn: async (data: { sourceCollection: string; targetNodeType: string; syncType: string; status: string }) => {
      return apiRequest("POST", "/api/integration-mappings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integration-mappings"] });
      setIsNewMappingOpen(false);
      toast({
        title: "Success",
        description: "Integration mapping created successfully",
      });
      
      // Reset form values
      setSelectedCollection("");
      setSelectedNodeType("");
      setSyncType("MongoDB → Neo4j");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create integration mapping: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Sync data 
  const syncDataMutation = useMutation({
    mutationFn: async (mappingId: number) => {
      return integrationService.syncData(mappingId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integration-mappings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sync-histories"] });
      toast({
        title: "Success",
        description: `Data synchronized successfully: ${data.syncOperation.recordsUpdated} records updated, ${data.syncOperation.recordsCreated} records created`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to synchronize data: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete mapping
  const deleteMappingMutation = useMutation({
    mutationFn: async (mappingId: number) => {
      return apiRequest("DELETE", `/api/integration-mappings/${mappingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integration-mappings"] });
      setMappingToDelete(null);
      toast({
        title: "Éxito",
        description: "Mapeo de integración eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al eliminar mapeo de integración: ${error}`,
        variant: "destructive",
      });
      setMappingToDelete(null);
    },
  });

  // Handle create mapping form submission
  const handleCreateMapping = () => {
    if (!selectedCollection || !selectedNodeType) {
      toast({
        title: "Validation Error",
        description: "Please select both a source collection and target node type",
        variant: "destructive",
      });
      return;
    }

    createMappingMutation.mutate({
      sourceCollection: selectedCollection,
      targetNodeType: selectedNodeType,
      syncType: syncType,
      status: "active"
    });
  };

  // Handle sync data for a mapping
  const handleSyncData = (mappingId: number) => {
    syncDataMutation.mutate(mappingId);
  };
  
  // Handle delete mapping
  const handleDeleteMapping = (mappingId: number) => {
    setMappingToDelete(mappingId);
  };

  // Format time ago
  const formatTimeAgo = (date?: Date | null) => {
    if (!date) return "Never";
    
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (isLoadingCollections || isLoadingNodeTypes || isLoadingMappings) {
    return (
      <div className="p-6 bg-neutral-lightest">
        <h2 className="text-2xl font-semibold mb-6">Data Bridge</h2>
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-lightest">
      {/* Diálogo de confirmación para eliminar mapeo */}
      <Dialog open={mappingToDelete !== null} onOpenChange={(open) => !open && setMappingToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este mapeo de integración? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setMappingToDelete(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (mappingToDelete !== null) {
                  deleteMappingMutation.mutate(mappingToDelete);
                }
              }}
              disabled={deleteMappingMutation.isPending}
            >
              {deleteMappingMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Data Bridge</h2>
        
        <Dialog open={isNewMappingOpen} onOpenChange={setIsNewMappingOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3D89FF] hover:bg-blue-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Integration Mapping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Mapeo de Integración</DialogTitle>
              <DialogDescription>
                Conecta colecciones de MongoDB con tipos de nodos Neo4j para sincronización de datos
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sourceCollection" className="text-right">
                  Colección Origen
                </Label>
                <div className="col-span-3">
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar colección MongoDB" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections?.map(collection => (
                        <SelectItem key={collection.id} value={collection.name}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="syncType" className="text-right">
                  Tipo de Sincronización
                </Label>
                <div className="col-span-3">
                  <Select value={syncType} onValueChange={setSyncType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo de sincronización" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MongoDB → Neo4j">MongoDB → Neo4j (Unidireccional)</SelectItem>
                      <SelectItem value="Bidirectional">Bidireccional</SelectItem>
                      <SelectItem value="Neo4j → MongoDB">Neo4j → MongoDB (Unidireccional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetNodeType" className="text-right">
                  Tipo de Nodo Destino
                </Label>
                <div className="col-span-3">
                  <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo de nodo Neo4j" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodeTypes?.map(nodeType => (
                        <SelectItem key={nodeType.id} value={nodeType.name}>
                          {nodeType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewMappingOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[#3D89FF] hover:bg-blue-600 text-white"
                onClick={handleCreateMapping}
                disabled={createMappingMutation.isPending}
              >
                {createMappingMutation.isPending ? "Creando..." : "Crear Mapeo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="mappings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mappings">Integration Mappings</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="schema">Schema Mapping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mappings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Integration Mappings</CardTitle>
              <CardDescription>
                Configured mappings between MongoDB collections and Neo4j node types
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {mappings?.length === 0 ? (
                <div className="text-center py-12 border rounded-md border-dashed">
                  <div className="w-16 h-16 bg-neutral-lightest rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                      <line x1="12" y1="16" x2="12" y2="8"></line>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Integration Mappings</h3>
                  <p className="text-neutral-medium text-sm max-w-md mx-auto mb-6">
                    Create your first mapping to start synchronizing data between MongoDB and Neo4j
                  </p>
                  <Button 
                    className="bg-[#3D89FF] hover:bg-blue-600 text-white"
                    onClick={() => setIsNewMappingOpen(true)}
                  >
                    Create First Mapping
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>MongoDB Collection</TableHead>
                        <TableHead>Neo4j Node Type</TableHead>
                        <TableHead>Sync Type</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappings?.map(mapping => (
                        <TableRow key={mapping.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <i className="ri-database-2-line text-[#00684A] mr-2"></i>
                              {mapping.sourceCollection}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <i className="ri-bubble-chart-line text-[#1F4F9E] mr-2"></i>
                              {mapping.targetNodeType}
                            </div>
                          </TableCell>
                          <TableCell>{mapping.syncType}</TableCell>
                          <TableCell>{formatTimeAgo(mapping.lastSync)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${
                              mapping.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {mapping.status.charAt(0).toUpperCase() + mapping.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline" 
                              size="sm"
                              className="mr-2"
                              onClick={() => handleSyncData(mapping.id)}
                              disabled={syncDataMutation.isPending}
                            >
                              {syncDataMutation.isPending ? "Sincronizando..." : "Sincronizar"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleDeleteMapping(mapping.id)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mapping Details</CardTitle>
                <CardDescription>Detailed configuration for each mapping</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-neutral-lightest p-4 rounded-md">
                    <h4 className="font-medium mb-2">Field Mapping & Transformation</h4>
                    <p className="text-sm text-neutral-medium mb-4">
                      Define how MongoDB document fields map to Neo4j node properties
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Field Mappings
                    </Button>
                  </div>
                  
                  <div className="bg-neutral-lightest p-4 rounded-md">
                    <h4 className="font-medium mb-2">Relationship Definitions</h4>
                    <p className="text-sm text-neutral-medium mb-4">
                      Define how document references translate to graph relationships
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Relationships
                    </Button>
                  </div>
                  
                  <div className="bg-neutral-lightest p-4 rounded-md">
                    <h4 className="font-medium mb-2">Sync Schedule</h4>
                    <p className="text-sm text-neutral-medium mb-4">
                      Set up automated synchronization schedules
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common integration operations</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-[#3D89FF] hover:bg-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 1 21 5 17 9"></polyline>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <polyline points="7 23 3 19 7 15"></polyline>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                    Sync All Mappings
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="18" r="3"></circle>
                        <circle cx="6" cy="6" r="3"></circle>
                        <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                        <line x1="6" y1="9" x2="6" y2="21"></line>
                      </svg>
                      Configure Triggers
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      View Logs
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-neutral-light rounded-md">
                    <h4 className="font-medium mb-2">Connectivity Status</h4>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">MongoDB</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Neo4j</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-sm px-2">
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Configuration</CardTitle>
              <CardDescription>Global settings for the data bridge</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">MongoDB Connection</h3>
                    <div className="space-y-2">
                      <Label htmlFor="mongoUrl">Connection String</Label>
                      <Input id="mongoUrl" placeholder="mongodb://username:password@host:port/database" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mongoDatabase">Database Name</Label>
                      <Input id="mongoDatabase" placeholder="mydatabase" />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        Test Connection
                      </Button>
                      <Button size="sm" className="bg-[#00684A] hover:bg-[#13AA52] text-white">
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Neo4j Connection</h3>
                    <div className="space-y-2">
                      <Label htmlFor="neo4jUrl">Connection URI</Label>
                      <Input id="neo4jUrl" placeholder="neo4j://hostname:port" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="neo4jUsername">Username</Label>
                        <Input id="neo4jUsername" placeholder="neo4j" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neo4jPassword">Password</Label>
                        <Input id="neo4jPassword" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        Test Connection
                      </Button>
                      <Button size="sm" className="bg-[#1F4F9E] hover:bg-[#4A77D6] text-white">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Sync Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="syncBatchSize">Batch Size</Label>
                      <Input id="syncBatchSize" type="number" defaultValue="100" />
                      <p className="text-xs text-neutral-medium">Number of documents processed in each batch</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="syncConcurrency">Concurrency</Label>
                      <Input id="syncConcurrency" type="number" defaultValue="5" />
                      <p className="text-xs text-neutral-medium">Number of parallel synchronization processes</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="syncRetries">Retry Attempts</Label>
                      <Input id="syncRetries" type="number" defaultValue="3" />
                      <p className="text-xs text-neutral-medium">How many times to retry failed operations</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Advanced Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Error Handling</h4>
                        <p className="text-sm text-neutral-medium">Configure how sync errors are handled</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Conflict Resolution</h4>
                        <p className="text-sm text-neutral-medium">Set up conflict resolution strategies</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Logging</h4>
                        <p className="text-sm text-neutral-medium">Configure log verbosity and retention</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Notification Settings</h4>
                        <p className="text-sm text-neutral-medium">Configure alert and notification rules</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schema" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schema Mapping</CardTitle>
              <CardDescription>Define how MongoDB schemas map to Neo4j graph structures</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="visual" className="w-full">
                <TabsList>
                  <TabsTrigger value="visual">Visual Mapper</TabsTrigger>
                  <TabsTrigger value="code">JSON Mapper</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visual" className="mt-4">
                  <div className="text-center py-12 border rounded-md">
                    <div className="max-w-md mx-auto space-y-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-medium mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      <h3 className="text-lg font-medium">Visual Schema Mapper</h3>
                      <p className="text-neutral-medium text-sm">
                        Drag and drop interface to visually map MongoDB document schemas to Neo4j graph structures.
                      </p>
                      <Button className="bg-[#3D89FF] hover:bg-blue-600 text-white">
                        Launch Visual Mapper
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-lightest rounded-md">
                      <h4 className="font-medium mb-2">Sample Mapping Configuration</h4>
                      <pre className="text-xs font-mono overflow-auto p-4 bg-white border rounded-md">
{`{
  "collection": "users",
  "nodeLabel": "User",
  "properties": {
    "map": {
      "_id": "id",
      "name": "name",
      "email": "email"
    }
  },
  "relationships": [
    {
      "field": "orders",
      "type": "PLACED",
      "direction": "outgoing",
      "target": {
        "label": "Order",
        "idField": "_id"
      }
    }
  ]
}`}
                      </pre>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="collection">Select Collection</Label>
                        <Select>
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select MongoDB collection" />
                          </SelectTrigger>
                          <SelectContent>
                            {collections?.map(collection => (
                              <SelectItem key={collection.id} value={collection.name}>
                                {collection.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="nodeType">Select Node Type</Label>
                        <Select>
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select Neo4j node type" />
                          </SelectTrigger>
                          <SelectContent>
                            {nodeTypes?.map(nodeType => (
                              <SelectItem key={nodeType.id} value={nodeType.name}>
                                {nodeType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="mappingJson">Mapping Configuration (JSON)</Label>
                      <div className="mt-1 border rounded-md">
                        <QueryEditor
                          language="json"
                          value={`{
  "properties": {
    "map": {
      "_id": "id",
      "name": "name",
      "email": "email"
    }
  },
  "relationships": []
}`}
                          onChange={() => {}}
                          height="200px"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" className="mr-2">Cancel</Button>
                      <Button className="bg-[#3D89FF] hover:bg-blue-600 text-white">Save Mapping</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataBridge;
