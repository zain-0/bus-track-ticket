
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { TicketCard } from "@/components/TicketCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CreatorTickets = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tickets created by the logged in user
  const creatorTickets = tickets.filter(
    (ticket) => ticket.createdBy === user?.email
  );
  
  // Filter tickets based on search query
  const filteredTickets = creatorTickets.filter((ticket) => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Categorize tickets by status
  const pendingTickets = filteredTickets.filter(
    (ticket) => ticket.status === "pending"
  );
  
  const inProgressTickets = filteredTickets.filter(
    (ticket) => ["approved", "acknowledged", "repair_requested", "invoiced"].includes(ticket.status)
  );
  
  const completedTickets = filteredTickets.filter(
    (ticket) => ticket.status === "completed"
  );
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Tickets</h1>
            <p className="text-muted-foreground">
              View and manage the service tickets you have created.
            </p>
          </div>
          <Button asChild>
            <Link to="/creator/create" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create New Ticket
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Tickets ({filteredTickets.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressTickets.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTickets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/creator/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No tickets found. Create your first ticket!
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/creator/create">Create Ticket</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/creator/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No pending tickets to display.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="in-progress">
            {inProgressTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inProgressTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/creator/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No in-progress tickets to display.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/creator/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No completed tickets to display.
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

export default CreatorTickets;
