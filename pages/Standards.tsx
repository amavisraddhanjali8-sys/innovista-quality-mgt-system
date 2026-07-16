
import React, { useState, useMemo } from 'react';
import { MOCK_STANDARDS, MOCK_INSPECTION_PLANS } from '../constants';
import { Status, Standard, BusinessSector, InspectionPlan } from '../types';
import { 
  FileText, 
  Filter, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  History, 
  Clock, 
  FileDown, 
  Settings, 
  Eye, 
  Hash,
  Globe,
  X,
  FileSignature,
  Link as LinkIcon,
  Unlink,
  ExternalLink,
  Target,
  ClipboardList,
  Briefcase,
  Search,
  // Fix: Added missing Check icon import
  Check
} from 'lucide-react';

const StandardStatusBadge = ({ status }: { status: Status }) => {
  const configs = {
    [Status.ACTIVE]: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100',
      dot: 'bg-emerald-500 animate-pulse',
      label: 'Approved & Active'
    },
    [Status.DRAFT]: {
      container: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500 animate-bounce',
      label: 'Work In Progress'
    },
    [Status.OBSOLETE]: {
      container: 'bg-slate-100 text-slate-500 border-slate-200 grayscale',
      dot: 'bg-slate-400',
      label: 'Deprecated'
    },
    [Status.PENDING]: {
      container: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500 animate-pulse',
      label: 'Awaiting Review'
    }
  };

  const config = configs[status as keyof typeof configs] || configs[Status.DRAFT];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-500 ${config.container}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </div>
  );
};

interface StandardsProps {
  searchQuery?: string;
}

