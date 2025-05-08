import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./components/layout/layout";

// Importación de las páginas del sistema
import DashboardPage from "./pages/inventory/DashboardPage";
import ProductosPage from "./pages/inventory/ProductosPage";
import ClientesPage from "./pages/inventory/ClientesPage";
import TransaccionesPage from "./pages/inventory/TransaccionesPage";
import ReportesPage from "./pages/inventory/ReportesPage";
import ConfiguracionPage from "./pages/inventory/ConfiguracionPage";
import DatabasePage from "./pages/configuration/DatabasePage";

// Página de autenticación
const AuthPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Iniciar Sesión</h1><p>Esta página de autenticación se implementará próximamente</p></div>;

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
