import React, { useState } from "react";
import { Contract, ContractStatus, Company } from "../types";
import {
  FileText,
  Calendar,
  DollarSign,
  Briefcase,
  ShieldAlert,
  Building,
  Plus,
  Edit,
  Trash2,
  X,
  Clock,
  ExternalLink
} from "lucide-react";

interface ContractListProps {
  contracts: Contract[];
  companies: Company[];
  onAddContract: (cnt: Omit<Contract, "id">) => void;
  onUpdateContract: (cnt: Contract) => void;
  onDeleteContract: (id: string) => void;
}

export default function ContractList({
  contracts,
  companies,
  onAddContract,
  onUpdateContract,
  onDeleteContract
}: ContractListProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Form Fields
  const [companyId, setCompanyId] = useState(companies[0]?.id || "");
  const [contractNumber, setContractNumber] = useState(`CT-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]);
  const [annualCost, setAnnualCost] = useState("15000");
  const [terms, setTerms] = useState("");
  const [coverage, setCoverage] = useState("");
  const [status, setStatus] = useState<ContractStatus>(ContractStatus.Active);
  const [formCurrency, setFormCurrency] = useState<"USD" | "CAD" | "EUR">("CAD");
  const [pdfFile, setPdfFile] = useState("");

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("The PDF contract size exceeds 5MB limit.");
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

  const handleOpenAdd = () => {
    setCompanyId(companies[0]?.id || "");
    setContractNumber(`CT-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`);
    setTitle("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]);
    setAnnualCost("15000");
    setTerms("");
    setCoverage("");
    setStatus(ContractStatus.Active);
    setFormCurrency("CAD");
    setPdfFile("");
    setIsAddOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyId) {
      alert("Please fill contract title and choose connected vendor");
      return;
    }

    onAddContract({
      companyId,
      vendorName: companies.find(c => c.id === companyId)?.name || "Unknown Company",
      contractNumber,
      title,
      startDate,
      endDate,
      annualCost: parseFloat(annualCost) || 0,
      terms,
      coverage,
      status,
      currency: formCurrency,
      pdfUrl: pdfFile || undefined
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (cnt: Contract) => {
    setEditingContract(cnt);
    setCompanyId(cnt.companyId);
    setContractNumber(cnt.contractNumber);
    setTitle(cnt.title);
    setStartDate(cnt.startDate);
    setEndDate(cnt.endDate);
    setAnnualCost(cnt.annualCost.toString());
    setTerms(cnt.terms);
    setCoverage(cnt.coverage);
    setStatus(cnt.status);
    setFormCurrency(cnt.currency || "CAD");
    setPdfFile(cnt.pdfUrl || "");
    setIsEditOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract || !title) return;

    onUpdateContract({
      id: editingContract.id,
      companyId,
      vendorName: companies.find(c => c.id === companyId)?.name || "Unknown Company",
      contractNumber,
      title,
      startDate,
      endDate,
      annualCost: parseFloat(annualCost) || 0,
      terms,
      coverage,
      status,
      currency: formCurrency,
      pdfUrl: pdfFile || undefined
    });

    setIsEditOpen(false);
    setEditingContract(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">Operational SLA Contracts</h2>
          <p className="text-xs text-slate-500 mt-1">SLA coverage, liability parameters, and annual fees tracker</p>
        </div>
        <button
          id="btn-add-contract"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ml-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Contract
        </button>
      </div>

      {/* Grid of Active Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map(cnt => {
          const matchedCompany = companies.find(c => c.id === cnt.companyId);

          return (
            <div key={cnt.id} className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono block tracking-wide">{cnt.contractNumber}</span>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                      {cnt.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                    cnt.status === ContractStatus.Active 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" 
                      : cnt.status === ContractStatus.PendingRenewal 
                      ? "bg-amber-50 border-amber-200 text-amber-700 font-semibold" 
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}>
                    {cnt.status}
                  </span>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-start gap-2 text-slate-655">
                    <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Servicing Vendor Partner</span>
                      <span className="font-semibold text-slate-700">{cnt.vendorName}</span>
                      {matchedCompany && (
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Contact: {matchedCompany.contactPerson} ({matchedCompany.phone})</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-655">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Validity Windows</span>
                      <span className="text-slate-700 font-medium">Duration: <strong className="text-slate-900 font-semibold">{cnt.startDate}</strong> to <strong className="text-slate-900 font-semibold">{cnt.endDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-655">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Annual Billing Cost</span>
                      <span className="font-bold text-slate-800">{cnt.annualCost.toLocaleString()} {cnt.currency || "CAD"} / year</span>
                      {(cnt.currency || "CAD") !== "CAD" && (
                        <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                          (&asymp; {((cnt.annualCost || 0) * ((cnt.currency || "CAD") === "USD" ? 1.37 : 1.48)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} CAD)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Coverage scope</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {cnt.coverage || "General mechanical maintenance."}
                    </p>
                  </div>

                  {cnt.terms && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Terms Synopsis</span>
                      <p className="text-[11px] text-slate-500 leading-normal italic line-clamp-2">
                        &ldquo;{cnt.terms}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">Master SLA</span>
                  {cnt.pdfUrl && (
                    <a
                      href={cnt.pdfUrl}
                      download={`Contract-${cnt.contractNumber}.pdf`}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" /> Download PDF
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cnt)}
                    className="p-1 px-3 text-xs font-semibold hover:bg-slate-50 border border-slate-200 text-slate-650 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Do you wish to delete agreement ${cnt.contractNumber}?`)) {
                        onDeleteContract(cnt.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE CONTRACT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSubmitAdd} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Submit Service Agreement (SLA)</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">SLA Title / Nomenclature *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Forklift Maintenance SLA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Linked Partner Vendor *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Agreement Code ID *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-mono"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Start Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Expiration Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Annual Cost Fee *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-semibold text-slate-800"
                        value={annualCost}
                        onChange={(e) => setAnnualCost(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Currency</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer text-slate-700 font-semibold"
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value as any)}
                      >
                        <option value="CAD">CAD ($)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Agreement Status *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ContractStatus)}
                    >
                      {Object.values(ContractStatus).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Service Agreement PDF Upload</label>
                  <div className="space-y-2">
                    {pdfFile && (
                      <div className="flex items-center gap-2 border border-slate-200 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 max-w-max text-xs font-semibold animate-in fade-in duration-100">
                        <span>SLA Contract PDF Uploaded</span>
                        <button
                          type="button"
                          onClick={() => setPdfFile("")}
                          className="bg-white/85 text-rose-605 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
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
                  <label className="text-xs font-bold text-slate-600 block">Coverage Scope Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parts & labor, priority dispatch response, bi-annual reviews"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={coverage}
                    onChange={(e) => setCoverage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Detailed Terms & Penalties Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Describe penalty rates, renewal notice requirements, replacement schedules..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
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
                  Establish SLA Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CONTRACT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleSubmitEdit} className="p-6 md:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Edit SLA Configuration</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">SLA Title / Nomenclature *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Servicing Vendor Partner *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Agreement Code ID *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-mono"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Start Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Expiration Date *</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Annual Cost Fee *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-semibold text-slate-800"
                        value={annualCost}
                        onChange={(e) => setAnnualCost(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Currency</label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer text-slate-700 font-semibold"
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value as any)}
                      >
                        <option value="CAD">CAD ($)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Agreement Status *</label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden cursor-pointer"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ContractStatus)}
                    >
                      {Object.values(ContractStatus).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Service Agreement PDF Upload</label>
                  <div className="space-y-2">
                    {pdfFile && (
                      <div className="flex items-center gap-2 border border-slate-200 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 max-w-max text-xs font-semibold animate-in fade-in duration-100">
                        <span>SLA Contract PDF Uploaded</span>
                        <button
                          type="button"
                          onClick={() => setPdfFile("")}
                          className="bg-white/85 text-rose-605 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
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
                  <label className="text-xs font-bold text-slate-600 block">Coverage Scope Summary *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden font-semibold"
                    value={coverage}
                    onChange={(e) => setCoverage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Detailed Terms & Penalties Summary</label>
                  <textarea
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:outline-hidden"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