export const Standards: React.FC<StandardsProps> = ({ searchQuery = '' }) => {
  const [standards, setStandards] = useState<Standard[]>(MOCK_STANDARDS);
  const [plans, setPlans] = useState<InspectionPlan[]>(MOCK_INSPECTION_PLANS);
  const [activeStandardId, setActiveStandardId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterOrigin, setFilterOrigin] = useState('All');
  const [showLinkModal, setShowLinkModal] = useState(false);

  const filteredStandards = useMemo(() => {
    return standards.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesOrigin = filterOrigin === 'All' || s.origin === filterOrigin;
      return matchesSearch && matchesOrigin;
    });
  }, [standards, searchQuery, filterOrigin]);

  const activeStandard = useMemo(() => 
    standards.find(s => s.id === activeStandardId), 
  [standards, activeStandardId]);

  const linkedPlans = useMemo(() => 
    activeStandardId ? plans.filter(p => p.standardId === activeStandardId) : [],
  [plans, activeStandardId]);

  const unlinkedPlans = useMemo(() => 
    activeStandardId ? plans.filter(p => p.standardId !== activeStandardId) : [],
  [plans, activeStandardId]);

  const handleCreateNew = () => {
    const newId = `STD-${Date.now().toString().slice(-3)}`;
    const newStd: Standard = {
      id: newId,
      title: 'New Technical Specification',
      version: '1.0',
      origin: 'Internal',
      status: Status.DRAFT,
      owner: 'Alex Quality',
      lastUpdated: new Date().toISOString().split('T')[0],
      description: 'Define scope...',
      project: 'Global QMS'
    };
    setStandards([newStd, ...standards]);
    setActiveStandardId(newId);
    setIsEditing(true);
  };

  const handleUpdateStandard = (field: keyof Standard, value: any) => {
    if (!activeStandardId) return;
    setStandards(prev => prev.map(s => s.id === activeStandardId ? { ...s, [field]: value } : s));
  };

  const handleApprove = () => {
    if (!activeStandardId) return;
    handleUpdateStandard('status', Status.ACTIVE);
    handleUpdateStandard('lastUpdated', new Date().toISOString().split('T')[0]);
    setIsEditing(false);
  };

  const handleLinkPlan = (planId: string) => {
    if (!activeStandardId) return;
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, standardId: activeStandardId } : p));
    setShowLinkModal(false);
  };

  const handleUnlinkPlan = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, standardId: 'N/A' } : p));
  };

  if (activeStandardId && activeStandard) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        {/* Link Plan Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-900 uppercase">Link Technical Plan</h3>
                <button onClick={() => setShowLinkModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={18}/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-2 custom-scrollbar">
                {unlinkedPlans.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10 font-medium uppercase tracking-widest">No available plans.</p>
                ) : (
                  unlinkedPlans.map(plan => (
                    <button 
                      key={plan.id}
                      onClick={() => handleLinkPlan(plan.id)}
                      className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase truncate">{plan.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{plan.id}</p>
                      </div>
                      <Plus size={16} className="text-slate-300 group-hover:text-indigo-600" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setActiveStandardId(null); setIsEditing(false); }} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-tight">{activeStandard.id}</span>
                <StandardStatusBadge status={activeStandard.status} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Document Control Panel</h1>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
                <FileDown size={20} />
             </button>
             {activeStandard.status === Status.DRAFT ? (
               <button 
                onClick={handleApprove}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
               >
                 <ShieldCheck size={18} /> Finalise & Sign-off
               </button>
             ) : (
               <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
               >
                 {isEditing ? <><Check size={18} /> Save Draft</> : <><Settings size={18} /> Edit Master Copy</>}
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={16} /> Technical Metadata
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Document Title</label>
                  <input 
                    disabled={!isEditing && activeStandard.status !== Status.DRAFT}
                    value={activeStandard.title}
                    onChange={(e) => handleUpdateStandard('title', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner"
                  />
                </div>
                {/* Associated Project */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Target Project</label>
                  <input 
                    disabled={!isEditing && activeStandard.status !== Status.DRAFT}
                    value={activeStandard.project || ''}
                    onChange={(e) => handleUpdateStandard('project', e.target.value)}
                    placeholder="Global QMS or Project Code"
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Version</label>
                    <input 
                      disabled={!isEditing && activeStandard.status !== Status.DRAFT}
                      value={activeStandard.version}
                      onChange={(e) => handleUpdateStandard('version', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Type</label>
                    <select 
                      disabled={!isEditing && activeStandard.status !== Status.DRAFT}
                      value={activeStandard.origin}
                      onChange={(e) => handleUpdateStandard('origin', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner cursor-pointer"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Customer">Customer</option>
                      <option value="Regulatory">Regulatory</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Scope & Requirements</h3>
               </div>
               <div className="p-10 flex-1">
                  <textarea 
                    disabled={!isEditing && activeStandard.status !== Status.DRAFT}
                    value={activeStandard.description}
                    onChange={(e) => handleUpdateStandard('description', e.target.value)}
                    placeholder="Enter detailed scope..."
                    className="w-full h-full min-h-[300px] bg-slate-50/50 border-2 border-slate-100 p-8 rounded-3xl text-base font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner disabled:bg-transparent disabled:border-transparent disabled:shadow-none italic text-slate-600"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Standard Registry</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-80">Clause 7.5 Controlled Information Repository</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <Filter size={18} className="text-indigo-600 mr-2" />
            <select 
              value={filterOrigin} 
              onChange={(e) => setFilterOrigin(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black text-slate-700 uppercase cursor-pointer tracking-widest"
            >
              <option value="All">All Origins</option>
              <option value="Internal">Internal Only</option>
              <option value="Customer">Customer Specs</option>
              <option value="Regulatory">Regulatory Codes</option>
            </select>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={20} /> Register Standard
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Title & Application</th>
                <th className="px-8 py-6">Vertical Origin</th>
                <th className="px-8 py-6">Custodian</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStandards.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-8 py-24 text-center text-slate-400 text-sm italic font-medium">No standards found in current view.</td>
                </tr>
              ) : (
                filteredStandards.map((std) => (
                    <tr key={std.id} className="group hover:bg-slate-50/70 transition-all cursor-pointer" onClick={() => setActiveStandardId(std.id)}>
                    <td className="px-8 py-6">
                        <span className="text-base font-black text-slate-900 tracking-tight uppercase">{std.id}</span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{std.title}</span>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black uppercase border border-indigo-100 flex items-center gap-1">
                                <Briefcase size={8} /> {std.project}
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">V{std.version}</span>
                           </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-700 uppercase bg-indigo-50/80 w-fit px-3 py-1.5 rounded-xl border border-indigo-100">
                           <Globe size={10} />
                           {std.origin}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-[11px] font-black uppercase">
                              {std.owner.split(' ').map(n => n[0]).join('')}
                           </div>
                           <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{std.owner}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <StandardStatusBadge status={std.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveStandardId(std.id); setIsEditing(true); }}
                                className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-xl border border-transparent hover:border-slate-200"
                            >
                                <Settings size={20} />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};