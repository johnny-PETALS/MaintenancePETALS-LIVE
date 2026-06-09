import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wrench,
  Building2,
  FileText,
  CalendarDays,
  UserCheck,
  ClipboardList,
  Contact,
  LayoutDashboard,
  Menu,
  X,
  Settings,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// Types and Seeds
import {
  Warehouse,
  Equipment,
  MaintenanceTask,
  ServiceLog,
  Contract,
  Company,
  EquipmentStatus,
  TaskStatus,
  TaskPriority,
  ServiceType,
  ContractStatus,
  CompanyType
} from "./types";
import {
  INITIAL_WAREHOUSES,
  INITIAL_EQUIPMENT,
  INITIAL_TASKS,
  INITIAL_SERVICE_LOGS,
  INITIAL_CONTRACTS,
  INITIAL_COMPANIES
} from "./data";

// Extracted Sub-Components
import DashboardOverview from "./components/DashboardOverview";
import EquipmentList from "./components/EquipmentList";
import WarehouseList from "./components/WarehouseList";
import MaintenanceSchedule from "./components/MaintenanceSchedule";
import ServiceLogs from "./components/ServiceLogs";
import ContractList from "./components/ContractList";
import CompanyList from "./components/CompanyList";

export default function App() {
  // Mobile nav toggler
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State Containers initialized from local storage
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const val = localStorage.getItem("wh_manager_warehouses");
    return val ? JSON.parse(val) : INITIAL_WAREHOUSES;
  });

  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const val = localStorage.getItem("wh_manager_equipments");
    return val ? JSON.parse(val) : INITIAL_EQUIPMENT;
  });

  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => {
    const val = localStorage.getItem("wh_manager_tasks");
    return val ? JSON.parse(val) : INITIAL_TASKS;
  });

  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>(() => {
    const val = localStorage.getItem("wh_manager_serviceLogs");
    return val ? JSON.parse(val) : INITIAL_SERVICE_LOGS;
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const val = localStorage.getItem("wh_manager_contracts");
    return val ? JSON.parse(val) : INITIAL_CONTRACTS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const val = localStorage.getItem("wh_manager_companies");
    return val ? JSON.parse(val) : INITIAL_COMPANIES;
  });

  // State Triggers for Quick Links / Modals routing
  const [quickIntentEqFormOpen, setQuickIntentEqFormOpen] = useState(false);
  const [quickIntentMaintFormOpen, setQuickIntentMaintFormOpen] = useState(false);
  const [quickIntentLogFormOpen, setQuickIntentLogFormOpen] = useState(false);
  const [rapidPreSelectedEqId, setRapidPreSelectedEqId] = useState("");
  const [preSelectedAssetId, setPreSelectedAssetId] = useState<string | undefined>(undefined);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("wh_manager_warehouses", JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem("wh_manager_equipments", JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem("wh_manager_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("wh_manager_serviceLogs", JSON.stringify(serviceLogs));
  }, [serviceLogs]);

  useEffect(() => {
    localStorage.setItem("wh_manager_contracts", JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem("wh_manager_companies", JSON.stringify(companies));
  }, [companies]);

  // HANDLERS: Warehouses
  const handleAddWarehouse = (wh: Omit<Warehouse, "id">) => {
    const newWh: Warehouse = {
      ...wh,
      id: `wh-${Date.now()}`
    };
    setWarehouses(prev => [newWh, ...prev]);
  };

  const handleUpdateWarehouse = (wh: Warehouse) => {
    setWarehouses(prev => prev.map(item => item.id === wh.id ? wh : item));
  };

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(item => item.id !== id));
  };

  // HANDLERS: Equipments
  const handleAddEquipment = (eq: Omit<Equipment, "id">) => {
    const newEq: Equipment = {
      ...eq,
      id: `eq-${Date.now()}`
    };
    setEquipments(prev => [newEq, ...prev]);
  };

  const handleUpdateEquipment = (eq: Equipment) => {
    setEquipments(prev => prev.map(item => item.id === eq.id ? eq : item));
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipments(prev => prev.filter(item => item.id !== id));
    // clean orphaned tasks
    setTasks(prev => prev.filter(t => t.equipmentId !== id));
  };

  // HANDLERS: Maintenance tasks
  const handleAddTask = (task: Omit<MaintenanceTask, "id">) => {
    const newTask: MaintenanceTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);

    // Force equipment status to MAINTENANCE if task is 'InProgress'
    if (task.status === TaskStatus.InProgress) {
      setEquipments(prev => prev.map(eq => {
        if (eq.id === task.equipmentId) {
          return { ...eq, status: EquipmentStatus.Maintenance };
        }
        return eq;
      }));
    }
  };

  const handleUpdateTask = (task: MaintenanceTask) => {
    setTasks(prev => prev.map(item => item.id === task.id ? task : item));

    // Side effect triggers:
    if (task.status === TaskStatus.InProgress) {
      setEquipments(prev => prev.map(eq => {
        if (eq.id === task.equipmentId) {
          return { ...eq, status: EquipmentStatus.Maintenance };
        }
        return eq;
      }));
    } else if (task.status === TaskStatus.Cancelled) {
      // Revert status to online if cancel
      setEquipments(prev => prev.map(eq => {
        if (eq.id === task.equipmentId && eq.status === EquipmentStatus.Maintenance) {
          return { ...eq, status: EquipmentStatus.Active };
        }
        return eq;
      }));
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  // ADVANCED: Complete Maintenance Task trigger
  const handleCompleteTask = (
    taskId: string, 
    actualCost: number, 
    performedBy: string, 
    ticketNumber: string, 
    logNotes: string,
    pdfUrl?: string
  ) => {
    // 1. Mark task as Completed
    const matchedTask = tasks.find(t => t.id === taskId);
    if (!matchedTask) return;

    const updatedTask: MaintenanceTask = {
      ...matchedTask,
      status: TaskStatus.Completed
    };
    
    // 2. Set Equipment status to Active, and update its last/next maintenance date
    setEquipments(prev => prev.map(eq => {
      if (eq.id === matchedTask.equipmentId) {
        const pmDate = new Date();
        const nextPmDate = new Date();
        nextPmDate.setMonth(nextPmDate.getMonth() + 3); // next scheduled PM: 3 months

        return {
          ...eq,
          status: EquipmentStatus.Active,
          lastMaintenanceDate: pmDate.toISOString().split("T")[0],
          nextMaintenanceDate: nextPmDate.toISOString().split("T")[0]
        };
      }
      return eq;
    }));

    // 3. Append Service Log
    const newServiceLog: ServiceLog = {
      id: `sl-${Date.now()}`,
      equipmentId: matchedTask.equipmentId,
      date: new Date().toISOString().split("T")[0],
      performedBy,
      ticketNumber,
      serviceType: ServiceType.Repair,
      actualCost,
      notes: logNotes,
      checklist: ["Planned work schedule resolved", "Safety switches confirmed", "Action parameters authenticated"],
      pdfUrl
    };

    setTasks(prev => prev.map(item => item.id === taskId ? updatedTask : item));
    setServiceLogs(prev => [newServiceLog, ...prev]);
  };

  // HANDLERS: Manual quick service log
  const handleAddManualLog = (log: Omit<ServiceLog, "id">) => {
    const newLog: ServiceLog = {
      ...log,
      id: `log-man-${Date.now()}`
    };
    
    setServiceLogs(prev => [newLog, ...prev]);

    // Force asset status to ONLINE active since log has been registered as completed action!
    setEquipments(prev => prev.map(eq => {
      if (eq.id === log.equipmentId) {
        return { 
          ...eq, 
          status: EquipmentStatus.Active,
          lastMaintenanceDate: log.date
        };
      }
      return eq;
    }));
  };

  // HANDLERS: Contracts
  const handleAddContract = (cnt: Omit<Contract, "id">) => {
    const newCnt: Contract = {
      ...cnt,
      id: `con-${Date.now()}`
    };
    setContracts(prev => [newCnt, ...prev]);
  };

  const handleUpdateContract = (cnt: Contract) => {
    setContracts(prev => prev.map(item => item.id === cnt.id ? cnt : item));
  };

  const handleDeleteContract = (id: string) => {
    setContracts(prev => prev.filter(item => item.id !== id));
  };

  // HANDLERS: Companies
  const handleAddCompany = (comp: Omit<Company, "id">) => {
    const newComp: Company = {
      ...comp,
      id: `c-${Date.now()}`
    };
    setCompanies(prev => [newComp, ...prev]);
  };

  const handleUpdateCompany = (comp: Company) => {
    setCompanies(prev => prev.map(item => item.id === comp.id ? comp : item));
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(item => item.id !== id));
  };

  // HANDLER: Dispatch triggers from dashboard
  const handleQuickActionDispatch = (actionString: string) => {
    if (actionString === "schedule") {
      setQuickIntentMaintFormOpen(true);
      setActiveTab("maintenance");
    } else if (actionString === "equipment") {
      setQuickIntentEqFormOpen(true);
      setActiveTab("equipment");
    } else if (actionString.startsWith("service-now:")) {
      const eqId = actionString.split(":")[1];
      // route to services logs archive with opening state
      setRapidPreSelectedEqId(eqId);
      setQuickIntentLogFormOpen(true);
      setActiveTab("services");
    }
  };

  const handleRouteToEquipmentDetails = (eqId: string) => {
    setPreSelectedAssetId(eqId);
    setActiveTab("equipment");
  };

  // Render correct tab view dynamically
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            equipments={equipments}
            warehouses={warehouses}
            tasks={tasks}
            serviceLogs={serviceLogs}
            contracts={contracts}
            onNavigate={(tab) => {
              // Reset selectors when changing tab
              setPreSelectedAssetId(undefined);
              setActiveTab(tab);
            }}
            onQuickAction={handleQuickActionDispatch}
          />
        );
      case "equipment":
        return (
          <EquipmentList
            equipments={equipments}
            warehouses={warehouses}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            initialFormOpen={quickIntentEqFormOpen}
            initialSelectedAssetId={preSelectedAssetId}
          />
        );
      case "warehouses":
        return (
          <WarehouseList
            warehouses={warehouses}
            equipments={equipments}
            onAddWarehouse={handleAddWarehouse}
            onUpdateWarehouse={handleUpdateWarehouse}
            onDeleteWarehouse={handleDeleteWarehouse}
          />
        );
      case "maintenance":
        return (
          <MaintenanceSchedule
            tasks={tasks}
            equipments={equipments}
            companies={companies}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            initialFormOpen={quickIntentMaintFormOpen}
          />
        );
      case "services":
        return (
          <ServiceLogs
            logs={serviceLogs}
            equipments={equipments}
            companies={companies}
            onAddManualLog={handleAddManualLog}
            initialAddOpen={quickIntentLogFormOpen}
            onNavigateToEquipment={handleRouteToEquipmentDetails}
          />
        );
      case "contracts":
        return (
          <ContractList
            contracts={contracts}
            companies={companies}
            onAddContract={handleAddContract}
            onUpdateContract={handleUpdateContract}
            onDeleteContract={handleDeleteContract}
          />
        );
      case "companies":
        return (
          <CompanyList
            companies={companies}
            onAddCompany={handleAddCompany}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={handleDeleteCompany}
          />
        );
      default:
        return <div className="text-slate-400">Section placeholder</div>;
    }
  };

  // Menu items list mapping
  const menuItems = [
    { id: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
    { id: "equipment", label: "Equipment Directory", icon: ClipboardList },
    { id: "warehouses", label: "Warehouse Facilities", icon: Building2 },
    { id: "maintenance", label: "Maintenance Planner", icon: CalendarDays },
    { id: "services", label: "Service Logs Archive", icon: Wrench },
    { id: "contracts", label: "SLA Agreements", icon: FileText },
    { id: "companies", label: "Servicing Providers", icon: Contact }
  ];

  // Side Navigation items wrapper
  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setQuickIntentEqFormOpen(false);
    setQuickIntentMaintFormOpen(false);
    setQuickIntentLogFormOpen(false);
    setPreSelectedAssetId(undefined);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased font-sans" id="applet-main-container">
      {/* Desktop Left Rail Navigation (Classic Enterprise Portal Mood) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 text-slate-800 shrink-0 select-none">
        {/* Title branding */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-950 leading-tight">AssetTrack</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Depot Platform</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1 mt-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Management</div>
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isTabActive
                    ? "bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600 rounded-l-none"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <IconComp className={`w-4 h-4 shrink-0 transition-colors ${isTabActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer info inside rail */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">John Doe</p>
              <p className="text-[10px] text-slate-500 truncate">Facility Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header block */}
        <header className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between lg:hidden shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-slate-900 rounded-lg text-white text-xs font-black">
              W
            </div>
            <h1 className="font-bold text-slate-900 text-sm tracking-tight">Depot Assets</h1>
          </div>

          <button
            id="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition-all"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile menu collapsible */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 shadow-xs overflow-hidden absolute w-full z-45 top-[52px]"
            >
              <div className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const IconComp = item.icon;
                  const isTabActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        isTabActive
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0 text-slate-400" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content viewport area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
