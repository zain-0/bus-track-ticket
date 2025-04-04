import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ServiceType } from "@/types/ticket";

const CreateTicket = () => {
  const { user, vendors, addVendor } = useAuth();
  const { addTicket, getBusPresets } = useTickets();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [serviceType, setServiceType] = useState<ServiceType>("minor");
  const [busNumber, setBusNumber] = useState("");
  const [fleetNumber, setFleetNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [route, setRoute] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");
  const [vendor, setVendor] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");
  const [newVendorContact, setNewVendorContact] = useState("");
  const [newVendorPhone, setNewVendorPhone] = useState("");
  
  const busPresets = getBusPresets();
  
  const handleBusSelect = (selectedBusNumber: string) => {
    const busPreset = busPresets.find(bus => bus.busNumber === selectedBusNumber);
    if (busPreset) {
      setBusNumber(busPreset.busNumber);
      setFleetNumber(busPreset.fleetNumber);
      setChassisNumber(busPreset.chassisNumber);
      setRegistrationNumber(busPreset.registrationNumber);
      setModel(busPreset.model);
      setYear(busPreset.year);
    }
  };
  
  const handleCreateVendor = () => {
    if (!newVendorName || !newVendorEmail) {
      toast.error("Vendor name and email are required");
      return;
    }
    
    const vendorData = {
      name: newVendorName,
      email: newVendorEmail,
      contactPerson: newVendorContact,
      phone: newVendorPhone
    };
    
    const newVendor = addVendor(vendorData);
    
    if (newVendor && typeof newVendor === 'object' && 'email' in newVendor) {
      setVendor(newVendor.email);
      setShowNewVendorDialog(false);
      
      setNewVendorName("");
      setNewVendorEmail("");
      setNewVendorContact("");
      setNewVendorPhone("");
    } else {
      toast.error("Failed to create vendor");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a ticket");
      return;
    }
    
    if (!title || !description || !busNumber || !route || !model || !year || !issue || !vendor || !serviceType) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const newTicket = {
      title,
      description,
      priority,
      serviceType,
      createdBy: user.email,
      assignedVendor: vendor,
      bus: {
        busNumber,
        fleetNumber,
        chassisNumber,
        registrationNumber,
        route,
        model,
        year,
        issue,
      },
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
    };
    
    addTicket(newTicket);
    navigate("/creator/tickets");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Ticket</h1>
          <p className="text-muted-foreground">
            Submit a new service ticket for bus maintenance or repair.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ticket Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief title describing the issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={serviceType} onValueChange={(value) => setServiceType(value as ServiceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="minor">Minor Service</SelectItem>
                        <SelectItem value="major">Major Service</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the problem or service needed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Bus Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bus-select">Select Bus</Label>
                    <Select onValueChange={handleBusSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bus to auto-fill details" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {busPresets.map((bus) => (
                            <SelectItem key={bus.busNumber} value={bus.busNumber}>
                              {bus.busNumber} - {bus.model} ({bus.year})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Select a bus to auto-fill the details below, or enter them manually
                    </p>
                  </div>
                
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bus-number">Bus Number</Label>
                      <Input
                        id="bus-number"
                        placeholder="Bus identification number"
                        value={busNumber}
                        onChange={(e) => setBusNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fleet-number">Fleet Number</Label>
                      <Input
                        id="fleet-number"
                        placeholder="Fleet number"
                        value={fleetNumber}
                        onChange={(e) => setFleetNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="chassis-number">Chassis Number</Label>
                      <Input
                        id="chassis-number"
                        placeholder="Chassis number"
                        value={chassisNumber}
                        onChange={(e) => setChassisNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration-number">Registration Number</Label>
                      <Input
                        id="registration-number"
                        placeholder="Registration number"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="route">Route</Label>
                      <Input
                        id="route"
                        placeholder="Bus route"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                      <Input
                        id="estimated-cost"
                        type="number"
                        step="0.01"
                        placeholder="0.00 (optional)"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="model">Bus Model</Label>
                      <Input
                        id="model"
                        placeholder="Model of the bus"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        placeholder="Year of manufacture"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issue">Issue Description</Label>
                    <Input
                      id="issue"
                      placeholder="Specific issue with the bus"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Vendor Assignment</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="vendor">Assign Vendor</Label>
                      <Dialog open={showNewVendorDialog} onOpenChange={setShowNewVendorDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" type="button" size="sm">
                            + Add New Vendor
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Vendor</DialogTitle>
                            <DialogDescription>
                              Enter the details for the new service vendor.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-vendor-name">Vendor Name</Label>
                              <Input
                                id="new-vendor-name"
                                placeholder="Company name"
                                value={newVendorName}
                                onChange={(e) => setNewVendorName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-vendor-email">Email</Label>
                              <Input
                                id="new-vendor-email"
                                type="email"
                                placeholder="contact@company.com"
                                value={newVendorEmail}
                                onChange={(e) => setNewVendorEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-vendor-contact">Contact Person</Label>
                              <Input
                                id="new-vendor-contact"
                                placeholder="Full name"
                                value={newVendorContact}
                                onChange={(e) => setNewVendorContact(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-vendor-phone">Phone Number</Label>
                              <Input
                                id="new-vendor-phone"
                                placeholder="(xxx) xxx-xxxx"
                                value={newVendorPhone}
                                onChange={(e) => setNewVendorPhone(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setShowNewVendorDialog(false)}>Cancel</Button>
                            <Button type="button" onClick={handleCreateVendor}>Add Vendor</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Select value={vendor} onValueChange={setVendor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {vendors.map((v) => (
                            <SelectItem key={v.id} value={v.email}>
                              {v.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateTicket;
