
export type TicketStatus = 
  | 'pending' // Newly created, waiting for supervisor approval
  | 'approved' // Approved by supervisor, waiting for vendor acknowledgment
  | 'acknowledged' // Acknowledged by vendor, work in progress
  | 'invoiced' // Vendor has sent an invoice
  | 'repair_requested' // Vendor has requested additional repair approval
  | 'rejected' // Rejected by supervisor, back to creator
  | 'completed' // All work done, ticket closed

export type ServiceType = 'minor' | 'major' | 'other' | 'repair';

export interface BusDetails {
  busNumber: string;
  fleetNumber?: string;
  chassisNumber?: string;
  registrationNumber?: string;
  route: string;
  model: string;
  year: string;
  issue: string;
}

export interface RepairRequest {
  id: string;
  description: string;
  estimatedCost: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface Invoice {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  paidAt?: Date;
  attachmentUrl?: string;
  fileUpload?: File | null;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  serviceType: ServiceType;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  assignedVendor: string;
  approvedBy?: string;
  approvedAt?: Date;
  acknowledgedAt?: Date;
  bus: BusDetails;
  invoice?: Invoice;
  repairRequests?: RepairRequest[];
  notes?: string[];
  completedAt?: Date;
  estimatedCost?: number;
  finalCost?: number;
  rejectedReason?: string;
}

export interface BusPreset {
  busNumber: string;
  fleetNumber: string;
  chassisNumber: string;
  registrationNumber: string;
  model: string;
  year: string;
}
