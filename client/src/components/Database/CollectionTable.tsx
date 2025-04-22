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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MongoCollection } from "@shared/schema";

interface CollectionTableProps {
  collections: MongoCollection[];
}

const CollectionTable = ({ collections }: CollectionTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState<MongoCollection | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    documentCount: 0,
    storageSize: 0,
    status: ""
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCollections = collections.slice(startIndex, endIndex);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Format storage size from KB to a human-readable format
  const formatStorageSize = (sizeInKB: number) => {
    if (sizeInKB < 1000) return `${sizeInKB} KB`;
    if (sizeInKB < 1000000) return `${(sizeInKB / 1000).toFixed(1)} MB`;
    return `${(sizeInKB / 1000000).toFixed(1)} GB`;
  };

  // Handle view collection
  const handleView = (collection: MongoCollection) => {
    setSelectedCollection(collection);
    setIsViewDialogOpen(true);
  };

  // Handle edit collection
  const handleEdit = (collection: MongoCollection) => {
    setSelectedCollection(collection);
    setEditFormData({
      name: collection.name,
      documentCount: collection.documentCount,
      storageSize: collection.storageSize,
      status: collection.status
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete collection
  const handleDelete = (collection: MongoCollection) => {
    setSelectedCollection(collection);
    setIsDeleteDialogOpen(true);
  };

  // Update collection mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number, collection: Partial<MongoCollection> }) => {
      return apiRequest("PUT", `/api/mongo-collections/${data.id}`, data.collection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mongo-collections"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Collection updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update collection: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Delete collection mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/mongo-collections/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mongo-collections"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete collection: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollection) return;
    
    updateMutation.mutate({
      id: selectedCollection.id,
      collection: editFormData
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!selectedCollection) return;
    deleteMutation.mutate(selectedCollection.id);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Storage Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCollections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-neutral-medium">
                  No collections found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCollections.map((collection) => (
                <TableRow key={collection.id} className="hover:bg-neutral-lightest transition-colors">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="ri-database-2-line text-[#00684A] mr-2"></i>
                      <span className="font-medium">{collection.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{collection.documentCount.toLocaleString()}</TableCell>
                  <TableCell>{formatStorageSize(collection.storageSize)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`px-2 py-1 text-xs rounded-full ${
                      collection.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(collection)}>
                      <Eye className="h-4 w-4 text-neutral-medium hover:text-[#00684A]" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(collection)}>
                      <Edit className="h-4 w-4 text-neutral-medium hover:text-[#00684A]" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(collection)}>
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
                    className={currentPage === index + 1 ? "bg-[#00684A] text-white hover:bg-[#13AA52]" : ""}
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
      
      {/* View Collection Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collection Details</DialogTitle>
            <DialogDescription>
              View detailed information about this collection
            </DialogDescription>
          </DialogHeader>
          
          {selectedCollection && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Name:</div>
                <div className="col-span-2">{selectedCollection.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Documents:</div>
                <div className="col-span-2">{selectedCollection.documentCount.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Storage Size:</div>
                <div className="col-span-2">{formatStorageSize(selectedCollection.storageSize)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Status:</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={`px-2 py-1 text-xs rounded-full ${
                    selectedCollection.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {selectedCollection.status.charAt(0).toUpperCase() + selectedCollection.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Created At:</div>
                <div className="col-span-2">{new Date(selectedCollection.createdAt).toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-neutral-medium">Updated At:</div>
                <div className="col-span-2">{new Date(selectedCollection.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Make changes to the collection details
            </DialogDescription>
          </DialogHeader>
          
          {selectedCollection && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="documentCount" className="text-right">
                    Documents
                  </Label>
                  <Input
                    id="documentCount"
                    type="number"
                    value={editFormData.documentCount}
                    onChange={(e) => setEditFormData({ ...editFormData, documentCount: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storageSize" className="text-right">
                    Storage Size (KB)
                  </Label>
                  <Input
                    id="storageSize"
                    type="number"
                    value={editFormData.storageSize}
                    onChange={(e) => setEditFormData({ ...editFormData, storageSize: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Input
                    id="status"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#00684A] hover:bg-[#13AA52] text-white"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Collection Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-bold"> {selectedCollection?.name}</span> collection and all its data.
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
    </div>
  );
};

export default CollectionTable;
