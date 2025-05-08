import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from 'url';
import seedMongoDB from './seed-data';

// ES Modules equivalente a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string - esto se podría mover a variables de entorno
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "violetta_db";

// Para entornos de prueba/desarrollo, usamos una URI dedicada a pruebas
if (process.env.NODE_ENV === 'development') {
  // Esta URI se puede usar para pruebas locales o en la nube
  // Para desarrollo local, mantenemos localhost
  // Para nube, se puede usar un servicio gratuito como MongoDB Atlas
  log(`Ambiente de desarrollo detectado, usando configuración de MongoDB para desarrollo`);
}

// Variable global para la conexión de MongoDB
export let mongoClient: MongoClient | null = null;
export let db: any = null;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inicializar la bandera de conexión a MongoDB
app.set("mongoConnected", false);

// Middleware para logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Función para conectar a MongoDB
async function connectToMongoDB() {
  try {
    log("Conectando a MongoDB...");
    
    // Conectar a MongoDB con un timeout de 5 segundos
    mongoClient = new MongoClient(MONGO_URI, { 
      serverSelectionTimeoutMS: 5000 // 5 segundos de timeout
    });
    await mongoClient.connect();
    db = mongoClient.db(MONGO_DB_NAME);
    
    log("Conexión a MongoDB establecida");
    
    // Crear índices en colecciones si no existen
    await createIndexes();
    
    // Establecer la bandera en la aplicación
    app.set("mongoConnected", true);
    
    return true;
  } catch (error) {
    log(`Error al conectar a MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// Función para crear índices en las colecciones
async function createIndexes() {
  try {
    // Crear índices para mejor rendimiento en consultas frecuentes
    if (db) {
      // Índices para productos
      await db.collection('productos').createIndex({ nombre: 1 });
      await db.collection('productos').createIndex({ categoria: 1 });
      await db.collection('productos').createIndex({ estado: 1 });
      
      // Índices para clientes
      await db.collection('clientes').createIndex({ nombre: 1 });
      await db.collection('clientes').createIndex({ email: 1 }, { unique: true });
      
      // Índices para transacciones
      await db.collection('transacciones').createIndex({ "cliente._id": 1 });
      await db.collection('transacciones').createIndex({ fecha: 1 });
      await db.collection('transacciones').createIndex({ tipo: 1 });
      await db.collection('transacciones').createIndex({ estado: 1 });
      
      // Índices para usuarios
      await db.collection('usuarios').createIndex({ email: 1 }, { unique: true });
      
      // Índices para eventos
      await db.collection('eventos').createIndex({ "usuario._id": 1 });
      await db.collection('eventos').createIndex({ fecha: 1 });
      await db.collection('eventos').createIndex({ "entidad._id": 1 });
      
      log("Índices creados en las colecciones de MongoDB");
    }
  } catch (error) {
    log(`Error al crear índices: ${error instanceof Error ? error.message : String(error)}`);
  }
}

(async () => {
  // Intentar conectar a MongoDB en segundo plano
  // No esperamos, para no bloquear el inicio del servidor
  connectToMongoDB().then(connected => {
    if (connected) {
      log("MongoDB está disponible y listo para usar");
      
      // Sembrar datos iniciales si es necesario
      seedMongoDB().then(seeded => {
        if (seeded) {
          log("Datos iniciales sembrados en MongoDB");
        }
      });
    } else {
      log("El servidor está usando almacenamiento en memoria");
    }
  });
  
  // Registrar rutas de la API
  const server = await registerRoutes(app);

  // Middleware de manejo de errores
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Error Interno del Servidor";

    res.status(status).json({ message });
    console.error(err);
  });

  // Ruta para manejar cualquier solicitud que no coincida con las rutas definidas anteriormente
  // Vite se encargará de esto en desarrollo
  if (app.get("env") !== "development") {
    app.get("*", (req, res) => {
      res.send("Sistema de Gestión de Inventario Violetta");
    });
  }

  // Configuración Vite
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Iniciar servidor
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Servidor Violetta Inventario iniciado en el puerto ${port}`);
    log(`http://localhost:${port}`);
  });
  
  // Manejador de cierre del servidor
  process.on("SIGINT", async () => {
    log("Cerrando servidor...");
    
    // Cerrar la conexión a MongoDB si existe
    if (mongoClient) {
      await mongoClient.close();
      log("Conexión a MongoDB cerrada");
    }
    
    process.exit(0);
  });
})();
