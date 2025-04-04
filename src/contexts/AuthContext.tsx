
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'vendor' | 'creator' | 'supervisor' | 'purchase' | 'guest';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define vendor type
export interface Vendor {
  id: string;
  name: string;
  email: string;
  contactPerson?: string;
  phone?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => Vendor; // Updated return type
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  vendors: [],
  addVendor: () => {
    throw new Error('addVendor not implemented');
    // Need to return a value here to satisfy TS, but this will never be called
    return {} as Vendor; 
  },
});

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Vendor User',
    email: 'vendor@example.com',
    role: 'vendor',
  },
  {
    id: '2',
    name: 'Service Creator',
    email: 'creator@example.com',
    role: 'creator',
  },
  {
    id: '3',
    name: 'Supervisor',
    email: 'supervisor@example.com',
    role: 'supervisor',
  },
  {
    id: '4',
    name: 'Purchase Manager',
    email: 'purchase@example.com',
    role: 'purchase',
  },
];

// Initial vendors
const initialVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Prime Bus Services',
    email: 'vendor@example.com',
    contactPerson: 'John Smith',
    phone: '555-123-4567',
  },
  {
    id: 'v2',
    name: 'City Mechanics Ltd',
    email: 'city@example.com',
    contactPerson: 'Mary Johnson',
    phone: '555-987-6543',
  }
];

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Check for stored user and vendors on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('busTicketUser');
    const storedVendors = localStorage.getItem('busTicketVendors');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedVendors) {
      setVendors(JSON.parse(storedVendors));
    } else {
      setVendors(initialVendors);
      localStorage.setItem('busTicketVendors', JSON.stringify(initialVendors));
    }
    
    setLoading(false);
  }, []);

  // Add vendor function - updated to explicitly return the new vendor
  const addVendor = (vendor: Omit<Vendor, 'id'>): Vendor => {
    const newVendor: Vendor = {
      ...vendor,
      id: `v${vendors.length + 1}`,
    };
    
    const updatedVendors = [...vendors, newVendor];
    setVendors(updatedVendors);
    localStorage.setItem('busTicketVendors', JSON.stringify(updatedVendors));
    toast.success(`Vendor ${newVendor.name} added successfully`);
    return newVendor;
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    // Simple validation for demo purposes
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Find user by email (simplified for demo)
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser && password === 'password') { // Simple password check for demo
      setUser(foundUser);
      localStorage.setItem('busTicketUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error('Invalid email or password');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('busTicketUser');
    toast.info('You have been logged out');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    vendors,
    addVendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
