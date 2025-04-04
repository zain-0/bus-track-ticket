
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Bus, Ticket, Users, ClipboardCheck, DollarSign, LogOut, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: <Bus className="w-5 h-5 mr-2" />,
        showTo: ['vendor', 'creator', 'supervisor', 'purchase'],
      }
    ];
    
    const roleItems = {
      vendor: [
        {
          name: "My Tickets",
          href: "/vendor/tickets",
          icon: <Ticket className="w-5 h-5 mr-2" />,
          showTo: ['vendor'],
        },
      ],
      creator: [
        {
          name: "Create Ticket",
          href: "/creator/create",
          icon: <Ticket className="w-5 h-5 mr-2" />,
          showTo: ['creator'],
        },
        {
          name: "My Tickets",
          href: "/creator/tickets",
          icon: <ClipboardCheck className="w-5 h-5 mr-2" />,
          showTo: ['creator'],
        },
      ],
      supervisor: [
        {
          name: "Pending Approvals",
          href: "/supervisor/approvals",
          icon: <ClipboardCheck className="w-5 h-5 mr-2" />,
          showTo: ['supervisor'],
        },
        {
          name: "All Tickets",
          href: "/supervisor/tickets",
          icon: <Ticket className="w-5 h-5 mr-2" />,
          showTo: ['supervisor'],
        },
      ],
      purchase: [
        {
          name: "Financial Summary",
          href: "/purchase/summary",
          icon: <DollarSign className="w-5 h-5 mr-2" />,
          showTo: ['purchase'],
        },
        {
          name: "Reports",
          href: "/purchase/reports",
          icon: <FileText className="w-5 h-5 mr-2" />,
          showTo: ['purchase'],
        },
      ]
    };
    
    let items = [...baseItems];
    
    if (user && user.role in roleItems) {
      items = [...items, ...roleItems[user.role as keyof typeof roleItems]];
    }
    
    // Filter items based on user role
    return items.filter(item => !user || item.showTo.includes(user.role));
  };
  
  const navItems = getNavItems();
  
  return (
    <Sidebar className="h-screen">
      <SidebarHeader className="px-4 py-2 border-b">
        <div className="flex items-center">
          <Bus className="h-6 w-6 text-bus-blue" />
          <span className="ml-2 text-lg font-semibold">Bus Track System</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm",
                        location.pathname === item.href 
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "hover:bg-sidebar-accent/50"
                      )}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 mb-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full flex items-center justify-center"
            asChild
          >
            <Link to="/login">
              <User className="w-4 h-4 mr-2" />
              Login
            </Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
