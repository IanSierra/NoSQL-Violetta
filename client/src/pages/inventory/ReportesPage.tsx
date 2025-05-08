import React, { useState } from 'react';
import { 
  BarChart3,
  PieChart,
  LineChart,
  Download,
  FileText,
  Printer,
  Filter,
  Calendar,
  Share2,
  Star,
  TrendingUp,
  CircleDollarSign,
  ShoppingBag,
  Users,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Datos de ejemplo para los reportes
const ventasMensuales = [
  { name: 'Ene', ventas: 4000, rentas: 2400 },
  { name: 'Feb', ventas: 3000, rentas: 1398 },
  { name: 'Mar', ventas: 2000, rentas: 9800 },
  { name: 'Abr', ventas: 2780, rentas: 3908 },
  { name: 'May', ventas: 1890, rentas: 4800 },
  { name: 'Jun', ventas: 2390, rentas: 3800 },
  { name: 'Jul', ventas: 3490, rentas: 4300 },
];

const ventasPorCategoria = [
  { name: 'Vestidos', value: 45 },
  { name: 'Faldas', value: 20 },
  { name: 'Blusas', value: 15 },
  { name: 'Accesorios', value: 12 },
  { name: 'Zapatos', value: 8 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

const productosTop = [
  { id: 'P004', nombre: 'Vestido de Noche Elegante', categoria: 'Vestidos', ventas: 28, ingresos: 2519.72 },
  { id: 'P001', nombre: 'Vestido Primavera Floral', categoria: 'Vestidos', ventas: 22, ingresos: 1099.78 },
  { id: 'P002', nombre: 'Blusa Manga Acampanada', categoria: 'Blusas', ventas: 20, ingresos: 599.80 },
  { id: 'P005', nombre: 'Collar de Perlas', categoria: 'Accesorios', ventas: 18, ingresos: 359.82 },
  { id: 'P003', nombre: 'Falda Midi Plisada', categoria: 'Faldas', ventas: 15, ingresos: 599.85 },
];

const clientesTop = [
  { id: 'C004', nombre: 'Carlos Rodríguez', transacciones: 8, totalGasto: 1520.75, ultimaCompra: '2023-04-20' },
  { id: 'C001', nombre: 'María González', transacciones: 7, totalGasto: 1280.40, ultimaCompra: '2023-04-18' },
  { id: 'C009', nombre: 'Isabel Vargas', transacciones: 6, totalGasto: 980.25, ultimaCompra: '2023-04-15' },
  { id: 'C002', nombre: 'Juan López', transacciones: 5, totalGasto: 860.90, ultimaCompra: '2023-04-10' },
  { id: 'C007', nombre: 'Sofía Torres', transacciones: 4, totalGasto: 720.60, ultimaCompra: '2023-04-05' },
];

const inventarioStock = [
  { categoria: 'Vestidos', enStock: 45, bajoStock: 5, agotados: 2 },
  { categoria: 'Blusas', enStock: 38, bajoStock: 3, agotados: 1 },
  { categoria: 'Faldas', enStock: 30, bajoStock: 2, agotados: 0 },
  { categoria: 'Accesorios', enStock: 62, bajoStock: 0, agotados: 0 },
  { categoria: 'Zapatos', enStock: 28, bajoStock: 4, agotados: 3 },
];

const datosComparativoMensual = [
  { name: 'Ene', actual: 4200, anterior: 3800 },
  { name: 'Feb', actual: 3500, anterior: 3200 },
  { name: 'Mar', actual: 5200, anterior: 4500 },
  { name: 'Abr', actual: 4800, anterior: 4100 },
  { name: 'May', actual: 5800, anterior: 5000 },
  { name: 'Jun', actual: 6000, anterior: 5200 },
  { name: 'Jul', actual: 6500, anterior: 5800 },
];

const ReportesPage: React.FC = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
  const [reporteSeleccionado, setReporteSeleccionado] = useState('ventas');

  // Formateador de moneda
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Datos para cálculos
  const totalVentasMes = ventasMensuales.reduce((sum, item) => sum + item.ventas, 0);
  const totalRentasMes = ventasMensuales.reduce((sum, item) => sum + item.rentas, 0);
  const totalTransacciones = totalVentasMes + totalRentasMes;
  
  // Cambio porcentual (ejemplo)
  const cambioVentas = 12.5; // Porcentaje de cambio en ventas respecto al periodo anterior
  const cambioRentas = 8.2; // Porcentaje de cambio en rentas respecto al periodo anterior

  return (
    <div className="space-y-6 p-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
          <p className="text-gray-500 mt-1">Visualiza el rendimiento del negocio con datos analíticos</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Filtros de periodo */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant={periodoSeleccionado === 'dia' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodoSeleccionado('dia')}
          >
            Día
          </Button>
          <Button 
            variant={periodoSeleccionado === 'semana' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodoSeleccionado('semana')}
          >
            Semana
          </Button>
          <Button 
            variant={periodoSeleccionado === 'mes' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriodoSeleccionado('mes')}
          >
            Mes
          </Button>
          <Button 
            variant={periodoSeleccionado === 'trimestre' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriodoSeleccionado('trimestre')}
          >
            Trimestre
          </Button>
          <Button 
            variant={periodoSeleccionado === 'año' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriodoSeleccionado('año')}
          >
            Año
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Periodo Personalizado
          </Button>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVentasMes)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${cambioVentas >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {cambioVentas >= 0 ? '+' : ''}{cambioVentas}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Rentas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRentasMes)}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${cambioRentas >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {cambioRentas >= 0 ? '+' : ''}{cambioRentas}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransacciones}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10.5%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ticket Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency((totalVentasMes + totalRentasMes) / totalTransacciones)}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selección de tipo de reporte */}
      <Tabs 
        defaultValue="ventas" 
        className="space-y-4"
        value={reporteSeleccionado}
        onValueChange={setReporteSeleccionado}
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="ventas">
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Ventas
          </TabsTrigger>
          <TabsTrigger value="productos">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="clientes">
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="inventario">
            <BarChart3 className="h-4 w-4 mr-2" />
            Inventario
          </TabsTrigger>
        </TabsList>
        
        {/* Reporte de Ventas */}
        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas y Rentas</CardTitle>
              <CardDescription>Comparativa de ingresos por ventas y rentas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={ventasMensuales}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Ventas" />
                    <Line type="monotone" dataKey="rentas" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Rentas" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>Porcentaje de ventas por tipo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={ventasPorCategoria}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {ventasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => `${value}%`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparativo Mensual</CardTitle>
                <CardDescription>Rendimiento actual vs. año anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={datosComparativoMensual}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="actual" fill="#8b5cf6" name="2023" />
                      <Bar dataKey="anterior" fill="#c4b5fd" name="2022" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reporte de Productos */}
        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Top 5 productos con mayor número de ventas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={productosTop}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="nombre" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8b5cf6" name="Unidades Vendidas" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Productos Top</CardTitle>
              <CardDescription>Análisis detallado de productos con mayor rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Unidades</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosTop.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell className="font-medium">{producto.id}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell className="text-right">{producto.ventas}</TableCell>
                      <TableCell className="text-right">{formatCurrency(producto.ingresos)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reporte de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes con Mayor Consumo</CardTitle>
              <CardDescription>Top 5 clientes por volumen de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={clientesTop}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => name === 'totalGasto' ? formatCurrency(value as number) : value} />
                    <Legend />
                    <Bar dataKey="totalGasto" fill="#8b5cf6" name="Gasto Total" />
                    <Bar dataKey="transacciones" fill="#c4b5fd" name="Número de Transacciones" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Mejores Clientes</CardTitle>
              <CardDescription>Información detallada sobre los clientes con mayor valor</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Transacciones</TableHead>
                    <TableHead className="text-right">Gasto Total</TableHead>
                    <TableHead>Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesTop.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.id}</TableCell>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell className="text-right">{cliente.transacciones}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cliente.totalGasto)}</TableCell>
                      <TableCell>{cliente.ultimaCompra}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Segmentación de Clientes</CardTitle>
              <CardDescription>Distribución de clientes por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'VIP', value: 15 },
                        { name: 'Regular', value: 45 },
                        { name: 'Ocasional', value: 30 },
                        { name: 'Nuevo', value: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#a78bfa" />
                      <Cell fill="#c4b5fd" />
                      <Cell fill="#ddd6fe" />
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reporte de Inventario */}
        <TabsContent value="inventario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Inventario</CardTitle>
              <CardDescription>Distribución de productos por estado y categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={inventarioStock}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enStock" stackId="a" fill="#8b5cf6" name="En Stock" />
                    <Bar dataKey="bajoStock" stackId="a" fill="#fcd34d" name="Bajo Stock" />
                    <Bar dataKey="agotados" stackId="a" fill="#f87171" name="Agotados" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inventarioStock.reduce((sum, item) => sum + item.enStock + item.bajoStock + item.agotados, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Productos en catálogo</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Bajo Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {inventarioStock.reduce((sum, item) => sum + item.bajoStock, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Requieren reposición</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Agotados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {inventarioStock.reduce((sum, item) => sum + item.agotados, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Productos sin stock</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Inventario por Categoría</CardTitle>
              <CardDescription>Estado actual del stock por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">En Stock</TableHead>
                    <TableHead className="text-right">Bajo Stock</TableHead>
                    <TableHead className="text-right">Agotados</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventarioStock.map((categoria) => (
                    <TableRow key={categoria.categoria}>
                      <TableCell className="font-medium">{categoria.categoria}</TableCell>
                      <TableCell className="text-right">{categoria.enStock}</TableCell>
                      <TableCell className="text-right text-yellow-600">{categoria.bajoStock}</TableCell>
                      <TableCell className="text-right text-red-600">{categoria.agotados}</TableCell>
                      <TableCell className="text-right">{categoria.enStock + categoria.bajoStock + categoria.agotados}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportesPage;