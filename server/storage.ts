import { 
  Producto, ProductoInsert,
  Cliente, ClienteInsert,
  Transaccion, TransaccionInsert,
  Usuario, UsuarioInsert,
  Evento, EventoInsert
} from "@shared/schema";

// Interfaz para las operaciones de almacenamiento de la base de datos MongoDB
export interface IStorage {
  // Operaciones de Productos
  getProductos(): Promise<Producto[]>;
  getProducto(id: string): Promise<Producto | undefined>;
  getProductosByCategoriaAndStock(categoria: string, stockMinimo: number): Promise<Producto[]>;
  createProducto(producto: ProductoInsert): Promise<Producto>;
  updateProducto(id: string, producto: Partial<ProductoInsert>): Promise<Producto | undefined>;
  deleteProducto(id: string): Promise<boolean>;

  // Operaciones de Clientes
  getClientes(): Promise<Cliente[]>;
  getCliente(id: string): Promise<Cliente | undefined>;
  createCliente(cliente: ClienteInsert): Promise<Cliente>;
  updateCliente(id: string, cliente: Partial<ClienteInsert>): Promise<Cliente | undefined>;
  deleteCliente(id: string): Promise<boolean>;

  // Operaciones de Transacciones
  getTransacciones(): Promise<Transaccion[]>;
  getTransaccionesByTipo(tipo: 'venta' | 'renta'): Promise<Transaccion[]>;
  getTransaccion(id: string): Promise<Transaccion | undefined>;
  getTransaccionesByCliente(clienteId: string): Promise<Transaccion[]>;
  createTransaccion(transaccion: TransaccionInsert): Promise<Transaccion>;
  updateTransaccion(id: string, transaccion: Partial<TransaccionInsert>): Promise<Transaccion | undefined>;
  deleteTransaccion(id: string): Promise<boolean>;

  // Operaciones de Usuarios
  getUsuarios(): Promise<Usuario[]>;
  getUsuario(id: string): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  createUsuario(usuario: UsuarioInsert): Promise<Usuario>;
  updateUsuario(id: string, usuario: Partial<UsuarioInsert>): Promise<Usuario | undefined>;
  deleteUsuario(id: string): Promise<boolean>;
  authenticateUsuario(email: string, password: string): Promise<Usuario | undefined>;

  // Operaciones de Eventos
  getEventos(): Promise<Evento[]>;
  getEvento(id: string): Promise<Evento | undefined>;
  getEventosByUsuario(usuarioId: string): Promise<Evento[]>;
  getEventosByEntidad(entidad: string, entidadId: string): Promise<Evento[]>;
  createEvento(evento: EventoInsert): Promise<Evento>;
}

export class MemStorage implements IStorage {
  private productosData: Map<string, Producto> = new Map();
  private clientesData: Map<string, Cliente> = new Map();
  private transaccionesData: Map<string, Transaccion> = new Map();
  private usuariosData: Map<string, Usuario> = new Map();
  private eventosData: Map<string, Evento> = new Map();
  
  private nextId = 1;

  constructor() {
    // Inicializar con datos de muestra
    this.initializeData();
  }

  private generateId(prefix: string): string {
    return `${prefix}_${(this.nextId++).toString().padStart(4, '0')}`;
  }

