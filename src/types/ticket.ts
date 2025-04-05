
export type TicketStatus = 
  | 'pending' // Newly created, waiting for supervisor approval
  | 'approved' // Approved by supervisor, waiting for vendor acknowledgment
  | 'acknowledged' // Acknowledged by vendor, waiting for quotation
  | 'quoted' // Vendor has sent a quotation, waiting for supervisor approval
  | 'quote_rejected' // Quotation rejected by supervisor, back to vendor
  | 'quote_approved' // Quotation approved by supervisor
  | 'under_service' // Service in progress by vendor
  | 'completed' // All work done, ticket closed
  | 'rejected' // Initial ticket rejected by supervisor, back to creator
  | 'repair_requested' // Vendor has requested additional repair approval
  | 'invoiced'; // Vendor has sent an invoice

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

export interface Quotation {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  approved?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
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
  quotation?: Quotation;
  repairRequests?: RepairRequest[];
  notes?: string[];
  completedAt?: Date;
  estimatedCost?: number;
  finalCost?: number;
  rejectedReason?: string;
  underServiceAt?: Date;
}

export interface BusPreset {
  busNumber: string;
  fleetNumber: string;
  chassisNumber: string;
  registrationNumber: string;
  model: string;
  year: string;
}
