import React, { useState } from 'react';
import { 
  Save, 
  User, 
  Settings, 
  Database, 
  Lock, 
  Globe, 
  Bell, 
  Layers, 
  Tag, 
  Store, 
  Upload, 
  Check,
  X,
  Trash2,
  Plus,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Datos de ejemplo para la configuración
const usuariosData = [
  { 
    id: 'U001', 
    nombre: 'Admin Principal', 
    email: 'admin@violetta.com', 
    rol: 'admin', 
    estado: 'activo', 
    ultimoAcceso: '2023-04-23 10:15' 
  },
  { 
    id: 'U002', 
    nombre: 'María Vendedora', 
    email: 'maria@violetta.com', 
    rol: 'vendedor', 
    estado: 'activo', 
    ultimoAcceso: '2023-04-22 16:30' 
  },
  { 
    id: 'U003', 
    nombre: 'Juan Inventario', 
    email: 'juan@violetta.com', 
    rol: 'inventario', 
    estado: 'activo', 
    ultimoAcceso: '2023-04-20 09:45' 
  },
  { 
    id: 'U004', 
    nombre: 'Ana Gerente', 
    email: 'ana@violetta.com', 
    rol: 'gerente', 
    estado: 'inactivo', 
    ultimoAcceso: '2023-03-15 14:20' 
  },
];

const categoriasData = [
  { id: 'C001', nombre: 'Vestidos', productos: 45, estado: 'activo' },
  { id: 'C002', nombre: 'Blusas', productos: 38, estado: 'activo' },
  { id: 'C003', nombre: 'Faldas', productos: 30, estado: 'activo' },
  { id: 'C004', nombre: 'Accesorios', productos: 62, estado: 'activo' },
  { id: 'C005', nombre: 'Zapatos', productos: 28, estado: 'activo' },
];

const rolesUsuario = [
  { value: 'admin', label: 'Administrador', permisos: 'Control total del sistema' },
  { value: 'gerente', label: 'Gerente', permisos: 'Reportes, transacciones, inventario' },
  { value: 'vendedor', label: 'Vendedor', permisos: 'Transacciones, clientes' },
  { value: 'inventario', label: 'Inventario', permisos: 'Gestión de productos e inventario' },
];

// Estado inicial para formularios
const initialTiendaConfig = {
  nombre: 'Violetta Boutique',
  direccion: 'Calle Principal 123, Ciudad',
  telefono: '555-1234',
  email: 'contacto@violetta.com',
  sitioWeb: 'www.violetta.com',
  moneda: 'USD',
  impuesto: '16',
  logo: '',
  idiomaPrincipal: 'es',
  zonaHoraria: 'America/Mexico_City',
};

const initialNotificacionesConfig = {
  emailNuevaVenta: true,
  emailInventarioBajo: true,
  emailDevolucionPendiente: true,
  pushNuevaVenta: false,
  pushInventarioBajo: true,
  pushDevolucionPendiente: false,
  recordatoriosDiarios: true,
  resumenSemanal: true
};

const ConfiguracionPage: React.FC = () => {
  const [tiendaConfig, setTiendaConfig] = useState(initialTiendaConfig);
  const [notificacionesConfig, setNotificacionesConfig] = useState(initialNotificacionesConfig);
  const [categoriaNombre, setCategoriaNombre] = useState('');
  const [categorias, setCategorias] = useState(categoriasData);
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'vendedor',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [backupEmails, setBackupEmails] = useState('admin@violetta.com');
  const [backupFrecuencia, setBackupFrecuencia] = useState('diario');
  
  // Función para manejar cambios en formulario de tienda
  const handleTiendaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTiendaConfig({
      ...tiendaConfig,
      [name]: value
    });
  };

  // Función para manejar cambios en notificaciones (switches)
  const handleNotificacionChange = (key: string, checked: boolean) => {
    setNotificacionesConfig({
      ...notificacionesConfig,
      [key]: checked
    });
  };

  // Función para agregar categoría
  const handleAddCategoria = () => {
    if (categoriaNombre.trim()) {
      const newId = `C${(categorias.length + 1).toString().padStart(3, '0')}`;
      setCategorias([
        ...categorias,
        {
          id: newId,
          nombre: categoriaNombre,
          productos: 0,
          estado: 'activo'
        }
      ]);
      setCategoriaNombre('');
    }
  };

  // Función para eliminar categoría
  const handleDeleteCategoria = (id: string) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
  };

  // Función para manejar cambios en nuevo usuario
  const handleNuevoUsuarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario({
      ...nuevoUsuario,
      [name]: value
    });
  };

  // Función para agregar usuario
  const handleAddUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.email && nuevoUsuario.contrasena === nuevoUsuario.confirmarContrasena) {
      const newId = `U${(usuarios.length + 1).toString().padStart(3, '0')}`;
      setUsuarios([
        ...usuarios,
        {
          id: newId,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
          estado: 'activo',
          ultimoAcceso: 'Nunca'
        }
      ]);
      // Reiniciar formulario
      setNuevoUsuario({
        nombre: '',
        email: '',
        rol: 'vendedor',
        contrasena: '',
        confirmarContrasena: ''
      });
    }
  };
  
  // Función para cambiar estado de usuario
  const handleToggleUsuarioEstado = (id: string) => {
    setUsuarios(usuarios.map(user => {
      if (user.id === id) {
        return {
          ...user,
          estado: user.estado === 'activo' ? 'inactivo' : 'activo'
        };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra los ajustes y preferencias del sistema</p>
      </div>

      {/* Tabs de configuración */}
      <Tabs defaultValue="tienda" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="tienda">
            <Store className="h-4 w-4 mr-2" />
            Tienda
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <Tag className="h-4 w-4 mr-2" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="usuarios">
            <User className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Settings className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="avanzado">
            <Database className="h-4 w-4 mr-2" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Configuración de la Tienda */}
        <TabsContent value="tienda">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
              <CardDescription>Actualiza los datos generales de la tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Tienda</Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      value={tiendaConfig.nombre} 
                      onChange={handleTiendaChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de Contacto</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={tiendaConfig.email} 
                      onChange={handleTiendaChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    name="direccion" 
                    value={tiendaConfig.direccion} 
                    onChange={handleTiendaChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      name="telefono" 
                      value={tiendaConfig.telefono} 
                      onChange={handleTiendaChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input 
                      id="sitioWeb" 
                      name="sitioWeb" 
                      value={tiendaConfig.sitioWeb} 
                      onChange={handleTiendaChange}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración Regional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="moneda">Moneda</Label>
                    <Select 
                      value={tiendaConfig.moneda}
                      onValueChange={(value) => setTiendaConfig({...tiendaConfig, moneda: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                        <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                        <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="impuesto">Impuesto (%)</Label>
                    <Input 
                      id="impuesto" 
                      name="impuesto" 
                      value={tiendaConfig.impuesto} 
                      onChange={handleTiendaChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idiomaPrincipal">Idioma Principal</Label>
                    <Select 
                      value={tiendaConfig.idiomaPrincipal}
                      onValueChange={(value) => setTiendaConfig({...tiendaConfig, idiomaPrincipal: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logo de la Tienda</h3>
                
                <div className="flex items-center space-x-4">
                  <div className="h-32 w-32 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
                    {tiendaConfig.logo ? (
                      <img 
                        src={tiendaConfig.logo} 
                        alt="Logo de la tienda" 
                        className="max-h-full max-w-full"
                      />
                    ) : (
                      <Store className="h-16 w-16 text-gray-300" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Logo
                    </Button>
                    <p className="text-xs text-gray-500">
                      Formatos permitidos: JPG, PNG. Tamaño máximo: 2MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuración de Categorías */}
        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Categorías de Productos</CardTitle>
              <CardDescription>Administra las categorías disponibles para clasificar productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Nueva categoría..." 
                  value={categoriaNombre}
                  onChange={(e) => setCategoriaNombre(e.target.value)}
                />
                <Button onClick={handleAddCategoria}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-right">Productos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorias.map((categoria) => (
                      <TableRow key={categoria.id}>
                        <TableCell className="font-medium">{categoria.id}</TableCell>
                        <TableCell>{categoria.nombre}</TableCell>
                        <TableCell className="text-right">{categoria.productos}</TableCell>
                        <TableCell>
                          <Badge 
                            className={categoria.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {categoria.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCategoria(categoria.id)}
                            disabled={categoria.productos > 0}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-sm text-gray-500">
                <HelpCircle className="h-4 w-4 inline mr-1" /> 
                No se pueden eliminar categorías que contengan productos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Usuarios */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administra los usuarios del sistema y sus roles</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Complete la información para crear un nuevo usuario en el sistema.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-nombre">Nombre Completo</Label>
                        <Input 
                          id="new-nombre" 
                          name="nombre" 
                          placeholder="Nombre del usuario"
                          value={nuevoUsuario.nombre}
                          onChange={handleNuevoUsuarioChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Correo Electrónico</Label>
                        <Input 
                          id="new-email" 
                          name="email" 
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={nuevoUsuario.email}
                          onChange={handleNuevoUsuarioChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-rol">Rol</Label>
                        <Select 
                          name="rol"
                          value={nuevoUsuario.rol}
                          onValueChange={(value) => setNuevoUsuario({...nuevoUsuario, rol: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesUsuario.map((rol) => (
                              <SelectItem key={rol.value} value={rol.value}>
                                {rol.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          {rolesUsuario.find(r => r.value === nuevoUsuario.rol)?.permisos}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-contrasena">Contraseña</Label>
                        <Input 
                          id="new-contrasena" 
                          name="contrasena" 
                          type="password"
                          placeholder="********"
                          value={nuevoUsuario.contrasena}
                          onChange={handleNuevoUsuarioChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-confirmar">Confirmar Contraseña</Label>
                        <Input 
                          id="new-confirmar" 
                          name="confirmarContrasena" 
                          type="password"
                          placeholder="********"
                          value={nuevoUsuario.confirmarContrasena}
                          onChange={handleNuevoUsuarioChange}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline">Cancelar</Button>
                      <Button 
                        type="button"
                        onClick={handleAddUsuario}
                        disabled={
                          !nuevoUsuario.nombre || 
                          !nuevoUsuario.email || 
                          !nuevoUsuario.contrasena || 
                          nuevoUsuario.contrasena !== nuevoUsuario.confirmarContrasena
                        }
                      >
                        Crear Usuario
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{usuario.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{usuario.nombre}</div>
                              <div className="text-xs text-gray-500">{usuario.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              usuario.rol === 'admin' ? 'bg-purple-100 text-purple-800' :
                              usuario.rol === 'gerente' ? 'bg-blue-100 text-blue-800' :
                              usuario.rol === 'vendedor' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }
                          >
                            {rolesUsuario.find(r => r.value === usuario.rol)?.label || usuario.rol}
                          </Badge>
                        </TableCell>
                        <TableCell>{usuario.ultimoAcceso}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${usuario.estado === 'activo' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleUsuarioEstado(usuario.id)}
                          >
                            {usuario.estado === 'activo' ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración del Sistema */}
        <TabsContent value="sistema">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura las notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notificaciones por Email</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-nueva-venta">Nueva Venta</Label>
                      <p className="text-xs text-gray-500">Recibe una notificación cuando se registre una nueva venta</p>
                    </div>
                    <Switch 
                      id="email-nueva-venta" 
                      checked={notificacionesConfig.emailNuevaVenta}
                      onCheckedChange={(checked) => handleNotificacionChange('emailNuevaVenta', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-inventario">Inventario Bajo</Label>
                      <p className="text-xs text-gray-500">Recibe alertas cuando algún producto esté por agotarse</p>
                    </div>
                    <Switch 
                      id="email-inventario" 
                      checked={notificacionesConfig.emailInventarioBajo}
                      onCheckedChange={(checked) => handleNotificacionChange('emailInventarioBajo', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-devolucion">Devoluciones Pendientes</Label>
                      <p className="text-xs text-gray-500">Recibe recordatorios de devoluciones próximas a vencer</p>
                    </div>
                    <Switch 
                      id="email-devolucion" 
                      checked={notificacionesConfig.emailDevolucionPendiente}
                      onCheckedChange={(checked) => handleNotificacionChange('emailDevolucionPendiente', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Resúmenes Automáticos</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="resumen-diario">Recordatorios Diarios</Label>
                      <p className="text-xs text-gray-500">Recibe un resumen de las actividades pendientes para el día</p>
                    </div>
                    <Switch 
                      id="resumen-diario" 
                      checked={notificacionesConfig.recordatoriosDiarios}
                      onCheckedChange={(checked) => handleNotificacionChange('recordatoriosDiarios', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="resumen-semanal">Resumen Semanal</Label>
                      <p className="text-xs text-gray-500">Recibe un informe consolidado de ventas y actividad semanal</p>
                    </div>
                    <Switch 
                      id="resumen-semanal" 
                      checked={notificacionesConfig.resumenSemanal}
                      onCheckedChange={(checked) => handleNotificacionChange('resumenSemanal', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Configuraciones de seguridad del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contraseñas</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Complejidad de Contraseña</Label>
                      <p className="text-xs text-gray-500">Nivel de seguridad requerido para las contraseñas</p>
                    </div>
                    <Select defaultValue="media">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Caducidad de Contraseña</Label>
                      <p className="text-xs text-gray-500">Periodo para forzar cambio de contraseña</p>
                    </div>
                    <Select defaultValue="90">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Seleccionar periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="nunca">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Sesiones</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tiempo de Inactividad</Label>
                      <p className="text-xs text-gray-500">Tiempo antes de cerrar sesión por inactividad</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Seleccionar tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="permitir-multiples">Permitir Múltiples Sesiones</Label>
                      <p className="text-xs text-gray-500">Permite iniciar sesión en múltiples dispositivos</p>
                    </div>
                    <Switch id="permitir-multiples" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="avanzado">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Respaldo de Datos</CardTitle>
                <CardDescription>Configura los respaldos automáticos de la base de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frecuencia">Frecuencia de Respaldo</Label>
                  <Select 
                    value={backupFrecuencia}
                    onValueChange={setBackupFrecuencia}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-emails">Notificar a Emails</Label>
                  <Textarea 
                    id="backup-emails" 
                    placeholder="Ingrese los emails separados por comas"
                    value={backupEmails}
                    onChange={(e) => setBackupEmails(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Los reportes de respaldo serán enviados a estos correos
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Crear Respaldo Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mantenimiento</CardTitle>
                <CardDescription>Opciones de mantenimiento del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Limpiar Datos Temporales</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Elimina archivos temporales y caché del sistema para mejorar el rendimiento
                  </p>
                  <Button variant="outline" size="sm">
                    Iniciar Limpieza
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Optimizar Base de Datos</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Optimiza las tablas y la estructura de la base de datos
                  </p>
                  <Button variant="outline" size="sm">
                    Iniciar Optimización
                  </Button>
                </div>
                
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Registro de Actividad</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Descarga el registro de actividad del sistema
                  </p>
                  <Button variant="outline" size="sm">
                    Descargar Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracionPage;