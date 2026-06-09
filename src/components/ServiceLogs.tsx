import React, { useState } from "react";
import {
  ServiceLog,
  Equipment,
  ServiceType,
  Company
} from "../types";
import {
  Search,
  CheckCircle,
  Clock,
  Plus,
  DollarSign,
  FileText,
  Building,
  Tag,
  Wrench,
  ChevronDown,
  X,
  PlusCircle
} from "lucide-react";

interface ServiceLogsProps {
  logs: ServiceLog[];
  equipments: Equipment[];
  companies: Company[];
  onAddManualLog: (log: Omit<ServiceLog, "id">) => void;
  initialAddOpen?: boolean;
  onNavigateToEquipment: (eqId: string) => void;
}

export default function ServiceLogs({
  logs,
  equipments,
  companies,
  onAddManualLog,
  initialAddOpen = false,
  onNavigateToEquipment
}: ServiceLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ServiceType | "">("");
  const [isLogFormOpen, setIsLogFormOpen] = useState(initialAddOpen);

  // Form Fields
  const [eqId, setEqId] = useState(equipments[0]?.id || "");
  const [performedBy, setPerformedBy] = useState(companies[0]?.name || "Internal Staff");
  const [ticketNumber, setTicketNumber] = useState(`TK-MAN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.Repair);
  const [actualCost, setActualCost] = useState("350");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [checklistText, setChecklistText] = useState("");
  const [pdfFile, setPdfFile] = useState("");

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("The PDF report size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPdfFile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber || !eqId || !notes) {
      alert("Please populate equipment, ticket number, and actions notes!");
      return;
    }

    // Split checklist items by comma or newline
    const items = checklistText
      ? checklistText.split(/[,\n]/).map(i => i.trim()).filter(i => i !== "")
      : ["System diagnostics verified"];

    onAddManualLog({
      equipmentId: eqId,
      date,
      performedBy,
      ticketNumber,
      serviceType,
      actualCost: parseFloat(actualCost) || 0,
      notes,
      checklist: items,
      pdfUrl: pdfFile || undefined
    });

    setIsLogFormOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEqId(equipments[0]?.id || "");
    setPerformedBy(companies[0]?.name || "Internal Staff");
    setTicketNumber(`TK-MAN-${Math.floor(10000 + Math.random() * 90000)}`);
    setServiceType(ServiceType.Repair);
    setActualCost("350");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setChecklistText("");
    setPdfFile("");
  };

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const eqObj = equipments.find(e => e.id === log.equipmentId);
    
    const matchesSearch = 
      log.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.notes.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (eqObj ? eqObj.name.toLowerCase().includes(searchTerm.toLowerCase()) : false);

    const matchesType = selectedType ? log.serviceType === selectedType : true;

    return matchesSearch && matchesType;
  });

  const totalSpent = logs.reduce((sum, l) => sum + l.actualCost, 0);

  return (
    <div className="space-y-6">
      {/* Search Actions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 text-slate-400 pointer-events-none" />
          <input
            id="service-search-input"
            type="text"
            placeholder="Search service logs by ticket #, equipment name, notes..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-400 focus:outline-hidden rounded-xl text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="service-filter-type"
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 cursor-pointer"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ServiceType | "")}
          >
            <option value="">All Services Types</option>
            {Object.values(ServiceType).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <button
            id="btn-log-service-manual"
            onClick={() => { resetForm(); setIsLogFormOpen(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Rapid Service
          </button>
        </div>
      </div>

      {/* Metric Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Aggregated Repair Expense</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">{totalSpent.toLocaleString()} CAD</span>
          </div>
          <div className="p-3 bg-white rounded-xl text-blue-650 shadow-xs">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Archivated Ticket Logs</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">{logs.length} Closed Logs</span>
          </div>
          <div className="p-3 bg-white rounded-xl text-slate-650 shadow-xs">
            <CheckCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Logs Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket / Date</th>
                <th className="py-3 px-4">Associated Equipment</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4 text-right">Actual Cost</th>
                <th className="py-3 px-4 text-center">Outcome details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No closed maintenance tickets found. Adjust filter terms.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const eqObj = equipments.find(e => e.id === log.equipmentId);
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        className="hover:bg-slate-50/40 cursor-pointer transition-colors" 
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 text-xs tracking-wide bg-slate-100 p-1 px-1.5 rounded-md font-mono">
                              {log.ticketNumber}
                            </span>
                            <span className="text-xs text-slate-400 block pt-1">{log.date}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {eqObj ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToEquipment(log.equipmentId);
                              }}
                              className="hover:text-blue-600 transition-colors cursor-pointer text-left focus:outline-hidden"
                            >
                              {eqObj.name}
                            </button>
                          ) : (
                            <span className="text-slate-400">Archived Asset</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.serviceType === ServiceType.Emergency 
                              ? "bg-red-50 border-red-200 text-red-600" 
                              : log.serviceType === ServiceType.Repair 
                              ? "bg-amber-50 border-amber-200 text-amber-600" 
                              : log.serviceType === ServiceType.RoutinePM
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold"
                              : "bg-blue-50 border-blue-100 text-blue-600"
                          }`}>
                            {log.serviceType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                          {log.actualCost.toLocaleString()} CAD
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
                            <span className="text-xs font-semibold select-none">{isExpanded ? "Hide" : "Expand"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50/50 p-5 border-t border-b border-slate-100">
                            <div className="space-y-4 max-w-2xl text-xs md:text-sm">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Actions notes</span>
                                <p className="text-slate-700 font-medium leading-relaxed italic">
                                  &ldquo;{log.notes}&rdquo;
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Performing Vendor / Crew</span>
                                  <p className="text-slate-700 font-semibold flex items-center gap-1">
                                    <Building className="w-3.5 h-3.5 text-slate-400" />
                                    {log.performedBy}
                                  </p>

                                  {log.pdfUrl && (
                                    <div className="pt-2 select-none">
                                      <a
                                        href={log.pdfUrl}
                                        download={`WorkReport-${log.ticketNumber}.pdf`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-800 font-bold text-[11px] rounded-xl transition-all cursor-pointer shadow-xs"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                        Download Report PDF
                                      </a>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Technician Verification Checklist</span>
                                  <div className="flex flex-wrap gap-1">
                                    {log.checklist.map((item, idx) => (
                                      <span key={idx} className="p-1 px-2 border border-slate-200 bg-white rounded-lg text-slate-600 text-[10px] font-medium inline-block">
                                        &bull; {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RAPID SERVICE LOG MODAL */}
      {isLogFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsLogFormOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleCreateLog} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Add Historical Servicing Log
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Select Mapped Asset *</label>
                    <select
                      id="log-service-asset"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer text-slate-800"
                      value={eqId}
                      onChange={(e) => setEqId(e.target.value)}
                    >
                      {equipments.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.name} ({eq.model})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Service Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Ticket Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TK-88902"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-mono"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Servicing Type</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    >
                      {Object.values(ServiceType).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Servicing Amount Fee (CAD) *</label>
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
                    <label className="text-xs font-bold text-slate-600 block">Contractor / Agency Staff</label>
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Servicing Invoice Report PDF Attachment</label>
                  <div className="space-y-2">
                    {pdfFile && (
                      <div className="flex items-center gap-2 border border-slate-200 p-2 rounded-xl bg-emerald-50 text-emerald-800 max-w-max text-xs font-medium animate-in fade-in duration-100">
                        <span>Report PDF uploaded</span>
                        <button
                          type="button"
                          onClick={() => setPdfFile("")}
                          className="bg-white text-rose-600 px-1.5 py-0.5 rounded border border-slate-100 hover:bg-slate-50 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-200 file:bg-slate-50 file:hover:bg-slate-100 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Log Checklist Items (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Swapped power fuses, Bleed fluid, Calibrated laser scan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={checklistText}
                    onChange={(e) => setChecklistText(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-400 hint block mt-0.5">Separate with a comma for multiple bullet points</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Servicing Summary / Actions Notes *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Summarize actions completed, findings, machine readings..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden text-slate-800"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm Log Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
