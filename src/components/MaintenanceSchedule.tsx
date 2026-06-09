import React, { useState } from "react";
import {
  MaintenanceTask,
  Equipment,
  TaskStatus,
  TaskPriority,
  ServiceType,
  Company
} from "../types";
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  User,
  DollarSign,
  Briefcase,
  X,
  FileSpreadsheet
} from "lucide-react";

interface MaintenanceScheduleProps {
  tasks: MaintenanceTask[];
  equipments: Equipment[];
  companies: Company[];
  onAddTask: (task: Omit<MaintenanceTask, "id">) => void;
  onUpdateTask: (task: MaintenanceTask) => void;
  onCompleteTask: (taskId: string, actualCost: number, performedBy: string, ticketNumber: string, logNotes: string, pdfUrl?: string) => void;
  onDeleteTask: (id: string) => void;
  initialFormOpen?: boolean;
}

export default function MaintenanceSchedule({
  tasks,
  equipments,
  companies,
  onAddTask,
  onUpdateTask,
  onCompleteTask,
  onDeleteTask,
  initialFormOpen = false
}: MaintenanceScheduleProps) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "All">("All");

  // Models status
  const [isAddOpen, setIsAddOpen] = useState(initialFormOpen);
  const [isCompleteFormOpen, setIsCompleteFormOpen] = useState(false);
  const [selectedTaskIdForCompletion, setSelectedTaskIdForCompletion] = useState<string | null>(null);

  // Add Form fields
  const [eqId, setEqId] = useState(equipments[0]?.id || "");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("Internal Technical Crew");
  const [taskCurrency, setTaskCurrency] = useState<"USD" | "CAD" | "EUR">("CAD");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [costEst, setCostEst] = useState("500");
  const [notes, setNotes] = useState("");

  // Complete Form Fields
  const [actualCost, setActualCost] = useState("");
  const [completeCurrency, setCompleteCurrency] = useState<"USD" | "CAD" | "EUR">("CAD");
  const [servicePdf, setServicePdf] = useState("");
  const [performedBy, setPerformedBy] = useState(companies[0]?.name || "Internal Technical Crew");
  const [ticketNumber, setTicketNumber] = useState("");
  const [logNotes, setLogNotes] = useState("");

  const handleServicePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("The PDF report size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setServicePdf(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eqId) {
      alert("Please enter title and select equipment");
      return;
    }
    onAddTask({
      equipmentId: eqId,
      title,
      description: desc,
      assignedTo: assignedTo || "Internal Technical Crew",
      scheduledDate,
      status: TaskStatus.Scheduled,
      priority,
      costEst: parseFloat(costEst) || 0,
      currency: taskCurrency,
      notes: notes || undefined
    });
    setIsAddOpen(false);
    resetAddFields();
  };

  const handleOpenComplete = (taskId: string, originalEstCost: number) => {
    setSelectedTaskIdForCompletion(taskId);
    setActualCost(originalEstCost.toString());
    setCompleteCurrency("CAD");
    setServicePdf("");
    setTicketNumber(`TK-SVR-${Math.floor(10000 + Math.random() * 90000)}`);
    setLogNotes("");
    setIsCompleteFormOpen(true);
  };

  const handleSaveComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskIdForCompletion) return;
    
    // Convert entered cost to CAD based on selection
    const priceEntered = parseFloat(actualCost) || 0;
    let convertedCAD = priceEntered;
    if (completeCurrency === "USD") {
      convertedCAD = priceEntered * 1.37;
    } else if (completeCurrency === "EUR") {
      convertedCAD = priceEntered * 1.48;
    }

    onCompleteTask(
      selectedTaskIdForCompletion,
      convertedCAD,
      performedBy,
      ticketNumber,
      logNotes,
      servicePdf || undefined
    );

    setIsCompleteFormOpen(false);
    setSelectedTaskIdForCompletion(null);
  };

  const resetAddFields = () => {
    setEqId(equipments[0]?.id || "");
    setTitle("");
    setDesc("");
    setAssignedTo("Internal Technical Crew");
    setTaskCurrency("CAD");
    setScheduledDate(new Date().toISOString().split("T")[0]);
    setPriority(TaskPriority.Medium);
    setCostEst("500");
    setNotes("");
  };

  const filteredTasks = tasks.filter(t => activeFilter === "All" ? true : t.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Search Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors ${
              activeFilter === "All" 
                ? "bg-slate-900 text-white" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
            }`}
          >
            All Scheduled ({tasks.length})
          </button>
          {Object.values(TaskStatus).map(st => {
            const count = tasks.filter(t => t.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer select-none transition-colors ${
                  activeFilter === st 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <button
          id="btn-add-schedule"
          onClick={() => { resetAddFields(); setIsAddOpen(true); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs self-end sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Plan Maintenance
        </button>
      </div>

      {/* Main Timeline Board */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl text-center py-12 text-slate-400 text-sm">
            No planned maintenance tasks mapped in this subset.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const eqObj = equipments.find(e => e.id === task.equipmentId);
            
            return (
              <div 
                key={task.id} 
                className={`bg-white border rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all ${
                  task.status === TaskStatus.Completed 
                    ? "border-slate-100 hover:border-slate-200" 
                    : task.status === TaskStatus.InProgress 
                    ? "border-blue-200 bg-blue-50/10 hover:border-blue-300"
                    : "border-slate-100 hover:border-blue-100"
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-2 bg-slate-100 rounded-xl text-slate-500">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Asset: <strong className="text-slate-800 font-bold">{eqObj?.name || "Unidentified Asset"}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center ml-auto md:ml-2">
                      {/* Priority Tag */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        task.priority === TaskPriority.Critical 
                          ? "bg-red-50 border-red-200 text-red-600" 
                          : task.priority === TaskPriority.High 
                          ? "bg-amber-50 border-amber-200 text-amber-700" 
                          : "bg-blue-50 border-blue-100 text-blue-600"
                      }`}>
                        {task.priority} Priority
                      </span>
                      
                      {/* Status Tag */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${
                        task.status === TaskStatus.Completed 
                          ? "bg-slate-100 text-slate-600 border-slate-200" 
                          : task.status === TaskStatus.InProgress 
                          ? "bg-blue-100 text-blue-800 border-blue-200" 
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-655 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">
                    {task.description || "No operational instructions entered."}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Assigned point: <strong className="text-slate-700">{task.assignedTo || "Internal crew"}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Cost Est: <strong className="text-slate-700">{task.costEst.toLocaleString()} {task.currency || "CAD"}</strong>
                      {(task.currency || "CAD") !== "CAD" && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded font-mono">
                          (&asymp; {((task.costEst || 0) * ((task.currency || "CAD") === "USD" ? 1.37 : 1.48)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} CAD)
                        </span>
                      )}
                    </span>
                  </div>

                  {task.notes && (
                    <div className="text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Schedules Alert: <strong className="text-slate-500">{task.notes}</strong></span>
                    </div>
                  )}
                </div>

                {/* Operations buttons on active status */}
                {task.status !== TaskStatus.Completed && task.status !== TaskStatus.Cancelled && (
                  <div className="flex sm:flex-row md:flex-col items-stretch gap-2 shrink-0 justify-end md:justify-start md:self-center">
                    {task.status !== TaskStatus.InProgress && (
                      <button
                        title="Move to In-Progress status"
                        onClick={() => {
                          onUpdateTask({ ...task, status: TaskStatus.InProgress });
                        }}
                        className="py-1.5 px-3 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-100 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Work
                      </button>
                    )}

                    <button
                      title="File completion parameters"
                      onClick={() => handleOpenComplete(task.id, task.costEst)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Complete Task
                    </button>

                    <button
                      title="Abort scheduled maintenance"
                      onClick={() => {
                        if (confirm(`Do you want to abort task: ${task.title}?`)) {
                          onUpdateTask({ ...task, status: TaskStatus.Cancelled });
                        }
                      }}
                      className="py-1.5 px-3 bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-rose-100 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Task
                    </button>
                  </div>
                )}

                {/* Completed or Cancelled delete option */}
                {(task.status === TaskStatus.Completed || task.status === TaskStatus.Cancelled) && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${task.status.toLowerCase()} record from schedule pipeline?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:bg-slate-150 hover:text-rose-500 rounded-lg self-center cursor-pointer transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PLAN NEW TASK MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleCreateTask} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Schedule Maintenance Action</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Select Target Equipment *</label>
                  <select
                    id="schedule-task-eq"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={eqId}
                    onChange={(e) => setEqId(e.target.value)}
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.model})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Task Title *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Engine Oil Flush, Safety Switch Replacement"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Work Specifications & Steps</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed steps for technician (e.g. Audit belts, grease lines, test pressure thresholds)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Assigned Contractor/Provider *</label>
                    <select
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="Internal Technical Crew">Internal Technical Crew</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Scheduled Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Task Priority</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    >
                      {Object.values(TaskPriority).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Estimate Budget Cost *</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                        value={costEst}
                        onChange={(e) => setCostEst(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Currency</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer text-slate-700 font-semibold"
                        value={taskCurrency}
                        onChange={(e) => setTaskCurrency(e.target.value as any)}
                      >
                        <option value="CAD">CAD ($)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Scheduling Alert Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Requires coordinator to bypass local breaker unit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Approve Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE WORKLOG FORM MODAL (Saves log) */}
      {isCompleteFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => { setIsCompleteFormOpen(false); setSelectedTaskIdForCompletion(null); }}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSaveComplete} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Submit Servicing Worklog Entry
              </h3>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed font-mono">
                Saving this worklog parameters will:
                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                  <li>Mark the planned task status to <strong className="text-blue-800">Completed</strong></li>
                  <li>Revert the target asset status back to <strong className="text-emerald-700">Active / Online</strong></li>
                  <li>Insert a permanent entry inside the <strong className="text-slate-800">Historical Service Logs Archive</strong> representing these real-world fees and outcomes.</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Actual cost *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                        value={actualCost}
                        onChange={(e) => setActualCost(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Currency</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer text-slate-700 font-semibold"
                        value={completeCurrency}
                        onChange={(e) => setCompleteCurrency(e.target.value as any)}
                      >
                        <option value="CAD">CAD ($)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Work Ticket Reference # *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 block -mt-2">
                  * Note: Cost will automatically convert and save into the logs history in **CAD** format.
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Service Report / invoice PDF Document</label>
                  <div className="space-y-2">
                    {servicePdf && (
                      <div className="flex items-center gap-2 border border-slate-200 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 max-w-max text-xs font-semibold animate-in fade-in duration-100">
                        <span>Report PDF uploaded successfully</span>
                        <button
                          type="button"
                          onClick={() => setServicePdf("")}
                          className="bg-white/85 text-rose-600 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleServicePdfChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-200 file:bg-slate-50 file:hover:bg-slate-100 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Upload service work document in PDF format to preserve digital warranty.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Assigned Contractor/Vendor *</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                    value={performedBy}
                    onChange={(e) => setPerformedBy(e.target.value)}
                  >
                    <option value="Internal Technical Crew">Internal Technical Crew</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Actions Accomplished Notes *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe parts replaced, fluids filled, recalibrations completed, or future recommendation notes..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCompleteFormOpen(false); setSelectedTaskIdForCompletion(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Archive Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
