
import { useState } from "react";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, subMonths, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const PurchaseReports = () => {
  const { tickets } = useTickets();
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("expense-by-vendor");
  
  const filteredTickets = tickets.filter(ticket => {
    if (!startDate || !endDate || !ticket.createdAt) return false;
    
    const ticketDate = new Date(ticket.createdAt);
    return isWithinInterval(ticketDate, {
      start: startOfDay(startDate),
      end: endOfDay(endDate)
    });
  });
  
  // Expense by vendor report data
  const expenseByVendor = filteredTickets.reduce((acc: Record<string, number>, ticket) => {
    const vendorName = ticket.assignedVendor;
    const cost = ticket.finalCost || ticket.estimatedCost || 0;
    
    if (!acc[vendorName]) {
      acc[vendorName] = 0;
    }
    
    acc[vendorName] += cost;
    return acc;
  }, {});
  
  // Expense by bus report data
  const expenseByBus = filteredTickets.reduce((acc: Record<string, number>, ticket) => {
    const busNumber = ticket.bus.busNumber;
    const cost = ticket.finalCost || ticket.estimatedCost || 0;
    
    if (!acc[busNumber]) {
      acc[busNumber] = 0;
    }
    
    acc[busNumber] += cost;
    return acc;
  }, {});
  
  // Expense by service type report data
  const expenseByServiceType = filteredTickets.reduce((acc: Record<string, number>, ticket) => {
    const serviceType = ticket.serviceType || "unspecified";
    const cost = ticket.finalCost || ticket.estimatedCost || 0;
    
    if (!acc[serviceType]) {
      acc[serviceType] = 0;
    }
    
    acc[serviceType] += cost;
    return acc;
  }, {});
  
  const renderReport = () => {
    switch (reportType) {
      case "expense-by-vendor":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expense</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(expenseByVendor).map(([vendor, amount]) => {
                const totalExpense = Object.values(expenseByVendor).reduce((sum, val) => sum + val, 0);
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : "0";
                
                return (
                  <tr key={vendor}>
                    <td className="px-6 py-4 whitespace-nowrap">{vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      
      case "expense-by-bus":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expense</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(expenseByBus).map(([busNumber, amount]) => {
                const totalExpense = Object.values(expenseByBus).reduce((sum, val) => sum + val, 0);
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : "0";
                
                return (
                  <tr key={busNumber}>
                    <td className="px-6 py-4 whitespace-nowrap">{busNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      
      case "expense-by-service-type":
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expense</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(expenseByServiceType).map(([serviceType, amount]) => {
                const totalExpense = Object.values(expenseByServiceType).reduce((sum, val) => sum + val, 0);
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : "0";
                
                return (
                  <tr key={serviceType}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {serviceType === "minor" ? "Minor Service" :
                       serviceType === "major" ? "Major Service" :
                       serviceType === "repair" ? "Repair" :
                       serviceType === "other" ? "Other" : serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      
      default:
        return <p className="text-center py-10">Select a report type</p>;
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate detailed financial reports for bus maintenance and repairs.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense-by-vendor">Expense by Vendor</SelectItem>
                    <SelectItem value="expense-by-bus">Expense by Bus</SelectItem>
                    <SelectItem value="expense-by-service-type">Expense by Service Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <Button>Generate Report</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "expense-by-vendor" && "Expenses by Vendor"}
              {reportType === "expense-by-bus" && "Expenses by Bus"}
              {reportType === "expense-by-service-type" && "Expenses by Service Type"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTickets.length > 0 ? (
              <div className="overflow-x-auto">
                {renderReport()}
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No data available for the selected date range</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PurchaseReports;
