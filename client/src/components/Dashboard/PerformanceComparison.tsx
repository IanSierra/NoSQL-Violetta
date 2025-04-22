import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PerformanceMetric } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface PerformanceComparisonProps {
  metrics: PerformanceMetric[];
}

const PerformanceComparison = ({ metrics }: PerformanceComparisonProps) => {
  const [timeRange, setTimeRange] = useState("7days");
  
  // Mock data for query response time chart
  const queryResponseData = [
    { name: "MongoDB", time: 32 },
    { name: "Neo4j", time: 52 },
    { name: "SQL", time: 82 }
  ];
  
  // Mock data for write performance chart
  const writePerformanceData = [
    { name: "MongoDB", ops: 4250 },
    { name: "Neo4j", ops: 3180 },
    { name: "SQL", ops: 2400 }
  ];

  return (
    <div className="mt-8 bg-white rounded-lg shadow">
      <div className="p-5 border-b border-neutral-light flex items-center justify-between">
        <div className="flex items-center">
          <i className="ri-bar-chart-2-line text-neutral-dark mr-2 text-xl"></i>
          <h3 className="font-semibold text-lg">Performance Comparison</h3>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4 text-neutral-medium" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Run New Benchmark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Query Response Time */}
          <div className="border border-neutral-light rounded-lg p-4">
            <h4 className="font-medium mb-3">Query Response Time (ms)</h4>
            <div className="h-64 bg-neutral-lightest rounded-md">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryResponseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ms`, "Response Time"]} />
                  <Bar dataKey="time" fill="#00684A" name="Response Time (ms)" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-neutral-medium text-center mt-2">Lower is better</p>
            </div>
          </div>
          
          {/* Write Performance */}
          <div className="border border-neutral-light rounded-lg p-4">
            <h4 className="font-medium mb-3">Write Performance (ops/sec)</h4>
            <div className="h-64 bg-neutral-lightest rounded-md">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={writePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} ops/sec`, "Write Performance"]} />
                  <Bar dataKey="ops" fill="#1F4F9E" name="Operations per second" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-neutral-medium text-center mt-2">Higher is better</p>
            </div>
          </div>
        </div>
        
        <div className="border border-neutral-light rounded-lg p-4">
          <h4 className="font-medium mb-3">Complex Query Performance for Common Operations</h4>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>MongoDB (ms)</TableHead>
                  <TableHead>Neo4j (ms)</TableHead>
                  <TableHead>SQL (ms)</TableHead>
                  <TableHead>Best Performer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.id} className="hover:bg-neutral-lightest transition-colors">
                    <TableCell className="font-medium">{metric.operationType}</TableCell>
                    <TableCell>{metric.mongoDbTime}</TableCell>
                    <TableCell>{metric.neo4jTime}</TableCell>
                    <TableCell>{metric.sqlTime}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          metric.bestPerformer === "MongoDB" 
                            ? "bg-[#E3FCF2] text-[#00684A] border-[#00684A]/20" 
                            : "bg-[#EBF1FF] text-[#1F4F9E] border-[#1F4F9E]/20"
                        }
                      >
                        {metric.bestPerformer}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 bg-neutral-lightest rounded-md p-4 border border-neutral-light">
            <h5 className="font-medium text-sm mb-2">Analysis</h5>
            <p className="text-sm text-neutral-medium">
              The integration of MongoDB and Neo4j provides optimal performance across different query types. 
              MongoDB excels at CRUD operations, aggregations, and full-text search, while Neo4j outperforms 
              in relationship-heavy operations like multi-level traversals and path finding. This hybrid 
              approach delivers 45-75% better performance than a single-database solution for complex operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparison;
