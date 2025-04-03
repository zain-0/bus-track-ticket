
import { useState } from "react";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { TicketCard } from "@/components/TicketCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const SupervisorTickets = () => {
  const { tickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter tickets based on search query and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Group tickets by status for the summary view
  const pendingCount = tickets.filter(t => t.status === "pending").length;
  const approvedCount = tickets.filter(t => t.status === "approved").length;
  const acknowledgedCount = tickets.filter(t => t.status === "acknowledged").length;
  const repairCount = tickets.filter(t => t.status === "repair_requested").length;
  const invoicedCount = tickets.filter(t => t.status === "invoiced").length;
  const completedCount = tickets.filter(t => t.status === "completed").length;
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">All Tickets</h1>
          <p className="text-muted-foreground">
            Monitor and manage all tickets in the system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard status="pending" count={pendingCount} />
          <StatusCard status="approved" count={approvedCount} />
          <StatusCard status="acknowledged" count={acknowledgedCount} />
          <StatusCard status="repair_requested" count={repairCount} />
          <StatusCard status="invoiced" count={invoicedCount} />
          <StatusCard status="completed" count={completedCount} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="repair_requested">Repair Requested</SelectItem>
                <SelectItem value="invoiced">Invoiced</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/supervisor/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No tickets match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {filteredTickets.filter(t => t.status !== "completed").length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets
                  .filter(t => t.status !== "completed")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      viewRoute="/supervisor/tickets"
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No active tickets match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {filteredTickets.filter(t => t.status === "completed").length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets
                  .filter(t => t.status === "completed")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      viewRoute="/supervisor/tickets"
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No completed tickets match your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Helper component for status summary cards
const StatusCard = ({ status, count }: { status: string; count: number }) => {
  const statusConfig: Record<string, { title: string; class: string }> = {
    pending: { 
      title: "Pending Approval", 
      class: "bg-amber-50 border-amber-200 text-amber-800" 
    },
    approved: { 
      title: "Approved", 
      class: "bg-green-50 border-green-200 text-green-800" 
    },
    acknowledged: { 
      title: "In Progress", 
      class: "bg-blue-50 border-blue-200 text-blue-800" 
    },
    repair_requested: { 
      title: "Repair Requested", 
      class: "bg-red-50 border-red-200 text-red-800" 
    },
    invoiced: { 
      title: "Invoiced", 
      class: "bg-purple-50 border-purple-200 text-purple-800" 
    },
    completed: { 
      title: "Completed", 
      class: "bg-gray-50 border-gray-200 text-gray-800" 
    },
  };

  const config = statusConfig[status] || { title: status, class: "" };

  return (
    <div className={`p-4 rounded-lg border ${config.class} flex justify-between items-center`}>
      <span>{config.title}</span>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );
};

export default SupervisorTickets;
