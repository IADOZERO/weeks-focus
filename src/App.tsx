import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import VisionPage from "./pages/VisionPage";
import ObjectivesPage from "./pages/ObjectivesPage";
import ExecutionPage from "./pages/ExecutionPage";
import PlanningPage from "./pages/PlanningPage";
import ReviewsPage from "./pages/ReviewsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/vision" element={
              <ProtectedRoute>
                <Layout>
                  <VisionPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/objectives" element={
              <ProtectedRoute>
                <Layout>
                  <ObjectivesPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/execution" element={
              <ProtectedRoute>
                <Layout>
                  <ExecutionPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/planning" element={
              <ProtectedRoute>
                <Layout>
                  <PlanningPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={
              <ProtectedRoute>
                <Layout>
                  <ReviewsPage />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
