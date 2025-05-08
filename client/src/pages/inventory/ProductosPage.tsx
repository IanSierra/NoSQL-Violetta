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
  FileText,
  Download,
  Upload
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

// Datos de ejemplo para productos
const productosData = [
  { 
    id: 'P001', 
    nombre: 'Vestido Primavera Floral', 
    categoria: 'Vestidos', 
    precio: 49.99, 
    stock: 15, 
    talla: ['S', 'M', 'L'], 
    color: ['Azul', 'Rosa'], 
    imagen: 'vestido-floral.jpg',
    estado: 'activo'
  },
  { 
    id: 'P002', 
    nombre: 'Blusa Manga Acampanada', 
    categoria: 'Blusas', 
    precio: 29.99, 
    stock: 8, 
    talla: ['XS', 'S', 'M', 'L'], 
    color: ['Blanco', 'Negro'], 
    imagen: 'blusa-manga.jpg',
    estado: 'activo'
  },
  { 
    id: 'P003', 
    nombre: 'Falda Midi Plisada', 
    categoria: 'Faldas', 
    precio: 39.99, 
    stock: 12, 
    talla: ['S', 'M', 'L'], 
    color: ['Negro', 'Beige', 'Azul Marino'], 
    imagen: 'falda-plisada.jpg',
    estado: 'activo'
  },
  { 
    id: 'P004', 
    nombre: 'Vestido de Noche Elegante', 
    categoria: 'Vestidos', 
    precio: 89.99, 
    stock: 5, 
    talla: ['S', 'M', 'L'], 
    color: ['Negro', 'Rojo'], 
    imagen: 'vestido-noche.jpg',
    estado: 'activo'
  },
  { 
    id: 'P005', 
    nombre: 'Collar de Perlas', 
    categoria: 'Accesorios', 
    precio: 19.99, 
    stock: 20, 
    talla: ['Única'], 
    color: ['Blanco'], 
    imagen: 'collar-perlas.jpg',
    estado: 'activo'
  },
  { 
    id: 'P006', 
    nombre: 'Zapatos Tacón Stiletto', 
    categoria: 'Zapatos', 
    precio: 59.99, 
    stock: 8, 
    talla: ['36', '37', '38', '39'], 
    color: ['Negro', 'Nude'], 
    imagen: 'zapatos-tacon.jpg',
    estado: 'activo'
  },
  { 
    id: 'P007', 
    nombre: 'Vestido Casual Verano', 
    categoria: 'Vestidos', 
    precio: 35.99, 
    stock: 0, 
    talla: ['S', 'M', 'L'], 
    color: ['Amarillo', 'Verde'], 
    imagen: 'vestido-verano.jpg',
    estado: 'agotado'
  },
  { 
    id: 'P008', 
    nombre: 'Aretes Largos Vintage', 
    categoria: 'Accesorios', 
    precio: 15.99, 
    stock: 14, 
    talla: ['Única'], 
    color: ['Dorado', 'Plateado'], 
    imagen: 'aretes-vintage.jpg',
    estado: 'activo'
  },
  { 
    id: 'P009', 
    nombre: 'Blusa Hombros Descubiertos', 
    categoria: 'Blusas', 
    precio: 32.99, 
    stock: 0, 
    talla: ['S', 'M'], 
    color: ['Blanco', 'Azul Claro'], 
    imagen: 'blusa-hombros.jpg',
    estado: 'descontinuado'
  },
  { 
    id: 'P010', 
    nombre: 'Falda Corta Vaquera', 
    categoria: 'Faldas', 
    precio: 27.99, 
    stock: 9, 
    talla: ['S', 'M', 'L'], 
    color: ['Azul'], 
    imagen: 'falda-vaquera.jpg',
    estado: 'activo'
  },
];

// Categorías disponibles
const categorias = [
  'Vestidos',
  'Blusas',
  'Faldas',
  'Zapatos',
  'Accesorios',
  'Conjuntos'
];

