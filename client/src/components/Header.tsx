import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Get page title from location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/mongodb/collections":
        return "MongoDB Collections";
      case "/mongodb/queries":
        return "MongoDB Queries";
      case "/mongodb/aggregations":
        return "MongoDB Aggregations";
      case "/neo4j/graphs":
        return "Neo4j Graphs";
      case "/neo4j/relationships":
        return "Neo4j Relationships";
      case "/neo4j/cypher":
        return "Neo4j Cypher";
      case "/integration/data-bridge":
        return "Data Bridge";
      case "/integration/sync-history":
        return "Sync History";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-light bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Database Connection Status */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-neutral-medium">MongoDB</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-neutral-medium">Neo4j</span>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative hidden sm:block">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="py-1.5 pl-8 pr-4 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-neutral-medium" />
        </div>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <i className="ri-arrow-down-s-line ml-1 text-neutral-medium"></i>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
