import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import {
  NewTicket,
  Ticket,
  BusPreset,
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
    quotation: {
      vendorId: 'v1',
      items: [
        { description: 'Front tyres replacement', cost: 200 },
        { description: 'Labour', cost: 50 },
      ],
      totalCost: 250,
      status: 'approved',
    },
    approval: {
      approvedBy: 'supervisor@example.com',
      approvedAt: new Date(),
    },
    purchaseOrder: {
      orderNumber: 'PO123',
      orderedAt: new Date(),
    },
    payment: {
      paymentId: 'PAY123',
      paidAt: new Date(),
    },
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
    quotation: {
      vendorId: 'v2',
      items: [
        { description: 'Engine maintenance', cost: 300 },
        { description: 'Labour', cost: 75 },
      ],
      totalCost: 375,
      status: 'pending',
    },
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
  getBusPresets: () => BusPreset[];
  addBusPreset: (bus: BusPreset) => boolean;
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
  getBusPresets: () => BUS_PRESETS,
  addBusPreset: () => {
    throw new Error('addBusPreset not implemented');
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

  const value = {
    tickets,
    addTicket,
    updateTicket,
    getTicket,
    getBusPresets,
    addBusPreset,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

// Custom hook for using ticket context
export const useTickets = () => useContext(TicketContext);
