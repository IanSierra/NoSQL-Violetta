import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [location] = useLocation();

  // Definimos los items de navegación
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Productos',
      path: '/productos',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: <Users size={20} />,
    },
    {
      name: 'Transacciones',
      path: '/transacciones',
      icon: <Receipt size={20} />,
    },
    {
      name: 'Reportes',
      path: '/reportes',
      icon: <BarChart3 size={20} />,
    },
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div 
      className={`bg-violet-900 text-white h-full transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo y nombre */}
      <div className="p-6 border-b border-violet-800 flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-violet-900 font-bold">
            V
          </div>
          {/* Nombre */}
          {isOpen && (
            <span className="ml-3 font-bold text-lg">Violetta</span>
          )}
        </div>

        {/* Botón para colapsar/expandir */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-full hover:bg-violet-800"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link href={item.path}>
                <div 
                  className={`flex items-center py-3 px-6 ${
                    location === item.path
                      ? 'bg-violet-800 text-white'
                      : 'text-violet-200 hover:bg-violet-800 hover:text-white'
                  } transition-colors rounded-md ${isOpen ? 'mx-3' : 'mx-auto justify-center'} cursor-pointer`}
                >
                  <span className="inline-block">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-violet-800 text-center text-xs text-violet-300">
        {isOpen ? 'Violetta Inventario v1.0' : 'V1.0'}
      </div>
    </div>
  );
};

export default Sidebar;