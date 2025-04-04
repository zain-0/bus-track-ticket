
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '@/contexts/TicketContext';
import MainLayout from '@/components/MainLayout';
import { TicketStatusBadge } from '@/components/TicketStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

const VendorTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicketById, acknowledgeTicket, submitInvoice, requestRepair, requestRepairWithInvoice } = useTickets();
  
  const [activeTab, setActiveTab] = useState('details');
  const [note, setNote] = useState('');
  const [submitCombined, setSubmitCombined] = useState(false);
  
  // Get ticket details
  const ticket = id ? getTicketById(id) : undefined;
  
  if (!ticket) {
    return (
      <MainLayout>
        <div className="py-6">
          <h1 className="text-3xl font-bold tracking-tight">Ticket not found</h1>
          <Button onClick={() => navigate('/vendor/tickets')} className="mt-4">Back to Tickets</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Form schema for repair request
  const repairSchema = z.object({
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    estimatedCost: z.coerce.number().min(1, { message: "Cost must be greater than 0" }),
  });
  
  const repairForm = useForm<z.infer<typeof repairSchema>>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      description: "",
      estimatedCost: 0,
    },
  });
  
  // Form schema for invoice
  const invoiceSchema = z.object({
    amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  });
  
  const invoiceForm = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      amount: ticket.estimatedCost || 0,
      description: "",
    },
  });
  
  // Handle ticket acknowledgment
  const handleAcknowledge = () => {
    if (id) {
      acknowledgeTicket(id);
    }
  };
  
  // Handle invoice submission
  const onInvoiceSubmit = (data: z.infer<typeof invoiceSchema>) => {
    if (id) {
      if (submitCombined) {
        const repairData = repairForm.getValues();
        requestRepairWithInvoice(
          id, 
          { 
            description: repairData.description, 
            estimatedCost: repairData.estimatedCost 
          }, 
          data
        );
      } else {
        submitInvoice(id, {
          amount: data.amount,
          description: data.description,
        });
      }
      setActiveTab('details');
    }
  };
  
  // Handle repair request
  const onRepairSubmit = (data: z.infer<typeof repairSchema>) => {
    if (id) {
      if (submitCombined) {
        const invoiceData = invoiceForm.getValues();
        requestRepairWithInvoice(
          id, 
          data, 
          { 
            amount: invoiceData.amount, 
            description: invoiceData.description
          }
        );
      } else {
        requestRepair(id, {
          description: data.description,
          estimatedCost: data.estimatedCost,
        });
      }
      setActiveTab('details');
    }
  };
  
  // Determine what actions are available based on ticket status
  const canAcknowledge = ticket.status === 'approved';
  const canSubmitInvoice = ticket.status === 'acknowledged' || ticket.status === 'repair_requested';
  const canRequestRepair = ticket.status === 'acknowledged';
  
  return (
    <MainLayout>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{ticket.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <TicketStatusBadge status={ticket.status} />
              <span className="text-sm text-muted-foreground">
                Ticket #{ticket.id}
              </span>
              <span className="text-sm text-muted-foreground">
                Created on {ticket.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="space-x-2">
            {canAcknowledge && (
              <Button onClick={handleAcknowledge}>
                Acknowledge Ticket
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/vendor/tickets')}>
              Back to Tickets
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Ticket Details</TabsTrigger>
            {canSubmitInvoice && <TabsTrigger value="invoice">Submit Invoice</TabsTrigger>}
            {canRequestRepair && <TabsTrigger value="repair">Request Repair</TabsTrigger>}
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bus Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Bus Number</p>
                    <p className="text-lg">{ticket.bus.busNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-lg">{ticket.bus.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Year</p>
                    <p className="text-lg">{ticket.bus.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Issue</p>
                    <p className="text-lg">{ticket.bus.issue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="mt-1">{ticket.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Service Type</p>
                    <p className="capitalize">{ticket.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="capitalize">{ticket.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Cost</p>
                    <p>${ticket.estimatedCost?.toFixed(2) || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {ticket.repairRequests && ticket.repairRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Repair Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.repairRequests.map((repair) => (
                    <div key={repair.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Request #{repair.id}</h4>
                        <span className={repair.approved ? "text-green-600" : "text-amber-600"}>
                          {repair.approved ? "Approved" : "Pending Approval"}
                        </span>
                      </div>
                      <p className="mt-2">{repair.description}</p>
                      <p className="mt-1 text-sm">Estimated cost: ${repair.estimatedCost.toFixed(2)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {ticket.invoice && (
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Invoice #{ticket.invoice.id}</p>
                      <p className="mt-1">Amount: ${ticket.invoice.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="mt-1">{ticket.invoice.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submitted On</p>
                      <p className="mt-1">{ticket.invoice.createdAt.toLocaleDateString()}</p>
                    </div>
                    {ticket.invoice.paidAt && (
                      <div>
                        <p className="text-sm font-medium">Paid On</p>
                        <p className="mt-1">{ticket.invoice.paidAt.toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {canSubmitInvoice && (
            <TabsContent value="invoice">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Invoice</CardTitle>
                  <CardDescription>
                    Enter the invoice details for the completed work
                  </CardDescription>
                </CardHeader>
                <Form {...invoiceForm}>
                  <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={invoiceForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={invoiceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the work completed"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {canRequestRepair && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="request-repair-too"
                            checked={submitCombined}
                            onCheckedChange={(checked) => {
                              setSubmitCombined(checked === true);
                              if (checked) {
                                setActiveTab('repair');
                              }
                            }}
                          />
                          <Label htmlFor="request-repair-too">
                            I also need to request additional repairs
                          </Label>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('details')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Invoice
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          )}
          
          {canRequestRepair && (
            <TabsContent value="repair">
              <Card>
                <CardHeader>
                  <CardTitle>Request Additional Repair</CardTitle>
                  <CardDescription>
                    Submit a request for additional repairs that require approval
                  </CardDescription>
                </CardHeader>
                <Form {...repairForm}>
                  <form onSubmit={repairForm.handleSubmit(onRepairSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={repairForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repair Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the needed repairs"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={repairForm.control}
                        name="estimatedCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Cost ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {canSubmitInvoice && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="submit-invoice-too"
                            checked={submitCombined}
                            onCheckedChange={(checked) => {
                              setSubmitCombined(checked === true);
                              if (checked) {
                                setActiveTab('invoice');
                              }
                            }}
                          />
                          <Label htmlFor="submit-invoice-too">
                            I also want to submit an invoice for completed work
                          </Label>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab('details')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Request
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <p className="font-medium">Ticket Created</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.createdAt.toLocaleString()}
                      </p>
                      <p className="text-sm">Created by {ticket.createdBy}</p>
                    </div>
                  </div>
                  
                  {ticket.approvedAt && (
                    <div className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <p className="font-medium">Ticket Approved</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.approvedAt.toLocaleString()}
                        </p>
                        <p className="text-sm">Approved by {ticket.approvedBy}</p>
                      </div>
                    </div>
                  )}
                  
                  {ticket.acknowledgedAt && (
                    <div className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <p className="font-medium">Ticket Acknowledged</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.acknowledgedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {ticket.repairRequests && ticket.repairRequests.map((repair) => (
                    <div key={repair.id} className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <p className="font-medium">Repair Request #{repair.id} Submitted</p>
                        {repair.approved && (
                          <>
                            <p className="text-sm text-muted-foreground">
                              Approved on {repair.approvedAt?.toLocaleString()}
                            </p>
                            <p className="text-sm">Approved by {repair.approvedBy}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {ticket.invoice && (
                    <div className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div>
                        <p className="font-medium">Invoice #{ticket.invoice.id} Submitted</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.invoice.createdAt.toLocaleString()}
                        </p>
                        {ticket.invoice.paidAt && (
                          <p className="text-sm">
                            Paid on {ticket.invoice.paidAt.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {ticket.completedAt && (
                    <div className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <p className="font-medium">Ticket Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.completedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VendorTicketDetail;
