import { ObjectId } from 'mongodb';
import { db } from './index';
import { 
  IStorage, 
  Producto, 
  ProductoInsert, 
  Cliente, 
  ClienteInsert, 
  Transaccion, 
  TransaccionInsert, 
  Usuario, 
  UsuarioInsert, 
  Evento, 
  EventoInsert 
} from './storage';
import { log } from './vite';

/**
 * Implementación de almacenamiento usando MongoDB
 */
export class MongoDBStorage implements IStorage {
  /**
   * Convierte un ID de string a ObjectId de MongoDB
   */
  private toObjectId(id: string): ObjectId {
    try {
      return new ObjectId(id);
    } catch (error) {
      throw new Error(`ID inválido: ${id}`);
    }
  }

  /**
   * Formatea un documento de MongoDB eliminando el campo _id y convirtiéndolo a string
   */
  private formatDocument<T>(doc: any): T {
    if (!doc) return doc;
    
    const formatted = { ...doc };
    if (formatted._id) {
      formatted._id = formatted._id.toString();
    }
    return formatted as T;
  }

  /**
   * Formatea una lista de documentos de MongoDB
   */
  private formatDocuments<T>(docs: any[]): T[] {
    return docs.map(doc => this.formatDocument<T>(doc));
  }

  //=================================
  // Operaciones de Productos
  //=================================
  
