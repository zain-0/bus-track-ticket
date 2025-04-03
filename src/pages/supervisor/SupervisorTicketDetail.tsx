
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { TicketStatusBadge } from "@/components/TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { 
  CheckCheck, 
  FileText, 
  Clock, 
  Bus, 
  Calendar, 
  DollarSign, 
  ArrowLeft,
  User
} from "lucide-react";

const SupervisorTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, approveTicket, approveRepair } = useTickets();
  const navigate = useNavigate();
  
  const ticket = getTicketById(id || "");
  
  if (!ticket) {
    return (
      <MainLayout>
        <div className="py-10 text-center">
          <p>Ticket not found.</p>
          <Button onClick={() => navigate(-1)} variant="link">
            Go back
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const canApprove = ticket.status === "pending";
  const pendingRepairRequests = ticket.repairRequests?.filter(r => !r.approved) || [];
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tickets</span>
          </Button>
          <TicketStatusBadge status={ticket.status} />
        </div>
        
        {canApprove && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-amber-800">This ticket needs your approval</h3>
                <p className="text-sm text-amber-700">
                  Review the details and approve if everything is in order.
                </p>
              </div>
              <Button onClick={() => approveTicket(ticket.id)}>
                Approve Ticket
              </Button>
            </CardContent>
          </Card>
        )}
        
        {pendingRepairRequests.length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-red-800 mb-2">Pending repair requests</h3>
              <div className="space-y-3">
                {pendingRepairRequests.map(repair => (
                  <div key={repair.id} className="bg-white rounded-md p-3 border border-red-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Request {repair.id}</span>
                      <Button 
                        size="sm" 
                        onClick={() => approveRepair(ticket.id, repair.id)}
                      >
                        Approve
                      </Button>
                    </div>
                    <p className="text-sm mb-2">{repair.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Estimated cost:</span>
                      <span className="font-medium">${repair.estimatedCost.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Ticket ID: {ticket.id}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm">{ticket.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Bus className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Bus Details</h3>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3 text-sm">
                      <p><span className="font-medium">Number:</span> {ticket.bus.busNumber}</p>
                      <p><span className="font-medium">Route:</span> {ticket.bus.route}</p>
                      <p><span className="font-medium">Model:</span> {ticket.bus.model}</p>
                      <p><span className="font-medium">Year:</span> {ticket.bus.year}</p>
                      <p><span className="font-medium">Issue:</span> {ticket.bus.issue}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Participants</h3>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3 text-sm">
                      <p><span className="font-medium">Created by:</span> {ticket.createdBy}</p>
                      <p><span className="font-medium">Assigned vendor:</span> {ticket.assignedVendor}</p>
                      {ticket.approvedBy && (
                        <p><span className="font-medium">Approved by:</span> {ticket.approvedBy}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Timeline</h3>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3 text-sm">
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {format(ticket.createdAt, "PPp")}
                    </p>
                    {ticket.approvedAt && (
                      <p>
                        <span className="font-medium">Approved:</span>{" "}
                        {format(ticket.approvedAt, "PPp")}
                      </p>
                    )}
                    {ticket.acknowledgedAt && (
                      <p>
                        <span className="font-medium">Acknowledged:</span>{" "}
                        {format(ticket.acknowledgedAt, "PPp")}
                      </p>
                    )}
                    {ticket.completedAt && (
                      <p>
                        <span className="font-medium">Completed:</span>{" "}
                        {format(ticket.completedAt, "PPp")}
                      </p>
                    )}
                  </div>
                </div>
                
                {ticket.estimatedCost && (
                  <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="font-medium">Estimated Cost:</span>{" "}
                      ${ticket.estimatedCost.toFixed(2)}
                    </div>
                  </div>
                )}
                
                {ticket.finalCost && (
                  <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="font-medium">Final Cost:</span>{" "}
                      ${ticket.finalCost.toFixed(2)}
                    </div>
                  </div>
                )}
                
                {ticket.notes && ticket.notes.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <h3 className="font-medium">Notes</h3>
                      <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                        {ticket.notes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-80 space-y-6">
            {ticket.invoice && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount:</span>
                    <span>${ticket.invoice.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm mt-1">{ticket.invoice.description}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <p className="text-sm">{format(ticket.invoice.createdAt, "PPp")}</p>
                  </div>
                  {ticket.invoice.paidAt && (
                    <div className="bg-green-50 p-2 rounded flex items-center gap-2">
                      <CheckCheck className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-xs">Paid on</div>
                        <div className="text-sm font-medium">
                          {format(ticket.invoice.paidAt, "PPp")}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {ticket.repairRequests && ticket.repairRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Repair Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.repairRequests.map((repair) => (
                    <div 
                      key={repair.id} 
                      className={`p-3 rounded-md border ${
                        repair.approved ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Request {repair.id}</span>
                        {repair.approved ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{repair.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>Est. Cost:</span>
                        <span className="font-medium">${repair.estimatedCost.toFixed(2)}</span>
                      </div>
                      {repair.approvedBy && (
                        <div className="text-xs mt-2 text-muted-foreground">
                          Approved by {repair.approvedBy}
                        </div>
                      )}
                      {!repair.approved && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => approveRepair(ticket.id, repair.id)}
                        >
                          Approve Repair
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check isActive={true} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {format(ticket.createdAt, "PPp")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full ${ticket.approvedAt ? "bg-green-100" : "bg-muted"} flex items-center justify-center`}>
                    <Check isActive={!!ticket.approvedAt} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Approved</p>
                    {ticket.approvedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {format(ticket.approvedAt, "PPp")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full ${ticket.acknowledgedAt ? "bg-green-100" : "bg-muted"} flex items-center justify-center`}>
                    <Check isActive={!!ticket.acknowledgedAt} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Acknowledged</p>
                    {ticket.acknowledgedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {format(ticket.acknowledgedAt, "PPp")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full ${ticket.invoice ? "bg-green-100" : "bg-muted"} flex items-center justify-center`}>
                    <Check isActive={!!ticket.invoice} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Invoiced</p>
                    {ticket.invoice ? (
                      <p className="text-xs text-muted-foreground">
                        {format(ticket.invoice.createdAt, "PPp")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full ${ticket.completedAt ? "bg-green-100" : "bg-muted"} flex items-center justify-center`}>
                    <Check isActive={!!ticket.completedAt} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Completed</p>
                    {ticket.completedAt ? (
                      <p className="text-xs text-muted-foreground">
                        {format(ticket.completedAt, "PPp")}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pending</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Small check component for status timeline
const Check = ({ isActive }: { isActive: boolean }) => {
  return isActive ? (
    <CheckCheck className="h-3 w-3 text-green-600" />
  ) : (
    <Clock className="h-3 w-3 text-muted-foreground" />
  );
};

export default SupervisorTicketDetail;
