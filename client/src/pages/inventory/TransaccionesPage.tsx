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
  Download,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  FileText,
  ShoppingBag,
  DollarSign,
  CreditCard
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Datos de ejemplo para transacciones
const transaccionesData = [
  { 
    id: 'T001', 
    tipo: 'venta',
    cliente: {
      id: 'C001',
      nombre: 'María González',
    },
    fecha: '2023-04-20',
    total: 245.99,
    estado: 'completada',
    metodoPago: 'tarjeta',
    productos: [
      { id: 'P001', nombre: 'Vestido Primavera Floral', cantidad: 1, precio: 49.99, subtotal: 49.99 },
      { id: 'P004', nombre: 'Vestido de Noche Elegante', cantidad: 2, precio: 89.99, subtotal: 179.98 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 19.99, subtotal: 19.99 }
    ],
    notas: ''
  },
  { 
    id: 'T002', 
    tipo: 'venta',
    cliente: {
      id: 'C002',
      nombre: 'Juan López',
    },
    fecha: '2023-04-19',
    total: 119.98,
    estado: 'completada',
    metodoPago: 'efectivo',
    productos: [
      { id: 'P002', nombre: 'Blusa Manga Acampanada', cantidad: 2, precio: 29.99, subtotal: 59.98 },
      { id: 'P010', nombre: 'Falda Corta Vaquera', cantidad: 1, precio: 27.99, subtotal: 27.99 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 2, precio: 15.99, subtotal: 31.98 }
    ],
    notas: 'Cliente solicitó embalaje para regalo'
  },
  { 
    id: 'T003', 
    tipo: 'renta',
    cliente: {
      id: 'C003',
      nombre: 'Ana Martínez',
    },
    fecha: '2023-04-18',
    total: 120.00,
    estado: 'activa',
    metodoPago: 'tarjeta',
    productos: [
      { id: 'P004', nombre: 'Vestido de Noche Elegante', cantidad: 1, precio: 40.00, subtotal: 40.00 },
      { id: 'P006', nombre: 'Zapatos Tacón Stiletto', cantidad: 1, precio: 30.00, subtotal: 30.00 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 20.00, subtotal: 20.00 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 1, precio: 15.00, subtotal: 15.00 },
      { id: 'P001', nombre: 'Vestido Primavera Floral', cantidad: 1, precio: 15.00, subtotal: 15.00 }
    ],
    fechaDevolucion: '2023-04-25',
    notas: 'Evento: Boda'
  },
  { 
    id: 'T004', 
    tipo: 'venta',
    cliente: {
      id: 'C004',
      nombre: 'Carlos Rodríguez',
    },
    fecha: '2023-04-17',
    total: 324.95,
    estado: 'completada',
    metodoPago: 'transferencia',
    productos: [
      { id: 'P003', nombre: 'Falda Midi Plisada', cantidad: 2, precio: 39.99, subtotal: 79.98 },
      { id: 'P004', nombre: 'Vestido de Noche Elegante', cantidad: 2, precio: 89.99, subtotal: 179.98 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 2, precio: 19.99, subtotal: 39.98 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 1, precio: 15.99, subtotal: 15.99 }
    ],
    notas: 'Compra para regalo de aniversario'
  },
  { 
    id: 'T005', 
    tipo: 'renta',
    cliente: {
      id: 'C005',
      nombre: 'Laura Sánchez',
    },
    fecha: '2023-04-15',
    total: 75.00,
    estado: 'completada',
    metodoPago: 'efectivo',
    productos: [
      { id: 'P001', nombre: 'Vestido Primavera Floral', cantidad: 1, precio: 25.00, subtotal: 25.00 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 10.00, subtotal: 10.00 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 1, precio: 10.00, subtotal: 10.00 },
      { id: 'P006', nombre: 'Zapatos Tacón Stiletto', cantidad: 1, precio: 30.00, subtotal: 30.00 }
    ],
    fechaDevolucion: '2023-04-18',
    notas: 'Evento: Reunión de trabajo'
  },
  { 
    id: 'T006', 
    tipo: 'venta',
    cliente: {
      id: 'C006',
      nombre: 'Pedro Ramírez',
    },
    fecha: '2023-04-12',
    total: 124.97,
    estado: 'completada',
    metodoPago: 'tarjeta',
    productos: [
      { id: 'P002', nombre: 'Blusa Manga Acampanada', cantidad: 1, precio: 29.99, subtotal: 29.99 },
      { id: 'P003', nombre: 'Falda Midi Plisada', cantidad: 1, precio: 39.99, subtotal: 39.99 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 19.99, subtotal: 19.99 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 2, precio: 15.99, subtotal: 31.98 }
    ],
    notas: 'Regalo para su esposa'
  },
  { 
    id: 'T007', 
    tipo: 'renta',
    cliente: {
      id: 'C007',
      nombre: 'Sofía Torres',
    },
    fecha: '2023-04-10',
    total: 160.00,
    estado: 'pendiente_devolucion',
    metodoPago: 'tarjeta',
    productos: [
      { id: 'P004', nombre: 'Vestido de Noche Elegante', cantidad: 2, precio: 40.00, subtotal: 80.00 },
      { id: 'P006', nombre: 'Zapatos Tacón Stiletto', cantidad: 2, precio: 30.00, subtotal: 60.00 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 20.00, subtotal: 20.00 }
    ],
    fechaDevolucion: '2023-04-24',
    notas: 'Evento: Fiesta de graduación'
  },
  { 
    id: 'T008', 
    tipo: 'venta',
    cliente: {
      id: 'C008',
      nombre: 'Miguel Flores',
    },
    fecha: '2023-04-05',
    total: 157.95,
    estado: 'completada',
    metodoPago: 'efectivo',
    productos: [
      { id: 'P002', nombre: 'Blusa Manga Acampanada', cantidad: 2, precio: 29.99, subtotal: 59.98 },
      { id: 'P010', nombre: 'Falda Corta Vaquera', cantidad: 1, precio: 27.99, subtotal: 27.99 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 19.99, subtotal: 19.99 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 3, precio: 15.99, subtotal: 47.97 }
    ],
    notas: ''
  },
  { 
    id: 'T009', 
    tipo: 'renta',
    cliente: {
      id: 'C009',
      nombre: 'Isabel Vargas',
    },
    fecha: '2023-04-02',
    total: 95.00,
    estado: 'cancelada',
    metodoPago: 'transferencia',
    productos: [
      { id: 'P001', nombre: 'Vestido Primavera Floral', cantidad: 1, precio: 25.00, subtotal: 25.00 },
      { id: 'P006', nombre: 'Zapatos Tacón Stiletto', cantidad: 1, precio: 30.00, subtotal: 30.00 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 1, precio: 10.00, subtotal: 10.00 },
      { id: 'P005', nombre: 'Collar de Perlas', cantidad: 1, precio: 10.00, subtotal: 10.00 },
      { id: 'P003', nombre: 'Falda Midi Plisada', cantidad: 1, precio: 20.00, subtotal: 20.00 }
    ],
    fechaDevolucion: '2023-04-06',
    notas: 'Cancelada por cliente - reembolso completo'
  },
  { 
    id: 'T010', 
    tipo: 'venta',
    cliente: {
      id: 'C010',
      nombre: 'Roberto Silva',
    },
    fecha: '2023-03-28',
    total: 199.96,
    estado: 'completada',
    metodoPago: 'tarjeta',
    productos: [
      { id: 'P002', nombre: 'Blusa Manga Acampanada', cantidad: 2, precio: 29.99, subtotal: 59.98 },
      { id: 'P003', nombre: 'Falda Midi Plisada', cantidad: 1, precio: 39.99, subtotal: 39.99 },
      { id: 'P006', nombre: 'Zapatos Tacón Stiletto', cantidad: 1, precio: 59.99, subtotal: 59.99 },
      { id: 'P008', nombre: 'Aretes Largos Vintage', cantidad: 2, precio: 15.99, subtotal: 31.98 }
    ],
    notas: ''
  },
];