  private initializeData() {
    // Añadir productos de muestra
    const productos: ProductoInsert[] = [
      {
        codigo: "VES-001",
        nombre: "Vestido de Novia Elegancia",
        descripcion: "Vestido de novia con encaje y pedrería",
        categoria: "vestido",
        subcategoria: "novia",
        precio: 4500,
        precioRenta: 1200,
        stock: 3,
        stockMinimo: 1,
        tallas: ["S", "M", "L"],
        colores: ["Blanco", "Marfil"],
        imagenes: ["vestido_novia_1.jpg", "vestido_novia_2.jpg"],
        activo: true,
        destacado: true
      },
      {
        codigo: "VES-002",
        nombre: "Vestido de Quince Primavera",
        descripcion: "Vestido de quinceañera con capas y tul",
        categoria: "vestido",
        subcategoria: "quinceañera",
        precio: 3200,
        precioRenta: 800,
        stock: 5,
        stockMinimo: 2,
        tallas: ["S", "M", "L", "XL"],
        colores: ["Rosa", "Azul", "Lila"],
        imagenes: ["vestido_quince_1.jpg"],
        activo: true,
        destacado: true
      },
      {
        codigo: "ACC-001",
        nombre: "Tiara Princesa",
        descripcion: "Tiara con cristales y perlas",
        categoria: "accesorio",
        subcategoria: "tiara",
        precio: 450,
        stock: 10,
        stockMinimo: 3,
        colores: ["Plateado", "Dorado"],
        imagenes: ["tiara_1.jpg"],
        activo: true,
        destacado: false
      },
      {
        codigo: "CAL-001",
        nombre: "Zapatillas de Novia Perla",
        descripcion: "Zapatillas de novia con perlas y tacón bajo",
        categoria: "calzado",
        subcategoria: "novia",
        precio: 850,
        precioRenta: 250,
        stock: 4,
        stockMinimo: 1,
        tallas: ["35", "36", "37", "38"],
        colores: ["Blanco", "Champagne"],
        imagenes: ["zapatillas_1.jpg"],
        activo: true,
        destacado: false
      },
      {
        codigo: "VES-003",
        nombre: "Vestido de Gala Noche",
        descripcion: "Vestido de gala para eventos formales",
        categoria: "vestido",
        subcategoria: "gala",
        precio: 2800,
        precioRenta: 700,
        stock: 2,
        stockMinimo: 1,
        tallas: ["M", "L"],
        colores: ["Negro", "Rojo", "Azul Marino"],
        imagenes: ["vestido_gala_1.jpg"],
        activo: true,
        destacado: true
      }
    ];
    
    productos.forEach(producto => {
      this.createProducto(producto);
    });

    // Añadir clientes de muestra
    const clientes: ClienteInsert[] = [
      {
        nombre: "Ana",
        apellidos: "García López",
        email: "ana.garcia@email.com",
        telefono: "5512345678",
        direccion: "Calle Principal 123, Colonia Centro"
      },
      {
        nombre: "Sofía",
        apellidos: "Martínez Ruiz",
        email: "sofia.martinez@email.com",
        telefono: "5598765432",
        direccion: "Av. Reforma 456, Colonia Juárez"
      },
      {
        nombre: "María",
        apellidos: "Rodríguez Sánchez",
        email: "maria.rodriguez@email.com",
        telefono: "5523456789",
        direccion: "Calle Independencia 789, Colonia Roma"
      }
    ];
    
    clientes.forEach(cliente => {
      this.createCliente(cliente);
    });

    // Añadir usuarios de muestra
    const usuarios: UsuarioInsert[] = [
      {
        nombre: "Administrador",
        email: "admin@violetta.com",
        password: "admin123",
        rol: "admin",
        activo: true
      },
      {
        nombre: "Vendedor",
        email: "vendedor@violetta.com",
        password: "vendedor123",
        rol: "vendedor",
        activo: true
      },
      {
        nombre: "Encargado de Inventario",
        email: "inventario@violetta.com",
        password: "inventario123",
        rol: "inventario",
        activo: true
      }
    ];
    
    usuarios.forEach(usuario => {
      this.createUsuario(usuario);
    });
  }

  // Implementación de métodos para Productos
  async getProductos(): Promise<Producto[]> {
    return Array.from(this.productosData.values());
  }

  async getProducto(id: string): Promise<Producto | undefined> {
    return this.productosData.get(id);
  }

  async getProductosByCategoriaAndStock(categoria: string, stockMinimo: number): Promise<Producto[]> {
    return Array.from(this.productosData.values()).filter(
      producto => producto.categoria === categoria && producto.stock <= stockMinimo
    );
  }

  async createProducto(producto: ProductoInsert): Promise<Producto> {
    const id = this.generateId('PROD');
    const now = new Date();
    const nuevoProducto: Producto = {
      ...producto,
      _id: id,
      createdAt: now,
      updatedAt: now
    };
    this.productosData.set(id, nuevoProducto);
    return nuevoProducto;
  }

  async updateProducto(id: string, producto: Partial<ProductoInsert>): Promise<Producto | undefined> {
    const productoExistente = this.productosData.get(id);
    if (!productoExistente) return undefined;

    const productoActualizado: Producto = {
      ...productoExistente,
      ...producto,
      updatedAt: new Date()
    };
    this.productosData.set(id, productoActualizado);
    return productoActualizado;
  }

  async deleteProducto(id: string): Promise<boolean> {
    return this.productosData.delete(id);
  }

  // Implementación de métodos para Clientes
  async getClientes(): Promise<Cliente[]> {
    return Array.from(this.clientesData.values());
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    return this.clientesData.get(id);
  }

  async createCliente(cliente: ClienteInsert): Promise<Cliente> {
    const id = this.generateId('CLI');
    const now = new Date();
    const nuevoCliente: Cliente = {
      ...cliente,
      _id: id,
      historialCompras: [],
      historialRentas: [],
      createdAt: now,
      updatedAt: now
    };
    this.clientesData.set(id, nuevoCliente);
    return nuevoCliente;
  }

  async updateCliente(id: string, cliente: Partial<ClienteInsert>): Promise<Cliente | undefined> {
    const clienteExistente = this.clientesData.get(id);
    if (!clienteExistente) return undefined;

    const clienteActualizado: Cliente = {
      ...clienteExistente,
      ...cliente,
      updatedAt: new Date()
    };
    this.clientesData.set(id, clienteActualizado);
    return clienteActualizado;
  }

  async deleteCliente(id: string): Promise<boolean> {
    return this.clientesData.delete(id);
  }

  // Implementación de métodos para Transacciones
  async getTransacciones(): Promise<Transaccion[]> {
    return Array.from(this.transaccionesData.values());
  }

