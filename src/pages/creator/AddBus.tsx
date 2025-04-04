
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Bus, Wrench } from "lucide-react";

const AddBus = () => {
  const { addBusPreset } = useTickets();
  const navigate = useNavigate();
  
  const [busNumber, setBusNumber] = useState("");
  const [fleetNumber, setFleetNumber] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [year, setYear] = useState("");
  
  // Service interval fields
  const [engineServiceInterval, setEngineServiceInterval] = useState<number>(0);
  const [tyreServiceInterval, setTyreServiceInterval] = useState<number>(0);
  const [acServiceInterval, setAcServiceInterval] = useState<number>(0);
  const [transmissionServiceInterval, setTransmissionServiceInterval] = useState<number>(0);
  const [brakePadServiceInterval, setBrakePadServiceInterval] = useState<number>(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!busNumber || !model || !manufacturer || !year) {
      toast.error("Bus number, model, manufacturer and year are required");
      return;
    }
    
    const busData = {
      busNumber,
      fleetNumber,
      chassisNumber,
      registrationNumber,
      model,
      manufacturer,
      year,
      engineServiceInterval,
      tyreServiceInterval,
      acServiceInterval,
      transmissionServiceInterval,
      brakePadServiceInterval
    };
    
    // Check if addBusPreset function exists in the context
    if (addBusPreset) {
      const success = addBusPreset(busData);
      
      if (success) {
        toast.success(`Bus ${busNumber} added successfully`);
        navigate("/dashboard");
      } else {
        toast.error("Failed to add bus or bus already exists");
      }
    } else {
      toast.error("Bus management functionality is not available");
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6 py-6">
        <div className="flex items-center">
          <Bus className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold tracking-tight">Add New Bus</h1>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Bus Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bus-number">Bus Number *</Label>
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
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="model">Bus Model *</Label>
                  <Input
                    id="model"
                    placeholder="Model of the bus"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    placeholder="Bus manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    placeholder="Year of manufacture"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-md font-medium mb-3">Service Intervals (KMS)</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="engine-service" className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" /> Engine
                    </Label>
                    <Input
                      id="engine-service"
                      type="number"
                      placeholder="Engine service interval"
                      value={engineServiceInterval || ""}
                      onChange={(e) => setEngineServiceInterval(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tyre-service" className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" /> Tyre
                    </Label>
                    <Input
                      id="tyre-service"
                      type="number"
                      placeholder="Tyre service interval"
                      value={tyreServiceInterval || ""}
                      onChange={(e) => setTyreServiceInterval(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ac-service" className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" /> AC
                    </Label>
                    <Input
                      id="ac-service"
                      type="number"
                      placeholder="AC service interval"
                      value={acServiceInterval || ""}
                      onChange={(e) => setAcServiceInterval(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission-service" className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" /> Transmission
                    </Label>
                    <Input
                      id="transmission-service"
                      type="number"
                      placeholder="Transmission service interval"
                      value={transmissionServiceInterval || ""}
                      onChange={(e) => setTransmissionServiceInterval(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brakepad-service" className="flex items-center gap-1">
                      <Wrench className="h-4 w-4" /> Brake Pad
                    </Label>
                    <Input
                      id="brakepad-service"
                      type="number"
                      placeholder="Brake pad service interval"
                      value={brakePadServiceInterval || ""}
                      onChange={(e) => setBrakePadServiceInterval(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Add Bus</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddBus;
