
import React, { useState, useMemo } from 'react';
import { MOCK_INSPECTION_TASKS, MOCK_STANDARDS, MOCK_INSPECTION_PLANS } from '../constants';
import { Status, InspectionTask, BusinessSector, InspectionStep, InspectionPlan } from '../types';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  Clock,
  User,
  Package,
  FileText,
  BarChart3,
  History,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Compass,
  Hammer,
  Layout as LayoutIcon,
  Truck,
  Palette,
  HardHat,
  Construction,
  Save,
  X,
  Camera,
  Layers,
  Info,
  Target,
  Loader2,
  Calendar,
  Briefcase,
  AlertCircle,
  GripVertical,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ArrowDownCircle,
  ArrowUpCircle,
  ListChecks,
  FileSignature,
  LayoutTemplate,
  Trash2
} from 'lucide-react';

const SectorIcon = ({ sector }: { sector: BusinessSector }) => {
  const icons: Record<string, any> = {
    'Construction': Construction,
    'Aluminium Fabrication': Hammer,
    'Welding': Settings,
    'Interior Fitout': LayoutIcon,
    'Glass & Glazing': Package,
    'Design & Architecture': Compass,
    'Import & Logistics': Truck,
    'Branding & Development': Palette
  };
  const Icon = icons[sector] || ClipboardCheck;
  return <Icon size={16} />;
};

const TECHNICAL_UNITS = [
  'N/A', 'mm', 'µm', 'm', 'kg', 'Nm', 'MPa', 'Shore A', 'RAL', 'Pantone', 'dB', '°C', 'Job Code'
];

const CATEGORIES = [
  'Pre-check', 'Preparation', 'Core Process', 'Dimensions', 'Aesthetics', 'Safety', 'Final / Documentation'
];

const SECTORS: BusinessSector[] = [
  'Construction', 
  'Aluminium Fabrication', 
  'Welding', 
  'Interior Fitout', 
  'Glass & Glazing', 
  'Design & Architecture', 
  'Import & Logistics', 
  'Branding & Development'
];

