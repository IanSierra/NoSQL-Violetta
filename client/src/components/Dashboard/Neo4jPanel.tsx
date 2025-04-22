import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, MoreHorizontal, ChevronRight } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Neo4jNodeType } from "@shared/schema";
import { Link } from "wouter";

interface Neo4jPanelProps {
  nodeTypes: Neo4jNodeType[];
}

const Neo4jPanel = ({ nodeTypes }: Neo4jPanelProps) => {
  // Basic graph visualization
  // In a real implementation, this would be a more sophisticated graph visualization
  const renderSimpleGraphVisualization = () => {
    const userNode = nodeTypes.find(type => type.name === "User");
    const orderNode = nodeTypes.find(type => type.name === "Order");
    const productNode = nodeTypes.find(type => type.name === "Product");
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        {/* User node */}
        {userNode && (
          <div 
            className="absolute top-10 left-16 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${userNode.color}20`,
              borderWidth: 2,
              borderColor: userNode.color 
            }}
          >
            <span className="text-sm font-medium">{userNode.name}</span>
          </div>
        )}
        
        {/* Order node */}
        {orderNode && (
          <div 
            className="absolute bottom-10 left-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${orderNode.color}20`,
              borderWidth: 2,
              borderColor: orderNode.color 
            }}
          >
            <span className="text-sm font-medium">{orderNode.name}</span>
          </div>
        )}
        
        {/* Product node */}
        {productNode && (
          <div 
            className="absolute bottom-10 right-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${productNode.color}20`,
              borderWidth: 2,
              borderColor: productNode.color 
            }}
          >
            <span className="text-sm font-medium">{productNode.name}</span>
          </div>
        )}
        
        {/* Relationship lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
          {userNode && orderNode && (
            <line x1="96" y1="58" x2="50" y2="134" stroke="#1F4F9E" strokeWidth="2" strokeDasharray="4" />
          )}
          {userNode && productNode && (
            <line x1="96" y1="58" x2="142" y2="134" stroke="#13AA52" strokeWidth="2" strokeDasharray="4" />
          )}
          {orderNode && productNode && (
            <line x1="50" y1="134" x2="142" y2="134" stroke="#00684A" strokeWidth="2" strokeDasharray="4" />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b border-neutral-light flex items-center justify-between">
        <div className="flex items-center">
          <i className="ri-bubble-chart-line text-[#1F4F9E] mr-2 text-xl"></i>
          <h3 className="font-semibold text-lg">Neo4j Graph Data</h3>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <RefreshCcw className="h-4 w-4 text-neutral-medium" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4 text-neutral-medium" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Export Graph</DropdownMenuItem>
              <DropdownMenuItem>View Full Graph</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-5">
        {/* Graph Visualization */}
        <div className="h-64 mb-4 bg-neutral-lightest rounded-md border border-neutral-light flex items-center justify-center">
          {renderSimpleGraphVisualization()}
          <p className="text-xs text-neutral-medium mt-4 absolute bottom-2">Interactive graph visualization - click nodes to explore relationships</p>
        </div>
        
        {/* Node Types */}
        <h4 className="font-medium text-sm text-neutral-medium uppercase mb-2">Node Types</h4>
        <div className="space-y-2 mb-6">
          {nodeTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between bg-neutral-lightest p-3 rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                <span>{type.name}</span>
              </div>
              <span className="text-sm font-medium">{type.nodeCount.toLocaleString()} nodes</span>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <h4 className="font-medium text-sm text-neutral-medium uppercase mb-2">Quick Actions</h4>
        <div className="space-y-2">
          <Link href="/neo4j/cypher">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
            >
              <div className="flex items-center">
                <i className="ri-terminal-line text-[#1F4F9E] mr-2"></i>
                <span>Run Cypher Query</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1F4F9E]" />
            </Button>
          </Link>
          <Link href="/neo4j/graphs">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
            >
              <div className="flex items-center">
                <i className="ri-bubble-chart-line text-[#1F4F9E] mr-2"></i>
                <span>View Full Graph</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1F4F9E]" />
            </Button>
          </Link>
          <Link href="/neo4j/relationships">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between bg-[#EBF1FF] hover:bg-[#EBF1FF]/70 text-[#1F4F9E] hover:text-[#1F4F9E] transition-colors border-[#4A77D6]/20"
            >
              <div className="flex items-center">
                <i className="ri-database-2-line text-[#1F4F9E] mr-2"></i>
                <span>Import Data</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1F4F9E]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Neo4jPanel;
