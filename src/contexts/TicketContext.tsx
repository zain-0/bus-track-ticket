
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
  NewTicket,
  Ticket,
  BusPreset,
  RepairRequest,
  Invoice,
} from '@/types/ticket';

// Mock data for demonstration
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    title: 'Replace front tyres',
    description: 'Front tyres are worn out and need replacement',
    status: 'open',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'creator@example.com',
    assignedVendor: 'vendor@example.com',
    serviceType: 'repair',
    repairCategory: 'tyre_replacement',
    bus: {
      busNumber: '123',
      fleetNumber: 'F123',
      chassisNumber: 'C123',
      registrationNumber: 'R123',
      route: '',
      model: 'ABC Model',
      manufacturer: 'ABC Manufacturer',
      year: '2018',
      issue: 'Tyre worn out',
      engineServiceInterval: 5000,
      tyreServiceInterval: 10000,
      acServiceInterval: 2000,
      transmissionServiceInterval: 15000,
      brakePadServiceInterval: 7000,
    },
    quotations: [
      {
        vendorId: 'v1',
        price: 250,
        description: 'Front tyres replacement and labour',
        status: 'approved'
      }
    ],
    approvedQuotation: {
      vendorId: 'v1',
      price: 250,
      description: 'Front tyres replacement and labour',
      status: 'approved'
    },
    estimatedCost: 250,
    finalCost: 250,
  },
  {
    id: '2',
    title: 'Engine maintenance',
    description: 'Engine is making strange noises',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'creator@example.com',
    assignedVendor: 'vendor@example.com',
    serviceType: 'major',
    bus: {
      busNumber: '456',
      fleetNumber: 'F456',
      chassisNumber: 'C456',
      registrationNumber: 'R456',
      route: '',
      model: 'XYZ Model',
      manufacturer: 'XYZ Manufacturer',
      year: '2020',
      issue: 'Engine noise',
      engineServiceInterval: 5000,
      tyreServiceInterval: 10000,
      acServiceInterval: 2000,
      transmissionServiceInterval: 15000,
      brakePadServiceInterval: 7000,
    },
    quotations: [
      {
        vendorId: 'v2',
        price: 375,
        description: 'Engine maintenance and labour',
        status: 'pending'
      }
    ],
    estimatedCost: 375,
  },
  {
    id: '3',
    title: 'AC repair',
    description: 'AC is not cooling',
    status: 'pending_vendor',
    priority: 'low',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'creator@example.com',
    assignedVendor: 'vendor@example.com',
    serviceType: 'repair',
    repairCategory: 'ac_repair',
    bus: {
      busNumber: '789',
      fleetNumber: 'F789',
      chassisNumber: 'C789',
      registrationNumber: 'R789',
      route: '',
      model: 'PQR Model',
      manufacturer: 'PQR Manufacturer',
      year: '2022',
      issue: 'AC not cooling',
      engineServiceInterval: 5000,
      tyreServiceInterval: 10000,
      acServiceInterval: 2000,
      transmissionServiceInterval: 15000,
      brakePadServiceInterval: 7000,
    },
  },
];

const BUS_PRESETS: BusPreset[] = [
  {
    busNumber: '123',
    fleetNumber: 'F123',
    chassisNumber: 'C123',
    registrationNumber: 'R123',
    model: 'ABC Model',
    manufacturer: 'ABC Manufacturer',
    year: '2018',
    engineServiceInterval: 5000,
    tyreServiceInterval: 10000,
    acServiceInterval: 2000,
    transmissionServiceInterval: 15000,
    brakePadServiceInterval: 7000,
  },
  {
    busNumber: '456',
    fleetNumber: 'F456',
    chassisNumber: 'C456',
    registrationNumber: 'R456',
    model: 'XYZ Model',
    manufacturer: 'XYZ Manufacturer',
    year: '2020',
    engineServiceInterval: 5000,
    tyreServiceInterval: 10000,
    acServiceInterval: 2000,
    transmissionServiceInterval: 15000,
    brakePadServiceInterval: 7000,
  },
  {
    busNumber: '789',
    fleetNumber: 'F789',
    chassisNumber: 'C789',
    registrationNumber: 'R789',
    model: 'PQR Model',
    manufacturer: 'PQR Manufacturer',
    year: '2022',
    engineServiceInterval: 5000,
    tyreServiceInterval: 10000,
    acServiceInterval: 2000,
    transmissionServiceInterval: 15000,
    brakePadServiceInterval: 7000,
  },
];

