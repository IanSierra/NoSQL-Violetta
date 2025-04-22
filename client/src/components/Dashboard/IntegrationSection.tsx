import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash } from "lucide-react";
import IntegrationTable from "@/components/Database/IntegrationTable";
import type { IntegrationMapping } from "@shared/schema";

interface IntegrationSectionProps {
  mappings: IntegrationMapping[];
}

const IntegrationSection = ({ mappings }: IntegrationSectionProps) => {
  // Generate mock sync activities based on the mappings
  const generateSyncActivities = () => {
    return mappings.slice(0, 3).map(mapping => ({
      id: mapping.id,
      sourceCollection: mapping.sourceCollection,
      targetNodeType: mapping.targetNodeType,
      status: "success",
      recordsUpdated: Math.floor(Math.random() * 100) + 1,
      recordsCreated: Math.floor(Math.random() * 20),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000))
    }));
  };

  const syncActivities = generateSyncActivities();

  // Format time ago for sync activities
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow">
      <div className="p-5 border-b border-neutral-light flex items-center justify-between">
        <div className="flex items-center">
          <i className="ri-link text-[#3D89FF] mr-2 text-xl"></i>
          <h3 className="font-semibold text-lg">Data Integration</h3>
        </div>
        <Button className="bg-[#3D89FF] hover:bg-blue-600 text-white">
          <i className="ri-refresh-line mr-1"></i> Sync Now
        </Button>
      </div>
      
      <div className="p-5">
        <div className="mb-6">
          <h4 className="font-medium text-sm text-neutral-medium uppercase mb-3">Current Mappings</h4>
          <IntegrationTable mappings={mappings} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Integration Card */}
          <div className="border border-dashed border-neutral-light rounded-lg p-5 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-lightest rounded-full flex items-center justify-center mb-4">
              <i className="ri-add-line text-3xl text-neutral-medium"></i>
            </div>
            <h4 className="font-medium text-lg mb-2">Create New Integration</h4>
            <p className="text-neutral-medium text-sm mb-4">Map data between MongoDB and Neo4j to leverage the strengths of both database types.</p>
            <Link href="/integration/data-bridge">
              <Button variant="outline">
                Add Mapping
              </Button>
            </Link>
          </div>
          
          {/* Recent Sync Activity */}
          <div className="border border-neutral-light rounded-lg p-5">
            <h4 className="font-medium text-lg mb-4">Recent Sync Activity</h4>
            
            <div className="space-y-4">
              {syncActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-green-500"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Successful sync of <span className="text-[#00684A]">{activity.sourceCollection}</span> to{" "}
                      <span className="text-[#1F4F9E]">{activity.targetNodeType} nodes</span>
                    </p>
                    <p className="text-xs text-neutral-medium">
                      {getTimeAgo(activity.timestamp)} - {activity.recordsUpdated} records updated, {activity.recordsCreated} created
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/integration/sync-history">
              <Button variant="link" className="w-full mt-4 text-center text-sm text-[#3D89FF] hover:underline">
                View Full Sync History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSection;
