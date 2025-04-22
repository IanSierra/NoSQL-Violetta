import { z } from "zod";

// Esquema para MongoDB (sin usar Drizzle ORM para PostgreSQL)

// Esquema para Productos (Vestidos y Accesorios)
export const productoSchema = z.object({
  _id: z.string().optional(), // MongoDB genera esto automáticamente
  codigo: z.string().min(3),
  nombre: z.string().min(3),
  descripcion: z.string().min(5),
  categoria: z.enum(["vestido", "accesorio", "calzado"]),
  subcategoria: z.string().optional(),
  precio: z.number().positive(),
  precioRenta: z.number().positive().optional(),
  stock: z.number().int().min(0),
  stockMinimo: z.number().int().min(0).default(1),
  tallas: z.array(z.string()).optional(),
  colores: z.array(z.string()).optional(),
  imagenes: z.array(z.string()).optional(),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Esquema para Clientes
export const clienteSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().min(3),
  apellidos: z.string().min(3),
  email: z.string().email().optional(),
  telefono: z.string().min(10).optional(),
  direccion: z.string().optional(),
  historialCompras: z.array(z.string()).optional(), // Referencias a IDs de transacciones
  historialRentas: z.array(z.string()).optional(), // Referencias a IDs de transacciones
  fechaNacimiento: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Esquema para Transacciones (Ventas y Rentas)
export const transaccionSchema = z.object({
  _id: z.string().optional(),
  tipo: z.enum(["venta", "renta"]),
  clienteId: z.string(),
  productos: z.array(z.object({
    productoId: z.string(),
    cantidad: z.number().int().positive(),
    precio: z.number().positive(),
    esRenta: z.boolean().default(false),
    fechaDevolucion: z.date().optional()
  })),
  total: z.number().positive(),
  metodoPago: z.enum(["efectivo", "tarjeta", "transferencia"]),
  estado: z.enum(["pendiente", "completada", "cancelada"]),
  fechaCreacion: z.date().optional(),
  fechaActualizacion: z.date().optional(),
  // Solo para rentas
  fechaInicio: z.date().optional(),
  fechaFinalizacion: z.date().optional(),
  deposito: z.number().optional(),
  depositoDevuelto: z.boolean().optional()
});

// Esquema para usuarios del sistema
export const usuarioSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  rol: z.enum(["admin", "vendedor", "inventario"]),
  activo: z.boolean().default(true),
  ultimoAcceso: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Esquema para eventos (bitácora)
export const eventoSchema = z.object({
  _id: z.string().optional(),
  tipo: z.enum(["login", "logout", "creacion", "modificacion", "eliminacion"]),
  usuario: z.string(), // ID del usuario que realizó la acción
  descripcion: z.string(),
  entidad: z.enum(["producto", "cliente", "transaccion", "usuario"]),
  entidadId: z.string(),
  datosAnteriores: z.record(z.any()).optional(),
  datosNuevos: z.record(z.any()).optional(),
  fecha: z.date().optional(),
});

// Tipos inferidos a partir de los esquemas
export type Producto = z.infer<typeof productoSchema>;
export type ProductoInsert = Omit<Producto, "_id" | "createdAt" | "updatedAt">;

export type Cliente = z.infer<typeof clienteSchema>;
export type ClienteInsert = Omit<Cliente, "_id" | "createdAt" | "updatedAt">;

export type Transaccion = z.infer<typeof transaccionSchema>;
export type TransaccionInsert = Omit<Transaccion, "_id" | "fechaCreacion" | "fechaActualizacion">;

export type Usuario = z.infer<typeof usuarioSchema>;
export type UsuarioInsert = Omit<Usuario, "_id" | "createdAt" | "updatedAt" | "ultimoAcceso">;

export type Evento = z.infer<typeof eventoSchema>;
export type EventoInsert = Omit<Evento, "_id" | "fecha">;