// Define ticket context type
interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: NewTicket) => Ticket;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  getTicket: (id: string) => Ticket | undefined;
  getTicketById: (id: string) => Ticket | undefined;
  getBusPresets: () => BusPreset[];
  addBusPreset: (bus: BusPreset) => boolean;
  getRelevantTickets: () => Ticket[];
  approveTicket: (id: string) => void;
  rejectTicket: (id: string) => void;
  acknowledgeTicket: (id: string) => void;
  submitInvoice: (id: string, invoice: Omit<Invoice, 'id'>) => void;
  completeTicket: (id: string) => void;
  requestRepair: (id: string, repair: Omit<RepairRequest, 'id' | 'approved' | 'createdAt'>) => void;
  approveRepair: (ticketId: string, repairId: string) => void;
  requestRepairWithInvoice: (id: string, repair: Omit<RepairRequest, 'id' | 'approved' | 'createdAt'>, invoice: Omit<Invoice, 'id'>) => void;
}

// Create ticket context
const TicketContext = createContext<TicketContextType>({
  tickets: [],
  addTicket: () => {
    throw new Error('addTicket not implemented');
  },
  updateTicket: () => {
    throw new Error('updateTicket not implemented');
  },
  getTicket: () => {
    throw new Error('getTicket not implemented');
  },
  getTicketById: () => {
    throw new Error('getTicketById not implemented');
  },
  getBusPresets: () => BUS_PRESETS,
  addBusPreset: () => {
    throw new Error('addBusPreset not implemented');
  },
  getRelevantTickets: () => {
    throw new Error('getRelevantTickets not implemented');
  },
  approveTicket: () => {
    throw new Error('approveTicket not implemented');
  },
  rejectTicket: () => {
    throw new Error('rejectTicket not implemented');
  },
  acknowledgeTicket: () => {
    throw new Error('acknowledgeTicket not implemented');
  },
  submitInvoice: () => {
    throw new Error('submitInvoice not implemented');
  },
  completeTicket: () => {
    throw new Error('completeTicket not implemented');
  },
  requestRepair: () => {
    throw new Error('requestRepair not implemented');
  },
  approveRepair: () => {
    throw new Error('approveRepair not implemented');
  },
  requestRepairWithInvoice: () => {
    throw new Error('requestRepairWithInvoice not implemented');
  },
});

