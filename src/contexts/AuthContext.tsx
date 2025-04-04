
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

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
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

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('busTicketUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
