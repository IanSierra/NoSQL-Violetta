import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  ArrowRight,
  Box
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Datos de ejemplo para el dashboard
const inventoryStats = [
  {
    title: "Total Productos",
    value: "324",
    icon: <ShoppingBag className="h-8 w-8" />,
    trend: "+5%",
    trendUp: true,
    description: "vs. mes anterior"
  },
  {
    title: "Ventas del Mes",
    value: "$15,250",
    icon: <DollarSign className="h-8 w-8" />,
    trend: "+12%",
    trendUp: true,
    description: "vs. mes anterior"
  },
  {
    title: "Bajo Stock",
    value: "18",
    icon: <AlertTriangle className="h-8 w-8" />,
    trend: "+3",
    trendUp: false,
    description: "necesitan reposición"
  },
  {
    title: "Clientes Activos",
    value: "156",
    icon: <Users className="h-8 w-8" />,
    trend: "+8%",
    trendUp: true,
    description: "vs. mes anterior"
  }
];

// Datos para los gráficos
const salesData = [
  { name: 'Ene', ventas: 4000, rentas: 2400, devoluciones: 400 },
  { name: 'Feb', ventas: 3000, rentas: 1398, devoluciones: 210 },
  { name: 'Mar', ventas: 2000, rentas: 9800, devoluciones: 290 },
  { name: 'Abr', ventas: 2780, rentas: 3908, devoluciones: 200 },
  { name: 'May', ventas: 1890, rentas: 4800, devoluciones: 310 },
  { name: 'Jun', ventas: 2390, rentas: 3800, devoluciones: 250 },
  { name: 'Jul', ventas: 3490, rentas: 4300, devoluciones: 230 },
  { name: 'Ago', ventas: 3490, rentas: 4300, devoluciones: 230 },
  { name: 'Sep', ventas: 3490, rentas: 4300, devoluciones: 230 },
  { name: 'Oct', ventas: 3490, rentas: 4300, devoluciones: 230 },
  { name: 'Nov', ventas: 3490, rentas: 4300, devoluciones: 230 },
  { name: 'Dic', ventas: 3490, rentas: 4300, devoluciones: 230 },
];

const categoryData = [
  { name: 'Vestidos', value: 45 },
  { name: 'Faldas', value: 20 },
  { name: 'Blusas', value: 15 },
  { name: 'Accesorios', value: 12 },
  { name: 'Zapatos', value: 8 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

// Datos para la tabla de productos bajo stock
const lowStockProducts = [
  { id: 'P001', name: 'Vestido Primavera Floral', category: 'Vestidos', stock: 3, reorderPoint: 5 },
  { id: 'P045', name: 'Blusa Manga Larga Encaje', category: 'Blusas', stock: 2, reorderPoint: 5 },
  { id: 'P112', name: 'Falda Corta Plisada', category: 'Faldas', stock: 4, reorderPoint: 8 },
  { id: 'P078', name: 'Collar Perlas Delicado', category: 'Accesorios', stock: 1, reorderPoint: 3 },
  { id: 'P256', name: 'Zapatos Tacón Aguja', category: 'Zapatos', stock: 2, reorderPoint: 4 },
];

// Datos para las ventas recientes
const recentSales = [
  { id: 'T001', customer: 'María González', items: 3, total: '$245.00', date: '2023-04-25' },
  { id: 'T002', customer: 'Juan López', items: 1, total: '$120.00', date: '2023-04-24' },
  { id: 'T003', customer: 'Ana Martínez', items: 2, total: '$180.50', date: '2023-04-24' },
  { id: 'T004', customer: 'Carlos Rodríguez', items: 5, total: '$410.75', date: '2023-04-23' },
  { id: 'T005', customer: 'Laura Sánchez', items: 2, total: '$150.25', date: '2023-04-22' },
];

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month");

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Última actualización: Hoy, 13:30</span>
          <Button variant="outline" size="sm">
            Actualizar
          </Button>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${
                  stat.icon.type === AlertTriangle ? 'bg-red-100 text-red-600' :
                  stat.icon.type === ShoppingBag ? 'bg-violet-100 text-violet-600' :
                  stat.icon.type === DollarSign ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {stat.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.trend}
                </span>
                <span className="text-xs text-gray-500 ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos y Análisis */}
      <Tabs defaultValue="ventas" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={timeRange === "day" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("day")}
            >
              Día
            </Button>
            <Button 
              variant={timeRange === "week" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("week")}
            >
              Semana
            </Button>
            <Button 
              variant={timeRange === "month" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("month")}
            >
              Mes
            </Button>
            <Button 
              variant={timeRange === "year" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("year")}
            >
              Año
            </Button>
          </div>
        </div>

        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas y Rentas</CardTitle>
              <CardDescription>Análisis comparativo de ventas y rentas a lo largo del tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="ventas" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="rentas" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="devoluciones" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos de Mayor Venta</CardTitle>
                <CardDescription>Top 5 productos más vendidos este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Vestido Noche', ventas: 35 },
                        { name: 'Blusa Casual', ventas: 28 },
                        { name: 'Falda Midi', ventas: 22 },
                        { name: 'Vestido Fiesta', ventas: 18 },
                        { name: 'Zapatos Tacón', ventas: 15 }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="ventas" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por categoría de producto</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos con Bajo Stock</CardTitle>
              <CardDescription>Elementos que requieren reposición inmediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punto Reorden</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lowStockProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.reorderPoint}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${product.stock <= product.reorderPoint / 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {product.stock <= product.reorderPoint / 2 ? 'Crítico' : 'Bajo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button size="sm" variant="outline">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>Últimas transacciones realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button size="sm" variant="outline">
                Ver Todas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendario de Eventos</CardTitle>
              <CardDescription>Próximas devoluciones y compromisos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'E1', title: 'Devolución - Ana Martínez', date: '2023-04-28', type: 'return' },
                  { id: 'E2', title: 'Evento de Moda Primavera', date: '2023-04-30', type: 'event' },
                  { id: 'E3', title: 'Devolución - Carlos Rodríguez', date: '2023-05-02', type: 'return' },
                  { id: 'E4', title: 'Nueva Colección - Llegada', date: '2023-05-05', type: 'inventory' },
                ].map(event => (
                  <div key={event.id} className="flex items-center p-3 border rounded-md">
                    <div className={`p-2 rounded-full mr-4 
                      ${event.type === 'return' ? 'bg-yellow-100 text-yellow-600' :
                        event.type === 'event' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'}`}>
                      {event.type === 'return' ? <Box className="h-5 w-5" /> :
                        event.type === 'event' ? <Calendar className="h-5 w-5" /> :
                        <ShoppingBag className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;