export const Inspections: React.FC = () => {
  const [tasks, setTasks] = useState<InspectionTask[]>(MOCK_INSPECTION_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [filterSector, setFilterSector] = useState<BusinessSector | 'All'>('All');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showStandardDetails, setShowStandardDetails] = useState(false);
  const [showReviewStage, setShowReviewStage] = useState(false);
  
  // New Job Modal State
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState<Partial<InspectionTask>>({
    sector: 'Construction',
    status: Status.PLANNED,
    scheduledDate: new Date().toISOString().split('T')[0],
    results: [],
    project: ''
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Photo Simulation
  const [capturing, setCapturing] = useState(false);

  const filteredTasks = useMemo(() => 
    tasks.filter(t => filterSector === 'All' || t.sector === filterSector),
  [tasks, filterSector]);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  
  const categorizedSteps = useMemo(() => {
    if (!activeTask) return {} as Record<string, { step: InspectionStep, index: number }[]>;
    return activeTask.results.reduce((acc, step, index) => {
      const cat = step.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ step, index });
      return acc;
    }, {} as Record<string, { step: InspectionStep, index: number }[]>);
  }, [activeTask]);

  const handleUpdateStepResult = (stepId: string, result: Status.PASSED | Status.FAILED, measurement?: string, comment?: string, evidence?: string) => {
    if (!activeTaskId) return;
    setTasks(prev => prev.map(task => {
      if (task.id !== activeTaskId) return task;
      const updatedResults = task.results.map(step => {
        if (step.id !== stepId) return step;
        
        let finalResult = result;
        // Auto-validate numeric measurement if range exists
        if (measurement !== undefined) {
          const val = parseFloat(measurement);
          if (!isNaN(val)) {
            if ((step.minValue !== undefined && val < step.minValue) || (step.maxValue !== undefined && val > step.maxValue)) {
              finalResult = Status.FAILED;
            } else if (step.minValue !== undefined || step.maxValue !== undefined) {
              finalResult = Status.PASSED;
            }
          }
        }

        return { ...step, result: finalResult, measurement: measurement !== undefined ? measurement : step.measurement, comment: comment !== undefined ? comment : step.comment, evidence: evidence || step.evidence };
      });
      return { ...task, results: updatedResults, status: Status.IN_PROGRESS };
    }));
  };

  const handleCapturePhoto = (stepId: string) => {
    setCapturing(true);
    setTimeout(() => {
      const simulatedUrl = `https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400`;
      handleUpdateStepResult(stepId, Status.PASSED, undefined, undefined, simulatedUrl);
      setCapturing(false);
    }, 1500);
  };

  const handleAddStep = (category?: string) => {
    if (!activeTaskId) return;
    const newStep: InspectionStep = {
      id: `STEP-${Date.now()}`,
      description: 'New Quality Check',
      category: category || 'Core Process',
      type: 'Visual',
      criteria: 'Define technical threshold...',
      unit: 'N/A'
    };
    setTasks(prev => prev.map(task => {
      if (task.id !== activeTaskId) return task;
      return { ...task, results: [...task.results, newStep] };
    }));
    setCurrentStepIndex(activeTask?.results.length || 0);
  };

  const handleEditStepData = (stepId: string, field: keyof InspectionStep, value: any) => {
    if (!activeTaskId) return;
    setTasks(prev => prev.map(task => {
      if (task.id !== activeTaskId) return task;
      const updatedResults = task.results.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      );
      return { ...task, results: updatedResults };
    }));
  };

  const handleFinishInspection = () => {
    if (!activeTaskId || !activeTask) return;
    
    const unmetRequirements = activeTask.results.some(r => {
      if (r.isMandatoryMeasurement && !r.measurement) return true;
      if (r.isMandatoryEvidence && !r.evidence) return true;
      if (!r.result) return true;
      return false;
    });

    if (unmetRequirements) {
      alert("Cannot complete inspection. Please ensure all mandatory data and evidence are recorded.");
      return;
    }

    const allPassed = activeTask.results.every(r => r.result === Status.PASSED);
    setTasks(prev => prev.map(task => 
      task.id === activeTaskId ? { ...task, status: allPassed ? Status.COMPLETED : Status.FAILED, completedDate: new Date().toISOString() } : task
    ));
    setActiveTaskId(null);
    setIsEditMode(false);
    setShowReviewStage(false);
  };

  const handleDispatchJob = () => {
    if (!newJobData.planName || !newJobData.lotNumber || !newJobData.inspector || !newJobData.project) {
      alert("Please fill in mandatory fields: Project, Task Name, Lot #, and Inspector.");
      return;
    }

    const id = `INS-${newJobData.sector?.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const task: InspectionTask = {
      ...newJobData as InspectionTask,
      id,
      planId: selectedPlanId || 'CUSTOM',
      status: Status.PLANNED,
      results: newJobData.results || [],
      type: 'High Integrity Audit'
    };

    setTasks([task, ...tasks]);
    setIsNewJobModalOpen(false);
    setNewJobData({
      sector: 'Construction',
      status: Status.PLANNED,
      scheduledDate: new Date().toISOString().split('T')[0],
      results: [],
      project: ''
    });
    setSelectedPlanId('');
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = MOCK_INSPECTION_PLANS.find(p => p.id === planId);
    if (plan) {
      setNewJobData(prev => ({
        ...prev,
        planName: plan.name,
        sector: plan.sector,
        project: plan.project || '',
        results: plan.steps.map(s => ({ ...s, result: undefined, measurement: undefined, evidence: undefined }))
      }));
    }
  };

  const isOutOfRange = (step: InspectionStep) => {
    if (!step.measurement) return false;
    const val = parseFloat(step.measurement);
    if (isNaN(val)) return false;
    if (step.minValue !== undefined && val < step.minValue) return true;
    if (step.maxValue !== undefined && val > step.maxValue) return true;
    return false;
  };

  if (activeTaskId && activeTask) {
    const currentStep = activeTask.results[currentStepIndex];
    const totalSteps = activeTask.results.length;
    const completedCount = activeTask.results.filter(r => r.result).length;
    const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setActiveTaskId(null); setIsEditMode(false); setShowReviewStage(false); }} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold uppercase flex items-center gap-1">
                  <SectorIcon sector={activeTask.sector} /> {activeTask.sector}
                </div>
                <span className="px-2 py-0.5 bg-slate-900 text-slate-100 rounded text-[10px] font-bold uppercase tracking-tight">Audit #{activeTask.id}</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-200">{activeTask.project}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Protocol Modification' : showReviewStage ? 'Compliance Review' : 'Inspection Execution'}
              </h1>
            </div>
          </div>
          {/* ... Action buttons remained same ... */}
          <div className="flex gap-2">
             <button 
                onClick={() => setShowStandardDetails(!showStandardDetails)}
                className={`p-2.5 rounded-lg border transition-all ${showStandardDetails ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}`}
                title="View Linked Standards"
             >
                <Info size={20} />
             </button>
             {!showReviewStage && (
                <button 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${
                      isEditMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isEditMode ? <><Save size={16} /> Save Changes</> : <><Settings size={16} /> Edit Protocol</>}
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Progress</span>
                <span className="text-xs font-bold text-indigo-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-3 text-[10px] font-bold text-slate-400 text-center uppercase tracking-tight">{completedCount} of {totalSteps} stages checked</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Flow Stages</h3>
                {isEditMode && (
                    <button onClick={() => handleAddStep()} className="p-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        <Plus size={14} />
                    </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {(Object.entries(categorizedSteps) as [string, { step: InspectionStep, index: number }[]][]).map(([category, steps]) => (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={12} /> {category}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {steps.map(({ step, index }) => (
                        <button
                          key={step.id}
                          onClick={() => { setShowReviewStage(false); setCurrentStepIndex(index); }}
                          className={`group w-full text-left p-4 transition-all flex items-center justify-between border-l-4 ${
                            currentStepIndex === index && !showReviewStage ? 'bg-indigo-50 border-indigo-600' : 'hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              step.result === Status.PASSED ? 'bg-emerald-100 text-emerald-600' : 
                              step.result === Status.FAILED ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className={`text-[11px] font-black truncate uppercase tracking-tighter ${currentStepIndex === index && !showReviewStage ? 'text-indigo-900' : 'text-slate-600'}`}>{step.description}</span>
                              <div className="flex items-center gap-1.5">
                                {step.isMandatoryEvidence && <Camera size={8} className="text-amber-500" />}
                                {step.isMandatoryMeasurement && <BarChart3 size={8} className="text-blue-500" />}
                                {step.result && <Check size={8} className="text-emerald-500" />}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[650px]">
              {showReviewStage ? (
                <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                   <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Technical Review Board</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Certify results before permanent ledger recording</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pass Index</p>
                          <p className="text-2xl font-black text-emerald-600">{activeTask.results.filter(r => r.result === Status.PASSED).length}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Failures</p>
                          <p className="text-2xl font-black text-red-600">{activeTask.results.filter(r => r.result === Status.FAILED).length}</p>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex-1 p-8 overflow-y-auto space-y-3 custom-scrollbar">
                     {activeTask.results.map((r, i) => (
                       <div key={r.id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${r.result === Status.PASSED ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                             {i + 1}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800 uppercase">{r.description}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{r.category} • {r.measurement || 'No numeric data'}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                           <button onClick={() => { setShowReviewStage(false); setCurrentStepIndex(i); }} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase">Revise</button>
                           <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${r.result === Status.PASSED ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                             {r.result}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="p-10 border-t border-slate-100 flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4 max-w-lg text-center">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><FileSignature size={32} /></div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase">Audit Certification</h4>
                          <p className="text-sm text-slate-500 font-medium">By submitting, you certify that all measurements and evidence provided are accurate as per ISO quality protocols.</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleFinishInspection}
                        className="px-24 py-5 bg-indigo-600 text-white rounded-[24px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                      >
                        Commit & Certify Audit
                      </button>
                   </div>
                </div>
              ) : (
                <>
                <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/20">
                    <div className="space-y-4 flex-1">
                        {isEditMode ? (
                            <div className="space-y-6 pr-10 animate-in slide-in-from-left-2 duration-300">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-7 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Point Label</label>
                                        <input 
                                            value={currentStep.description}
                                            onChange={(e) => handleEditStepData(currentStep.id, 'description', e.target.value)}
                                            className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-sm font-black outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="col-span-5 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stage Category</label>
                                        <select 
                                            value={currentStep.category || 'Core Process'}
                                            onChange={(e) => handleEditStepData(currentStep.id, 'category', e.target.value)}
                                            className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-sm font-black outline-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Min Value</label>
                                        <input 
                                            type="number"
                                            value={currentStep.minValue ?? ''}
                                            onChange={(e) => handleEditStepData(currentStep.id, 'minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-sm font-black outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Max Value</label>
                                        <input 
                                            type="number"
                                            value={currentStep.maxValue ?? ''}
                                            onChange={(e) => handleEditStepData(currentStep.id, 'maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                                            className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-sm font-black outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Enforce Mandatory</label>
                                        <div className="flex gap-2 pt-1">
                                           <button 
                                              onClick={() => handleEditStepData(currentStep.id, 'isMandatoryEvidence', !currentStep.isMandatoryEvidence)}
                                              className={`flex-1 p-2 rounded-lg border-2 text-[9px] font-black uppercase transition-all ${currentStep.isMandatoryEvidence ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}
                                           >
                                              Photo
                                           </button>
                                           <button 
                                              onClick={() => handleEditStepData(currentStep.id, 'isMandatoryMeasurement', !currentStep.isMandatoryMeasurement)}
                                              className={`flex-1 p-2 rounded-lg border-2 text-[9px] font-black uppercase transition-all ${currentStep.isMandatoryMeasurement ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-100 text-slate-400'}`}
                                           >
                                              Value
                                           </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technical Criteria Text</label>
                                    <textarea 
                                        value={currentStep.criteria}
                                        onChange={(e) => handleEditStepData(currentStep.id, 'criteria', e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl text-xs font-medium outline-none h-24 resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded uppercase tracking-wider">{currentStep.category} • {currentStep.type}</span>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{currentStep.description}</h2>
                                    {currentStep.unit && currentStep.unit !== 'N/A' && (
                                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100 uppercase">Unit: {currentStep.unit}</span>
                                    )}
                                </div>
                                <div className="p-6 bg-slate-50 border-l-4 border-indigo-600 rounded-r-2xl flex items-start gap-5">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Target size={24} /></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Required Standard</p>
                                        <p className="text-base text-slate-800 font-bold leading-relaxed italic">"{currentStep.criteria}"</p>
                                        {(currentStep.minValue !== undefined || currentStep.maxValue !== undefined) && (
                                          <div className="mt-3 flex gap-4">
                                            <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">LIMITS: {currentStep.minValue ?? 'N/A'} — {currentStep.maxValue ?? 'N/A'}</span>
                                          </div>
                                        )}
                                    </div>
                                </div>
                                {(currentStep.isMandatoryEvidence || currentStep.isMandatoryMeasurement) && (
                                  <div className="flex gap-4">
                                    {currentStep.isMandatoryEvidence && <div className="flex items-center gap-2 text-[9px] font-black text-amber-700 uppercase bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100"><Camera size={12} /> Photo Evidence Required</div>}
                                    {currentStep.isMandatoryMeasurement && <div className="flex items-center gap-2 text-[9px] font-black text-blue-700 uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"><BarChart3 size={12} /> Technical Value Required</div>}
                                  </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 border-l border-slate-100 pl-6">
                      <button disabled={currentStepIndex === 0} onClick={() => setCurrentStepIndex(currentStepIndex - 1)} className="p-3 text-slate-300 hover:text-indigo-600 disabled:opacity-20 rounded-xl hover:bg-slate-50"><ChevronUp size={28}/></button>
                      <button disabled={currentStepIndex === totalSteps - 1} onClick={() => setCurrentStepIndex(currentStepIndex + 1)} className="p-3 text-slate-300 hover:text-indigo-600 disabled:opacity-20 rounded-xl hover:bg-slate-50"><ChevronDown size={28}/></button>
                    </div>
                </div>

                {!isEditMode && (
                    <div className="p-10 flex-1 space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-center gap-10">
                            <button 
                              onClick={() => handleUpdateStepResult(currentStep.id, Status.FAILED)}
                              className={`px-20 py-10 rounded-[40px] font-black text-2xl transition-all flex flex-col items-center gap-4 border-4 ${
                                  currentStep.result === Status.FAILED 
                                  ? 'bg-red-50 border-red-500 text-red-700 shadow-2xl shadow-red-200 scale-105' 
                                  : 'bg-white border-slate-100 text-slate-200 hover:border-red-200 hover:text-red-400'
                              }`}
                            >
                              <XCircle size={48} /> REJECTED
                            </button>
                            <button 
                              onClick={() => handleUpdateStepResult(currentStep.id, Status.PASSED)}
                              className={`px-20 py-10 rounded-[40px] font-black text-2xl transition-all flex flex-col items-center gap-4 border-4 ${
                                  currentStep.result === Status.PASSED 
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xl shadow-emerald-200 scale-105' 
                                  : 'bg-white border-slate-100 text-slate-200 hover:border-emerald-200 hover:text-emerald-400'
                              }`}
                            >
                              <CheckCircle size={48} /> APPROVED
                            </button>
                        </div>

                        <div className="grid grid-cols-12 gap-10">
                          <div className="col-span-8 grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Dimensional Data Log</label>
                                <div className={`flex items-center bg-white border-2 rounded-2xl px-6 py-6 transition-all shadow-sm ${isOutOfRange(currentStep) ? 'border-red-500 bg-red-50 ring-4 ring-red-100' : 'border-slate-100 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-50'}`}>
                                  <input 
                                      type="text" 
                                      value={currentStep.measurement || ''}
                                      onChange={(e) => handleUpdateStepResult(currentStep.id, currentStep.result as any, e.target.value)}
                                      placeholder="Exact numerical input..."
                                      className="bg-transparent border-none outline-none text-2xl font-black w-full text-slate-900 placeholder:text-slate-200"
                                  />
                                  <BarChart3 size={28} className={isOutOfRange(currentStep) ? 'text-red-500' : 'text-slate-200'} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Condition Observations</label>
                                <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl px-6 py-6 focus-within:border-indigo-600 transition-all shadow-sm focus-within:ring-4 focus-within:ring-indigo-50">
                                  <input 
                                      type="text" 
                                      value={currentStep.comment || ''}
                                      onChange={(e) => handleUpdateStepResult(currentStep.id, currentStep.result as any, undefined, e.target.value)}
                                      placeholder="Visual defects or notes..."
                                      className="bg-transparent border-none outline-none text-base font-bold w-full text-slate-700 placeholder:text-slate-200"
                                  />
                                  <FileText size={28} className="text-slate-200" />
                                </div>
                            </div>
                          </div>
                          <div className="col-span-4 space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">High-Res Evidence</label>
                             <div className="relative group overflow-hidden border-2 border-slate-100 rounded-2xl h-[120px] flex items-center justify-center bg-slate-50 transition-all hover:border-indigo-300 cursor-pointer shadow-sm">
                                {currentStep.evidence ? (
                                  <>
                                    <img src={currentStep.evidence} alt="Evidence" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                    <button onClick={() => handleCapturePhoto(currentStep.id)} className="z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 uppercase shadow-xl hover:bg-white transition-colors">
                                       <Camera size={14} className="inline mr-2" /> Replace Capture
                                    </button>
                                  </>
                                ) : (
                                  <button onClick={() => handleCapturePhoto(currentStep.id)} className="flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                    {capturing ? <Loader2 size={32} className="animate-spin text-indigo-600" /> : <Camera size={40} />}
                                    <span className="text-[10px] font-black uppercase tracking-tight">{capturing ? 'Initializing Optics...' : 'Capture Detail'}</span>
                                  </button>
                                )}
                             </div>
                          </div>
                        </div>
                    </div>
                )}
                </>
              )}

              <div className="px-10 py-8 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-white mt-auto">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.1em]">
                   <div className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-lg shadow-emerald-500/20`}></div>
                   <span>{isEditMode ? 'Protocol Modification Mode' : showReviewStage ? 'Compliance Confirmation' : 'Live Integrity Audit'}</span>
                </div>
                {!isEditMode && totalSteps > 0 && (
                  <button 
                    onClick={() => showReviewStage ? handleFinishInspection() : setShowReviewStage(true)}
                    disabled={activeTask.results.some(r => !r.result)}
                    className="px-12 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-20"
                  >
                    {showReviewStage ? 'Finalize Certificate' : 'Review & Confirm'}
                  </button>
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
      {/* New Job Dispatch Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200"><Briefcase size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Audit Dispatch System</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operation Workflow Initiation Control</p>
                </div>
              </div>
              <button onClick={() => setIsNewJobModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"><X size={24} /></button>
            </div>

            <div className="p-10 flex-1 overflow-y-auto space-y-12 custom-scrollbar">
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-4 space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">Industrial Vertical</label>
                  <div className="grid grid-cols-1 gap-2">
                    {SECTORS.map(s => (
                      <button 
                        key={s}
                        onClick={() => setNewJobData({ ...newJobData, sector: s })}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${newJobData.sector === s ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <SectorIcon sector={s} />
                          <span className="text-[10px] font-black uppercase">{s}</span>
                        </div>
                        {newJobData.sector === s && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-8 space-y-8">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <LayoutTemplate size={18} className="text-indigo-600" />
                      <h3 className="text-sm font-black text-slate-900 uppercase">Audit Protocol Template</h3>
                    </div>
                    <select 
                      value={selectedPlanId}
                      onChange={(e) => handlePlanSelection(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all shadow-inner"
                    >
                      <option value="">Select an ITP Master Plan...</option>
                      {MOCK_INSPECTION_PLANS.map(p => <option key={p.id} value={p.id}>{p.id}: {p.name}</option>)}
                    </select>
                  </section>

                  <section className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Project Assignment</label>
                      <input 
                        placeholder="e.g. Skyline Mall Project"
                        value={newJobData.project || ''}
                        onChange={(e) => setNewJobData({ ...newJobData, project: e.target.value })}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job / Lot Identity #</label>
                      <input 
                        placeholder="e.g. LOT-2024-X"
                        value={newJobData.lotNumber || ''}
                        onChange={(e) => setNewJobData({ ...newJobData, lotNumber: e.target.value })}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </section>

                  <section className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Task Context Name</label>
                      <input 
                        placeholder="e.g. Phase 1 structural audit"
                        value={newJobData.planName || ''}
                        onChange={(e) => setNewJobData({ ...newJobData, planName: e.target.value })}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Authorised Inspector</label>
                      <input 
                        placeholder="Search technical user..."
                        value={newJobData.inspector || ''}
                        onChange={(e) => setNewJobData({ ...newJobData, inspector: e.target.value })}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </section>

                  <section className="grid grid-cols-1">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Scheduled Audit Date</label>
                      <input 
                        type="date"
                        value={newJobData.scheduledDate}
                        onChange={(e) => setNewJobData({ ...newJobData, scheduledDate: e.target.value })}
                        className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      />
                    </div>
                  </section>

                  {newJobData.results && newJobData.results.length > 0 && (
                    <section className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100"><ShieldCheck size={24} /></div>
                          <div>
                            <h4 className="text-sm font-black text-emerald-900 uppercase">Protocol Loaded</h4>
                            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">{newJobData.results.length} Technical points integrated from master plan</p>
                          </div>
                       </div>
                       <button onClick={() => setNewJobData({ ...newJobData, results: [] })} className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase underline">Clear Points</button>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <button onClick={() => setIsNewJobModalOpen(false)} className="px-8 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest transition-all">Abort Dispatch</button>
               <button 
                onClick={handleDispatchJob}
                className="px-16 py-5 bg-indigo-600 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
               >
                 Execute Dispatch Flow
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Audit Control Center</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-80">Site & Production Level Integrity Verification</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Filter size={18} className="text-slate-400 mr-3" />
            <select 
              value={filterSector} 
              onChange={(e) => setFilterSector(e.target.value as any)}
              className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase cursor-pointer"
            >
              <option value="All">Global Vertical View</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setIsNewJobModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={20} /> New Job Dispatch
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Control ID</th>
                <th className="px-8 py-6">Project / Identity / Lot</th>
                <th className="px-8 py-6">Industrial Vertical</th>
                <th className="px-8 py-6">Technical Auth</th>
                <th className="px-8 py-6">Modality Status</th>
                <th className="px-8 py-6 text-right">Ledger Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-8 py-24 text-center text-slate-400 text-sm italic font-medium">No pending audit logs in vertical queue.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-50/70 transition-all">
                    <td className="px-8 py-6">
                        <span className="text-base font-black text-slate-900 tracking-tight uppercase">{task.id}</span>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{task.planName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase">{task.project}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ref: {task.lotNumber}</span>
                        </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-700 uppercase bg-indigo-50/80 w-fit px-3 py-1.5 rounded-xl border border-indigo-100">
                        <SectorIcon sector={task.sector} />
                        {task.sector}
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-[11px] font-black uppercase shadow-lg shadow-slate-200">
                            {task.inspector.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{task.inspector}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        task.status === Status.PLANNED ? 'bg-slate-100 text-slate-600' :
                        task.status === Status.IN_PROGRESS ? 'bg-indigo-100 text-indigo-700 shadow-sm' :
                        task.status === Status.COMPLETED ? 'bg-emerald-100 text-emerald-800 shadow-sm' : 'bg-red-100 text-red-800 shadow-sm'
                        }`}>
                        {task.status}
                        </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                        {task.status !== Status.COMPLETED && task.status !== Status.FAILED ? (
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => { setActiveTaskId(task.id); setIsEditMode(true); }}
                                className="p-3 text-slate-400 hover:text-indigo-600 transition-all hover:bg-white rounded-2xl border border-transparent hover:border-slate-200"
                                title="Configure Stages"
                            >
                                <Settings size={20} />
                            </button>
                            <button 
                                onClick={() => setActiveTaskId(task.id)}
                                className="px-6 py-3 bg-slate-950 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 active:scale-95"
                            >
                                <Play size={12} fill="white" /> Execute
                            </button>
                        </div>
                        ) : (
                        <div className="flex justify-end gap-3">
                           <button className="p-3 text-slate-300 hover:text-slate-900 transition-all hover:bg-white rounded-xl">
                              <History size={20} />
                           </button>
                           <button onClick={() => {
                             const confirmDelete = window.confirm("Are you sure you want to delete this inspection record? This will leave a gap in the audit trail.");
                             if(confirmDelete) setTasks(prev => prev.filter(t => t.id !== task.id));
                           }} className="p-3 text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl">
                              <Trash2 size={20} />
                           </button>
                        </div>
                        )}
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