  async getProductos(): Promise<Producto[]> {
    try {
      const productos = await db.collection('productos').find().toArray();
      return this.formatDocuments<Producto>(productos);
    } catch (error) {
      log(`Error al obtener productos: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getProducto(id: string): Promise<Producto | undefined> {
    try {
      const producto = await db.collection('productos').findOne({ _id: this.toObjectId(id) });
      return producto ? this.formatDocument<Producto>(producto) : undefined;
    } catch (error) {
      log(`Error al obtener producto: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getProductosByCategoriaAndStock(categoria: string, stockMinimo: number): Promise<Producto[]> {
    try {
      const productos = await db.collection('productos')
        .find({ 
          categoria, 
          stock: { $lte: stockMinimo } 
        })
        .toArray();
      return this.formatDocuments<Producto>(productos);
    } catch (error) {
      log(`Error al obtener productos por categoría y stock: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createProducto(producto: ProductoInsert): Promise<Producto> {
    try {
      const nuevoProducto = {
        ...producto,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('productos').insertOne(nuevoProducto);
      
      return {
        ...nuevoProducto,
        _id: result.insertedId.toString()
      } as Producto;
    } catch (error) {
      log(`Error al crear producto: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateProducto(id: string, producto: Partial<ProductoInsert>): Promise<Producto | undefined> {
    try {
      const result = await db.collection('productos').findOneAndUpdate(
        { _id: this.toObjectId(id) },
        {
          $set: {
            ...producto,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result ? this.formatDocument<Producto>(result) : undefined;
    } catch (error) {
      log(`Error al actualizar producto: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async deleteProducto(id: string): Promise<boolean> {
    try {
      const result = await db.collection('productos').deleteOne({ _id: this.toObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      log(`Error al eliminar producto: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  //=================================
  // Operaciones de Clientes
  //=================================
  
  async getClientes(): Promise<Cliente[]> {
    try {
      const clientes = await db.collection('clientes').find().toArray();
      return this.formatDocuments<Cliente>(clientes);
    } catch (error) {
      log(`Error al obtener clientes: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    try {
      const cliente = await db.collection('clientes').findOne({ _id: this.toObjectId(id) });
      return cliente ? this.formatDocument<Cliente>(cliente) : undefined;
    } catch (error) {
      log(`Error al obtener cliente: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async createCliente(cliente: ClienteInsert): Promise<Cliente> {
    try {
      const nuevoCliente = {
        ...cliente,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('clientes').insertOne(nuevoCliente);
      
      return {
        ...nuevoCliente,
        _id: result.insertedId.toString()
      } as Cliente;
    } catch (error) {
      log(`Error al crear cliente: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateCliente(id: string, cliente: Partial<ClienteInsert>): Promise<Cliente | undefined> {
    try {
      const result = await db.collection('clientes').findOneAndUpdate(
        { _id: this.toObjectId(id) },
        {
          $set: {
            ...cliente,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result ? this.formatDocument<Cliente>(result) : undefined;
    } catch (error) {
      log(`Error al actualizar cliente: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async deleteCliente(id: string): Promise<boolean> {
    try {
      const result = await db.collection('clientes').deleteOne({ _id: this.toObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      log(`Error al eliminar cliente: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  //=================================
  // Operaciones de Transacciones
  //=================================
  
  async getTransacciones(): Promise<Transaccion[]> {
    try {
      const transacciones = await db.collection('transacciones').find().toArray();
      return this.formatDocuments<Transaccion>(transacciones);
    } catch (error) {
      log(`Error al obtener transacciones: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getTransaccionesByTipo(tipo: 'venta' | 'renta'): Promise<Transaccion[]> {
    try {
      const transacciones = await db.collection('transacciones')
        .find({ tipo })
        .toArray();
      return this.formatDocuments<Transaccion>(transacciones);
    } catch (error) {
      log(`Error al obtener transacciones por tipo: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getTransaccion(id: string): Promise<Transaccion | undefined> {
    try {
      const transaccion = await db.collection('transacciones').findOne({ _id: this.toObjectId(id) });
      return transaccion ? this.formatDocument<Transaccion>(transaccion) : undefined;
    } catch (error) {
      log(`Error al obtener transacción: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getTransaccionesByCliente(clienteId: string): Promise<Transaccion[]> {
    try {
      const transacciones = await db.collection('transacciones')
        .find({ 'cliente._id': clienteId })
        .toArray();
      return this.formatDocuments<Transaccion>(transacciones);
    } catch (error) {
      log(`Error al obtener transacciones por cliente: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createTransaccion(transaccion: TransaccionInsert): Promise<Transaccion> {
    try {
      const nuevaTransaccion = {
        ...transaccion,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };
      
      const result = await db.collection('transacciones').insertOne(nuevaTransaccion);
      
      // Actualizar el stock de los productos si es una venta
      if (transaccion.tipo === 'venta' && transaccion.productos) {
        for (const item of transaccion.productos) {
          await db.collection('productos').updateOne(
            { _id: this.toObjectId(item.productoId) },
            { $inc: { stock: -item.cantidad } }
          );
        }
      }
      
      return {
        ...nuevaTransaccion,
        _id: result.insertedId.toString()
      } as Transaccion;
    } catch (error) {
      log(`Error al crear transacción: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateTransaccion(id: string, transaccion: Partial<TransaccionInsert>): Promise<Transaccion | undefined> {
    try {
      const result = await db.collection('transacciones').findOneAndUpdate(
        { _id: this.toObjectId(id) },
        {
          $set: {
            ...transaccion,
            fechaActualizacion: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result ? this.formatDocument<Transaccion>(result) : undefined;
    } catch (error) {
      log(`Error al actualizar transacción: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async deleteTransaccion(id: string): Promise<boolean> {
    try {
      // Obtener la transacción antes de eliminarla para restaurar el stock si es necesario
      const transaccion = await this.getTransaccion(id);
      
      if (transaccion && transaccion.tipo === 'venta' && transaccion.productos) {
        // Restaurar el stock de los productos
        for (const item of transaccion.productos) {
          await db.collection('productos').updateOne(
            { _id: this.toObjectId(item.productoId) },
            { $inc: { stock: item.cantidad } }
          );
        }
      }
      
      const result = await db.collection('transacciones').deleteOne({ _id: this.toObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      log(`Error al eliminar transacción: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  //=================================
  // Operaciones de Usuarios
  //=================================
  
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const usuarios = await db.collection('usuarios').find().toArray();
      return this.formatDocuments<Usuario>(usuarios);
    } catch (error) {
      log(`Error al obtener usuarios: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getUsuario(id: string): Promise<Usuario | undefined> {
    try {
      const usuario = await db.collection('usuarios').findOne({ _id: this.toObjectId(id) });
      return usuario ? this.formatDocument<Usuario>(usuario) : undefined;
    } catch (error) {
      log(`Error al obtener usuario: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    try {
      const usuario = await db.collection('usuarios').findOne({ email });
      return usuario ? this.formatDocument<Usuario>(usuario) : undefined;
    } catch (error) {
      log(`Error al obtener usuario por email: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async createUsuario(usuario: UsuarioInsert): Promise<Usuario> {
    try {
      const nuevoUsuario = {
        ...usuario,
        createdAt: new Date(),
        updatedAt: new Date(),
        ultimoAcceso: undefined
      };
      
      const result = await db.collection('usuarios').insertOne(nuevoUsuario);
      
      return {
        ...nuevoUsuario,
        _id: result.insertedId.toString()
      } as Usuario;
    } catch (error) {
      log(`Error al crear usuario: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async updateUsuario(id: string, usuario: Partial<UsuarioInsert>): Promise<Usuario | undefined> {
    try {
      const result = await db.collection('usuarios').findOneAndUpdate(
        { _id: this.toObjectId(id) },
        {
          $set: {
            ...usuario,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      return result ? this.formatDocument<Usuario>(result) : undefined;
    } catch (error) {
      log(`Error al actualizar usuario: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async deleteUsuario(id: string): Promise<boolean> {
    try {
      const result = await db.collection('usuarios').deleteOne({ _id: this.toObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      log(`Error al eliminar usuario: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  async authenticateUsuario(email: string, password: string): Promise<Usuario | undefined> {
    try {
      // Nota: En una implementación real, la contraseña debería estar hasheada
      const usuario = await db.collection('usuarios').findOne({ email, password });
      
      if (usuario) {
        // Actualizar último acceso
        await db.collection('usuarios').updateOne(
          { _id: usuario._id },
          { $set: { ultimoAcceso: new Date() } }
        );
        
        return this.formatDocument<Usuario>(usuario);
      }
      
      return undefined;
    } catch (error) {
      log(`Error al autenticar usuario: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  //=================================
  // Operaciones de Eventos
  //=================================
  
  async getEventos(): Promise<Evento[]> {
    try {
      const eventos = await db.collection('eventos').find().sort({ fecha: -1 }).toArray();
      return this.formatDocuments<Evento>(eventos);
    } catch (error) {
      log(`Error al obtener eventos: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getEvento(id: string): Promise<Evento | undefined> {
    try {
      const evento = await db.collection('eventos').findOne({ _id: this.toObjectId(id) });
      return evento ? this.formatDocument<Evento>(evento) : undefined;
    } catch (error) {
      log(`Error al obtener evento: ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  }

  async getEventosByUsuario(usuarioId: string): Promise<Evento[]> {
    try {
      const eventos = await db.collection('eventos')
        .find({ 'usuario._id': usuarioId })
        .sort({ fecha: -1 })
        .toArray();
      return this.formatDocuments<Evento>(eventos);
    } catch (error) {
      log(`Error al obtener eventos por usuario: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async getEventosByEntidad(entidad: string, entidadId: string): Promise<Evento[]> {
    try {
      const eventos = await db.collection('eventos')
        .find({ 
          'entidad.tipo': entidad,
          'entidad._id': entidadId 
        })
        .sort({ fecha: -1 })
        .toArray();
      return this.formatDocuments<Evento>(eventos);
    } catch (error) {
      log(`Error al obtener eventos por entidad: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async createEvento(evento: EventoInsert): Promise<Evento> {
    try {
      const nuevoEvento = {
        ...evento,
        fecha: new Date()
      };
      
      const result = await db.collection('eventos').insertOne(nuevoEvento);
      
      return {
        ...nuevoEvento,
        _id: result.insertedId.toString()
      } as Evento;
    } catch (error) {
      log(`Error al crear evento: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

// Exportamos la instancia de almacenamiento MongoDB
export const mongoStorage = new MongoDBStorage();