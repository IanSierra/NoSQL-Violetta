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
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Get page title from location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Panel Principal";
      case "/mongodb/collections":
        return "Colecciones MongoDB";
      case "/mongodb/queries":
        return "Consultas MongoDB";
      case "/mongodb/aggregations":
        return "Agregaciones MongoDB";
      case "/neo4j/graphs":
        return "Grafos Neo4j";
      case "/neo4j/relationships":
        return "Relaciones Neo4j";
      case "/neo4j/cypher":
        return "Cypher Neo4j";
      case "/integration/data-bridge":
        return "Puente de Datos";
      case "/integration/sync-history":
        return "Historial de Sincronización";
      default:
        return "Panel Principal";
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
            placeholder="Buscar..." 
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
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuItem>Ayuda</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
