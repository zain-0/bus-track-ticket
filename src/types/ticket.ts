
export type TicketStatus =
  | "open"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed"
  | "rejected"
  | "pending"
  | "approved"
  | "acknowledged"
  | "quoted"
  | "quote_approved"
  | "quote_rejected"
  | "under_service"
  | "invoiced"
  | "repair_requested"
  | "completed"
  | "pending_vendor";

export type ServiceType = "minor" | "major" | "repair" | "other";

// Bus details
export interface BusDetails {
  busNumber: string;
  fleetNumber?: string;
  chassisNumber?: string;
  registrationNumber?: string;
  route?: string;
  model: string;
  manufacturer: string;
  year: string;
  issue: string;
  engineServiceInterval?: number;
  tyreServiceInterval?: number;
  acServiceInterval?: number;
  transmissionServiceInterval?: number;
  brakePadServiceInterval?: number;
}

export interface BusPreset {
  busNumber: string;
  fleetNumber: string;
  chassisNumber: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  year: string;
  engineServiceInterval: number;
  tyreServiceInterval: number;
  acServiceInterval: number;
  transmissionServiceInterval: number;
  brakePadServiceInterval: number;
}

export type RepairCategory =
  | "electrical"
  | "mechanical"
  | "ac_repair"
  | "engine"
  | "body"
  | "battery_replacement"
  | "tyre_replacement";

export interface Quotation {
  vendorId: string;
  price: number;
  description: string;
  status: "pending" | "approved" | "rejected";
}

// Invoice interface
export interface Invoice {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  uploadedDate?: Date;
  paidAt?: Date;
  pdf?: string;
}

// Repair request interface
export interface RepairRequest {
  id: string;
  description: string;
  estimatedCost: number;
  approved: boolean;
  approvedBy?: string;
  createdAt: Date;
}

// Ticket interface
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  serviceType: ServiceType;
  createdBy: string;
  assignedVendor: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  acknowledgedAt?: Date;
  completedAt?: Date;
  repairCategory?: RepairCategory;
  bus: BusDetails;
  quotations?: Quotation[];
  approvedQuotation?: Quotation;
  estimatedCost?: number;
  finalCost?: number;
  notes?: string[];
  invoice?: Invoice;
  repairRequests?: RepairRequest[];
}

export type NewTicket = Omit<Ticket, "id" | "status" | "createdAt" | "updatedAt" | "quotations">;
