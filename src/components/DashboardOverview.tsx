import React from "react";
import {
  Equipment,
  Warehouse,
  MaintenanceTask,
  ServiceLog,
  Contract,
  EquipmentStatus,
  TaskStatus,
  TaskPriority
} from "../types";
import {
  Wrench,
  Building2,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  HardHat
} from "lucide-react";

interface DashboardProps {
  equipments: Equipment[];
  warehouses: Warehouse[];
  tasks: MaintenanceTask[];
  serviceLogs: ServiceLog[];
  contracts: Contract[];
  onNavigate: (tab: string) => void;
  onQuickAction: (actionType: string) => void;
}

export default function DashboardOverview({
  equipments,
  warehouses,
  tasks,
  serviceLogs,
  contracts,
  onNavigate,
  onQuickAction
}: DashboardProps) {
  // 1. Calculate stats
  const totalEquipments = equipments.length;
  const activeEquipments = equipments.filter(e => e.status === EquipmentStatus.Active).length;
  const maintenanceEquipments = equipments.filter(e => e.status === EquipmentStatus.Maintenance).length;
  const serviceNeededEquipments = equipments.filter(e => e.status === EquipmentStatus.ServiceRequired).length;

  const activeTasks = tasks.filter(t => t.status === TaskStatus.InProgress || t.status === TaskStatus.Scheduled).length;
  const criticalTasks = tasks.filter(t => t.priority === TaskPriority.Critical && t.status !== TaskStatus.Completed).length;

  const totalMaintenanceCost = serviceLogs.reduce((acc, log) => acc + log.actualCost, 0);
  const activeContracts = contracts.filter(c => c.status === "Active").length;

  // 2. Alert Generation (Equipment needs service, high-priority tasks soon, expiring contracts)
  const serviceRequiredList = equipments.filter(e => e.status === EquipmentStatus.ServiceRequired);
  
  // Custom SVG status donut calculation
  const statusCounts = {
    Active: activeEquipments,
    Maintenance: maintenanceEquipments,
    "Service Required": serviceNeededEquipments,
    Retired: equipments.filter(e => e.status === EquipmentStatus.Retired).length
  };
  
  const totalForChart = totalEquipments || 1;
  const activePct = Math.round((statusCounts.Active / totalForChart) * 100);
  const maintPct = Math.round((statusCounts.Maintenance / totalForChart) * 100);
  const reqPct = Math.round((statusCounts["Service Required"] / totalForChart) * 100);
  const retPct = Math.round((statusCounts.Retired / totalForChart) * 100);

  // Cost by Category
  const categoryCosts: Record<string, number> = {};
  serviceLogs.forEach(log => {
    const eq = equipments.find(e => e.id === log.equipmentId);
    const cat = eq ? eq.category : "Others";
    categoryCosts[cat] = (categoryCosts[cat] || 0) + log.actualCost;
  });

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between md:p-8 gap-4 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-1.5">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Operational Dashboard</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Facility Service Console</h1>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            Real-time tracking across <span className="text-slate-800 font-semibold">{warehouses.length} facility nodes</span>. Tracks maintenance schedules, servicing costs, active agreements, and mechanical logs.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button
            id="action-schedule-maint"
            onClick={() => onQuickAction("schedule")}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            Plan Maintenance
          </button>
          <button
            id="action-add-eq"
            onClick={() => onQuickAction("equipment")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Equipments */}
        <div 
          onClick={() => onNavigate("equipment")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
        >
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Equipment</span>
            <span className="text-3xl font-bold text-slate-950 mt-1 block">{totalEquipments}</span>
            <span className="text-xs text-slate-400 mt-2 block font-medium">
              <span className="text-emerald-600 font-bold">{activeEquipments}</span> Online &bull; <span className="text-amber-500 font-bold">{maintenanceEquipments}</span> In Shop
            </span>
          </div>
        </div>

        {/* Card 2: Warehouses */}
        <div 
          onClick={() => onNavigate("warehouses")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
        >
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Warehouses</span>
            <span className="text-3xl font-bold text-slate-950 mt-1 block">{warehouses.length}</span>
            <span className="text-xs text-slate-400 mt-2 block">Active depots & facilities</span>
          </div>
        </div>

        {/* Card 3: Maintenance Tasks */}
        <div 
          onClick={() => onNavigate("maintenance")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
        >
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Scheduled Actions</span>
            <span className="text-3xl font-bold text-slate-950 mt-1 block">{activeTasks}</span>
            <span className="text-xs text-slate-400 mt-2 block font-medium flex items-center gap-1">
              {criticalTasks > 0 ? (
                <span className="text-red-600 font-semibold flex items-center gap-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> {criticalTasks} Critical Issues
                </span>
              ) : (
                <span className="text-slate-500">All schedules aligned</span>
              )}
            </span>
          </div>
        </div>

        {/* Card 4: Total Cost and SLAs */}
        <div 
          onClick={() => onNavigate("contracts")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
        >
          <div className="p-3 bg-violet-50 rounded-xl text-violet-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Service Costs</span>
            <span className="text-3xl font-bold text-slate-950 mt-1 block">${totalMaintenanceCost.toLocaleString()}</span>
            <span className="text-xs text-slate-400 mt-2 block font-medium">
              <span className="text-violet-700 font-bold">{activeContracts}</span> Active Contracts
            </span>
          </div>
        </div>
      </div>

      {/* Analytics and Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: System Health Indicators (2/3 width container or split grid) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status Breakdown SVG */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Asset Status Allocation</h3>
                <span className="text-xs text-slate-400">Relative share</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Radial representation using simple nested rings or stylized gauges */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                    {/* Active ring */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="#10b981" 
                      strokeWidth="12" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 40}`} 
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - statusCounts.Active / totalForChart)}`}
                    />
                    {/* Maintenance ring smaller */}
                    <circle cx="50" cy="50" r="28" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle 
                      cx="50" cy="50" r="28" 
                      stroke="#f59e0b" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 28}`} 
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - statusCounts.Maintenance / totalForChart)}`} 
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-bold text-slate-800">{activePct}%</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Active</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="w-full grid grid-cols-2 gap-25 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <div className="text-xs">
                      <span className="text-slate-500 block">Active</span>
                      <span className="font-semibold text-slate-800">{statusCounts.Active} ({activePct}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <div className="text-xs">
                      <span className="text-slate-500 block">Maintenance</span>
                      <span className="font-semibold text-slate-800">{statusCounts.Maintenance} ({maintPct}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <div className="text-xs">
                      <span className="text-slate-500 block">Service Req.</span>
                      <span className="font-semibold text-slate-800">{statusCounts["Service Required"]} ({reqPct}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                    <div className="text-xs">
                      <span className="text-slate-500 block">Retired</span>
                      <span className="font-semibold text-slate-800">{statusCounts.Retired} ({retPct}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses By Category SVG Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Servicing Expense Breakdown</h3>
                <span className="text-xs text-slate-400">Cumulative USD</span>
              </div>

              <div className="p-2 space-y-4">
                {Object.keys(categoryCosts).length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    No service logs filed yet to calculate expenses.
                  </div>
                ) : (
                  Object.entries(categoryCosts).map(([cat, cost]) => {
                    const maxCost = Math.max(...Object.values(categoryCosts), 1);
                    const percent = Math.min(100, Math.round((cost / maxCost) * 105));
                    
                    // Assign colors based on category
                    let barColor = "bg-blue-500";
                    if (cat.includes("HVAC")) barColor = "bg-amber-500";
                    else if (cat.includes("Autom")) barColor = "bg-purple-500";
                    else if (cat.includes("Handling")) barColor = "bg-emerald-500";
                    else if (cat.includes("Load")) barColor = "bg-violet-500";

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate max-w-40">{cat}</span>
                          <span className="font-semibold text-slate-900">${cost.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Tracked Repair Log count:</span>
                  <span className="font-semibold text-slate-700">{serviceLogs.length} entries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Maintenance Backlog List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Operational Maintenance Pipeline</h3>
                <p className="text-xs text-slate-500 mt-1">Upcoming actions require coordination</p>
              </div>
              <button 
                onClick={() => onNavigate("maintenance")} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
              >
                Full Planner <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {tasks.filter(t => t.status !== TaskStatus.Completed).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  All systems green. No outstanding scheduled maintenance.
                </div>
              ) : (
                tasks
                  .filter(t => t.status !== TaskStatus.Completed)
                  .map(task => {
                    const eqObj = equipments.find(e => e.id === task.equipmentId);
                    
                    return (
                      <div key={task.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm">{task.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              task.priority === TaskPriority.Critical 
                                ? "bg-red-50 border-red-200 text-red-600" 
                                : task.priority === TaskPriority.High 
                                ? "bg-amber-50 border-amber-200 text-amber-600" 
                                : "bg-blue-50 border-blue-100 text-blue-600"
                            }`}>
                              {task.priority} Priority
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                            <span className="font-medium text-slate-700">{eqObj?.name || "Unknown Asset"}</span>
                            <span>&bull;</span>
                            <span>Assigned to: {task.assignedTo}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-left md:text-right">
                            <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-semibold">Scheduled Date</span>
                            <span className="font-semibold text-slate-700">{task.scheduledDate}</span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded font-medium ${
                            task.status === TaskStatus.InProgress 
                              ? "bg-blue-50 text-blue-700 font-bold border border-blue-100" 
                              : "bg-slate-50 text-slate-700 font-bold border border-slate-100"
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Alerts & Quick Metrics (1/3 width) */}
        <div className="space-y-6">
          {/* Quick Stats Panel */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <HardHat className="w-4 h-4 text-slate-650" />
              Depot Health Indexes
            </h4>
            
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Equipments Needing Service</span>
                  <span className="font-bold text-slate-800 text-sm">{serviceRequiredList.length} Units flagged</span>
                </div>
                {serviceRequiredList.length > 0 && (
                  <span className="p-1 px-2.5 rounded-full text-[10px] bg-rose-50 text-rose-600 font-black border border-rose-100 animate-pulse">
                    Alert
                  </span>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Expiring Contracts (30 Days)</span>
                  {/* Find active contracts ending soon */}
                  <span className="font-bold text-slate-800 text-sm">
                    {contracts.filter(c => c.status === "Pending Renewal").length} in expiration buffer
                  </span>
                </div>
                {contracts.some(c => c.status === "Pending Renewal") && (
                  <span className="p-1 px-2.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-black border border-amber-100">
                    Review
                  </span>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Avg Maintenance Cost</span>
                  <span className="font-bold text-slate-800 text-sm">
                    ${serviceLogs.length > 0 ? Math.round(totalMaintenanceCost / serviceLogs.length) : 0} per ticket
                  </span>
                </div>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Urgent Dispatch Board (Alert triggers) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-red-500 fill-red-50 text-semibold" />
              <h3 className="font-bold text-slate-900 text-sm">Urgent Dispatch Board</h3>
            </div>
            
            <p className="text-xs text-slate-500">
              Immediate attention requested. Critical status logs:
            </p>

            <div className="space-y-3">
              {serviceRequiredList.length === 0 ? (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-700">
                  All physical equipment metrics report stable. 
                </div>
              ) : (
                serviceRequiredList.map(eq => {
                  const wh = warehouses.find(w => w.id === eq.warehouseId);
                  return (
                    <div key={eq.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-red-800">{eq.name}</span>
                        <span className="text-red-500 font-bold uppercase tracking-wider text-[8px]">Needs Audit</span>
                      </div>
                      <p className="text-xs text-slate-655">
                        <span className="font-medium text-slate-800">Serial:</span> {eq.serialNumber} &bull; <span className="font-medium text-slate-800">Model:</span> {eq.model}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Located at: <span className="font-medium text-slate-600">{wh?.name || "General Facility"}</span>
                      </p>
                      
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => onQuickAction(`service-now:${eq.id}`)}
                          className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white font-medium text-[10px] rounded shadow-xs cursor-pointer select-none transition-colors"
                        >
                          Dispatch Service Technician
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
