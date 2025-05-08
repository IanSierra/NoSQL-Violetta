import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Eye,
  Mail,
  Phone,
  Download,
  FileText,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Datos de ejemplo para clientes
const clientesData = [
  { 
    id: 'C001', 
    nombre: 'María González', 
    email: 'maria.gonzalez@ejemplo.com', 
    telefono: '555-1234', 
    direccion: 'Calle Principal 123, Ciudad',
    fechaRegistro: '2023-01-15',
    ultimaCompra: '2023-04-18',
    tipo: 'regular',
    totalCompras: 12,
    valorCompras: 1250.75
  },
  { 
    id: 'C002', 
    nombre: 'Juan López', 
    email: 'juan.lopez@ejemplo.com', 
    telefono: '555-5678', 
    direccion: 'Avenida Central 456, Ciudad',
    fechaRegistro: '2023-02-20',
    ultimaCompra: '2023-04-10',
    tipo: 'vip',
    totalCompras: 8,
    valorCompras: 2340.50
  },
  { 
    id: 'C003', 
    nombre: 'Ana Martínez', 
    email: 'ana.martinez@ejemplo.com', 
    telefono: '555-9012', 
    direccion: 'Calle Secundaria 789, Ciudad',
    fechaRegistro: '2023-03-05',
    ultimaCompra: '2023-04-22',
    tipo: 'regular',
    totalCompras: 5,
    valorCompras: 620.25
  },
  { 
    id: 'C004', 
    nombre: 'Carlos Rodríguez', 
    email: 'carlos.rodriguez@ejemplo.com', 
    telefono: '555-3456', 
    direccion: 'Paseo del Parque 101, Ciudad',
    fechaRegistro: '2023-01-30',
    ultimaCompra: '2023-03-15',
    tipo: 'vip',
    totalCompras: 15,
    valorCompras: 3125.80
  },
  { 
    id: 'C005', 
    nombre: 'Laura Sánchez', 
    email: 'laura.sanchez@ejemplo.com', 
    telefono: '555-7890', 
    direccion: 'Avenida Norte 202, Ciudad',
    fechaRegistro: '2023-02-10',
    ultimaCompra: '2023-04-05',
    tipo: 'regular',
    totalCompras: 7,
    valorCompras: 890.40
  },
  { 
    id: 'C006', 
    nombre: 'Pedro Ramírez', 
    email: 'pedro.ramirez@ejemplo.com', 
    telefono: '555-2345', 
    direccion: 'Calle del Sol 303, Ciudad',
    fechaRegistro: '2023-03-20',
    ultimaCompra: '2023-04-15',
    tipo: 'nuevo',
    totalCompras: 2,
    valorCompras: 180.90
  },
  { 
    id: 'C007', 
    nombre: 'Sofía Torres', 
    email: 'sofia.torres@ejemplo.com', 
    telefono: '555-6789', 
    direccion: 'Avenida Sur 404, Ciudad',
    fechaRegistro: '2023-01-05',
    ultimaCompra: '2023-04-12',
    tipo: 'regular',
    totalCompras: 10,
    valorCompras: 1120.60
  },
  { 
    id: 'C008', 
    nombre: 'Miguel Flores', 
    email: 'miguel.flores@ejemplo.com', 
    telefono: '555-0123', 
    direccion: 'Calle de la Luna 505, Ciudad',
    fechaRegistro: '2023-02-15',
    ultimaCompra: '2023-03-28',
    tipo: 'inactivo',
    totalCompras: 3,
    valorCompras: 350.30
  },
  { 
    id: 'C009', 
    nombre: 'Isabel Vargas', 
    email: 'isabel.vargas@ejemplo.com', 
    telefono: '555-4567', 
    direccion: 'Paseo Central 606, Ciudad',
    fechaRegistro: '2023-03-10',
    ultimaCompra: '2023-04-20',
    tipo: 'vip',
    totalCompras: 9,
    valorCompras: 2780.15
  },
  { 
    id: 'C010', 
    nombre: 'Roberto Silva', 
    email: 'roberto.silva@ejemplo.com', 
    telefono: '555-8901', 
    direccion: 'Avenida Principal 707, Ciudad',
    fechaRegistro: '2023-01-25',
    ultimaCompra: '2023-02-28',
    tipo: 'inactivo',
    totalCompras: 1,
    valorCompras: 120.75
  },
];

