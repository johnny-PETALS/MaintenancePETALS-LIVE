export enum EquipmentStatus {
  Active = "Active",
  Maintenance = "Maintenance",
  ServiceRequired = "Service Required",
  Retired = "Retired"
}

export enum TaskStatus {
  Scheduled = "Scheduled",
  InProgress = "In Progress",
  Completed = "Completed",
  Cancelled = "Cancelled"
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export enum ServiceType {
  RoutinePM = "Routine PM",
  Repair = "Repair",
  Inspection = "Inspection",
  Emergency = "Emergency"
}

export enum ContractStatus {
  Active = "Active",
  Expired = "Expired",
  PendingRenewal = "Pending Renewal"
}

export enum CompanyType {
  Manufacturer = "Manufacturer",
  ServiceProvider = "Service Provider",
  Contractor = "Contractor",
  PartsSupplier = "Parts Supplier"
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
  capacitySqM: number;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  warehouseId: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchaseCost: number;
  currency?: "USD" | "CAD" | "EUR";
  status: EquipmentStatus;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  specs: string; // text description of specs
  imageUrl?: string;
}

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  assignedTo: string; // Servicing Provider ID or Name
  scheduledDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  notes?: string;
  costEst: number;
  currency?: "USD" | "CAD" | "EUR";
}

export interface ServiceLog {
  id: string;
  equipmentId: string;
  date: string;
  performedBy: string; // Company / Vendor ID or Name
  ticketNumber: string;
  serviceType: ServiceType;
  actualCost: number; // Always in CAD according to requirement
  notes: string;
  checklist: string[]; // checklist items that were done
  pdfUrl?: string; // uploaded PDF base64 or Link
}

export interface Contract {
  id: string;
  companyId: string; // Associated vendor ID
  vendorName: string;
  contractNumber: string;
  title: string;
  startDate: string;
  endDate: string;
  annualCost: number; // CAD or specific
  currency?: "USD" | "CAD" | "EUR";
  terms: string;
  coverage: string; // e.g. "Full Maintenance, Parts & Labor"
  status: ContractStatus;
  notes?: string;
  pdfUrl?: string; // uploaded Contract PDF base64 or Link
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number; // 1-5 star
  servicesOffered: string;
}