  async getTransaccionesByTipo(tipo: 'venta' | 'renta'): Promise<Transaccion[]> {
    return Array.from(this.transaccionesData.values()).filter(
      transaccion => transaccion.tipo === tipo
    );
  }

  async getTransaccion(id: string): Promise<Transaccion | undefined> {
    return this.transaccionesData.get(id);
  }

  async getTransaccionesByCliente(clienteId: string): Promise<Transaccion[]> {
    return Array.from(this.transaccionesData.values()).filter(
      transaccion => transaccion.clienteId === clienteId
    );
  }

  async createTransaccion(transaccion: TransaccionInsert): Promise<Transaccion> {
    const id = this.generateId(transaccion.tipo === 'venta' ? 'VEN' : 'REN');
    const now = new Date();
    const nuevaTransaccion: Transaccion = {
      ...transaccion,
      _id: id,
      fechaCreacion: now,
      fechaActualizacion: now
    };
    this.transaccionesData.set(id, nuevaTransaccion);

    // Actualizar historial del cliente
    const cliente = await this.getCliente(transaccion.clienteId);
    if (cliente) {
      if (transaccion.tipo === 'venta') {
        cliente.historialCompras = [...(cliente.historialCompras || []), id];
      } else {
        cliente.historialRentas = [...(cliente.historialRentas || []), id];
      }
      await this.updateCliente(cliente._id!, cliente);
    }

    // Actualizar stock de productos
    for (const item of transaccion.productos) {
      const producto = await this.getProducto(item.productoId);
      if (producto) {
        producto.stock = Math.max(0, producto.stock - item.cantidad);
        await this.updateProducto(producto._id!, producto);
      }
    }

    return nuevaTransaccion;
  }

  async updateTransaccion(id: string, transaccion: Partial<TransaccionInsert>): Promise<Transaccion | undefined> {
    const transaccionExistente = this.transaccionesData.get(id);
    if (!transaccionExistente) return undefined;

    const transaccionActualizada: Transaccion = {
      ...transaccionExistente,
      ...transaccion,
      fechaActualizacion: new Date()
    };
    this.transaccionesData.set(id, transaccionActualizada);
    return transaccionActualizada;
  }

  async deleteTransaccion(id: string): Promise<boolean> {
    return this.transaccionesData.delete(id);
  }

  // Implementación de métodos para Usuarios
  async getUsuarios(): Promise<Usuario[]> {
    return Array.from(this.usuariosData.values());
  }

  async getUsuario(id: string): Promise<Usuario | undefined> {
    return this.usuariosData.get(id);
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    return Array.from(this.usuariosData.values()).find(
      usuario => usuario.email === email
    );
  }

  async createUsuario(usuario: UsuarioInsert): Promise<Usuario> {
    const id = this.generateId('USR');
    const now = new Date();
    const nuevoUsuario: Usuario = {
      ...usuario,
      _id: id,
      ultimoAcceso: null,
      createdAt: now,
      updatedAt: now
    };
    this.usuariosData.set(id, nuevoUsuario);
    return nuevoUsuario;
  }

  async updateUsuario(id: string, usuario: Partial<UsuarioInsert>): Promise<Usuario | undefined> {
    const usuarioExistente = this.usuariosData.get(id);
    if (!usuarioExistente) return undefined;

    const usuarioActualizado: Usuario = {
      ...usuarioExistente,
      ...usuario,
      updatedAt: new Date()
    };
    this.usuariosData.set(id, usuarioActualizado);
    return usuarioActualizado;
  }

  async deleteUsuario(id: string): Promise<boolean> {
    return this.usuariosData.delete(id);
  }

  async authenticateUsuario(email: string, password: string): Promise<Usuario | undefined> {
    const usuario = await this.getUsuarioByEmail(email);
    if (!usuario || usuario.password !== password || !usuario.activo) {
      return undefined;
    }
    
    usuario.ultimoAcceso = new Date();
    await this.updateUsuario(usuario._id!, { ultimoAcceso: usuario.ultimoAcceso } as any);
    
    return usuario;
  }

  // Implementación de métodos para Eventos
  async getEventos(): Promise<Evento[]> {
    return Array.from(this.eventosData.values());
  }

  async getEvento(id: string): Promise<Evento | undefined> {
    return this.eventosData.get(id);
  }

  async getEventosByUsuario(usuarioId: string): Promise<Evento[]> {
    return Array.from(this.eventosData.values()).filter(
      evento => evento.usuario === usuarioId
    );
  }

  async getEventosByEntidad(entidad: string, entidadId: string): Promise<Evento[]> {
    return Array.from(this.eventosData.values()).filter(
      evento => evento.entidad === entidad && evento.entidadId === entidadId
    );
  }

  async createEvento(evento: EventoInsert): Promise<Evento> {
    const id = this.generateId('EVT');
    const now = new Date();
    const nuevoEvento: Evento = {
      ...evento,
      _id: id,
      fecha: now
    };
    this.eventosData.set(id, nuevoEvento);
    return nuevoEvento;
  }
}

// Crear y exportar una única instancia del almacenamiento
export const storage = new MemStorage();
