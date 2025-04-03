
import { useState } from "react";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DollarSign, Calendar, Ticket } from "lucide-react";
import { format } from "date-fns";

const PurchaseSummary = () => {
  const { tickets } = useTickets();
  const [timeFrame, setTimeFrame] = useState("all");
  
  // Filter invoiced or completed tickets
  const financialTickets = tickets.filter(t => 
    t.status === "invoiced" || t.status === "completed"
  );
  
  // Get financial metrics
  const totalSpent = financialTickets.reduce((sum, ticket) => 
    sum + (ticket.finalCost || 0), 0
  );
  
  const averageCost = financialTickets.length > 0 
    ? totalSpent / financialTickets.length 
    : 0;
  
  // Filter tickets based on time frame
  const getFilteredTickets = () => {
    const now = new Date();
    
    switch(timeFrame) {
      case "week":
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return financialTickets.filter(t => 
          new Date(t.invoice?.createdAt || t.createdAt) >= weekAgo
        );
      case "month":
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return financialTickets.filter(t => 
          new Date(t.invoice?.createdAt || t.createdAt) >= monthAgo
        );
      case "quarter":
        const quarterAgo = new Date();
        quarterAgo.setMonth(now.getMonth() - 3);
        return financialTickets.filter(t => 
          new Date(t.invoice?.createdAt || t.createdAt) >= quarterAgo
        );
      case "all":
      default:
        return financialTickets;
    }
  };
  
  const filteredTickets = getFilteredTickets();
  
  // Prepare data for charts
  // Costs by bus
  const costsByBus = filteredTickets.reduce((acc: any[], ticket) => {
    const existingBus = acc.find(b => b.name === ticket.bus.busNumber);
    if (existingBus) {
      existingBus.cost += ticket.finalCost || 0;
    } else {
      acc.push({
        name: ticket.bus.busNumber,
        cost: ticket.finalCost || 0
      });
    }
    return acc;
  }, []);
  
  costsByBus.sort((a, b) => b.cost - a.cost);
  
  // Costs by issue type
  const costsByIssueType = filteredTickets.reduce((acc: any[], ticket) => {
    // Simple categorization based on ticket title keywords
    let category = "Other";
    
    const title = ticket.title.toLowerCase();
    if (title.includes("engine") || title.includes("transmission")) {
      category = "Engine/Transmission";
    } else if (title.includes("brake") || title.includes("wheel")) {
      category = "Brakes/Wheels";
    } else if (title.includes("door") || title.includes("window")) {
      category = "Doors/Windows";
    } else if (title.includes("a/c") || title.includes("air") || title.includes("heat")) {
      category = "HVAC";
    } else if (title.includes("maintenance")) {
      category = "Regular Maintenance";
    }
    
    const existingCategory = acc.find(c => c.name === category);
    if (existingCategory) {
      existingCategory.value += ticket.finalCost || 0;
    } else {
      acc.push({
        name: category,
        value: ticket.finalCost || 0
      });
    }
    return acc;
  }, []);
  
  // Define colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff5724'];
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Summary</h1>
          <p className="text-muted-foreground">
            Track and analyze costs for bus maintenance and repairs.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            description="Total expenses for maintenance"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
          />
          <MetricCard
            title="Average Cost per Ticket"
            value={`$${averageCost.toFixed(2)}`}
            description="Average maintenance cost"
            icon={<Ticket className="h-5 w-5 text-blue-600" />}
          />
          <MetricCard
            title="Total Tickets"
            value={`${filteredTickets.length}`}
            description="Completed and invoiced tickets"
            icon={<Calendar className="h-5 w-5 text-amber-600" />}
          />
        </div>
        
        <Tabs defaultValue="costs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="tickets">Completed Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="costs" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="pt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Costs by Bus</CardTitle>
                  <CardDescription>
                    Maintenance costs for each bus
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {costsByBus.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={costsByBus}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="cost" fill="#0ea5e9" name="Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="pt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Cost Distribution by Issue Type</CardTitle>
                  <CardDescription>
                    Breakdown of costs by maintenance type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {costsByIssueType.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costsByIssueType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {costsByIssueType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Recently Completed Tickets</CardTitle>
                <CardDescription>
                  Details of invoiced and completed maintenance tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">Ticket ID</th>
                          <th className="py-3 px-4 text-left">Title</th>
                          <th className="py-3 px-4 text-left">Bus</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-right">Cost</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets
                          .sort((a, b) => new Date(b.invoice?.createdAt || 0).getTime() - new Date(a.invoice?.createdAt || 0).getTime())
                          .map(ticket => (
                            <tr key={ticket.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{ticket.id}</td>
                              <td className="py-3 px-4">{ticket.title}</td>
                              <td className="py-3 px-4">{ticket.bus.busNumber}</td>
                              <td className="py-3 px-4">
                                {ticket.invoice?.createdAt 
                                  ? format(ticket.invoice.createdAt, "MM/dd/yyyy") 
                                  : "N/A"}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">
                                ${(ticket.finalCost || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                    ticket.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {ticket.status === "completed" ? "Completed" : "Invoiced"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/purchase/tickets/${ticket.id}`}>
                                    View
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-muted-foreground">No completed or invoiced tickets found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Helper component for metric cards
const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode 
}) => {
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

export default PurchaseSummary;
