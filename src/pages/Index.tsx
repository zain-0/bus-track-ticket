
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Check, DollarSign, ClipboardCheck, Users, Ticket } from "lucide-react";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      {/* Header and hero */}
      <header className="relative px-4 pt-6 lg:pt-10 pb-16 md:pb-24 mx-auto max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bus className="h-6 w-6 text-bus-blue" />
            <h1 className="ml-2 text-xl font-semibold">Bus Track System</h1>
          </div>
          <div>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 md:mt-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Bus Maintenance <span className="text-bus-blue">Tracking System</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your bus maintenance workflow with our comprehensive tracking system. 
            From service requests to invoicing and financial reporting.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Features */}
      <section className="py-12 md:py-16 bg-white">
        <div className="px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Role-Based Views</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Our system offers specialized views tailored for each participant in the maintenance workflow.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RoleCard 
              title="Service Creator" 
              description="Create maintenance tickets with detailed bus information and assign vendors."
              icon={<Ticket className="h-8 w-8 text-bus-blue" />}
              features={[
                "Create service tickets",
                "Track ticket progress",
                "View maintenance history",
              ]}
            />
            
            <RoleCard 
              title="Supervisor" 
              description="Review and approve maintenance tickets before they're sent to vendors."
              icon={<ClipboardCheck className="h-8 w-8 text-bus-purple" />}
              features={[
                "Approve service requests",
                "Review repair requests",
                "Monitor all tickets",
              ]}
            />
            
            <RoleCard 
              title="Vendor" 
              description="Acknowledge tickets, submit repair requests, and provide invoices."
              icon={<Users className="h-8 w-8 text-bus-orange" />}
              features={[
                "Acknowledge assignments",
                "Submit repair requests",
                "Generate invoices",
              ]}
            />
            
            <RoleCard 
              title="Purchase" 
              description="Track costs, view invoices, and generate financial reports."
              icon={<DollarSign className="h-8 w-8 text-green-600" />}
              features={[
                "View cost summaries",
                "Process invoices",
                "Track maintenance expenses",
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="px-4 mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center">
            <Bus className="h-5 w-5 text-bus-blue" />
            <span className="ml-2 text-lg font-medium">Bus Track System</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            © 2025 Bus Track System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper component for role cards
const RoleCard = ({ 
  title, 
  description, 
  icon, 
  features 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  features: string[];
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-sky-50 mb-3">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Index;
