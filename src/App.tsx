
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";
import AuthRequired from "@/components/AuthRequired";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Vendor pages
import VendorTickets from "./pages/vendor/VendorTickets";
import VendorTicketDetail from "./pages/vendor/VendorTicketDetail";

// Creator pages
import CreateTicket from "./pages/creator/CreateTicket";
import CreatorTickets from "./pages/creator/CreatorTickets";
import CreatorTicketDetail from "./pages/creator/CreatorTicketDetail";

// Supervisor pages
import SupervisorApprovals from "./pages/supervisor/SupervisorApprovals";
import SupervisorTickets from "./pages/supervisor/SupervisorTickets";
import SupervisorTicketDetail from "./pages/supervisor/SupervisorTicketDetail";

// Purchase pages
import PurchaseSummary from "./pages/purchase/PurchaseSummary";
import PurchaseTicketDetail from "./pages/purchase/PurchaseTicketDetail";
import PurchaseReports from "./pages/purchase/PurchaseReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TicketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Dashboard (accessible by all logged in users) */}
              <Route path="/dashboard" element={
                <AuthRequired>
                  <Dashboard />
                </AuthRequired>
              } />
              
              {/* Vendor routes */}
              <Route path="/vendor/tickets" element={
                <AuthRequired allowedRoles={["vendor"]}>
                  <VendorTickets />
                </AuthRequired>
              } />
              <Route path="/vendor/tickets/:id" element={
                <AuthRequired allowedRoles={["vendor"]}>
                  <VendorTicketDetail />
                </AuthRequired>
              } />
              
              {/* Creator routes */}
              <Route path="/creator/create" element={
                <AuthRequired allowedRoles={["creator"]}>
                  <CreateTicket />
                </AuthRequired>
              } />
              <Route path="/creator/tickets" element={
                <AuthRequired allowedRoles={["creator"]}>
                  <CreatorTickets />
                </AuthRequired>
              } />
              <Route path="/creator/tickets/:id" element={
                <AuthRequired allowedRoles={["creator"]}>
                  <CreatorTicketDetail />
                </AuthRequired>
              } />
              
              {/* Supervisor routes */}
              <Route path="/supervisor/approvals" element={
                <AuthRequired allowedRoles={["supervisor"]}>
                  <SupervisorApprovals />
                </AuthRequired>
              } />
              <Route path="/supervisor/tickets" element={
                <AuthRequired allowedRoles={["supervisor"]}>
                  <SupervisorTickets />
                </AuthRequired>
              } />
              <Route path="/supervisor/tickets/:id" element={
                <AuthRequired allowedRoles={["supervisor"]}>
                  <SupervisorTicketDetail />
                </AuthRequired>
              } />
              
              {/* Purchase routes */}
              <Route path="/purchase/summary" element={
                <AuthRequired allowedRoles={["purchase"]}>
                  <PurchaseSummary />
                </AuthRequired>
              } />
              <Route path="/purchase/tickets/:id" element={
                <AuthRequired allowedRoles={["purchase"]}>
                  <PurchaseTicketDetail />
                </AuthRequired>
              } />
              <Route path="/purchase/reports" element={
                <AuthRequired allowedRoles={["purchase"]}>
                  <PurchaseReports />
                </AuthRequired>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TicketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
