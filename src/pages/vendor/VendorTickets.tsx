
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
  const { getRelevantTickets } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get tickets assigned to the vendor
  const vendorTickets = getRelevantTickets();
  
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
    (ticket) => ticket.status === "acknowledged" || ticket.status === "quoted" || ticket.status === "quote_approved" || ticket.status === "quote_rejected"
  );
  
  const underServiceTickets = filteredTickets.filter(
    (ticket) => ticket.status === "under_service"
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
              Pending Action ({acknowledgedTickets.length})
            </TabsTrigger>
            <TabsTrigger value="under_service">
              Under Service ({underServiceTickets.length})
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
                    No new tickets requiring your acknowledgment.
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
                    No tickets currently requiring action.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="under_service">
            {underServiceTickets.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {underServiceTickets.map((ticket) => (
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
                    No tickets currently under service.
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