// Estados de producto
const estados = [
  { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'agotado', label: 'Agotado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'descontinuado', label: 'Descontinuado', color: 'bg-red-100 text-red-800' },
];

const ProductosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'tabla' | 'tarjetas'>('tabla');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    talla: [] as string[],
    color: [] as string[],
    estado: 'activo'
  });

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = productosData.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          producto.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Manejar selección de producto
  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Manejar selección de todos los productos
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Obtener color de badge según estado
  const getStatusColor = (status: string) => {
    const estadoEncontrado = estados.find(e => e.value === status);
    return estadoEncontrado ? estadoEncontrado.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-gray-500 mt-1">Administra el inventario de productos de la tienda</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Complete los detalles del producto a continuación. Haga clic en guardar cuando termine.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="variantes">Variantes</TabsTrigger>
                  <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="producto-id">ID Producto</Label>
                      <Input 
                        id="producto-id" 
                        placeholder="Automático" 
                        disabled 
                        value={formData.id}
                        onChange={e => setFormData({...formData, id: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="producto-estado">Estado</Label>
                      <Select 
                        defaultValue={formData.estado}
                        onValueChange={value => setFormData({...formData, estado: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map(estado => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="producto-nombre">Nombre del Producto</Label>
                    <Input 
                      id="producto-nombre" 
                      placeholder="Ej: Vestido Floral Primavera" 
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="producto-categoria">Categoría</Label>
                      <Select 
                        defaultValue={formData.categoria}
                        onValueChange={value => setFormData({...formData, categoria: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map(categoria => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="producto-stock">Stock Disponible</Label>
                      <Input 
                        id="producto-stock" 
                        type="number" 
                        placeholder="0"
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="producto-precio">Precio (USD)</Label>
                    <Input 
                      id="producto-precio" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      value={formData.precio}
                      onChange={e => setFormData({...formData, precio: e.target.value})}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="variantes" className="space-y-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">Tallas Disponibles</Label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map(talla => (
                          <div key={talla} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`talla-${talla}`} 
                              checked={formData.talla.includes(talla)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({...formData, talla: [...formData.talla, talla]});
                                } else {
                                  setFormData({...formData, talla: formData.talla.filter(t => t !== talla)});
                                }
                              }}
                            />
                            <label
                              htmlFor={`talla-${talla}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {talla}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="block mb-2">Colores Disponibles</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Blanco', 'Negro', 'Rojo', 'Azul', 'Rosa', 'Verde', 'Amarillo', 'Beige'].map(color => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`color-${color}`} 
                              checked={formData.color.includes(color)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({...formData, color: [...formData.color, color]});
                                } else {
                                  setFormData({...formData, color: formData.color.filter(c => c !== color)});
                                }
                              }}
                            />
                            <label
                              htmlFor={`color-${color}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {color}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="imagenes" className="space-y-4 py-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button variant="secondary">Subir Imágenes</Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">PNG, JPG hasta 5MB</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" type="button">Cancelar</Button>
                <Button type="button">Guardar Producto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          
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
            placeholder="Buscar por nombre o ID..." 
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedCategory(value !== 'todos' ? value : null)} 
            defaultValue="todos"
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
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
              <DropdownMenuItem>Precio (menor a mayor)</DropdownMenuItem>
              <DropdownMenuItem>Precio (mayor a menor)</DropdownMenuItem>
              <DropdownMenuItem>Stock (menor a mayor)</DropdownMenuItem>
              <DropdownMenuItem>Stock (mayor a menor)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Vista</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewType('tabla')}>
                Tabla
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType('tarjetas')}>
                Tarjetas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filtros adicionales (colapsable) */}
      {isFilterOpen && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block mb-2">Estado</Label>
                <div className="space-y-2">
                  {estados.map(estado => (
                    <div key={estado.value} className="flex items-center space-x-2">
                      <Checkbox id={`estado-${estado.value}`} />
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
                <Label className="block mb-2">Talla</Label>
                <div className="space-y-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(talla => (
                    <div key={talla} className="flex items-center space-x-2">
                      <Checkbox id={`filtro-talla-${talla}`} />
                      <label
                        htmlFor={`filtro-talla-${talla}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {talla}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Color</Label>
                <div className="space-y-2">
                  {['Blanco', 'Negro', 'Rojo', 'Azul', 'Rosa'].map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox id={`filtro-color-${color}`} />
                      <label
                        htmlFor={`filtro-color-${color}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Rango de Precio</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Min" />
                  <Input type="number" placeholder="Max" />
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

      {/* Contenido principal - Vista de tabla */}
      {viewType === 'tabla' && (
        <div className="bg-white rounded-md shadow overflow-hidden">
          {selectedProducts.length > 0 && (
            <div className="bg-blue-50 p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">{selectedProducts.length} productos seleccionados</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Editar Seleccionados
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
                      checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox 
                        checked={selectedProducts.includes(producto.id)}
                        onCheckedChange={() => handleSelectProduct(producto.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${producto.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {producto.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={getStatusColor(producto.estado)}
                      >
                        {estados.find(e => e.value === producto.estado)?.label || producto.estado}
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
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredProducts.length}</span> de{" "}
                  <span className="font-medium">{productosData.length}</span> resultados
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
      )}

      {/* Contenido principal - Vista de tarjetas */}
      {viewType === 'tarjetas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((producto) => (
            <Card key={producto.id} className="overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(producto.estado)}>
                    {estados.find(e => e.value === producto.estado)?.label || producto.estado}
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-4xl">👗</span>
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{producto.nombre}</CardTitle>
                <CardDescription className="text-xs">{producto.categoria}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">${producto.precio.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Stock: {producto.stock}</div>
                  </div>
                  <div className="space-x-1">
                    {producto.talla.slice(0, 3).map(t => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                    {producto.talla.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{producto.talla.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosPage;