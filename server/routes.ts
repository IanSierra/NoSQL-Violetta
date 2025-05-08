import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mongoStorage } from "./mongodb-storage";
import { 
  productoSchema, 
  clienteSchema, 
  transaccionSchema, 
  usuarioSchema, 
  eventoSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Usar la implementación de almacenamiento adecuada
  // Si la conexión a MongoDB falla, usaremos el almacenamiento en memoria
  const db = (app.get("mongoConnected") === true) ? mongoStorage : storage;

  // Rutas para Productos
  app.get("/api/productos", async (req: Request, res: Response) => {
    try {
      const productos = await db.getProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos", error: String(error) });
    }
  });

  app.get("/api/productos/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const producto = await db.getProducto(id);
      
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      
      res.json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto", error: String(error) });
    }
  });

  app.post("/api/productos", async (req: Request, res: Response) => {
    try {
      const parsed = productoSchema.omit({ _id: true, createdAt: true, updatedAt: true }).safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de producto inválidos", errors: parsed.error.format() });
      }
      
      const producto = await db.createProducto(parsed.data);
      res.status(201).json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al crear producto", error: String(error) });
    }
  });

  app.put("/api/productos/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const parsed = productoSchema.omit({ _id: true, createdAt: true, updatedAt: true }).partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: parsed.error.format() });
      }
      
      const productoActualizado = await db.updateProducto(id, parsed.data);
      
      if (!productoActualizado) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      
      res.json(productoActualizado);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar producto", error: String(error) });
    }
  });

  app.delete("/api/productos/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await db.deleteProducto(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto", error: String(error) });
    }
  });

  app.get("/api/productos/categoria/:categoria/bajo-stock", async (req: Request, res: Response) => {
    try {
      const categoria = req.params.categoria;
      const stockMinimo = parseInt(req.query.stockMinimo as string) || 5;
      
      const productos = await db.getProductosByCategoriaAndStock(categoria, stockMinimo);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos con bajo stock", error: String(error) });
    }
  });

  // Rutas para Clientes
  app.get("/api/clientes", async (req: Request, res: Response) => {
    try {
      const clientes = await db.getClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener clientes", error: String(error) });
    }
  });

  app.get("/api/clientes/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const cliente = await db.getCliente(id);
      
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cliente", error: String(error) });
    }
  });

  app.post("/api/clientes", async (req: Request, res: Response) => {
    try {
      const parsed = clienteSchema.omit({ _id: true, createdAt: true, updatedAt: true, historialCompras: true, historialRentas: true }).safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de cliente inválidos", errors: parsed.error.format() });
      }
      
      const cliente = await db.createCliente(parsed.data);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ message: "Error al crear cliente", error: String(error) });
    }
  });

  app.put("/api/clientes/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const parsed = clienteSchema.omit({ _id: true, createdAt: true, updatedAt: true, historialCompras: true, historialRentas: true }).partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: parsed.error.format() });
      }
      
      const clienteActualizado = await db.updateCliente(id, parsed.data);
      
      if (!clienteActualizado) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      
      res.json(clienteActualizado);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar cliente", error: String(error) });
    }
  });

  app.delete("/api/clientes/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await db.deleteCliente(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar cliente", error: String(error) });
    }
  });

  // Rutas para Transacciones
  app.get("/api/transacciones", async (req: Request, res: Response) => {
    try {
      const tipo = req.query.tipo as 'venta' | 'renta' | undefined;
      
      let transacciones;
      if (tipo) {
        transacciones = await db.getTransaccionesByTipo(tipo);
      } else {
        transacciones = await db.getTransacciones();
      }
      
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener transacciones", error: String(error) });
    }
  });

  app.get("/api/transacciones/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const transaccion = await db.getTransaccion(id);
      
      if (!transaccion) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }
      
      res.json(transaccion);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener transacción", error: String(error) });
    }
  });

  app.get("/api/transacciones/cliente/:clienteId", async (req: Request, res: Response) => {
    try {
      const clienteId = req.params.clienteId;
      const transacciones = await db.getTransaccionesByCliente(clienteId);
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener transacciones del cliente", error: String(error) });
    }
  });

  app.post("/api/transacciones", async (req: Request, res: Response) => {
    try {
      const parsed = transaccionSchema.omit({ _id: true, fechaCreacion: true, fechaActualizacion: true }).safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de transacción inválidos", errors: parsed.error.format() });
      }
      
      const transaccion = await db.createTransaccion(parsed.data);
      res.status(201).json(transaccion);
    } catch (error) {
      res.status(500).json({ message: "Error al crear transacción", error: String(error) });
    }
  });

  app.put("/api/transacciones/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const parsed = transaccionSchema.omit({ _id: true, fechaCreacion: true, fechaActualizacion: true }).partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: parsed.error.format() });
      }
      
      const transaccionActualizada = await db.updateTransaccion(id, parsed.data);
      
      if (!transaccionActualizada) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }
      
      res.json(transaccionActualizada);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar transacción", error: String(error) });
    }
  });

  app.delete("/api/transacciones/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await db.deleteTransaccion(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar transacción", error: String(error) });
    }
  });

  // Rutas para Usuarios
  app.get("/api/usuarios", async (req: Request, res: Response) => {
    try {
      const usuarios = await db.getUsuarios();
      // No enviar las contraseñas al cliente
      const usuariosSinPassword = usuarios.map(usuario => {
        const { password, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
      });
      res.json(usuariosSinPassword);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios", error: String(error) });
    }
  });

  app.get("/api/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const usuario = await db.getUsuario(id);
      
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      // No enviar la contraseña al cliente
      const { password, ...usuarioSinPassword } = usuario;
      res.json(usuarioSinPassword);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario", error: String(error) });
    }
  });

  app.post("/api/usuarios", async (req: Request, res: Response) => {
    try {
      const parsed = usuarioSchema.omit({ _id: true, createdAt: true, updatedAt: true, ultimoAcceso: true }).safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de usuario inválidos", errors: parsed.error.format() });
      }
      
      // Verificar si ya existe un usuario con el mismo email
      const usuarioExistente = await db.getUsuarioByEmail(parsed.data.email);
      if (usuarioExistente) {
        return res.status(400).json({ message: "Ya existe un usuario con este email" });
      }
      
      const usuario = await db.createUsuario(parsed.data);
      
      // No enviar la contraseña al cliente
      const { password, ...usuarioSinPassword } = usuario;
      res.status(201).json(usuarioSinPassword);
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario", error: String(error) });
    }
  });

  app.put("/api/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const parsed = usuarioSchema.omit({ _id: true, createdAt: true, updatedAt: true, ultimoAcceso: true }).partial().safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de actualización inválidos", errors: parsed.error.format() });
      }
      
      // Si se está actualizando el email, verificar que no exista otro usuario con ese email
      if (parsed.data.email) {
        const usuarioConEmail = await db.getUsuarioByEmail(parsed.data.email);
        if (usuarioConEmail && usuarioConEmail._id !== id) {
          return res.status(400).json({ message: "Ya existe otro usuario con este email" });
        }
      }
      
      const usuarioActualizado = await db.updateUsuario(id, parsed.data);
      
      if (!usuarioActualizado) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      // No enviar la contraseña al cliente
      const { password, ...usuarioSinPassword } = usuarioActualizado;
      res.json(usuarioSinPassword);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario", error: String(error) });
    }
  });

  app.delete("/api/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await db.deleteUsuario(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario", error: String(error) });
    }
  });

  // Ruta para autenticación
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1)
      });
      
      const parsed = loginSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de inicio de sesión inválidos", errors: parsed.error.format() });
      }
      
      const { email, password } = parsed.data;
      const usuario = await db.authenticateUsuario(email, password);
      
      if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      // No enviar la contraseña al cliente
      const { password: _, ...usuarioSinPassword } = usuario;
      
      // Registrar evento de inicio de sesión
      await db.createEvento({
        tipo: "login",
        usuario: usuario._id!,
        descripcion: `Inicio de sesión del usuario ${usuario.nombre} (${usuario.email})`,
        entidad: "usuario",
        entidadId: usuario._id!
      });
      
      res.json({
        usuario: usuarioSinPassword,
        token: `token_simulado_${Date.now()}` // En una implementación real, se generaría un JWT
      });
    } catch (error) {
      res.status(500).json({ message: "Error en la autenticación", error: String(error) });
    }
  });

  // Rutas para Eventos (Bitácora)
  app.get("/api/eventos", async (req: Request, res: Response) => {
    try {
      const eventos = await db.getEventos();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener eventos", error: String(error) });
    }
  });

  app.get("/api/eventos/usuario/:usuarioId", async (req: Request, res: Response) => {
    try {
      const usuarioId = req.params.usuarioId;
      const eventos = await db.getEventosByUsuario(usuarioId);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener eventos del usuario", error: String(error) });
    }
  });
  
  app.get("/api/eventos/entidad/:entidad/:entidadId", async (req: Request, res: Response) => {
    try {
      const { entidad, entidadId } = req.params;
      const eventos = await db.getEventosByEntidad(entidad, entidadId);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener eventos de la entidad", error: String(error) });
    }
  });

  app.post("/api/eventos", async (req: Request, res: Response) => {
    try {
      const parsed = eventoSchema.omit({ _id: true, fecha: true }).safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ message: "Datos de evento inválidos", errors: parsed.error.format() });
      }
      
      const evento = await db.createEvento(parsed.data);
      res.status(201).json(evento);
    } catch (error) {
      res.status(500).json({ message: "Error al crear evento", error: String(error) });
    }
  });

  // Ruta para verificar el estado de la base de datos
  app.get("/api/system/status", async (req: Request, res: Response) => {
    try {
      const mongoConnected = app.get("mongoConnected") === true;
      
      const storageType = mongoConnected ? "MongoDB" : "Memoria";
      const status = {
        sistema: "Violetta Inventario",
        version: "1.0.0",
        storage: storageType,
        mongodb_connected: mongoConnected,
        uptime: process.uptime()
      };
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estado del sistema", error: String(error) });
    }
  });

  // Dashboard Data
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const productos = await db.getProductos();
      const clientes = await db.getClientes();
      const transacciones = await db.getTransacciones();
      
      // Total de productos
      const totalProductos = productos.length;
      
      // Total de clientes
      const totalClientes = clientes.length;
      
      // Ventas del día
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const ventasHoy = transacciones.filter(t => 
        t.tipo === 'venta' && 
        t.fechaCreacion && 
        new Date(t.fechaCreacion) >= hoy
      );
      
      // Total de ventas del día
      const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + venta.total, 0);
      
      // Productos con bajo stock
      const bajosDeStock = productos.filter(p => p.stock <= p.stockMinimo);
      
      res.json({
        totalProductos,
        totalClientes,
        ventasHoy: ventasHoy.length,
        totalVentasHoy,
        productosBajoStock: bajosDeStock.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estadísticas del dashboard", error: String(error) });
    }
  });

  app.get("/api/dashboard/productos-bajo-stock", async (req: Request, res: Response) => {
    try {
      const productos = await db.getProductos();
      const bajosDeStock = productos
        .filter(p => p.stock <= p.stockMinimo)
        .sort((a, b) => a.stock - b.stock); // Ordenar por stock ascendente
      
      res.json(bajosDeStock);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos con bajo stock", error: String(error) });
    }
  });

  app.get("/api/dashboard/ventas-recientes", async (req: Request, res: Response) => {
    try {
      const transacciones = await db.getTransacciones();
      const ventasRecientes = transacciones
        .filter(t => t.tipo === 'venta')
        .sort((a, b) => {
          const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
          const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
          return dateB - dateA; // Ordenar por fecha más reciente
        })
        .slice(0, 5); // Últimas 5 ventas
      
      // Obtener información del cliente para cada venta
      const ventasConCliente = await Promise.all(
        ventasRecientes.map(async (venta) => {
          const cliente = await db.getCliente(venta.clienteId);
          return {
            ...venta,
            cliente: cliente ? { nombre: cliente.nombre, apellidos: cliente.apellidos } : null
          };
        })
      );
      
      res.json(ventasConCliente);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener ventas recientes", error: String(error) });
    }
  });

  app.get("/api/dashboard/proximas-devoluciones", async (req: Request, res: Response) => {
    try {
      const hoy = new Date();
      const transacciones = await db.getTransacciones();
      
      // Obtener rentas con fecha de devolución próxima (en los próximos 7 días)
      const proximaSemana = new Date();
      proximaSemana.setDate(proximaSemana.getDate() + 7);
      
      const proximasDevoluciones = transacciones
        .filter(t => 
          t.tipo === 'renta' && 
          t.fechaFinalizacion && 
          new Date(t.fechaFinalizacion) >= hoy && 
          new Date(t.fechaFinalizacion) <= proximaSemana
        )
        .sort((a, b) => {
          const dateA = a.fechaFinalizacion ? new Date(a.fechaFinalizacion).getTime() : 0;
          const dateB = b.fechaFinalizacion ? new Date(b.fechaFinalizacion).getTime() : 0;
          return dateA - dateB; // Ordenar por fecha más cercana primero
        });
      
      // Obtener información del cliente para cada renta
      const devolucionesConCliente = await Promise.all(
        proximasDevoluciones.map(async (renta) => {
          const cliente = await db.getCliente(renta.clienteId);
          return {
            ...renta,
            cliente: cliente ? { nombre: cliente.nombre, apellidos: cliente.apellidos } : null
          };
        })
      );
      
      res.json(devolucionesConCliente);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener próximas devoluciones", error: String(error) });
    }
  });

  return httpServer;
}
