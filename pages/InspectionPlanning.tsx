
import React, { useState, useMemo } from 'react';
import { MOCK_INSPECTION_PLANS, MOCK_STANDARDS } from '../constants';
import { Status, InspectionPlan, BusinessSector, InspectionStep } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft,
  FileText,
  Trash2,
  Save,
  X,
  Target,
  Layers,
  Settings,
  Copy,
  ArrowUpCircle,
  ArrowDownCircle,
  Briefcase,
  History,
  MoreVertical,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';

const SECTORS: BusinessSector[] = [
  'Construction', 'Aluminium Fabrication', 'Welding', 'Interior Fitout', 
  'Glass & Glazing', 'Design & Architecture', 'Import & Logistics', 'Branding & Development'
];

const PLAN_TYPES = ['Incoming', 'In-process', 'Final', 'Site', 'Design Review'];

export const InspectionPlanning: React.FC = () => {
  const [plans, setPlans] = useState<InspectionPlan[]>(MOCK_INSPECTION_PLANS);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || p.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [plans, searchQuery, filterType]);

  const activePlan = plans.find(p => p.id === activePlanId);

  const handleCreateNew = () => {
    const newId = `ITP-${Date.now()}`;
    const newPlan: InspectionPlan = {
      id: newId,
      name: 'New Control Plan',
      sector: 'Construction',
      product: '',
      standardId: MOCK_STANDARDS[0].id,
      type: 'Final',
      status: Status.DRAFT,
      owner: 'Alex Quality',
      steps: [],
      project: 'Unassigned Project'
    };
    setPlans([newPlan, ...plans]);
    setActivePlanId(newId);
    setIsEditing(true);
  };

  const handleUpdatePlanMetadata = (field: keyof InspectionPlan, value: any) => {
    if (!activePlanId) return;
    setPlans(prev => prev.map(p => p.id === activePlanId ? { ...p, [field]: value } : p));
  };

  const handleAddStep = () => {
    if (!activePlanId) return;
    const newStep: InspectionStep = {
      id: `STEP-${Date.now()}`,
      description: 'New technical check',
      type: 'Visual',
      criteria: '',
      frequency: '100%',
      responsibleRole: 'Inspector'
    };
    setPlans(prev => prev.map(p => {
      if (p.id !== activePlanId) return p;
      return { ...p, steps: [...p.steps, newStep] };
    }));
  };

  const handleUpdateStep = (stepId: string, field: keyof InspectionStep, value: any) => {
    if (!activePlanId) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== activePlanId) return p;
      const newSteps = p.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s);
      return { ...p, steps: newSteps };
    }));
  };

  const handleRemoveStep = (stepId: string) => {
    if (!activePlanId) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== activePlanId) return p;
      return { ...p, steps: p.steps.filter(s => s.id !== stepId) };
    }));
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this inspection plan?')) {
      setPlans(prev => prev.filter(p => p.id !== id));
      if (activePlanId === id) setActivePlanId(null);
    }
  };

  if (activePlanId && activePlan) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setActivePlanId(null); setIsEditing(false); }} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-tight">{activePlan.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${activePlan.status === Status.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{activePlan.status}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {isEditing ? 'Configuring ITP' : 'Inspection Plan Overview'}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
             {isEditing ? (
               <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
               >
                 <Save size={18} /> Save & Finalize
               </button>
             ) : (
               <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
               >
                 <Settings size={18} /> Modify Plan
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Metadata Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} /> Plan Governance
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Plan Name</label>
                  <input 
                    disabled={!isEditing}
                    value={activePlan.name}
                    onChange={(e) => handleUpdatePlanMetadata('name', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Project Assignment</label>
                  <input 
                    disabled={!isEditing}
                    value={activePlan.project || ''}
                    onChange={(e) => handleUpdatePlanMetadata('project', e.target.value)}
                    placeholder="Project ID or Name"
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Business Vertical</label>
                  <select 
                    disabled={!isEditing}
                    value={activePlan.sector}
                    onChange={(e) => handleUpdatePlanMetadata('sector', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner cursor-pointer"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Reference Standard</label>
                  <select 
                    disabled={!isEditing}
                    value={activePlan.standardId}
                    onChange={(e) => handleUpdatePlanMetadata('standardId', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner cursor-pointer"
                  >
                    {MOCK_STANDARDS.map(s => <option key={s.id} value={s.id}>{s.id}: {s.title}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Plan Type</label>
                    <select 
                      disabled={!isEditing}
                      value={activePlan.type}
                      onChange={(e) => handleUpdatePlanMetadata('type', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner cursor-pointer"
                    >
                      {PLAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Plan Status</label>
                    <select 
                      disabled={!isEditing}
                      value={activePlan.status}
                      onChange={(e) => handleUpdatePlanMetadata('status', e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-indigo-500 disabled:bg-white transition-all shadow-inner cursor-pointer"
                    >
                      <option value={Status.DRAFT}>Draft</option>
                      <option value={Status.ACTIVE}>Active</option>
                      <option value={Status.OBSOLETE}>Obsolete</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">AQ</div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Owner</p>
                     <p className="text-sm font-bold text-slate-900">{activePlan.owner}</p>
                   </div>
                </div>
                {!isEditing && (
                  <button onClick={() => handleDeletePlan(activePlan.id)} className="p-3 text-slate-300 hover:text-red-500 transition-all rounded-xl hover:bg-red-50">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="lg:col-span-8 space-y-6">
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">ITP Technical Checkpoints</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sequence of verification steps & Acceptance Thresholds</p>
                  </div>
                  {isEditing && (
                    <button onClick={handleAddStep} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                      <Plus size={16} /> Append Stage
                    </button>
                  )}
                </div>

                <div className="p-8 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                  {activePlan.steps.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                       <div className="p-6 bg-slate-50 rounded-full text-slate-200"><Layers size={48} /></div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs">No technical steps defined. Add steps to establish the inspection protocol.</p>
                    </div>
                  ) : (
                    activePlan.steps.map((step, idx) => (
                      <div key={step.id} className="group bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm hover:border-indigo-200 transition-all animate-in slide-in-from-right-4 duration-300">
                         <div className="flex items-start gap-8">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">{idx + 1}</div>
                            <div className="flex-1 space-y-6">
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Process Point Description</label>
                                     <input 
                                        disabled={!isEditing}
                                        value={step.description}
                                        onChange={(e) => handleUpdateStep(step.id, 'description', e.target.value)}
                                        placeholder="e.g. Weld penetration analysis..."
                                        className="w-full bg-transparent border-b-2 border-slate-100 outline-none p-2 text-sm font-black focus:border-indigo-500 disabled:border-transparent transition-all"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Modality</label>
                                     <select 
                                        disabled={!isEditing}
                                        value={step.type}
                                        onChange={(e) => handleUpdateStep(step.id, 'type', e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-slate-100 outline-none p-2 text-[10px] font-black uppercase text-slate-600 focus:border-indigo-500 disabled:border-transparent cursor-pointer"
                                     >
                                        <option>Visual</option><option>Dimensional</option><option>Functional</option><option>Safety</option><option>Regulatory</option>
                                     </select>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-6 items-end">
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Acceptance Criteria / Threshold</label>
                                     <textarea 
                                        disabled={!isEditing}
                                        value={step.criteria}
                                        onChange={(e) => handleUpdateStep(step.id, 'criteria', e.target.value)}
                                        placeholder="Specific pass/fail limits..."
                                        className="w-full bg-slate-50/50 p-4 rounded-2xl text-xs font-semibold outline-none h-20 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-inner disabled:bg-transparent disabled:shadow-none"
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                           <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Frequency</label>
                                           <input 
                                              disabled={!isEditing}
                                              value={step.frequency}
                                              onChange={(e) => handleUpdateStep(step.id, 'frequency', e.target.value)}
                                              placeholder="e.g. 100%"
                                              className="w-full bg-transparent border-b-2 border-slate-100 outline-none p-2 text-[10px] font-black uppercase text-indigo-600 focus:border-indigo-500 disabled:border-transparent transition-all"
                                           />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Responsible Role</label>
                                           <input 
                                              disabled={!isEditing}
                                              value={step.responsibleRole}
                                              onChange={(e) => handleUpdateStep(step.id, 'responsibleRole', e.target.value)}
                                              placeholder="e.g. Inspector"
                                              className="w-full bg-transparent border-b-2 border-slate-100 outline-none p-2 text-[10px] font-black uppercase text-indigo-600 focus:border-indigo-500 disabled:border-transparent transition-all"
                                           />
                                        </div>
                                     </div>
                                     <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                           <input 
                                              disabled={!isEditing}
                                              type="checkbox" 
                                              checked={step.isMandatoryEvidence} 
                                              onChange={(e) => handleUpdateStep(step.id, 'isMandatoryEvidence', e.target.checked)}
                                              className="w-4 h-4 rounded accent-indigo-600"
                                           />
                                           <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-indigo-600 transition-colors">Req. Photo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                           <input 
                                              disabled={!isEditing}
                                              type="checkbox" 
                                              checked={step.isMandatoryMeasurement} 
                                              onChange={(e) => handleUpdateStep(step.id, 'isMandatoryMeasurement', e.target.checked)}
                                              className="w-4 h-4 rounded accent-indigo-600"
                                           />
                                           <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-indigo-600 transition-colors">Req. Value</span>
                                        </label>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            {isEditing && (
                              <button onClick={() => handleRemoveStep(step.id)} className="p-3 text-slate-200 hover:text-red-500 transition-all hover:bg-red-50 rounded-2xl">
                                <Trash2 size={24} />
                              </button>
                            )}
                         </div>
                      </div>
                    ))
                  )}
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Inspection Planning</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-80">Design Master Inspection & Test Plans (ITP)</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text"
              placeholder="Filter plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase"
            />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <Filter size={18} className="text-slate-400 mr-2" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase cursor-pointer"
            >
              <option value="All">All Types</option>
              {PLAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={20} /> Create New ITP
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Reference ID</th>
                <th className="px-8 py-6">Plan & Project</th>
                <th className="px-8 py-6">Product Scope</th>
                <th className="px-8 py-6">Hierarchy Level</th>
                <th className="px-8 py-6">Authority</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-8 py-24 text-center text-slate-400 text-sm italic font-medium">No established inspection plans found in registry.</td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                    <tr key={plan.id} className="group hover:bg-slate-50/70 transition-all cursor-pointer" onClick={() => setActivePlanId(plan.id)}>
                    <td className="px-8 py-6">
                        <span className="text-base font-black text-slate-900 tracking-tight uppercase">{plan.id}</span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{plan.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                             <Briefcase size={8} /> {plan.project}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.sector}</span>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-700">{plan.product || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-700 uppercase bg-indigo-50/80 w-fit px-3 py-1.5 rounded-xl border border-indigo-100">
                        {plan.type}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-[11px] font-black uppercase shadow-lg shadow-slate-200 border border-slate-800">
                            {plan.owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{plan.owner}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        plan.status === Status.ACTIVE ? 'bg-emerald-100 text-emerald-800' :
                        plan.status === Status.DRAFT ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-800'
                        }`}>
                        {plan.status}
                        </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActivePlanId(plan.id); setIsEditing(true); }}
                                className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-sm"
                            >
                                <Edit3 size={20} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                                className="p-3 text-slate-400 hover:text-red-500 transition-all hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-sm"
                            >
                                <Trash2 size={20} />
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

// Internal icon proxy for consistency
const Edit3 = ({ size }: { size: number }) => <Settings size={size} />;
