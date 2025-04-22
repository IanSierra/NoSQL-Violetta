import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { MongoClient } from "mongodb";
import path from "path";
import { fileURLToPath } from 'url';

// ES Modules equivalente a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string - esto se podría mover a variables de entorno
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "violetta_db";

// Variable global para la conexión de MongoDB
export let mongoClient: MongoClient | null = null;
export let db: any = null;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// Función para conectar a MongoDB (simulada para este ejemplo)
async function connectToMongoDB() {
  try {
    log("Conectando a MongoDB (simulado)...");
    
    // En una implementación real, aquí se conectaría a MongoDB
    // Para nuestro ejemplo, usaremos la implementación en memoria
    
    // Si quisiéramos conectar a una instancia real de MongoDB:
    // mongoClient = new MongoClient(MONGO_URI);
    // await mongoClient.connect();
    // db = mongoClient.db(MONGO_DB_NAME);
    
    log("Conexión a MongoDB (simulada) establecida");
    return true;
  } catch (error) {
    log(`Error al conectar a MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

(async () => {
  // Intentar conectar a MongoDB (simulado)
  await connectToMongoDB();
  
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
