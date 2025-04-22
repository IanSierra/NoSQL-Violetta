import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { IntegrationMapping } from "@shared/schema";

interface IntegrationTableProps {
  mappings: IntegrationMapping[];
}

const IntegrationTable = ({ mappings }: IntegrationTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMapping, setSelectedMapping] = useState<IntegrationMapping | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mappings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMappings = mappings.slice(startIndex, endIndex);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Format time ago for the last sync
  const getTimeAgo = (date?: Date | null) => {
    if (!date) return "Never";
    
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Handle view mapping
  const handleView = (mapping: IntegrationMapping) => {
    setSelectedMapping(mapping);
    setIsViewDialogOpen(true);
  };

  // Handle delete mapping
  const handleDelete = (mapping: IntegrationMapping) => {
    setSelectedMapping(mapping);
    setIsDeleteDialogOpen(true);
  };

  // Handle sync mapping
  const handleSync = (mapping: IntegrationMapping) => {
    setSelectedMapping(mapping);
    setIsSyncDialogOpen(true);
  };

  // Delete mapping mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/integration-mappings/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integration-mappings"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Integration mapping deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete mapping: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Sync mapping mutation
  const syncMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("POST", `/api/integration-mappings/${id}/sync`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integration-mappings"] });
      setIsSyncDialogOpen(false);
      toast({
        title: "Success",
        description: "Data synchronized successfully",
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

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!selectedMapping) return;
    deleteMutation.mutate(selectedMapping.id);
  };

  // Handle sync confirmation
  const handleSyncConfirm = () => {
    if (!selectedMapping) return;
    syncMutation.mutate(selectedMapping.id);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source (MongoDB)</TableHead>
              <TableHead>Target (Neo4j)</TableHead>
              <TableHead>Sync Type</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMappings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-neutral-medium">
                  No integration mappings found
                </TableCell>
              </TableRow>
            ) : (
              paginatedMappings.map((mapping) => (
                <TableRow key={mapping.id} className="hover:bg-neutral-lightest transition-colors">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="ri-database-2-line text-[#00684A] mr-2"></i>
                      <span>{mapping.sourceCollection}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="ri-bubble-chart-line text-[#1F4F9E] mr-2"></i>
                      <span>{mapping.targetNodeType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{mapping.syncType}</TableCell>
                  <TableCell>{getTimeAgo(mapping.lastSync)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`px-2 py-1 text-xs rounded-full ${
                      mapping.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {mapping.status.charAt(0).toUpperCase() + mapping.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(mapping)}>
                      <Eye className="h-4 w-4 text-neutral-medium hover:text-[#3D89FF]" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleSync(mapping)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-medium hover:text-[#3D89FF]">
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                        <path d="M3 22v-6h6"></path>
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(mapping)}>
                      <Trash className="h-4 w-4 text-neutral-medium hover:text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                    className={currentPage === index + 1 ? "bg-[#3D89FF] text-white hover:bg-blue-600" : ""}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {/* View Mapping Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Integration Mapping Details</DialogTitle>
            <DialogDescription>
              View details of the integration mapping
            </DialogDescription>
          </DialogHeader>
          
          {selectedMapping && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Source Collection:</div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <i className="ri-database-2-line text-[#00684A] mr-2"></i>
                    {selectedMapping.sourceCollection}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Target Node Type:</div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <i className="ri-bubble-chart-line text-[#1F4F9E] mr-2"></i>
                    {selectedMapping.targetNodeType}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Sync Type:</div>
                <div className="col-span-2">{selectedMapping.syncType}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Last Sync:</div>
                <div className="col-span-2">
                  {selectedMapping.lastSync 
                    ? new Date(selectedMapping.lastSync).toLocaleString() 
                    : "Never synchronized"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Status:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={`px-2 py-1 text-xs rounded-full ${
                    selectedMapping.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {selectedMapping.status.charAt(0).toUpperCase() + selectedMapping.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Created At:</div>
                <div className="col-span-2">{new Date(selectedMapping.createdAt).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Updated At:</div>
                <div className="col-span-2">{new Date(selectedMapping.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button 
              className="bg-[#3D89FF] hover:bg-blue-600 text-white"
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedMapping) handleSync(selectedMapping);
              }}
            >
              Sync Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Mapping Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the integration mapping
              between <span className="font-bold">{selectedMapping?.sourceCollection}</span> and{" "}
              <span className="font-bold">{selectedMapping?.targetNodeType}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Sync Mapping Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Synchronize Data</DialogTitle>
            <DialogDescription>
              Start data synchronization between MongoDB and Neo4j
            </DialogDescription>
          </DialogHeader>
          
          {selectedMapping && (
            <div className="py-4">
              <p className="mb-4">
                This will synchronize data from{" "}
                <span className="font-bold">{selectedMapping.sourceCollection}</span> MongoDB collection to{" "}
                <span className="font-bold">{selectedMapping.targetNodeType}</span> Neo4j nodes.
              </p>
              
              <div className="flex items-center p-4 bg-neutral-lightest rounded-md">
                <i className="ri-information-line text-lg text-blue-500 mr-2"></i>
                <p className="text-sm text-neutral-medium">
                  {selectedMapping.syncType === "Bidirectional" 
                    ? "This is a bidirectional sync. Changes will be propagated in both directions."
                    : "This is a one-way sync. Changes will be propagated from MongoDB to Neo4j."}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#3D89FF] hover:bg-blue-600 text-white"
              onClick={handleSyncConfirm}
              disabled={syncMutation.isPending}
            >
              {syncMutation.isPending ? "Synchronizing..." : "Start Synchronization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationTable;
