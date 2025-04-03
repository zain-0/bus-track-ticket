
import { useParams, useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { TicketStatusBadge } from "@/components/TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { 
  CheckCheck, 
  ArrowLeft, 
  DollarSign, 
  Bus, 
  Calendar, 
  FileText, 
  Download
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const PurchaseTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, completeTicket } = useTickets();
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
  
  const handleMarkPaid = () => {
    if (id && ticket.status === "invoiced") {
      completeTicket(id);
      toast.success("Ticket marked as paid and completed");
    }
  };
  
  const handleDownloadInvoice = () => {
    // This would normally download the invoice PDF, but for demo purposes we just show a toast
    toast.info("Invoice download functionality would be implemented here");
  };
  
  const canComplete = ticket.status === "invoiced";
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Summary</span>
          </Button>
          <TicketStatusBadge status={ticket.status} />
        </div>
        
        {canComplete && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-medium text-purple-800">Invoice Pending Payment</h3>
                <p className="text-sm text-purple-700">
                  This invoice is ready to be processed for payment.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={handleDownloadInvoice} className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                <Button onClick={handleMarkPaid}>
                  Mark as Paid
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Ticket ID: {ticket.id}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm">{ticket.description}</p>
                </div>
                
                <Separator />
                
                {/* Financial Summary */}
                <div className="space-y-1">
                  <h3 className="font-medium mb-2">Financial Summary</h3>
                  <Card className="bg-muted/30 border">
                    <CardContent className="p-4 space-y-3">
                      {ticket.estimatedCost && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Estimated Cost:</span>
                          <span className="font-medium">${ticket.estimatedCost.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {ticket.finalCost && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Final Cost:</span>
                          <span className="font-medium">${ticket.finalCost.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {ticket.estimatedCost && ticket.finalCost && (
                        <>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Difference:</span>
                            <span className={`font-medium ${
                              ticket.finalCost > ticket.estimatedCost 
                                ? "text-red-600" 
                                : ticket.finalCost < ticket.estimatedCost 
                                ? "text-green-600" 
                                : ""
                            }`}>
                              ${(ticket.finalCost - ticket.estimatedCost).toFixed(2)}
                              {ticket.finalCost > ticket.estimatedCost && " (Over budget)"}
                              {ticket.finalCost < ticket.estimatedCost && " (Under budget)"}
                            </span>
                          </div>
                        </>
                      )}
                      
                      {ticket.repairRequests && ticket.repairRequests.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <h4 className="text-sm font-medium mb-1">Additional Repairs:</h4>
                          {ticket.repairRequests.map(repair => (
                            <div key={repair.id} className="flex justify-between items-center text-sm">
                              <span>- {repair.description}</span>
                              <span>${repair.estimatedCost.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-80 space-y-6">
            {ticket.invoice && (
              <Card className="border border-purple-200">
                <CardHeader className="bg-purple-50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-purple-700" />
                        Invoice
                      </div>
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleDownloadInvoice}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Invoice #:</span>
                      <span>{ticket.invoice.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Date:</span>
                      <span>{format(ticket.invoice.createdAt, "PP")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount:</span>
                      <span className="text-lg font-bold">${ticket.invoice.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm mt-1">{ticket.invoice.description}</p>
                  </div>
                  
                  {ticket.invoice.paidAt ? (
                    <div className="bg-green-50 p-2 rounded flex items-center gap-2">
                      <CheckCheck className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-xs">Paid on</div>
                        <div className="text-sm font-medium">
                          {format(ticket.invoice.paidAt, "PPp")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-2 rounded flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <div>
                        <div className="text-sm">Payment pending</div>
                      </div>
                    </div>
                  )}
                  
                  {canComplete && (
                    <Button 
                      className="w-full"
                      onClick={handleMarkPaid}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PurchaseTicketDetail;
