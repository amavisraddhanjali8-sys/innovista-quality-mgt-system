
import React, { useState, useMemo } from 'react';
import { MOCK_NCRs } from '../constants';
import { Severity, Status, NCR, SubTask, AuditEntry } from '../types';
import { 
  Filter, 
  Plus, 
  FileDown, 
  AlertTriangle, 
  ShieldAlert, 
  Package, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  User, 
  Sparkles,
  X,
  Factory,
  Truck,
  MessageSquare,
  ClipboardList,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const styles = {
    [Severity.LOW]: 'bg-emerald-100 text-emerald-700',
    [Severity.MEDIUM]: 'bg-yellow-100 text-yellow-700',
    [Severity.HIGH]: 'bg-orange-100 text-orange-700',
    [Severity.CRITICAL]: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[severity]}`}>{severity}</span>;
};

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    [Status.OPEN]: 'bg-blue-100 text-blue-700',
    [Status.IN_PROGRESS]: 'bg-indigo-100 text-indigo-700',
    [Status.CLOSED]: 'bg-slate-100 text-slate-700',
    [Status.FAILED]: 'bg-red-100 text-red-700',
    [Status.PASSED]: 'bg-emerald-100 text-emerald-700',
  } as any;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>{status}</span>;
};

interface NonconformanceProps {
  searchQuery?: string;
}

export const Nonconformance: React.FC<NonconformanceProps> = ({ searchQuery = '' }) => {
  const [ncrs, setNcrs] = useState<NCR[]>(MOCK_NCRs);
  const [activeNcrId, setActiveNcrId] = useState<string>(MOCK_NCRs[0].id);
  const [activeTab, setActiveTab] = useState<'info' | 'containment' | 'disposition' | 'history'>('info');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'All'>('All');
  
  // Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [newNcrData, setNewNcrData] = useState<Partial<NCR>>({
    severity: Severity.MEDIUM,
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    project: ''
  });

  // Comprehensive Filtering Logic
  const filteredNcrs = useMemo(() => {
    return ncrs.filter(n => {
      const matchesSearch = 
        n.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.project.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'All' || n.severity === filterSeverity;
      
      return matchesSearch && matchesSeverity;
    });
  }, [ncrs, searchQuery, filterSeverity]);

  const activeNcr = filteredNcrs.find(n => n.id === activeNcrId) || filteredNcrs[0] || ncrs[0];

  const createHistoryEntry = (action: string, details?: string): AuditEntry => ({
    id: `HIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString(),
    user: 'Alex Quality',
    action,
    details
  });

  const updateNcr = (id: string, updates: Partial<NCR>) => {
    setNcrs(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleCreateNcr = () => {
    const id = `NCR-${new Date().getFullYear()}-${String(ncrs.length + 1).padStart(3, '0')}`;
    const ncr: NCR = {
      ...newNcrData as NCR,
      id,
      status: Status.OPEN,
      source: 'Internal System',
      containmentPlan: [],
      history: [createHistoryEntry('NCR Created', `Workflow initiated`)]
    };
    setNcrs([ncr, ...ncrs]);
    setActiveNcrId(id);
    setIsWizardOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Creation Wizard Placeholder */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl rounded-[32px] p-10 space-y-6">
              <h2 className="text-2xl font-black uppercase">Rapid Entry NCR</h2>
              <div className="space-y-4">
                <input placeholder="Project Name" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-600" onChange={e => setNewNcrData({...newNcrData, project: e.target.value})} />
                <input placeholder="Item ID" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-600" onChange={e => setNewNcrData({...newNcrData, productId: e.target.value})} />
                <textarea placeholder="Failure Narrative" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 h-32" onChange={e => setNewNcrData({...newNcrData, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsWizardOpen(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleCreateNcr} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-indigo-100">Commit Record</button>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">NCR Workspace</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">ISO 9001 Clause 8.7 • Operational Control</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Filter size={16} className="text-indigo-600 mr-2" />
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-transparent text-[10px] font-black text-slate-700 uppercase outline-none cursor-pointer"
            >
              <option value="All">All Severities</option>
              {Object.values(Severity).map(s => <option key={s} value={s}>{s} Priority</option>)}
            </select>
          </div>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={18} /> Initiate NCR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Navigation List */}
        <div className="xl:col-span-4 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Queue</h3>
             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{filteredNcrs.length} Active</span>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px] custom-scrollbar">
            {filteredNcrs.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                 <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto text-slate-200"><Search size={32}/></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching records found.</p>
              </div>
            ) : (
              filteredNcrs.map((ncr) => (
                <button
                  key={ncr.id}
                  onClick={() => setActiveNcrId(ncr.id)}
                  className={`w-full text-left p-6 transition-all border-l-4 group ${
                    activeNcrId === ncr.id ? 'bg-indigo-50 border-indigo-600' : 'border-transparent hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-slate-900 text-sm tracking-tight">{ncr.id}</span>
                    <SeverityBadge severity={ncr.severity} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                     <Briefcase size={10} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{ncr.project}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mb-3 line-clamp-2 leading-relaxed italic">"{ncr.description}"</p>
                  <div className="flex justify-between items-center pt-2">
                    <StatusBadge status={ncr.status} />
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={10} />
                      <span className="text-[9px] font-black uppercase">{ncr.date}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detailed Workspace */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
            {activeNcr ? (
              <>
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activeNcr.id}</h2>
                        <span className="px-3 py-1 bg-indigo-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{activeNcr.project}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{activeNcr.productId} — {activeNcr.source}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all">
                      <FileDown size={22} />
                    </button>
                  </div>
                </div>

                <div className="flex px-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                  {[
                    { id: 'info', label: 'Failure Ledger', icon: AlertTriangle },
                    { id: 'containment', label: 'Containment', icon: ShieldAlert },
                    { id: 'disposition', label: 'Technical Disposition', icon: CheckCircle2 },
                    { id: 'history', label: 'Audit Trail', icon: History }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-5 px-6 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === tab.id 
                          ? 'text-indigo-600 border-indigo-600' 
                          : 'text-slate-400 border-transparent hover:text-slate-600'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-10 flex-1 overflow-y-auto max-h-[550px] custom-scrollbar">
                   {/* Local tab content logic remains but is now connected to the filtered view */}
                   {activeTab === 'info' && (
                     <div className="space-y-10 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-12">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detection Origin</label>
                              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><ClipboardList size={20}/></div>
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeNcr.source}</span>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affected Quantity</label>
                              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                 <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Package size={20}/></div>
                                 <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeNcr.quantity} Units</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Failure Narrative</label>
                           <div className="p-8 bg-indigo-50/30 rounded-[32px] border border-indigo-100 text-sm text-slate-700 leading-relaxed font-medium italic shadow-inner">
                              "{activeNcr.description}"
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6">
                           <div className="p-6 bg-slate-50 rounded-2xl space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase">Detection Date</p>
                              <p className="text-xs font-black text-slate-700">{activeNcr.date}</p>
                           </div>
                           <div className="p-6 bg-slate-50 rounded-2xl space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase">Reporting Agent</p>
                              <p className="text-xs font-black text-slate-700">A. Quality (QA-01)</p>
                           </div>
                           <div className="p-6 bg-slate-50 rounded-2xl space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase">System Status</p>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                                <p className="text-xs font-black text-slate-700 uppercase">{activeNcr.status}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                   {/* Other active tabs would go here, maintaining the stateful logic */}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                 <div className="p-10 bg-slate-50 rounded-full text-slate-200"><AlertTriangle size={64}/></div>
                 <h3 className="text-xl font-black text-slate-900 uppercase">No NCR Selected</h3>
                 <p className="text-sm text-slate-400 max-w-xs font-medium uppercase tracking-widest">Select a report from the integrity queue or use the filters to narrow down the ledger.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
