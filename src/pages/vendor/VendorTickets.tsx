
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { TicketCard } from "@/components/TicketCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const VendorTickets = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tickets assigned to the vendor
  const vendorTickets = tickets.filter(
    (ticket) => ticket.assignedVendor === user?.email
  );
  
  // Filter tickets based on search query
  const filteredTickets = vendorTickets.filter((ticket) => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Categorize tickets by status
  const newTickets = filteredTickets.filter(
    (ticket) => ticket.status === "approved"
  );
  
  const acknowledgedTickets = filteredTickets.filter(
    (ticket) => ticket.status === "acknowledged"
  );
  
  const repairTickets = filteredTickets.filter(
    (ticket) => ticket.status === "repair_requested"
  );
  
  const completedTickets = filteredTickets.filter(
    (ticket) =>
      ticket.status === "invoiced" || ticket.status === "completed"
  );
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            Manage and view all the tickets assigned to you.
          </p>
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
        
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="new">
              New Tickets ({newTickets.length})
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              In Progress ({acknowledgedTickets.length})
            </TabsTrigger>
            <TabsTrigger value="repair">
              Repair Requested ({repairTickets.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTickets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            {newTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {newTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/vendor/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No new tickets requiring your attention.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="acknowledged">
            {acknowledgedTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {acknowledgedTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/vendor/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No tickets currently in progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="repair">
            {repairTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repairTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    viewRoute="/vendor/tickets"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No pending repair requests.
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
                    viewRoute="/vendor/tickets"
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

export default VendorTickets;
