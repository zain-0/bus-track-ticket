export type TicketStatus =
  | "open"
  | "in_progress"
  | "on_hold"
  | "resolved"
  | "closed"
  | "rejected";

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
  repairCategory?: RepairCategory;
  bus: BusDetails;
  quotations?: Quotation[];
  approvedQuotation?: Quotation;
  estimatedCost?: number;
}

export type NewTicket = Omit<Ticket, "id" | "status" | "createdAt" | "updatedAt" | "quotations">;
