import { db } from './index';
import { log } from './vite';
import { 
  Producto, ProductoInsert,
  Cliente, ClienteInsert,
  Usuario, UsuarioInsert
} from './storage';

/**
 * Función para inicializar datos de muestra en MongoDB
 */
export async function seedMongoDB() {
  if (!db) {
    log('Base de datos no disponible. No se pueden sembrar datos.');
    return false;
  }

  try {
    log('Iniciando sembrado de datos en MongoDB...');

    // Verificar si ya hay datos para evitar duplicados
    const productsCount = await db.collection('productos').countDocuments();
    if (productsCount > 0) {
      log('La base de datos ya contiene datos. Saltando el sembrado de datos.');
      return true;
    }

    // Datos de muestra para productos
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

    // Insertar productos
    const now = new Date();
    const productosConTimestamp = productos.map(producto => ({
      ...producto,
      createdAt: now,
      updatedAt: now
    }));

    await db.collection('productos').insertMany(productosConTimestamp);
    log(`Se insertaron ${productos.length} productos en la colección 'productos'`);

    // Datos de muestra para clientes
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

    // Insertar clientes
    const clientesConTimestamp = clientes.map(cliente => ({
      ...cliente,
      historialCompras: [],
      historialRentas: [],
      createdAt: now,
      updatedAt: now
    }));

    await db.collection('clientes').insertMany(clientesConTimestamp);
    log(`Se insertaron ${clientes.length} clientes en la colección 'clientes'`);

    // Datos de muestra para usuarios
    const usuarios: UsuarioInsert[] = [
      {
        nombre: "Administrador",
        email: "admin@violetta.com",
        password: "admin123", // En una implementación real, esto estaría hasheado
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

    // Insertar usuarios
    const usuariosConTimestamp = usuarios.map(usuario => ({
      ...usuario,
      createdAt: now,
      updatedAt: now,
      ultimoAcceso: undefined
    }));

    await db.collection('usuarios').insertMany(usuariosConTimestamp);
    log(`Se insertaron ${usuarios.length} usuarios en la colección 'usuarios'`);

    log('Sembrado de datos en MongoDB completado con éxito');
    return true;
  } catch (error) {
    log(`Error al sembrar datos en MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Exportar función para llamarla desde otros archivos
export default seedMongoDB;