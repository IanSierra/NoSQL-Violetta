import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar as CalendarIcon, Filter, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const SyncHistory = () => {
  const [selectedMapping, setSelectedMapping] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedSync, setSelectedSync] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get sync histories
  const { data: syncHistories, isLoading: isLoadingSyncHistories } = useQuery({
    queryKey: ["/api/sync-histories"],
  });

  // Get integration mappings for filtering
  const { data: mappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ["/api/integration-mappings"],
  });

  // Filter sync histories
  const filteredHistories = syncHistories?.filter((history: any) => {
    // Filter by mapping
    if (selectedMapping && history.mappingId !== parseInt(selectedMapping)) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus && history.status !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !history.message?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (startDate && new Date(history.startedAt) < startDate) {
      return false;
    }
    
    if (endDate) {
      // Add one day to endDate to include the entire day
      const endDatePlusOneDay = new Date(endDate);
      endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
      
      if (new Date(history.startedAt) > endDatePlusOneDay) {
        return false;
      }
    }
    
    return true;
  });

  // Get mapping name by id
  const getMappingName = (mappingId: number) => {
    const mapping = mappings?.find((m: any) => m.id === mappingId);
    if (!mapping) return "Unknown Mapping";
    return `${mapping.sourceCollection} → ${mapping.targetNodeType}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate duration between start and completion
  const calculateDuration = (startDate: string, completionDate: string | null) => {
    if (!completionDate) return "In progress";
    
    const start = new Date(startDate).getTime();
    const end = new Date(completionDate).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${Math.round(durationMs / 1000)}s`;
    } else {
      return `${Math.round(durationMs / 60000)}m ${Math.round((durationMs % 60000) / 1000)}s`;
    }
  };

  // Handle view sync details
  const handleViewDetails = (sync: any) => {
    setSelectedSync(sync);
    setIsDetailsOpen(true);
  };

  // Status badge colors
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "running":
      case "started":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Check if date filters are active
  const isDateFilterActive = startDate || endDate;

  // Clear all filters
  const clearFilters = () => {
    setSelectedMapping(null);
    setSelectedStatus(null);
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (isLoadingSyncHistories || isLoadingMappings) {
    return (
      <div className="p-6 bg-neutral-lightest">
        <h2 className="text-2xl font-semibold mb-6">Sync History</h2>
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">Sync History</h2>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Data Synchronization History</CardTitle>
              <CardDescription>
                Track all data synchronization operations between MongoDB and Neo4j
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={clearFilters}
                disabled={!selectedMapping && !selectedStatus && !searchQuery && !isDateFilterActive}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Filters</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
              <Input
                placeholder="Search sync operations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedMapping || ""} onValueChange={setSelectedMapping}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by mapping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Mappings</SelectItem>
                {mappings?.map((mapping: any) => (
                  <SelectItem key={mapping.id} value={mapping.id.toString()}>
                    {mapping.sourceCollection} → {mapping.targetNodeType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus || ""} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="started">In Progress</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isDateFilterActive ? (
                    <span>
                      {startDate ? format(startDate, "MMM d, yyyy") : "Any"} - {endDate ? format(endDate, "MMM d, yyyy") : "Any"}
                    </span>
                  ) : (
                    <span>Filter by date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate,
                    to: endDate,
                  }}
                  onSelect={(range) => {
                    setStartDate(range?.from);
                    setEndDate(range?.to);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mapping</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Records Updated</TableHead>
                  <TableHead>Records Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-neutral-medium">
                      No sync history records found matching the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistories?.map((history: any) => (
                    <TableRow key={history.id}>
                      <TableCell>{getMappingName(history.mappingId)}</TableCell>
                      <TableCell>{formatDate(history.startedAt)}</TableCell>
                      <TableCell>{calculateDuration(history.startedAt, history.completedAt)}</TableCell>
                      <TableCell>{history.recordsUpdated}</TableCell>
                      <TableCell>{history.recordsCreated}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeClass(history.status)}
                        >
                          {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(history)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-neutral-medium">
              Showing {filteredHistories?.length || 0} of {syncHistories?.length || 0} sync operations
            </p>
            {/* Pagination could be added here if needed */}
          </div>
        </CardContent>
      </Card>
      
      {/* Sync Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sync Operation Details</DialogTitle>
            <DialogDescription>
              Detailed information about the synchronization operation
            </DialogDescription>
          </DialogHeader>
          
          {selectedSync && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Mapping</h4>
                  <p>{getMappingName(selectedSync.mappingId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <Badge 
                    variant="outline" 
                    className={getStatusBadgeClass(selectedSync.status)}
                  >
                    {selectedSync.status.charAt(0).toUpperCase() + selectedSync.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Started At</h4>
                  <p>{formatDate(selectedSync.startedAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Completed At</h4>
                  <p>{selectedSync.completedAt ? formatDate(selectedSync.completedAt) : "Not completed"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Duration</h4>
                  <p>{calculateDuration(selectedSync.startedAt, selectedSync.completedAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Operation ID</h4>
                  <p className="font-mono text-sm">{selectedSync.id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Results</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-lightest p-4 rounded-md text-center">
                    <p className="text-2xl font-semibold text-green-600">{selectedSync.recordsUpdated}</p>
                    <p className="text-sm text-neutral-medium">Records Updated</p>
                  </div>
                  <div className="bg-neutral-lightest p-4 rounded-md text-center">
                    <p className="text-2xl font-semibold text-blue-600">{selectedSync.recordsCreated}</p>
                    <p className="text-sm text-neutral-medium">Records Created</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Message</h4>
                <div className="bg-neutral-lightest p-4 rounded-md">
                  <p className="text-sm">{selectedSync.message || "No message provided"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Technical Details</h4>
                <div className="bg-neutral-lightest p-4 rounded-md border font-mono text-xs overflow-auto">
                  <pre>{JSON.stringify({
                    id: selectedSync.id,
                    mappingId: selectedSync.mappingId,
                    status: selectedSync.status,
                    recordsUpdated: selectedSync.recordsUpdated,
                    recordsCreated: selectedSync.recordsCreated,
                    startedAt: selectedSync.startedAt,
                    completedAt: selectedSync.completedAt,
                    message: selectedSync.message
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Export Details</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyncHistory;