// Create ticket provider component
export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  // Add a ticket
  const addTicket = (ticket: NewTicket): Ticket => {
    const newTicket: Ticket = {
      ...ticket,
      id: uuidv4(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets([...tickets, newTicket]);
    toast.success(`Ticket "${newTicket.title}" created successfully`);
    return newTicket;
  };

  // Update a ticket
  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === id) {
          return { ...ticket, ...updates, updatedAt: new Date() };
        }
        return ticket;
      })
    );
    toast.success(`Ticket "${id}" updated successfully`);
  };

  // Get a ticket by ID
  const getTicket = (id: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.id === id);
  };

  // Alias for getTicket
  const getTicketById = getTicket;

  const getBusPresets = () => BUS_PRESETS;

  // Add a function to add a bus preset
  const addBusPreset = (bus: BusPreset): boolean => {
    try {
      // Check if bus with same number already exists
      const exists = BUS_PRESETS.some(b => b.busNumber === bus.busNumber);
      if (exists) {
        toast.error(`Bus with number ${bus.busNumber} already exists`);
        return false;
      }
      
      // Add the bus to presets
      BUS_PRESETS.push(bus);
      toast.success(`Bus ${bus.busNumber} added successfully`);
      return true;
    } catch (error) {
      console.error("Failed to add bus preset:", error);
      return false;
    }
  };
  
  // Get relevant tickets based on user role
  const getRelevantTickets = () => {
    // This is a stub - in a real app, this would filter based on the user's role
    return tickets;
  };

  // Approve a ticket
  const approveTicket = (id: string) => {
    updateTicket(id, { 
      status: 'approved', 
      approvedAt: new Date() 
    });
    toast.success(`Ticket "${id}" approved successfully`);
  };

  // Reject a ticket
  const rejectTicket = (id: string) => {
    updateTicket(id, { status: 'rejected' });
    toast.error(`Ticket "${id}" rejected`);
  };

  // Acknowledge a ticket
  const acknowledgeTicket = (id: string) => {
    updateTicket(id, { 
      status: 'acknowledged', 
      acknowledgedAt: new Date() 
    });
    toast.success(`Ticket "${id}" acknowledged successfully`);
  };

  // Submit invoice for a ticket
  const submitInvoice = (id: string, invoiceData: Omit<Invoice, 'id'>) => {
    const invoice = {
      ...invoiceData,
      id: uuidv4()
    };
    updateTicket(id, { 
      status: 'invoiced', 
      invoice,
      finalCost: invoiceData.amount
    });
    toast.success(`Invoice submitted for ticket "${id}"`);
  };

  // Complete a ticket
  const completeTicket = (id: string) => {
    updateTicket(id, { 
      status: 'completed', 
      completedAt: new Date()
    });
    toast.success(`Ticket "${id}" completed`);
  };

  // Request additional repair
  const requestRepair = (id: string, repairData: Omit<RepairRequest, 'id' | 'approved' | 'createdAt'>) => {
    const ticket = getTicket(id);
    if (!ticket) return;
    
    const repair: RepairRequest = {
      ...repairData,
      id: uuidv4(),
      approved: false,
      createdAt: new Date()
    };
    
    const repairRequests = ticket.repairRequests ? [...ticket.repairRequests, repair] : [repair];
    updateTicket(id, { 
      status: 'repair_requested',
      repairRequests
    });
    toast.success(`Repair request submitted for ticket "${id}"`);
  };

  // Approve a repair request
  const approveRepair = (ticketId: string, repairId: string) => {
    const ticket = getTicket(ticketId);
    if (!ticket || !ticket.repairRequests) return;
    
    const updatedRepairs = ticket.repairRequests.map(repair => 
      repair.id === repairId ? { ...repair, approved: true } : repair
    );
    
    updateTicket(ticketId, { 
      repairRequests: updatedRepairs,
      status: 'approved'
    });
    toast.success(`Repair request approved for ticket "${ticketId}"`);
  };

  // Request repair with invoice
  const requestRepairWithInvoice = (
    id: string, 
    repairData: Omit<RepairRequest, 'id' | 'approved' | 'createdAt'>,
    invoiceData: Omit<Invoice, 'id'>
  ) => {
    const ticket = getTicket(id);
    if (!ticket) return;
    
    // Create repair request
    const repair: RepairRequest = {
      ...repairData,
      id: uuidv4(),
      approved: false,
      createdAt: new Date()
    };
    
    // Create invoice
    const invoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    const repairRequests = ticket.repairRequests ? [...ticket.repairRequests, repair] : [repair];
    
    updateTicket(id, { 
      status: 'repair_requested',
      repairRequests,
      invoice,
      finalCost: invoiceData.amount
    });
    
    toast.success(`Repair request and invoice submitted for ticket "${id}"`);
  };

  const value = {
    tickets,
    addTicket,
    updateTicket,
    getTicket,
    getTicketById,
    getBusPresets,
    addBusPreset,
    getRelevantTickets,
    approveTicket,
    rejectTicket,
    acknowledgeTicket,
    submitInvoice,
    completeTicket,
    requestRepair,
    approveRepair,
    requestRepairWithInvoice,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

// Custom hook for using ticket context
export const useTickets = () => useContext(TicketContext);
