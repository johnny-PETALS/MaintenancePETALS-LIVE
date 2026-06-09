import {
  Warehouse,
  Equipment,
  EquipmentStatus,
  MaintenanceTask,
  TaskStatus,
  TaskPriority,
  ServiceLog,
  ServiceType,
  Contract,
  ContractStatus,
  Company,
  CompanyType
} from "./types";

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    name: "Pacific Distribution Hub (WH-1)",
    location: "Seattle, WA - Port Sector A",
    manager: "Marcus Vance",
    phone: "+1 (206) 555-0143",
    email: "m.vance@distributionhub.com",
    capacitySqM: 11520,
    notes: "Main cold storage facility and heavy equipment depot."
  },
  {
    id: "wh-2",
    name: "Midwest Logistics Center (WH-2)",
    location: "Chicago, IL - Interstate Industrial Park",
    manager: "Elena Rostova",
    phone: "+1 (312) 555-0891",
    email: "e.rostova@distributionhub.com",
    capacitySqM: 7900,
    notes: "Handles high-velocity dry goods and sorting operations. High automation."
  },
  {
    id: "wh-3",
    name: "Southern Gateway Depot (WH-3)",
    location: "Houston, TX - Ship Channel Zone C",
    manager: "Carlos Mendez",
    phone: "+1 (713) 555-0322",
    email: "c.mendez@distributionhub.com",
    capacitySqM: 13935,
    notes: "Primary loading dock facility with multi-level storage racking."
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: "c-1",
    name: "Apex Lift & Rigging Co.",
    type: CompanyType.ServiceProvider,
    contactPerson: "Thomas Miller",
    phone: "+1 (800) 555-8902",
    email: "service@apexlift.com",
    address: "909 Industrial Way, Seattle, WA",
    rating: 5,
    servicesOffered: "Forklift maintenance, crane certifying, conveyor belt repairs, hydraulic overhauls."
  },
  {
    id: "c-2",
    name: "Evergreen HVAC & Power Systems",
    type: CompanyType.Contractor,
    contactPerson: "Sarah Jenkins",
    phone: "+1 (888) 555-1234",
    email: "contracts@evergreenhvac.com",
    address: "320 Ventilation Blvd, Chicago, IL",
    rating: 4,
    servicesOffered: "Commercial HVAC tune-ups, industrial chiller servicing, backup generator load bank testing."
  },
  {
    id: "c-3",
    name: "Titan Automation Solutions",
    type: CompanyType.Manufacturer,
    contactPerson: "David Zheng",
    phone: "+1 (512) 555-6712",
    email: "support@titanautomation.com",
    address: "100 Automation Rd, Austin, TX",
    rating: 5,
    servicesOffered: "Automated sortation systems, electronic conveyor controllers, robotic arm calibration."
  },
  {
    id: "c-4",
    name: "Reliant Safety & Fire Systems",
    type: CompanyType.PartsSupplier,
    contactPerson: "Amanda Ross",
    phone: "+1 (800) 555-3211",
    email: "parts@reliantsafety.com",
    address: "411 Safeguard Ave, Atlanta, GA",
    rating: 4,
    servicesOffered: "Sprinkler system components, fire suppression chemical replacement, alarm panel board units."
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: "eq-1",
    name: "Hyster 120 VX Forklift (Heavy Duty)",
    category: "Material Handling",
    warehouseId: "wh-1",
    serialNumber: "HYS120VX-78401",
    model: "H120VX",
    manufacturer: "Hyster",
    purchaseDate: "2023-03-12",
    purchaseCost: 48500,
    status: EquipmentStatus.Active,
    lastMaintenanceDate: "2026-04-10",
    nextMaintenanceDate: "2026-07-10",
    specs: "Capacity: 12,000 lbs. Fuel Type: Cummins Turbo Diesel. Mast Height: 158 inches. Attachments: Hydraulic Fork Positioner.",
    imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-2",
    name: "Carrier industrial AquaEdge Chiller v4",
    category: "HVAC",
    warehouseId: "wh-1",
    serialNumber: "CAR-AQ4-902231",
    model: "19XR-Chiller",
    manufacturer: "Carrier",
    purchaseDate: "2022-06-15",
    purchaseCost: 115000,
    status: EquipmentStatus.Maintenance,
    lastMaintenanceDate: "2026-02-14",
    nextMaintenanceDate: "2026-06-12",
    specs: "Cooling Capacity: 400 Tons. Refrigerant: R-134a. Hermetic Centrifugal Compressor. SmartControl VFD Integration.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-3",
    name: "Titan SmartDrive Automated Conveyor Line",
    category: "Automation / Sorting",
    warehouseId: "wh-2",
    serialNumber: "TITAN-SD800-45A",
    model: "SD-800",
    manufacturer: "Titan Automation Solutions",
    purchaseDate: "2024-01-10",
    purchaseCost: 185000,
    status: EquipmentStatus.Active,
    lastMaintenanceDate: "2026-05-05",
    nextMaintenanceDate: "2026-08-05",
    specs: "Length: 500 feet. Belt Width: 30 inches. Multi-Speed VFD. Integrated Sorters & Optical Scanner Bar code readers.",
    imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb4f072?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-4",
    name: "Caterpillar D350 Backup Generator (350kW)",
    category: "Power Infrastructure",
    warehouseId: "wh-2",
    serialNumber: "CAT-350KW-00982",
    model: "D350-GC",
    manufacturer: "Caterpillar",
    purchaseDate: "2021-11-20",
    purchaseCost: 65000,
    status: EquipmentStatus.ServiceRequired,
    lastMaintenanceDate: "2025-11-20",
    nextMaintenanceDate: "2026-05-20",
    specs: "Power rating: 350 ekW / 437 kVA. Frequency: 60 Hz. Fuel Capacity: 500 Gal sub-base tank. Automatic Transfer Switch.",
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-5",
    name: "Kelley Hydraulic Dock Leveler (Dock 6)",
    category: "Loading Dock Systems",
    warehouseId: "wh-3",
    serialNumber: "KEL-DOCK6-778C",
    model: "HK-800",
    manufacturer: "Kelley Systems",
    purchaseDate: "2023-08-01",
    purchaseCost: 9200,
    status: EquipmentStatus.Active,
    lastMaintenanceDate: "2026-03-20",
    nextMaintenanceDate: "2026-09-20",
    specs: "Dynamic Capacity: 50,000 lbs. Platform Size: 7' x 8'. Fully hydraulic lift and lip mechanism. SafeTFrame design.",
    imageUrl: "https://images.unsplash.com/photo-1553413719-87a312353066?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-6",
    name: "Ingersoll Rand Rotational Compressor (100HP)",
    category: "Pneumatic Systems",
    warehouseId: "wh-3",
    serialNumber: "IR-100HP-CC8831",
    model: "RS75i-A125",
    manufacturer: "Ingersoll Rand",
    purchaseDate: "2022-10-05",
    purchaseCost: 32000,
    status: EquipmentStatus.Active,
    lastMaintenanceDate: "2026-01-15",
    nextMaintenanceDate: "2026-07-15",
    specs: "75 kW (100 HP). Flow: 450 CFM at 125 PSI. Air Cooled. Integrated dryer and particulate filter.",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "eq-7",
    name: "Crown RR 5700 Reach Truck Lift",
    category: "Material Handling",
    warehouseId: "wh-3",
    serialNumber: "CRN-R57-11209",
    model: "RR 5795-45",
    manufacturer: "Crown Equipment Corp.",
    purchaseDate: "2024-05-22",
    purchaseCost: 39000,
    status: EquipmentStatus.Active,
    lastMaintenanceDate: "2026-05-18",
    nextMaintenanceDate: "2026-11-18",
    specs: "Load capacity: 4,500 lbs. Lift height: 321 inches. Power: 36 Volt. Integrated camera and load weight indicator.",
    imageUrl: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=600"
  }
];

