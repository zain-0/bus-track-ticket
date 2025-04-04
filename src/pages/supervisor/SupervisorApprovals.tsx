
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, AlertTriangle, WrenchIcon, X } from "lucide-react";
import { TicketStatusBadge } from "@/components/TicketStatusBadge";
import { format } from "date-fns";

const SupervisorApprovals = () => {
  const { user } = useAuth();
  const { tickets, approveTicket, approveRepair, rejectTicket } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [ticketToReject, setTicketToReject] = useState<string | null>(null);
  
  // Filter pending approval tickets
  const pendingApprovalTickets = tickets.filter(
    (ticket) => ticket.status === "pending"
  );
  
  // Filter repair request tickets
  const repairRequestTickets = tickets.filter(
    (ticket) => ticket.status === "repair_requested"
  );
  
  // Filter based on search
  const filteredPendingTickets = pendingApprovalTickets.filter((ticket) => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRepairTickets = repairRequestTickets.filter((ticket) => 
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleApproveTicket = (ticketId: string) => {
    approveTicket(ticketId);
  };
  
  const handleRejectTicket = () => {
    if (!ticketToReject || !rejectionReason) return;
    
    rejectTicket(ticketToReject, rejectionReason);
    setTicketToReject(null);
    setRejectionReason("");
  };
  
  const handleApproveRepair = (ticketId: string, repairId: string) => {
    approveRepair(ticketId, repairId);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Pending Approvals</h1>
          <p className="text-muted-foreground">
            Manage tickets and repair requests that need your approval.
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
        
        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">
              New Tickets ({filteredPendingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="repairs">
              Repair Requests ({filteredRepairTickets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tickets">
            {filteredPendingTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredPendingTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{ticket.title}</CardTitle>
                        <TicketStatusBadge status={ticket.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">ID: {ticket.id}</div>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">Description</h4>
                          <p className="text-sm">{ticket.description}</p>
                          <div className="mt-3">
                            <h4 className="font-medium mb-1">Service Type</h4>
                            <p className="text-sm capitalize">{ticket.serviceType || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="md:w-1/3 space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Bus Details</h4>
                            <p className="text-sm">{ticket.bus.busNumber} - {ticket.bus.model}</p>
                            <p className="text-sm">Fleet: {ticket.bus.fleetNumber || 'N/A'}</p>
                            <p className="text-sm">Registration: {ticket.bus.registrationNumber || 'N/A'}</p>
                            <p className="text-sm">Issue: {ticket.bus.issue}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Requested by</h4>
                            <p className="text-sm">{ticket.createdBy}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(ticket.createdAt, "PPp")}
                            </p>
                          </div>
                          {ticket.estimatedCost && (
                            <div>
                              <h4 className="font-medium mb-1">Estimated Cost</h4>
                              <p className="text-sm">${ticket.estimatedCost.toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <p className="text-sm text-amber-800">This ticket requires your approval.</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Dialog open={ticketToReject === ticket.id} onOpenChange={(open) => {
                        if (!open) setTicketToReject(null);
                        if (open) setTicketToReject(ticket.id);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Ticket</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejection. This will be sent back to the creator.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Textarea
                              placeholder="Reason for rejection..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setTicketToReject(null)}>Cancel</Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleRejectTicket}
                              disabled={!rejectionReason.trim()}
                            >
                              Reject Ticket
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button onClick={() => handleApproveTicket(ticket.id)}>
                        Approve Ticket
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No tickets require your approval.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="repairs">
            {filteredRepairTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredRepairTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{ticket.title}</CardTitle>
                        <TicketStatusBadge status={ticket.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">ID: {ticket.id}</div>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">Original Issue</h4>
                          <p className="text-sm">{ticket.description}</p>
                          
                          {ticket.repairRequests && ticket.repairRequests.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <h4 className="font-medium">Repair Requests</h4>
                              {ticket.repairRequests.filter(r => !r.approved).map((repair) => (
                                <div key={repair.id} className="bg-red-50 border border-red-200 rounded-md p-3">
                                  <div className="flex justify-between mb-2">
                                    <span className="font-medium text-sm">Request {repair.id}</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                      Additional Repair
                                    </span>
                                  </div>
                                  <p className="text-sm mb-2">{repair.description}</p>
                                  <div className="flex justify-between text-sm">
                                    <span>Estimated Additional Cost:</span>
                                    <span className="font-medium">${repair.estimatedCost.toFixed(2)}</span>
                                  </div>
                                  <Button 
                                    className="w-full mt-3"
                                    onClick={() => handleApproveRepair(ticket.id, repair.id)}
                                  >
                                    Approve This Repair
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:w-1/3 space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Bus Details</h4>
                            <p className="text-sm">{ticket.bus.busNumber} - {ticket.bus.model}</p>
                            <p className="text-sm">Issue: {ticket.bus.issue}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Original Cost Estimate</h4>
                            <p className="text-sm">${ticket.estimatedCost?.toFixed(2) || "N/A"}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Vendor</h4>
                            <p className="text-sm">{ticket.assignedVendor}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md">
                        <WrenchIcon className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-800">Additional repairs need your approval.</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No repair requests require your approval.
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

export default SupervisorApprovals;
