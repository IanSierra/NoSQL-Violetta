import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Database, RefreshCw, Server } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Definir la estructura del objeto de estado del sistema
interface SystemStatus {
  sistema: string;
  version: string;
  storage: string;
  mongodb_connected: boolean;
  uptime: number;
}

export default function DatabasePage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Función para formatear el tiempo de actividad
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Función para refrescar los datos de estado
  const refreshStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/system/status');
      if (!response.ok) {
        throw new Error(`Error al obtener estado: ${response.statusText}`);
      }
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      toast({
        title: "Error",
        description: "No se pudo obtener el estado del sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    refreshStatus();
    // Configurar un refresco periódico cada 30 segundos
    const intervalId = setInterval(refreshStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración de Base de Datos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado del sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
              <CardDescription>
                Información sobre el estado actual del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              ) : status && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sistema:</span>
                    <span className="text-sm">{status.sistema} v{status.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiempo activo:</span>
                    <span className="text-sm">{formatUptime(status.uptime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Almacenamiento:</span>
                    <Badge variant={status.storage === "MongoDB" ? "default" : "outline"}>
                      {status.storage}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado MongoDB:</span>
                    <div className="flex items-center gap-2">
                      {status.mongodb_connected ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Conectado</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto flex items-center gap-2"
                onClick={refreshStatus}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </CardFooter>
          </Card>

          {/* Información de MongoDB */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Base de Datos MongoDB
              </CardTitle>
              <CardDescription>
                Información de la conexión a MongoDB
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              ) : status && (
                <div className="space-y-4">
                  {status.mongodb_connected ? (
                    <>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Conectado a MongoDB</AlertTitle>
                        <AlertDescription>
                          La conexión a MongoDB está establecida y operativa.
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Almacenamiento:</span>
                        <span className="text-sm">Datos persistentes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Modo:</span>
                        <span className="text-sm">Producción</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Usando almacenamiento en memoria</AlertTitle>
                        <AlertDescription>
                          El sistema está operando con datos temporales en memoria.
                          Los datos se perderán cuando el servidor se reinicie.
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Almacenamiento:</span>
                        <span className="text-sm">Datos temporales en memoria</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Modo:</span>
                        <span className="text-sm">Desarrollo/Fallback</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={true}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" /> 
                Configurar Conexión
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}