export const INITIAL_TASKS: MaintenanceTask[] = [
  {
    id: "t-1",
    equipmentId: "eq-2",
    title: "Refrigerant Pressure Audit & VFD Alignment",
    description: "Inspect system for chemical leak signs, audit refrigerant R-134a operating charge, and verify centifugal compressor drive alignment.",
    assignedTo: "Sarah Jenkins",
    scheduledDate: "2026-06-12",
    status: TaskStatus.InProgress,
    priority: TaskPriority.Critical,
    costEst: 1500,
    notes: "Evergreen HVAC specialized team is scheduled to deploy at 08:00 AM."
  },
  {
    id: "t-2",
    equipmentId: "eq-4",
    title: "Generator 350kW Loading Bank Load Test",
    description: "Perform critical semi-annual load bank audit to guarantee automatic voltage regulator response and black-start system functionality.",
    assignedTo: "Sarah Jenkins",
    scheduledDate: "2026-06-20",
    status: TaskStatus.Scheduled,
    priority: TaskPriority.High,
    costEst: 950,
    notes: "Requires coordination with Warehouse 2 operations to bypass main breaker for 30 minutes."
  },
  {
    id: "t-3",
    equipmentId: "eq-1",
    title: "15,000 Hour Engine & Hydraulic Service",
    description: "Replace engine oil and filter, hydraulic fluid lines swap, inspect disc brake linings, grease mast bearings, and clear emission sensors.",
    assignedTo: "Thomas Miller",
    scheduledDate: "2026-07-10",
    status: TaskStatus.Scheduled,
    priority: TaskPriority.Medium,
    costEst: 800,
    notes: "Forklift has been exhibiting minor hydraulic response delays in low temps."
  },
  {
    id: "t-4",
    equipmentId: "eq-3",
    title: "Optical Barcode Scanner Recalibration",
    description: "Recalibrate the high-speed sorting optical sensors. Clean lens coatings and test routing control responses with dummy package runs.",
    assignedTo: "David Zheng",
    scheduledDate: "2026-08-05",
    status: TaskStatus.Scheduled,
    priority: TaskPriority.Low,
    costEst: 400,
    notes: "Routine quarterly automated line calibration."
  }
];