// Tipos de cliente
const tiposCliente = [
  { value: 'nuevo', label: 'Nuevo', color: 'bg-blue-100 text-blue-800' },
  { value: 'regular', label: 'Regular', color: 'bg-green-100 text-green-800' },
  { value: 'vip', label: 'VIP', color: 'bg-purple-100 text-purple-800' },
  { value: 'inactivo', label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
];

const ClientesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: 'nuevo'
  });

  // Filtrar clientes por búsqueda y tipo
  const filteredClientes = clientesData.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || cliente.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  // Manejar selección de cliente
  const handleSelectCliente = (clienteId: string) => {
    if (selectedClientes.includes(clienteId)) {
      setSelectedClientes(selectedClientes.filter(id => id !== clienteId));
    } else {
      setSelectedClientes([...selectedClientes, clienteId]);
    }
  };

  // Manejar selección de todos los clientes
  const handleSelectAll = () => {
    if (selectedClientes.length === filteredClientes.length) {
      setSelectedClientes([]);
    } else {
      setSelectedClientes(filteredClientes.map(c => c.id));
    }
  };

  // Obtener color de badge según tipo de cliente
  const getClientTypeColor = (type: string) => {
    const tipoEncontrado = tiposCliente.find(t => t.value === type);
    return tipoEncontrado ? tipoEncontrado.color : 'bg-gray-100 text-gray-800';
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Administra la información de clientes de la tienda</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Complete la información del cliente a continuación. Haga clic en guardar cuando termine.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información Personal</TabsTrigger>
                  <TabsTrigger value="contacto">Contacto y Dirección</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente-id">ID Cliente</Label>
                      <Input 
                        id="cliente-id" 
                        placeholder="Automático" 
                        disabled 
                        value={formData.id}
                        onChange={e => setFormData({...formData, id: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cliente-tipo">Tipo de Cliente</Label>
                      <Select 
                        defaultValue={formData.tipo}
                        onValueChange={value => setFormData({...formData, tipo: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposCliente.map(tipo => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cliente-nombre">Nombre Completo</Label>
                    <Input 
                      id="cliente-nombre" 
                      placeholder="Ej: María González" 
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="contacto" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente-email">Correo Electrónico</Label>
                    <Input 
                      id="cliente-email" 
                      type="email" 
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cliente-telefono">Teléfono</Label>
                    <Input 
                      id="cliente-telefono" 
                      placeholder="555-1234"
                      value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cliente-direccion">Dirección</Label>
                    <Input 
                      id="cliente-direccion" 
                      placeholder="Calle, número, ciudad, código postal"
                      value={formData.direccion}
                      onChange={e => setFormData({...formData, direccion: e.target.value})}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" type="button">Cancelar</Button>
                <Button type="button">Guardar Cliente</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar por nombre, email o ID..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedType(value !== 'todos' ? value : null)} 
            defaultValue="todos"
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              {tiposCliente.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Nombre (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Nombre (Z-A)</DropdownMenuItem>
              <DropdownMenuItem>Registro (más reciente)</DropdownMenuItem>
              <DropdownMenuItem>Registro (más antiguo)</DropdownMenuItem>
              <DropdownMenuItem>Total compras (mayor a menor)</DropdownMenuItem>
              <DropdownMenuItem>Total compras (menor a mayor)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filtros adicionales (colapsable) */}
      {isFilterOpen && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2">Tipo de Cliente</Label>
                <div className="space-y-2">
                  {tiposCliente.map(tipo => (
                    <div key={tipo.value} className="flex items-center space-x-2">
                      <Checkbox id={`tipo-${tipo.value}`} />
                      <label
                        htmlFor={`tipo-${tipo.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tipo.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Última Compra</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="compra-30dias" />
                    <label
                      htmlFor="compra-30dias"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Últimos 30 días
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="compra-90dias" />
                    <label
                      htmlFor="compra-90dias"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Últimos 90 días
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="compra-365dias" />
                    <label
                      htmlFor="compra-365dias"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Último año
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="compra-nunca" />
                    <label
                      htmlFor="compra-nunca"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sin compras
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm">Limpiar</Button>
              <Button size="sm">Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clientes VIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.filter(c => c.tipo === 'vip').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clientes Nuevos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.filter(c => c.tipo === 'nuevo').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clientes Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.filter(c => c.tipo === 'inactivo').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {selectedClientes.length > 0 && (
          <div className="bg-blue-50 p-3 flex items-center justify-between">
            <span className="text-sm text-blue-700">{selectedClientes.length} clientes seleccionados</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Enviar Email
              </Button>
              <Button variant="destructive" size="sm">
                Eliminar Seleccionados
              </Button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <Checkbox 
                    checked={filteredClientes.length > 0 && selectedClientes.length === filteredClientes.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Compra
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Compras
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox 
                      checked={selectedClientes.includes(cliente.id)}
                      onCheckedChange={() => handleSelectCliente(cliente.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Avatar>
                          <AvatarFallback>{getInitials(cliente.nombre)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                        <div className="text-sm text-gray-500">ID: {cliente.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> {cliente.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> {cliente.ultimaCompra}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${cliente.valorCompras.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{cliente.totalCompras} compras</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      className={getClientTypeColor(cliente.tipo)}
                    >
                      {tiposCliente.find(t => t.value === cliente.tipo)?.label || cliente.tipo}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver Detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Ver Historial</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredClientes.length}</span> de{" "}
                <span className="font-medium">{clientesData.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button variant="outline" size="sm" className="rounded-l-md">
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="ml-2 rounded-r-md">
                  Siguiente
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;