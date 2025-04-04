import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, TicketStatus, Invoice, RepairRequest, ServiceType, Quotation } from '@/types/ticket';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Sample data for tickets
const DEMO_TICKETS: Ticket[] = [
  {
    id: 'T001',
    title: 'Engine Overheating',
    description: 'Bus engine overheating during long routes',
    status: 'pending',
    serviceType: 'major',
    priority: 'high',
    createdBy: 'creator@example.com',
    createdAt: new Date('2025-03-15T10:30:00'),
    assignedVendor: 'vendor@example.com',
    bus: {
      busNumber: 'B12345',
      fleetNumber: 'F001',
      chassisNumber: 'CH78901',
      registrationNumber: 'REG-001',
      route: 'Downtown - Airport',
      model: 'Mercedes Citaro',
      manufacturer: 'Mercedes',
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
    serviceType: 'minor',
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
      manufacturer: 'Volvo',
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
    serviceType: 'repair',
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
      manufacturer: 'MAN',
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
    serviceType: 'major',
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
      manufacturer: 'Solaris',
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
    serviceType: 'repair',
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
      manufacturer: 'Scania',
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
    serviceType: 'repair',
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
      manufacturer: 'Mercedes',
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

// Sample bus presets
export const BUS_PRESETS = [
  {
    busNumber: 'B12345',
    fleetNumber: 'F001',
    chassisNumber: 'CH78901',
    registrationNumber: 'REG-001',
    model: 'Mercedes Citaro',
    manufacturer: 'Mercedes',
    year: '2020',
    engineServiceInterval: 10000,
    tyreServiceInterval: 20000,
    acServiceInterval: 15000,
    transmissionServiceInterval: 30000,
    brakePadServiceInterval: 25000
  },
  {
    busNumber: 'B45678',
    fleetNumber: 'F002',
    chassisNumber: 'CH45612',
    registrationNumber: 'REG-002',
    model: 'Volvo 7900',
    manufacturer: 'Volvo',
    year: '2019',
    engineServiceInterval: 12000,
    tyreServiceInterval: 22000,
    acServiceInterval: 16000,
    transmissionServiceInterval: 35000,
    brakePadServiceInterval: 24000
  },
  {
    busNumber: 'B78901',
    fleetNumber: 'F003',
    chassisNumber: 'CH12345',
    registrationNumber: 'REG-003',
    model: 'MAN Lion\'s City',
    manufacturer: 'MAN',
    year: '2021',
    engineServiceInterval: 11000,
    tyreServiceInterval: 21000,
    acServiceInterval: 14000,
    transmissionServiceInterval: 32000,
    brakePadServiceInterval: 23000
  }
];

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  approveTicket: (ticketId: string) => void;
  rejectTicket: (ticketId: string, reason: string) => void;
  acknowledgeTicket: (ticketId: string) => void;
  submitQuotation: (ticketId: string, quotation: Omit<Quotation, 'id' | 'createdAt'>) => void;
  approveQuotation: (ticketId: string) => void;
  rejectQuotation: (ticketId: string, reason: string) => void;
  startService: (ticketId: string) => void;
  submitInvoice: (ticketId: string, invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  requestRepair: (ticketId: string, repairRequest: Omit<RepairRequest, 'id' | 'approved'>) => void;
  requestRepairWithInvoice: (ticketId: string, repairRequest: Omit<RepairRequest, 'id' | 'approved'>, invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  approveRepair: (ticketId: string, repairId: string) => void;
  completeTicket: (ticketId: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
  addNote: (ticketId: string, note: string) => void;
  getTicketsByDate: (startDate: Date, endDate: Date) => Ticket[];
  getTicketsByVendor: (vendorEmail: string) => Ticket[];
  getTicketsByBus: (busNumber: string) => Ticket[];
  getBusPresets: () => typeof BUS_PRESETS;
  getRelevantTickets: () => Ticket[];
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  addTicket: () => {},
  updateTicketStatus: () => {},
  approveTicket: () => {},
  rejectTicket: () => {},
  acknowledgeTicket: () => {},
  submitQuotation: () => {},
  approveQuotation: () => {},
  rejectQuotation: () => {},
  startService: () => {},
  submitInvoice: () => {},
  requestRepair: () => {},
  requestRepairWithInvoice: () => {},
  approveRepair: () => {},
  completeTicket: () => {},
  getTicketById: () => undefined,
  addNote: () => {},
  getTicketsByDate: () => [],
  getTicketsByVendor: () => [],
  getTicketsByBus: () => [],
  getBusPresets: () => BUS_PRESETS,
  getRelevantTickets: () => [],
});

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedTickets = localStorage.getItem('busSystemTickets');
    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets, (key, value) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
        if (typeof value === 'string' && datePattern.test(value)) {
          return new Date(value);
        }
        return value;
      });
      setTickets(parsedTickets);
    } else {
      setTickets(DEMO_TICKETS);
    }
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('busSystemTickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const getRelevantTickets = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'vendor':
        return tickets.filter(ticket => 
          ticket.assignedVendor === user.email && 
          ['approved', 'acknowledged', 'quoted', 'quote_approved', 'quote_rejected', 'under_service', 'completed', 'invoiced', 'repair_requested'].includes(ticket.status)
        );
      case 'creator':
        return tickets.filter(ticket => 
          ticket.createdBy === user.email
        );
      case 'supervisor':
        return tickets;
      case 'purchase':
        return tickets.filter(ticket => 
          ticket.status === 'invoiced' || 
          ticket.status === 'completed'
        );
      default:
        return [];
    }
  };

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

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );
    toast.success(`Ticket status updated to ${status}`);
  };

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

  const rejectTicket = (ticketId: string, reason: string) => {
    if (!user || user.role !== 'supervisor') {
      toast.error('Only supervisors can reject tickets');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'rejected',
              rejectedReason: reason
            }
          : ticket
      )
    );
    toast.warning('Ticket rejected - returned to creator');
  };

  const acknowledgeTicket = (ticketId: string) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can acknowledge tickets');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId && ticket.assignedVendor === user.email
          ? {
              ...ticket,
              status: 'acknowledged',
              acknowledgedAt: new Date()
            }
          : ticket
      )
    );
    toast.success('Ticket acknowledged successfully');
    
    const acknowledgedTicket = tickets.find(t => t.id === ticketId);
    if (acknowledgedTicket) {
      toast.info(`Notification sent to ticket creator: ${acknowledgedTicket.createdBy}`);
      if (acknowledgedTicket.approvedBy) {
        toast.info(`Notification sent to supervisor: ${acknowledgedTicket.approvedBy}`);
      }
    }
  };

  const submitQuotation = (ticketId: string, quotation: Omit<Quotation, 'id' | 'createdAt'>) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can submit quotations');
      return;
    }

    const newQuotation: Quotation = {
      ...quotation,
      id: `Q${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      createdAt: new Date()
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId && ticket.assignedVendor === user.email
          ? {
              ...ticket,
              status: 'quoted',
              quotation: newQuotation
            }
          : ticket
      )
    );
    toast.success('Quotation submitted successfully');
    
    const ticketWithQuotation = tickets.find(t => t.id === ticketId);
    if (ticketWithQuotation && ticketWithQuotation.approvedBy) {
      toast.info(`Notification sent to supervisor: ${ticketWithQuotation.approvedBy}`);
    }
  };

  const approveQuotation = (ticketId: string) => {
    if (!user || user.role !== 'supervisor') {
      toast.error('Only supervisors can approve quotations');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId && ticket.quotation) {
          return {
            ...ticket,
            status: 'quote_approved',
            quotation: {
              ...ticket.quotation,
              approved: true,
              approvedBy: user.email,
              approvedAt: new Date()
            }
          };
        }
        return ticket;
      })
    );
    toast.success('Quotation approved successfully');
    
    const ticketWithApprovedQuotation = tickets.find(t => t.id === ticketId);
    if (ticketWithApprovedQuotation) {
      toast.info(`Notification sent to vendor: ${ticketWithApprovedQuotation.assignedVendor}`);
    }
  };

  const rejectQuotation = (ticketId: string, reason: string) => {
    if (!user || user.role !== 'supervisor') {
      toast.error('Only supervisors can reject quotations');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId && ticket.quotation) {
          return {
            ...ticket,
            status: 'quote_rejected',
            quotation: {
              ...ticket.quotation,
              approved: false,
              rejectedAt: new Date(),
              rejectionReason: reason
            }
          };
        }
        return ticket;
      })
    );
    toast.warning('Quotation rejected');
    
    const ticketWithRejectedQuotation = tickets.find(t => t.id === ticketId);
    if (ticketWithRejectedQuotation) {
      toast.info(`Notification sent to vendor: ${ticketWithRejectedQuotation.assignedVendor}`);
    }
  };

  const startService = (ticketId: string) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can start service');
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId && ticket.assignedVendor === user.email && ticket.status === 'quote_approved') {
          return {
            ...ticket,
            status: 'under_service',
            underServiceAt: new Date()
          };
        }
        return ticket;
      })
    );
    toast.success('Service started');
    
    const ticketUnderService = tickets.find(t => t.id === ticketId);
    if (ticketUnderService) {
      toast.info(`Notification sent to ticket creator: ${ticketUnderService.createdBy}`);
    }
  };

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
        ticket.id === ticketId && ticket.assignedVendor === user.email
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
    
    const ticketWithInvoice = tickets.find(t => t.id === ticketId);
    if (ticketWithInvoice) {
      toast.info(`Notification sent to creator: ${ticketWithInvoice.createdBy}`);
      toast.info(`Notification sent to purchase department`);
    }
  };

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
        if (ticket.id === ticketId && ticket.assignedVendor === user.email) {
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
    
    const ticketWithRepairRequest = tickets.find(t => t.id === ticketId);
    if (ticketWithRepairRequest && ticketWithRepairRequest.approvedBy) {
      toast.info(`Notification sent to supervisor: ${ticketWithRepairRequest.approvedBy}`);
    }
  };

  const requestRepairWithInvoice = (
    ticketId: string, 
    repairRequest: Omit<RepairRequest, 'id' | 'approved'>,
    invoice: Omit<Invoice, 'id' | 'createdAt'>
  ) => {
    if (!user || user.role !== 'vendor') {
      toast.error('Only vendors can request repairs and submit invoices');
      return;
    }

    const newRepairRequest: RepairRequest = {
      ...repairRequest,
      id: `R${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      approved: false
    };

    const newInvoice: Invoice = {
      ...invoice,
      id: `INV${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      createdAt: new Date()
    };

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId && ticket.assignedVendor === user.email) {
          const currentRepairRequests = ticket.repairRequests || [];
          return {
            ...ticket,
            status: 'repair_requested',
            repairRequests: [...currentRepairRequests, newRepairRequest],
            invoice: newInvoice,
            finalCost: invoice.amount
          };
        }
        return ticket;
      })
    );
    toast.success('Repair request and invoice submitted successfully');
    
    const ticketWithRepairRequest = tickets.find(t => t.id === ticketId);
    if (ticketWithRepairRequest && ticketWithRepairRequest.approvedBy) {
      toast.info(`Notification sent to supervisor: ${ticketWithRepairRequest.approvedBy}`);
      toast.info(`Notification sent to purchase department`);
    }
  };

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
    
    const originalTicket = tickets.find(t => t.id === ticketId);
    const approvedRepair = originalTicket?.repairRequests?.find(r => r.id === repairId);
    
    if (originalTicket && approvedRepair) {
      const repairTicket: Omit<Ticket, 'id' | 'createdAt' | 'status'> = {
        title: `Repair for ${originalTicket.title}`,
        description: approvedRepair.description,
        serviceType: 'repair',
        priority: originalTicket.priority,
        createdBy: user.email,
        assignedVendor: originalTicket.assignedVendor,
        bus: originalTicket.bus,
        estimatedCost: approvedRepair.estimatedCost,
      };
      
      addTicket(repairTicket);
      toast.info(`New repair ticket created from request ${repairId}`);
    }
  };

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

  const addNote = (ticketId: string, note: string) => {
    if (!note.trim()) return;
    
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const currentNotes = ticket.notes || [];
          return {
            ...ticket,
            notes: [...currentNotes, note]
          };
        }
        return ticket;
      })
    );
    toast.success('Note added to ticket');
  };

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };
  
  const getTicketsByDate = (startDate: Date, endDate: Date) => {
    return tickets.filter(ticket => {
      return ticket.createdAt >= startDate && ticket.createdAt <= endDate;
    });
  };
  
  const getTicketsByVendor = (vendorEmail: string) => {
    return tickets.filter(ticket => ticket.assignedVendor === vendorEmail);
  };
  
  const getTicketsByBus = (busNumber: string) => {
    return tickets.filter(ticket => ticket.bus.busNumber === busNumber);
  };
  
  const getBusPresets = () => BUS_PRESETS;

  const value = {
    tickets,
    addTicket,
    updateTicketStatus,
    approveTicket,
    rejectTicket,
    acknowledgeTicket,
    submitQuotation,
    approveQuotation,
    rejectQuotation,
    startService,
    submitInvoice,
    requestRepair,
    requestRepairWithInvoice,
    approveRepair,
    completeTicket,
    getTicketById,
    addNote,
    getTicketsByDate,
    getTicketsByVendor,
    getTicketsByBus,
    getBusPresets,
    getRelevantTickets
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTickets = () => useContext(TicketContext);
