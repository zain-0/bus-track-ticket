
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, TicketStatus, Invoice, RepairRequest } from '@/types/ticket';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

// Sample data for tickets
const DEMO_TICKETS: Ticket[] = [
  {
    id: 'T001',
    title: 'Engine Overheating',
    description: 'Bus engine overheating during long routes',
    status: 'pending',
    priority: 'high',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-03-15T10:30:00'),
    assignedVendor: 'vendor@example.com',
    bus: {
      busNumber: 'B12345',
      route: 'Downtown - Airport',
      model: 'Mercedes Citaro',
      year: '2020',
      issue: 'Engine cooling system failure'
    },
    estimatedCost: 1200
  },
  {
    id: 'T002',
    title: 'Brake System Inspection',
    description: 'Regular brake system inspection required',
    status: 'approved',
    priority: 'medium',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-03-10T14:45:00'),
    assignedVendor: 'vendor@example.com',
    approvedBy: 'supervisor@example.com',
    approvedAt: new Date('2025-03-12T09:20:00'),
    bus: {
      busNumber: 'B45678',
      route: 'Central - Suburbs',
      model: 'Volvo 7900',
      year: '2019',
      issue: 'Brake system maintenance'
    },
    estimatedCost: 800
  },
  {
    id: 'T003',
    title: 'Door Mechanism Repair',
    description: 'Front door not closing properly',
    status: 'acknowledged',
    priority: 'medium',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-03-05T11:15:00'),
    assignedVendor: 'vendor@example.com',
    approvedBy: 'supervisor@example.com',
    approvedAt: new Date('2025-03-06T10:10:00'),
    acknowledgedAt: new Date('2025-03-07T08:30:00'),
    bus: {
      busNumber: 'B78901',
      route: 'Express Line 2',
      model: 'MAN Lion\'s City',
      year: '2021',
      issue: 'Front door mechanism failure'
    },
    estimatedCost: 500
  },
  {
    id: 'T004',
    title: 'Annual Maintenance',
    description: 'Complete annual maintenance service',
    status: 'invoiced',
    priority: 'low',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-02-28T09:00:00'),
    assignedVendor: 'vendor@example.com',
    approvedBy: 'supervisor@example.com',
    approvedAt: new Date('2025-03-01T14:00:00'),
    acknowledgedAt: new Date('2025-03-02T08:15:00'),
    bus: {
      busNumber: 'B23456',
      route: 'City Circle',
      model: 'Solaris Urbino 12',
      year: '2018',
      issue: 'Scheduled annual maintenance'
    },
    invoice: {
      id: 'INV001',
      amount: 1500,
      description: 'Annual maintenance service completed',
      createdAt: new Date('2025-03-09T16:30:00')
    },
    estimatedCost: 1500,
    finalCost: 1500
  },
  {
    id: 'T005',
    title: 'A/C System Malfunction',
    description: 'Air conditioning not working in passenger area',
    status: 'repair_requested',
    priority: 'high',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-03-18T13:20:00'),
    assignedVendor: 'vendor@example.com',
    approvedBy: 'supervisor@example.com',
    approvedAt: new Date('2025-03-19T11:45:00'),
    acknowledgedAt: new Date('2025-03-20T09:10:00'),
    bus: {
      busNumber: 'B34567',
      route: 'North - South Express',
      model: 'Scania Citywide',
      year: '2022',
      issue: 'A/C compressor failure'
    },
    repairRequests: [
      {
        id: 'R001',
        description: 'Complete A/C compressor replacement required',
        estimatedCost: 2200,
        approved: false
      }
    ],
    estimatedCost: 1800
  },
  {
    id: 'T006',
    title: 'Transmission Service',
    description: 'Transmission issues when shifting gears',
    status: 'completed',
    priority: 'high',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-02-20T08:30:00'),
    assignedVendor: 'vendor@example.com',
    approvedBy: 'supervisor@example.com',
    approvedAt: new Date('2025-02-21T10:20:00'),
    acknowledgedAt: new Date('2025-02-22T09:45:00'),
    completedAt: new Date('2025-03-01T14:30:00'),
    bus: {
      busNumber: 'B56789',
      route: 'Airport Express',
      model: 'Mercedes Citaro G',
      year: '2020',
      issue: 'Transmission control unit malfunction'
    },
    invoice: {
      id: 'INV002',
      amount: 3200,
      description: 'Transmission repair completed with parts replacement',
      createdAt: new Date('2025-02-28T16:15:00'),
      paidAt: new Date('2025-03-05T10:45:00')
    },
    notes: [
      'Initial diagnosis showed transmission control unit failure',
      'Parts ordered on Feb 23',
      'Repair completed and tested on Feb 28'
    ],
    estimatedCost: 3000,
    finalCost: 3200
  }
];

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  approveTicket: (ticketId: string) => void;
  acknowledgeTicket: (ticketId: string) => void;
  submitInvoice: (ticketId: string, invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  requestRepair: (ticketId: string, repairRequest: Omit<RepairRequest, 'id' | 'approved'>) => void;
  approveRepair: (ticketId: string, repairId: string) => void;
  completeTicket: (ticketId: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  addTicket: () => {},
  updateTicketStatus: () => {},
  approveTicket: () => {},
  acknowledgeTicket: () => {},
  submitInvoice: () => {},
  requestRepair: () => {},
  approveRepair: () => {},
  completeTicket: () => {},
  getTicketById: () => undefined,
});

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { user } = useAuth();

  // Load demo tickets on mount
  useEffect(() => {
    // Try to get from localStorage first
    const storedTickets = localStorage.getItem('busSystemTickets');
    if (storedTickets) {
      // Parse dates correctly when loading from localStorage
      const parsedTickets = JSON.parse(storedTickets, (key, value) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
        if (typeof value === 'string' && datePattern.test(value)) {
          return new Date(value);
        }
        return value;
      });
      setTickets(parsedTickets);
    } else {
      // Use demo tickets if none found in storage
      setTickets(DEMO_TICKETS);
    }
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('busSystemTickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  // Add a new ticket
  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    if (!user) {
      toast.error('You must be logged in to create a ticket');
      return;
    }

    const newTicket: Ticket = {
      ...ticket,
      id: `T${String(tickets.length + 7).padStart(3, '0')}`,
      createdAt: new Date(),
      status: 'pending'
    };

    setTickets((prev) => [...prev, newTicket]);
    toast.success('Ticket created successfully');
  };

  // Update ticket status
  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );
    toast.success(`Ticket status updated to ${status}`);
  };

  // Approve ticket (supervisor only)
  const approveTicket = (ticketId: string) => {
    if (!user || user.role !== 'supervisor') {
      toast.error('Only supervisors can approve tickets');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'approved',
              approvedBy: user.email,
              approvedAt: new Date()
            }
          : ticket
      )
    );
    toast.success('Ticket approved successfully');
  };

  // Acknowledge ticket (vendor only)
  const acknowledgeTicket = (ticketId: string) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can acknowledge tickets');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'acknowledged',
              acknowledgedAt: new Date()
            }
          : ticket
      )
    );
    toast.success('Ticket acknowledged successfully');
  };

  // Submit invoice (vendor only)
  const submitInvoice = (ticketId: string, invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can submit invoices');
      return;
    }

    const newInvoice: Invoice = {
      ...invoice,
      id: `INV${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      createdAt: new Date()
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'invoiced',
              invoice: newInvoice,
              finalCost: invoice.amount
            }
          : ticket
      )
    );
    toast.success('Invoice submitted successfully');
  };

  // Request repair (vendor only)
  const requestRepair = (ticketId: string, repairRequest: Omit<RepairRequest, 'id' | 'approved'>) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can request repairs');
      return;
    }

    const newRepairRequest: RepairRequest = {
      ...repairRequest,
      id: `R${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      approved: false
    };

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const currentRepairRequests = ticket.repairRequests || [];
          return {
            ...ticket,
            status: 'repair_requested',
            repairRequests: [...currentRepairRequests, newRepairRequest]
          };
        }
        return ticket;
      })
    );
    toast.success('Repair request submitted successfully');
  };

  // Approve repair (supervisor only)
  const approveRepair = (ticketId: string, repairId: string) => {
    if (!user || user.role !== 'supervisor') {
      toast.error('Only supervisors can approve repairs');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId && ticket.repairRequests) {
          return {
            ...ticket,
            status: 'acknowledged',
            repairRequests: ticket.repairRequests.map((request) =>
              request.id === repairId
                ? {
                    ...request,
                    approved: true,
                    approvedBy: user.email,
                    approvedAt: new Date()
                  }
                : request
            )
          };
        }
        return ticket;
      })
    );
    toast.success('Repair request approved');
  };

  // Complete ticket
  const completeTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'completed',
              completedAt: new Date()
            }
          : ticket
      )
    );
    toast.success('Ticket marked as completed');
  };

  // Get ticket by ID
  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const value = {
    tickets,
    addTicket,
    updateTicketStatus,
    approveTicket,
    acknowledgeTicket,
    submitInvoice,
    requestRepair,
    approveRepair,
    completeTicket,
    getTicketById
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTickets = () => useContext(TicketContext);