// Tipos de transacción
const tiposTransaccion = [
  { value: 'venta', label: 'Venta', color: 'bg-green-100 text-green-800' },
  { value: 'renta', label: 'Renta', color: 'bg-blue-100 text-blue-800' },
];

// Estados de transacción
const estadosTransaccion = [
  { value: 'completada', label: 'Completada', color: 'bg-green-100 text-green-800' },
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'activa', label: 'Activa', color: 'bg-blue-100 text-blue-800' },
  { value: 'pendiente_devolucion', label: 'Pendiente Devolución', color: 'bg-purple-100 text-purple-800' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-800' },
];

// Métodos de pago
const metodosPago = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
];

const TransaccionesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaccion, setSelectedTransaccion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'lista' | 'detalle'>('lista');

  // Filtrar transacciones por búsqueda, tipo y estado
  const filteredTransacciones = transaccionesData.filter(transaccion => {
    const matchesSearch = transaccion.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaccion.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || transaccion.tipo === selectedType;
    const matchesStatus = !selectedStatus || transaccion.estado === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Obtener transacción seleccionada
  const transaccionDetalle = selectedTransaccion 
    ? transaccionesData.find(t => t.id === selectedTransaccion) 
    : null;

  // Obtener color de badge según tipo de transacción
  const getTransactionTypeColor = (type: string) => {
    const tipoEncontrado = tiposTransaccion.find(t => t.value === type);
    return tipoEncontrado ? tipoEncontrado.color : 'bg-gray-100 text-gray-800';
  };

  // Obtener color de badge según estado de transacción
  const getTransactionStatusColor = (status: string) => {
    const estadoEncontrado = estadosTransaccion.find(e => e.value === status);
    return estadoEncontrado ? estadoEncontrado.color : 'bg-gray-100 text-gray-800';
  };

  // Obtener label del método de pago
  const getPaymentMethodLabel = (method: string) => {
    const metodoEncontrado = metodosPago.find(m => m.value === method);
    return metodoEncontrado ? metodoEncontrado.label : method;
  };

  // Iniciales para el avatar
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
      {viewMode === 'lista' ? (
        <>
          {/* Encabezado y acciones principales - Vista Lista */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Transacciones</h1>
              <p className="text-gray-500 mt-1">Gestiona ventas, rentas y devoluciones</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Transacción
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Registrar Nueva Transacción</DialogTitle>
                    <DialogDescription>
                      Complete los detalles de la transacción a continuación.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="info" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Información</TabsTrigger>
                      <TabsTrigger value="productos">Productos</TabsTrigger>
                      <TabsTrigger value="pago">Pago</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info" className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transaccion-tipo">Tipo de Transacción</Label>
                          <Select defaultValue="venta">
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {tiposTransaccion.map(tipo => (
                                <SelectItem key={tipo.value} value={tipo.value}>
                                  {tipo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transaccion-fecha">Fecha</Label>
                          <Input id="transaccion-fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transaccion-cliente">Cliente</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {transaccionesData.map(t => t.cliente).filter((cliente, index, self) => 
                              index === self.findIndex(c => c.id === cliente.id)
                            ).map(cliente => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nombre} ({cliente.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transaccion-notas">Notas</Label>
                        <Input id="transaccion-notas" placeholder="Información adicional sobre la transacción" />
                      </div>
                      
                      {/* Campo condicional para fecha de devolución si es una renta */}
                      <div className="space-y-2">
                        <Label htmlFor="transaccion-devolucion">Fecha de Devolución (Sólo para Rentas)</Label>
                        <Input id="transaccion-devolucion" type="date" />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="productos" className="space-y-4 py-4">
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Producto</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Subtotal</TableHead>
                              <TableHead className="w-10"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                Seleccione productos para añadir a la transacción
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Añadir Producto
                        </Button>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total</div>
                          <div className="text-xl font-bold">$0.00</div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pago" className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transaccion-metodo">Método de Pago</Label>
                          <Select defaultValue="efectivo">
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                            <SelectContent>
                              {metodosPago.map(metodo => (
                                <SelectItem key={metodo.value} value={metodo.value}>
                                  {metodo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transaccion-estado">Estado</Label>
                          <Select defaultValue="completada">
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {estadosTransaccion.map(estado => (
                                <SelectItem key={estado.value} value={estado.value}>
                                  {estado.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transaccion-referencia">Referencia de Pago</Label>
                        <Input id="transaccion-referencia" placeholder="Número de referencia o detalles de pago" />
                      </div>
                      
                      <div className="border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">IVA (16%):</span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>$0.00</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button">Cancelar</Button>
                    <Button type="button">Registrar Transacción</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Resumen de Transacciones */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transaccionesData.length}</div>
                <div className="text-xs text-gray-500 mt-1">Últimos 30 días</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transaccionesData
                    .filter(t => t.tipo === 'venta' && t.estado !== 'cancelada')
                    .reduce((sum, t) => sum + t.total, 0)
                    .toFixed(2)
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {transaccionesData.filter(t => t.tipo === 'venta' && t.estado !== 'cancelada').length} transacciones
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Rentas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transaccionesData
                    .filter(t => t.tipo === 'renta' && t.estado !== 'cancelada')
                    .reduce((sum, t) => sum + t.total, 0)
                    .toFixed(2)
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {transaccionesData.filter(t => t.tipo === 'renta' && t.estado !== 'cancelada').length} transacciones
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transaccionesData.filter(t => t.estado === 'pendiente_devolucion' || t.estado === 'activa' || t.estado === 'pendiente').length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Requieren seguimiento</div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Buscar por ID o cliente..." 
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
                  {tiposTransaccion.map(tipo => (
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
                  <DropdownMenuItem>Fecha (más reciente)</DropdownMenuItem>
                  <DropdownMenuItem>Fecha (más antigua)</DropdownMenuItem>
                  <DropdownMenuItem>Total (mayor a menor)</DropdownMenuItem>
                  <DropdownMenuItem>Total (menor a mayor)</DropdownMenuItem>
                  <DropdownMenuItem>ID (ascendente)</DropdownMenuItem>
                  <DropdownMenuItem>ID (descendente)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filtros adicionales (colapsable) */}
          {isFilterOpen && (
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="block mb-2">Estado</Label>
                    <div className="space-y-2">
                      {estadosTransaccion.map(estado => (
                        <div key={estado.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`estado-${estado.value}`}
                            checked={selectedStatus === estado.value}
                            onCheckedChange={(checked) => {
                              setSelectedStatus(checked ? estado.value : null);
                            }}
                          />
                          <label
                            htmlFor={`estado-${estado.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {estado.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Método de Pago</Label>
                    <div className="space-y-2">
                      {metodosPago.map(metodo => (
                        <div key={metodo.value} className="flex items-center space-x-2">
                          <Checkbox id={`metodo-${metodo.value}`} />
                          <label
                            htmlFor={`metodo-${metodo.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {metodo.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Rango de Fechas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="fecha-desde" className="text-xs">Desde</Label>
                        <Input type="date" id="fecha-desde" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fecha-hasta" className="text-xs">Hasta</Label>
                        <Input type="date" id="fecha-hasta" />
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

          {/* Lista de Transacciones */}
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransacciones.map((transaccion) => (
                    <tr key={transaccion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaccion.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaccion.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(transaccion.cliente.nombre)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-4 text-sm font-medium text-gray-900">
                            {transaccion.cliente.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTransactionTypeColor(transaccion.tipo)}>
                          {tiposTransaccion.find(t => t.value === transaccion.tipo)?.label || transaccion.tipo}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaccion.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTransactionStatusColor(transaccion.estado)}>
                          {estadosTransaccion.find(e => e.value === transaccion.estado)?.label || transaccion.estado}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedTransaccion(transaccion.id);
                            setViewMode('detalle');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> 
                          Ver
                        </Button>
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
                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredTransacciones.length}</span> de{" "}
                    <span className="font-medium">{transaccionesData.length}</span> resultados
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
        </>
      ) : (
        /* Vista de Detalle de Transacción */
        transaccionDetalle && (
          <>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setViewMode('lista');
                  setSelectedTransaccion(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la lista
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">Transacción {transaccionDetalle.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información de la Transacción */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Detalles de la Transacción</CardTitle>
                        <CardDescription>Información general de la transacción</CardDescription>
                      </div>
                      <Badge className={getTransactionTypeColor(transaccionDetalle.tipo)}>
                        {tiposTransaccion.find(t => t.value === transaccionDetalle.tipo)?.label || transaccionDetalle.tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium">{transaccionDetalle.fecha}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <Badge className={getTransactionStatusColor(transaccionDetalle.estado)}>
                          {estadosTransaccion.find(e => e.value === transaccionDetalle.estado)?.label || transaccionDetalle.estado}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-medium">{transaccionDetalle.cliente.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Método de Pago</p>
                        <p className="font-medium">{getPaymentMethodLabel(transaccionDetalle.metodoPago)}</p>
                      </div>
                    </div>
                    {transaccionDetalle.tipo === 'renta' && (
                      <div>
                        <p className="text-sm text-gray-500">Fecha de Devolución</p>
                        <p className="font-medium">{(transaccionDetalle as any).fechaDevolucion || 'No especificada'}</p>
                      </div>
                    )}
                    {transaccionDetalle.notas && (
                      <div>
                        <p className="text-sm text-gray-500">Notas</p>
                        <p className="text-sm italic text-gray-700">{transaccionDetalle.notas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos</CardTitle>
                    <CardDescription>Productos incluidos en esta transacción</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-center">Cantidad</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transaccionDetalle.productos.map((producto) => (
                            <TableRow key={producto.id}>
                              <TableCell className="font-medium">{producto.id}</TableCell>
                              <TableCell>{producto.nombre}</TableCell>
                              <TableCell className="text-center">{producto.cantidad}</TableCell>
                              <TableCell className="text-right">${producto.precio.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${producto.subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-right">
                      <div className="flex justify-end text-sm">
                        <span className="text-gray-500 mr-8">Subtotal:</span>
                        <span className="font-medium">${transaccionDetalle.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-end text-sm">
                        <span className="text-gray-500 mr-8">IVA (incluido):</span>
                        <span className="font-medium">${(transaccionDetalle.total * 0.16).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-end text-lg">
                        <span className="font-bold mr-8">Total:</span>
                        <span className="font-bold">${transaccionDetalle.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Acciones y resumen */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Generar Factura
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Transacción
                    </Button>
                    {transaccionDetalle.tipo === 'renta' && transaccionDetalle.estado === 'activa' && (
                      <Button variant="secondary" className="w-full">
                        <Check className="mr-2 h-4 w-4" />
                        Registrar Devolución
                      </Button>
                    )}
                    {['pendiente', 'activa'].includes(transaccionDetalle.estado) && (
                      <Button variant="destructive" className="w-full">
                        <X className="mr-2 h-4 w-4" />
                        Cancelar Transacción
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center py-2 border-b">
                      <ShoppingBag className="h-5 w-5 mr-2 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Total Productos</p>
                      </div>
                      <p className="font-medium">{transaccionDetalle.productos.reduce((sum, p) => sum + p.cantidad, 0)}</p>
                    </div>
                    <div className="flex items-center py-2 border-b">
                      <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Valor Total</p>
                      </div>
                      <p className="font-medium">${transaccionDetalle.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center py-2 border-b">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Método de Pago</p>
                      </div>
                      <p className="font-medium">{getPaymentMethodLabel(transaccionDetalle.metodoPago)}</p>
                    </div>
                    {transaccionDetalle.tipo === 'renta' && (
                      <div className="flex items-center py-2 border-b">
                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Fecha Devolución</p>
                        </div>
                        <p className="font-medium">{(transaccionDetalle as any).fechaDevolucion || '-'}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{getInitials(transaccionDetalle.cliente.nombre)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-medium">{transaccionDetalle.cliente.nombre}</p>
                        <p className="text-sm text-gray-500">ID: {transaccionDetalle.cliente.id}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Ver Historial del Cliente
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default TransaccionesPage;