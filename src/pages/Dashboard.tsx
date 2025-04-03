
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCard } from "@/components/TicketCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, CalendarClock, ClipboardCheck, Ticket, WrenchIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();

  // Get view route based on user role
  const getViewRoute = () => {
    switch (user?.role) {
      case 'vendor':
        return '/vendor/tickets';
      case 'creator':
        return '/creator/tickets';
      case 'supervisor':
        return '/supervisor/tickets';
      case 'purchase':
        return '/purchase/summary';
      default:
        return '/';
    }
  };

  // Filter tickets based on user role
  const getRelevantTickets = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'vendor':
        return tickets.filter(ticket => 
          ticket.assignedVendor === user.email && 
          ['approved', 'acknowledged', 'repair_requested'].includes(ticket.status)
        );
      case 'creator':
        return tickets.filter(ticket => ticket.createdBy === user.email);
      case 'supervisor':
        return tickets.filter(ticket => 
          ticket.status === 'pending' || 
          ticket.status === 'repair_requested'
        );
      case 'purchase':
        return tickets.filter(ticket => 
          ticket.status === 'invoiced' || 
          ticket.status === 'completed'
        );
      default:
        return [];
    }
  };

  // Get dashboard stats
  const getDashboardStats = () => {
    if (!user) return {};

    const relevantTickets = getRelevantTickets();
    const totalTickets = relevantTickets.length;
    
    // Stats based on user role
    switch (user.role) {
      case 'vendor':
        return {
          totalTickets,
          pendingAction: relevantTickets.filter(t => 
            t.status === 'approved' || t.status === 'repair_requested'
          ).length,
          inProgress: relevantTickets.filter(t => 
            t.status === 'acknowledged'
          ).length,
          completed: tickets.filter(t => 
            t.assignedVendor === user.email && 
            (t.status === 'invoiced' || t.status === 'completed')
          ).length
        };
      case 'creator':
        return {
          totalTickets,
          pending: relevantTickets.filter(t => t.status === 'pending').length,
          approved: relevantTickets.filter(t => 
            t.status !== 'pending' && t.status !== 'completed'
          ).length,
          completed: relevantTickets.filter(t => t.status === 'completed').length
        };
      case 'supervisor':
        return {
          totalTickets: tickets.length,
          pendingApproval: tickets.filter(t => t.status === 'pending').length,
          repairRequests: tickets.filter(t => t.status === 'repair_requested').length,
          activeTickets: tickets.filter(t => 
            t.status !== 'pending' && t.status !== 'completed'
          ).length
        };
      case 'purchase':
        return {
          totalTickets: tickets.length,
          invoiced: tickets.filter(t => t.status === 'invoiced').length,
          completed: tickets.filter(t => t.status === 'completed').length,
          totalSpent: tickets
            .filter(t => t.finalCost !== undefined)
            .reduce((sum, t) => sum + (t.finalCost || 0), 0)
        };
      default:
        return {};
    }
  };

  const stats = getDashboardStats();
  const relevantTickets = getRelevantTickets();
  const viewRoute = getViewRoute();

  // Helper to render different stat cards based on user role
  const renderRoleSpecificStats = () => {
    if (!user) return null;

    switch (user.role) {
      case 'vendor':
        return (
          <>
            <StatCard 
              title="Pending Action" 
              value={stats.pendingAction} 
              description="Tickets needing your attention" 
              icon={<ClipboardCheck className="h-5 w-5 text-blue-500" />}
            />
            <StatCard 
              title="In Progress" 
              value={stats.inProgress} 
              description="Tickets you're working on" 
              icon={<WrenchIcon className="h-5 w-5 text-amber-500" />}
            />
            <StatCard 
              title="Completed" 
              value={stats.completed} 
              description="Invoiced or completed tickets" 
              icon={<Ticket className="h-5 w-5 text-green-500" />}
            />
          </>
        );
      
      case 'creator':
        return (
          <>
            <StatCard 
              title="Pending Approval" 
              value={stats.pending} 
              description="Awaiting supervisor approval" 
              icon={<ClipboardCheck className="h-5 w-5 text-amber-500" />}
            />
            <StatCard 
              title="In Progress" 
              value={stats.approved} 
              description="Currently being processed" 
              icon={<WrenchIcon className="h-5 w-5 text-blue-500" />}
            />
            <StatCard 
              title="Completed" 
              value={stats.completed} 
              description="Finished service tickets" 
              icon={<Ticket className="h-5 w-5 text-green-500" />}
            />
          </>
        );
      
      case 'supervisor':
        return (
          <>
            <StatCard 
              title="Pending Approval" 
              value={stats.pendingApproval} 
              description="Tickets awaiting your approval" 
              icon={<ClipboardCheck className="h-5 w-5 text-amber-500" />}
            />
            <StatCard 
              title="Repair Requests" 
              value={stats.repairRequests} 
              description="Additional repair approvals needed" 
              icon={<WrenchIcon className="h-5 w-5 text-red-500" />}
            />
            <StatCard 
              title="Active Tickets" 
              value={stats.activeTickets} 
              description="Tickets currently in progress" 
              icon={<Ticket className="h-5 w-5 text-blue-500" />}
            />
          </>
        );
      
      case 'purchase':
        return (
          <>
            <StatCard 
              title="Invoiced" 
              value={stats.invoiced} 
              description="Tickets awaiting payment" 
              icon={<ClipboardCheck className="h-5 w-5 text-purple-500" />}
            />
            <StatCard 
              title="Completed" 
              value={stats.completed} 
              description="Finished service tickets" 
              icon={<Ticket className="h-5 w-5 text-green-500" />}
            />
            <StatCard 
              title="Total Spent" 
              value={`$${stats.totalSpent?.toFixed(2)}`} 
              description="Overall maintenance costs" 
              icon={<Bus className="h-5 w-5 text-blue-500" />}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your bus service tickets today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Tickets" 
            value={stats.totalTickets} 
            description="All your tickets" 
            icon={<CalendarClock className="h-5 w-5 text-primary" />}
          />
          {renderRoleSpecificStats()}
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Tickets</TabsTrigger>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {relevantTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relevantTickets
                  .filter(ticket => ticket.status !== 'completed')
                  .slice(0, 6)
                  .map((ticket) => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      viewRoute={viewRoute}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No active tickets to display.</p>
                </CardContent>
              </Card>
            )}
            
            {relevantTickets.length > 6 && (
              <div className="flex justify-center">
                <Link to={viewRoute} className="text-primary hover:underline">
                  View all tickets
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {relevantTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relevantTickets
                  .slice(0, 6)
                  .map((ticket) => (
                    <TicketCard 
                      key={ticket.id} 
                      ticket={ticket} 
                      viewRoute={viewRoute}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No tickets to display.</p>
                </CardContent>
              </Card>
            )}
            
            {relevantTickets.length > 6 && (
              <div className="flex justify-center">
                <Link to={viewRoute} className="text-primary hover:underline">
                  View all tickets
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Helper component for stats cards
const StatCard = ({ title, value, description, icon }: { title: string; value: number | string; description: string; icon: React.ReactNode }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