export const INITIAL_SERVICE_LOGS: ServiceLog[] = [
  {
    id: "sl-1",
    equipmentId: "eq-1",
    date: "2026-04-10",
    performedBy: "Apex Lift & Rigging Co.",
    ticketNumber: "TK-APX-88122",
    serviceType: ServiceType.RoutinePM,
    actualCost: 550,
    notes: "Standard 250-hour oil and filter change. Mast chain lubed and tension tested. Hydraulics topped off. No system issues reported.",
    checklist: ["Oil filter swapped", "Engine oil replaced", "Mast chain lubricated", "Tire pressure audit", "Safety alarm scan"]
  },
  {
    id: "sl-2",
    equipmentId: "eq-5",
    date: "2026-03-20",
    performedBy: "Apex Lift & Rigging Co.",
    ticketNumber: "TK-APX-77610",
    serviceType: ServiceType.Repair,
    actualCost: 1100,
    notes: "Replaced faulty dual hydraulic control valve assembly which was leaking pressure. Bleed air from hydraulic cylinders. Operations verified nominal.",
    checklist: ["Faulty valve removed", "New hydraulic valve installed", "Lines bleed and pressurized", "Weight safety test (loaded 40klbs)"]
  },
  {
    id: "sl-3",
    equipmentId: "eq-3",
    date: "2026-05-05",
    performedBy: "Titan Automation Solutions",
    ticketNumber: "TK-TITAN-009110",
    serviceType: ServiceType.RoutinePM,
    actualCost: 2400,
    notes: "Full system mechanical review. Replaced worn belt lacing on segment B3, tensioned main system drive belts, and applied drive sprocket grease.",
    checklist: ["Drive belt visual audit", "Segment B3 belt lace swap", "Belt tensioning setup", "Sprocket greasing", "PLC firmware update"]
  },
  {
    id: "sl-4",
    equipmentId: "eq-6",
    date: "2026-01-15",
    performedBy: "Apex Lift & Rigging Co.",
    ticketNumber: "TK-IR-05112",
    serviceType: ServiceType.Inspection,
    actualCost: 350,
    notes: "Assessed compressor operational temperatures and verified pressure relief valves are operating inside 115-130 PSI window. Filters clean.",
    checklist: ["Temp sensor calibration", "Pressure relief safety test", "Oil level check", "Acoustic bearing analysis"]
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "con-1",
    companyId: "c-1",
    vendorName: "Apex Lift & Rigging Co.",
    contractNumber: "CT-2025-APX920",
    title: "Forklift & Mechanical Depot SLA",
    startDate: "2025-01-01",
    endDate: "2027-01-01",
    annualCost: 18000,
    terms: "Covers 15 forklifts across Seattle & Houston. Response within 6 hours. Parts are billed at 12% discount. Quarterly preventative tune-ups are fully covered.",
    coverage: "Quarterly preventative maintenance, discounted replacement parts, priority technical dispatch.",
    status: ContractStatus.Active
  },
  {
    id: "con-2",
    companyId: "c-2",
    vendorName: "Evergreen HVAC & Power Systems",
    contractNumber: "CT-2026-EGR441",
    title: "HVAC & Emergency Generator SLA",
    startDate: "2026-01-15",
    endDate: "2027-01-15",
    annualCost: 26000,
    terms: "Bi-annual deep chillers maintenance. Quarterly engine starter tests for emergency generators. Emergency response windows within 4 hours. Dedicated representative.",
    coverage: "Full HVAC compressor and water tower maintenance, generator load bank testing, emergency repair response.",
    status: ContractStatus.Active
  },
  {
    id: "con-3",
    companyId: "c-3",
    vendorName: "Titan Automation Solutions",
    contractNumber: "CT-2024-TITAN05",
    title: "Automated Conveyers Master Service Agreement",
    startDate: "2024-06-01",
    endDate: "2026-06-01",
    annualCost: 32000,
    notes: "Contract is currently in the expiration buffer period. Active negotiations underway.",
    terms: "Custom automation software patches, electrical component warranties, dual-action sorter replacement. Bi-annual engineer onsite inspection audit.",
    coverage: "Firmware updates, optical sensor calibration, major motor warranty coverage.",
    status: ContractStatus.PendingRenewal
  }
];
