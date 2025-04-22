import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./components/layout/layout";

// Importación simulada de nuestras páginas (las crearemos más adelante)
// Para simplificar, temporalmente las definimos como componentes básicos
const DashboardPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Bienvenido al sistema de gestión de inventario Violetta</p></div>;
const ProductosPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Gestión de Productos</h1></div>;
const ClientesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Gestión de Clientes</h1></div>;
const TransaccionesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Transacciones</h1></div>;
const ReportesPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1></div>;
const ConfiguracionPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Configuración</h1></div>;
const AuthPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Iniciar Sesión</h1></div>;

function Router() {
  // Simulamos un estado de autenticación (siempre autenticado para este ejemplo)
  const isAuthenticated = true;

  return (
    <Layout>
      <Switch>
        {/* Ruta pública */}
        <Route path="/auth" component={AuthPage} />

        {/* Rutas protegidas */}
        {isAuthenticated && (
          <>
            <Route path="/" component={DashboardPage} />
            <Route path="/productos" component={ProductosPage} />
            <Route path="/clientes" component={ClientesPage} />
            <Route path="/transacciones" component={TransaccionesPage} />
            <Route path="/reportes" component={ReportesPage} />
            <Route path="/configuracion" component={ConfiguracionPage} />
          </>
        )}

        {/* Ruta 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
