
import { useState } from "react";
import { useTickets } from "@/contexts/TicketContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const PurchaseReports = () => {
  const { tickets, getTicketsByDate, getTicketsByVendor, getTicketsByBus } = useTickets();
  const { vendors } = useAuth();
  
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 3));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedBus, setSelectedBus] = useState<string>("");
  
  // Get unique bus numbers for the filter
  const busNumbers = Array.from(new Set(tickets.map(ticket => ticket.bus.busNumber)));
  
  // Get filtered tickets
  const getFilteredTickets = () => {
    let filtered = getTicketsByDate(startDate, endDate);
    
    if (selectedVendor) {
      filtered = filtered.filter(ticket => ticket.assignedVendor === selectedVendor);
    }
    
    if (selectedBus) {
      filtered = filtered.filter(ticket => ticket.bus.busNumber === selectedBus);
    }
    
    return filtered;
  };
  
  const filteredTickets = getFilteredTickets();
  
  // Calculate statistics
  const totalSpent = filteredTickets
    .filter(ticket => ticket.finalCost !== undefined)
    .reduce((sum, ticket) => sum + (ticket.finalCost || 0), 0);
    
  const averageCost = filteredTickets.length > 0 && totalSpent > 0 
    ? totalSpent / filteredTickets.length 
    : 0;
    
  const completedTickets = filteredTickets.filter(ticket => 
    ticket.status === 'completed' || ticket.status === 'invoiced'
  ).length;
  
  const repairedBuses = new Set(
    filteredTickets
      .filter(ticket => ticket.status === 'completed' || ticket.status === 'invoiced')
      .map(ticket => ticket.bus.busNumber)
  ).size;
  
  // Prepare chart data
  const prepareVendorCostData = () => {
    const vendorCosts = new Map<string, number>();
    
    filteredTickets
      .filter(ticket => ticket.finalCost !== undefined)
      .forEach(ticket => {
        const vendorEmail = ticket.assignedVendor;
        const vendor = vendors.find(v => v.email === vendorEmail);
        const vendorName = vendor ? vendor.name : vendorEmail;
        
        const currentCost = vendorCosts.get(vendorName) || 0;
        vendorCosts.set(vendorName, currentCost + (ticket.finalCost || 0));
      });
      
    return Array.from(vendorCosts.entries()).map(([name, amount]) => ({
      name,
      amount
    }));
  };
  
  const prepareServiceTypeData = () => {
    const serviceCosts = new Map<string, number>();
    
    filteredTickets
      .filter(ticket => ticket.finalCost !== undefined)
      .forEach(ticket => {
        const serviceType = ticket.serviceType || 'unknown';
        const currentCost = serviceCosts.get(serviceType) || 0;
        serviceCosts.set(serviceType, currentCost + (ticket.finalCost || 0));
      });
      
    return Array.from(serviceCosts.entries()).map(([type, amount]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      value: amount
    }));
  };
  
  const vendorCostData = prepareVendorCostData();
  const serviceTypeData = prepareServiceTypeData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Export report as CSV
  const exportReport = () => {
    const headers = ["Ticket ID", "Title", "Bus Number", "Vendor", "Status", "Created Date", "Completed Date", "Final Cost"];
    
    const data = filteredTickets.map(ticket => [
      ticket.id,
      ticket.title,
      ticket.bus.busNumber,
      vendors.find(v => v.email === ticket.assignedVendor)?.name || ticket.assignedVendor,
      ticket.status,
      format(ticket.createdAt, "yyyy-MM-dd"),
      ticket.completedAt ? format(ticket.completedAt, "yyyy-MM-dd") : "",
      ticket.finalCost ? `$${ticket.finalCost.toFixed(2)}` : ""
    ]);
    
    // Combine headers and data
    const csvContent = 
      [headers]
      .concat(data)
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ticket_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report downloaded successfully");
  };

  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and view reports on maintenance and repair costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Report Filters</CardTitle>
                <CardDescription>
                  Customize the data included in your reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <DatePicker 
                        date={startDate}
                        setDate={setStartDate} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <DatePicker 
                        date={endDate}
                        setDate={setEndDate} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vendor-filter">Filter by Vendor</Label>
                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                      <SelectTrigger>
                        <SelectValue placeholder="All vendors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All vendors</SelectItem>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.email}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bus-filter">Filter by Bus</Label>
                    <Select value={selectedBus} onValueChange={setSelectedBus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All buses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All buses</SelectItem>
                        {busNumbers.map((busNumber) => (
                          <SelectItem key={busNumber} value={busNumber}>
                            {busNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    onClick={exportReport}
                    disabled={filteredTickets.length === 0}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Total Spent</p>
                      <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Average Cost</p>
                      <p className="text-2xl font-bold">${averageCost.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Completed Tickets</p>
                      <p className="text-2xl font-bold">{completedTickets}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-muted-foreground text-sm">Buses Repaired</p>
                      <p className="text-2xl font-bold">{repairedBuses}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground pt-2">
                    {filteredTickets.length === 0 ? (
                      <p>No data available for the selected filters.</p>
                    ) : (
                      <p>Showing data for {filteredTickets.length} tickets.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="vendor" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendor">Cost by Vendor</TabsTrigger>
                <TabsTrigger value="service">Service Types</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vendor">
                <Card>
                  <CardHeader>
                    <CardTitle>Costs by Vendor</CardTitle>
                    <CardDescription>
                      Breakdown of expenses by service provider.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vendorCostData.length > 0 ? (
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={vendorCostData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 80,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: '#888' }} 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fill: '#888' }} />
                            <Tooltip 
                              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} 
                            />
                            <Legend />
                            <Bar dataKey="amount" name="Amount ($)" fill="#0088FE" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No cost data available for the selected filters.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="service">
                <Card>
                  <CardHeader>
                    <CardTitle>Costs by Service Type</CardTitle>
                    <CardDescription>
                      Distribution of expenses across service categories.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceTypeData.length > 0 ? (
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={serviceTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {serviceTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No service type data available for the selected filters.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PurchaseReports;
