import React, { useState } from 'react';
import { Menu, Bell, User, Search, Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es'); // Español por defecto

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  // Texto traducido según el lenguaje seleccionado
  const t = {
    search: language === 'es' ? 'Buscar...' : 'Search...',
    userMenu: language === 'es' ? 'Menú de usuario' : 'User menu',
    profile: language === 'es' ? 'Perfil' : 'Profile',
    settings: language === 'es' ? 'Configuración' : 'Settings',
    logout: language === 'es' ? 'Cerrar sesión' : 'Logout',
    notifications: language === 'es' ? 'Notificaciones' : 'Notifications',
    langSwitch: language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish',
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-10">
      {/* Botón para móvil que controla la visibilidad del sidebar */}
      <button 
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Barra de búsqueda */}
      <div className="relative ml-4 flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t.search}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
        />
      </div>

      {/* Iconos de la derecha */}
      <div className="flex items-center ml-auto">
        {/* Selector de idioma */}
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 ml-2 flex items-center"
          title={t.langSwitch}
        >
          <Globe size={20} />
          <span className="ml-1 hidden sm:inline-block">{language.toUpperCase()}</span>
        </button>

        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 ml-2 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-3 text-sm text-center text-gray-500">
              No hay notificaciones nuevas
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menú de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 ml-2 border border-gray-300">
              <User size={24} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.userMenu}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.profile}</DropdownMenuItem>
            <DropdownMenuItem>{t.settings}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.logout}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;