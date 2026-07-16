
import React, { useState, useCallback, useMemo } from 'react';
import { MOCK_CARs } from '../constants';
import { Severity, Status, CAR, ActionItem, AuditEntry, SubTask, EffectivenessMetrics } from '../types';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  History,
  User,
  ShieldCheck,
  XCircle,
  Send,
  Lock,
  Unlock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Target,
  BarChart3,
  Scale,
  Circle,
  CheckCircle2,
  ClipboardList,
  Briefcase
} from 'lucide-react';
import { analyzeRootCause } from '../services/geminiService';

export const CorrectiveActions: React.FC = () => {
  const [cars, setCars] = useState<CAR[]>(MOCK_CARs);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [activeCarId, setActiveCarId] = useState<string | null>(MOCK_CARs[0].id);
  const [activeRightTab, setActiveRightTab] = useState<'plan' | 'history' | 'effectiveness'>('plan');
  const [expandedActions, setExpandedActions] = useState<Record<string, boolean>>({});

  const activeCar = useMemo(() => 
    cars.find(c => c.id === activeCarId) || cars[0], 
  [cars, activeCarId]);

  const toggleActionExpansion = (id: string) => {
    setExpandedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const createHistoryEntry = (action: string, details?: string): AuditEntry => ({
    id: `HIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toLocaleString(),
    user: 'Alex Quality',
    action,
    details
  });

  const addHistoryEntry = useCallback((carId: string, action: string, details?: string) => {
    const newEntry = createHistoryEntry(action, details);
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        history: [newEntry, ...car.history]
      };
    }));
  }, []);

  const handleAIAnalysis = async (car: CAR) => {
    setAnalyzingId(car.id);
    const prompt = `Project: ${car.project}. Problem: ${car.title}. Initial Root Cause: ${car.rootCause}. This was linked to NCR ${car.ncrId}.`;
    const result = await analyzeRootCause(prompt);
    setAiAnalysis(result);
    setAnalyzingId(null);
  };

  const adoptAiSuggestion = (carId: string) => {
    if (!aiAnalysis) return;

    const newActionItems: ActionItem[] = aiAnalysis.suggestedActionPlan.map((desc: string, i: number) => ({
      id: `AI-${Date.now()}-${i}`,
      description: desc,
      detailedDescription: '',
      owner: 'Unassigned',
      responsibleRole: 'Process Owner',
      startDate: new Date().toISOString().split('T')[0],
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: Status.IN_PROGRESS,
      subTasks: []
    }));

    const auditEntry = createHistoryEntry('AI Suggestions Adopted', `Applied ${aiAnalysis.suggestedActionPlan.length} suggested actions and updated Root Cause to: "${aiAnalysis.suggestedRootCause}"`);

    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        rootCause: aiAnalysis.suggestedRootCause,
        actionPlan: [...car.actionPlan, ...newActionItems],
        history: [auditEntry, ...car.history]
      };
    }));
    
    setAiAnalysis(null);
  };

  const updateRootCause = (carId: string, value: string) => {
    setCars(prev => prev.map(car => car.id === carId ? { ...car, rootCause: value } : car));
  };

  const finalizeRootCause = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car?.rootCause?.trim()) {
      alert("Please provide a root cause statement before finalization.");
      return;
    }

    const auditEntry = createHistoryEntry('Root Cause Finalized', 'Investigation complete and systemic cause narrative is locked.');
    setCars(prev => prev.map(car => car.id === carId ? { 
      ...car, 
      rcaFinalized: true,
      history: [auditEntry, ...car.history]
    } : car));
  };

  const unlockRootCause = (carId: string) => {
    const auditEntry = createHistoryEntry('Root Cause Unlocked', 'RCA re-opened for refinement.');
    setCars(prev => prev.map(car => car.id === carId ? { 
      ...car, 
      rcaFinalized: false,
      history: [auditEntry, ...car.history]
    } : car));
  };

  const updateActionItem = (carId: string, itemId: string, updates: Partial<ActionItem>) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      
      const updatedPlan = car.actionPlan.map(item => {
        if (item.id === itemId) {
           return { ...item, ...updates };
        }
        return item;
      });

      let newStatus = car.status;
      const allActionsClosed = updatedPlan.length > 0 && updatedPlan.every(a => a.status === Status.CLOSED);
      if (allActionsClosed && car.status === Status.IN_PROGRESS) {
        newStatus = Status.PENDING;
      } else if (!allActionsClosed && car.status === Status.PENDING) {
        newStatus = Status.IN_PROGRESS;
      }

      return { 
        ...car, 
        status: newStatus,
        actionPlan: updatedPlan 
      };
    }));
  };

  const addSubTask = (carId: string, itemId: string) => {
    const newSubTask: SubTask = {
      id: `ST-${Date.now()}`,
      title: 'New Milestone',
      targetDate: new Date().toISOString().split('T')[0],
      status: Status.OPEN
    };

    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        actionPlan: car.actionPlan.map(action => {
          if (action.id === itemId) {
            return { ...action, subTasks: [...action.subTasks, newSubTask] };
          }
          return action;
        })
      };
    }));
  };

  const updateSubTask = (carId: string, itemId: string, subTaskId: string, updates: Partial<SubTask>) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        actionPlan: car.actionPlan.map(action => {
          if (action.id === itemId) {
            return {
              ...action,
              subTasks: action.subTasks.map(st => st.id === subTaskId ? { ...st, ...updates } : st)
            };
          }
          return action;
        })
      };
    }));
  };

  const removeSubTask = (carId: string, itemId: string, subTaskId: string) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        actionPlan: car.actionPlan.map(action => {
          if (action.id === itemId) {
            return {
              ...action,
              subTasks: action.subTasks.filter(st => st.id !== subTaskId)
            };
          }
          return action;
        })
      };
    }));
  };

  const duplicateActionItem = (carId: string, itemId: string) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      const itemToClone = car.actionPlan.find(a => a.id === itemId);
      if (!itemToClone) return car;

      const newItem: ActionItem = {
        ...JSON.parse(JSON.stringify(itemToClone)),
        id: `CLONE-${Date.now()}`,
        description: `${itemToClone.description} (Copy)`,
        status: Status.IN_PROGRESS,
        subTasks: itemToClone.subTasks.map(st => ({ ...st, id: `ST-${Date.now()}-${Math.random()}`, status: Status.OPEN }))
      };

      const itemIndex = car.actionPlan.findIndex(a => a.id === itemId);
      const updatedPlan = [...car.actionPlan];
      updatedPlan.splice(itemIndex + 1, 0, newItem);

      return { ...car, actionPlan: updatedPlan };
    }));
  };

  const moveActionItem = (carId: string, itemId: string, direction: 'up' | 'down') => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      const index = car.actionPlan.findIndex(a => a.id === itemId);
      if (index === -1) return car;
      if (direction === 'up' && index === 0) return car;
      if (direction === 'down' && index === car.actionPlan.length - 1) return car;

      const newPlan = [...car.actionPlan];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newPlan[index], newPlan[swapIndex]] = [newPlan[swapIndex], newPlan[index]];

      return { ...car, actionPlan: newPlan };
    }));
  };

  const removeActionItem = (carId: string, itemId: string) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      return { ...car, actionPlan: car.actionPlan.filter(i => i.id !== itemId) };
    }));
  };

  const addManualAction = (carId: string) => {
    const newItem: ActionItem = {
      id: `MAN-${Date.now()}`,
      description: '',
      detailedDescription: '',
      owner: '',
      responsibleRole: '',
      startDate: new Date().toISOString().split('T')[0],
      estimatedCompletionDate: '',
      dueDate: '',
      status: Status.IN_PROGRESS,
      subTasks: []
    };
    setCars(prev => prev.map(car => car.id === carId ? { ...car, actionPlan: [...car.actionPlan, newItem] } : car));
  };

  const updateEffectiveness = (carId: string, updates: Partial<EffectivenessMetrics>) => {
    setCars(prev => prev.map(car => {
      if (car.id !== carId) return car;
      const currentMetrics = car.effectivenessMetrics || {
        expectedAccuracy: 95,
        actualAccuracy: 0,
        expectedControlLevel: 'High',
        actualControlLevel: 'N/A',
        varianceAnalysis: ''
      };
      return { ...car, effectivenessMetrics: { ...currentMetrics, ...updates } };
    }));
  };

  const handleRequestClosure = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car?.rcaFinalized) {
      alert("Root Cause Analysis must be finalized before closure.");
      return;
    }
    setCars(prev => prev.map(car => car.id === carId ? { ...car, status: Status.PENDING } : car));
  };

  const handleApproveClosure = (carId: string) => {
    setCars(prev => prev.map(car => car.id === carId ? { 
      ...car, 
      status: Status.CLOSED, 
      closedDate: new Date().toISOString().split('T')[0] 
    } : car));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Corrective Action Workspace</h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100">{activeCar.project}</span>
           </div>
           <p className="text-slate-500">ISO 9001:2015 • Preventive and Systemic Controls</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={activeCarId || ''} 
            onChange={(e) => setActiveCarId(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            {cars.map(c => <option key={c.id} value={c.id}>{c.id}: {c.title}</option>)}
          </select>
          
          <div className="flex gap-2">
            {activeCar.status === Status.IN_PROGRESS && (
              <button 
                onClick={() => handleRequestClosure(activeCar.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg ${
                  activeCar.rcaFinalized 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <Send size={16} /> Request Closure
              </button>
            )}
            {/* ... other status buttons same ... */}
            {activeCar.status === Status.PENDING && (
              <button 
                onClick={() => handleApproveClosure(activeCar.id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <ShieldCheck size={16} /> Approve Closure
              </button>
            )}

            {activeCar.status === Status.CLOSED && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold border border-slate-200">
                <CheckCircle size={16} className="text-emerald-500" /> CAR CLOSED
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ... grid remained same ... */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeCar.rcaFinalized ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {activeCar.rcaFinalized ? <FileCheck size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Root Cause</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NCR: {activeCar.ncrId}</p>
                </div>
              </div>
              {!activeCar.rcaFinalized && activeCar.status === Status.IN_PROGRESS && (
                <button 
                  onClick={() => handleAIAnalysis(activeCar)}
                  disabled={analyzingId === activeCar.id}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                  title="AI Root Cause Analysis"
                >
                  {analyzingId === activeCar.id ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
              )}
            </div>
            {/* ... RCA Details same ... */}
            <div className="p-6 flex-1 flex flex-col">
              {aiAnalysis ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">AI Proposal</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setAiAnalysis(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Discard</button>
                      <button onClick={() => adoptAiSuggestion(activeCar.id)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800">Adopt Results</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {aiAnalysis.whys.map((why: string, i: number) => (
                      <div key={i} className="flex gap-3 text-xs p-2 bg-indigo-50/50 rounded-lg text-indigo-900 italic border border-indigo-100">
                        <span className="font-bold">{i+1}</span>
                        <span>{why}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-4">
                  <textarea 
                    value={activeCar.rootCause}
                    disabled={activeCar.rcaFinalized || activeCar.status === Status.CLOSED}
                    onChange={(e) => updateRootCause(activeCar.id, e.target.value)}
                    placeholder="Describe the identified root cause..."
                    className={`flex-1 w-full p-4 rounded-lg text-sm resize-none border outline-none transition-all ${
                      activeCar.rcaFinalized ? 'bg-slate-50 text-slate-500 italic' : 'bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500/20 border-slate-200'
                    }`}
                  />
                  {!activeCar.rcaFinalized && activeCar.status === Status.IN_PROGRESS && (
                    <button 
                      onClick={() => finalizeRootCause(activeCar.id)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700"
                    >
                      <Lock size={16} /> Finalize Narrative
                    </button>
                  )}
                  {activeCar.rcaFinalized && activeCar.status === Status.IN_PROGRESS && (
                    <button 
                      onClick={() => unlockRootCause(activeCar.id)}
                      className="w-full py-3 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50"
                    >
                      <Unlock size={14} className="inline mr-1" /> Re-open RCA Phase
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ... action plan tab same ... */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[600px]">
            <div className="flex px-6 pt-6 border-b border-slate-100 gap-8">
              {[
                { id: 'plan', label: 'Action Plan', icon: ClipboardList },
                { id: 'effectiveness', label: 'Analysis & Control', icon: BarChart3 },
                { id: 'history', label: 'Audit Trail', icon: History }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id as any)}
                  className={`pb-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                    activeRightTab === tab.id ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[650px]">
              {activeRightTab === 'plan' ? (
                <div className="space-y-4">
                  {activeCar.actionPlan.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-slate-400 text-sm font-medium">No actions defined in the preventive plan.</p>
                      <button onClick={() => addManualAction(activeCar.id)} className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mx-auto">
                        <Plus size={14} /> ADD INITIAL ACTION
                      </button>
                    </div>
                  ) : (
                    activeCar.actionPlan.map((action, actionIdx) => {
                      const totalSub = action.subTasks.length;
                      const completedSub = action.subTasks.filter(st => st.status === Status.CLOSED).length;
                      const progress = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

                      return (
                        <div key={action.id} className="bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all shadow-sm overflow-hidden animate-in fade-in duration-300">
                          <div className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <button 
                                onClick={() => updateActionItem(activeCar.id, action.id, { status: action.status === Status.CLOSED ? Status.IN_PROGRESS : Status.CLOSED })}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  action.status === Status.CLOSED ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-indigo-400'
                                }`}
                              >
                                <Check size={12} />
                              </button>
                              <div className="flex-1">
                                <input 
                                  value={action.description}
                                  onChange={(e) => updateActionItem(activeCar.id, action.id, { description: e.target.value })}
                                  placeholder="Action heading..."
                                  className={`w-full bg-transparent border-none outline-none text-sm font-bold ${
                                    action.status === Status.CLOSED ? 'text-slate-400 line-through' : 'text-slate-900'
                                  }`}
                                />
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">{action.owner || 'No Owner'}</span>
                                  {totalSub > 0 && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
                                      </div>
                                      <span className="text-[9px] font-bold text-indigo-500">{progress}%</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <div className="flex items-center border-r border-slate-100 pr-2 mr-2">
                                <button disabled={actionIdx === 0} onClick={() => moveActionItem(activeCar.id, action.id, 'up')} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-20"><ArrowUp size={14}/></button>
                                <button disabled={actionIdx === activeCar.actionPlan.length-1} onClick={() => moveActionItem(activeCar.id, action.id, 'down')} className="p-1 text-slate-300 hover:text-indigo-600 disabled:opacity-20"><ArrowDown size={14}/></button>
                              </div>
                              <button onClick={() => duplicateActionItem(activeCar.id, action.id)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><Copy size={16}/></button>
                              <button onClick={() => toggleActionExpansion(action.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                                {expandedActions[action.id] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                              </button>
                              {activeCar.status === Status.IN_PROGRESS && (
                                <button onClick={() => removeActionItem(activeCar.id, action.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                              )}
                            </div>
                          </div>

                          {expandedActions[action.id] && (
                            <div className="p-4 bg-slate-50/50 border-t border-slate-50 grid grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                              <section className="space-y-4">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Details</label>
                                <textarea 
                                  value={action.detailedDescription}
                                  onChange={(e) => updateActionItem(activeCar.id, action.id, { detailedDescription: e.target.value })}
                                  placeholder="Describe implementation steps and rationale..."
                                  className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                />
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-tasks / Milestones</label>
                                    <button onClick={() => addSubTask(activeCar.id, action.id)} className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                      <Plus size={10} /> ADD SUB-TASK
                                    </button>
                                  </div>
                                  <div className="space-y-1.5">
                                    {action.subTasks.length === 0 ? (
                                      <p className="text-[10px] text-slate-400 italic">No granular milestones defined.</p>
                                    ) : (
                                      action.subTasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 group shadow-sm">
                                          <button 
                                            onClick={() => updateSubTask(activeCar.id, action.id, st.id, { status: st.status === Status.CLOSED ? Status.OPEN : Status.CLOSED })}
                                            className={`transition-colors ${st.status === Status.CLOSED ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                          >
                                            {st.status === Status.CLOSED ? <CheckCircle2 size={14}/> : <Circle size={14}/>}
                                          </button>
                                          <input 
                                            value={st.title}
                                            onChange={(e) => updateSubTask(activeCar.id, action.id, st.id, { title: e.target.value })}
                                            className="flex-1 bg-transparent border-none text-[11px] font-medium outline-none text-slate-700"
                                          />
                                          <input 
                                            type="date"
                                            value={st.targetDate}
                                            onChange={(e) => updateSubTask(activeCar.id, action.id, st.id, { targetDate: e.target.value })}
                                            className="bg-transparent border-none text-[10px] font-bold text-slate-400 outline-none tabular-nums"
                                          />
                                          <button onClick={() => removeSubTask(activeCar.id, action.id, st.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={12}/></button>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </section>

                              <section className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Scheduling & Timeline</label>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-500">START DATE</p>
                                    <input 
                                      type="date" 
                                      value={action.startDate} 
                                      onChange={(e) => updateActionItem(activeCar.id, action.id, { startDate: e.target.value })}
                                      className="w-full bg-slate-50 p-2 rounded border border-slate-200 text-[11px] font-bold outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-500">EST. COMPLETION</p>
                                    <input 
                                      type="date" 
                                      value={action.estimatedCompletionDate} 
                                      onChange={(e) => updateActionItem(activeCar.id, action.id, { estimatedCompletionDate: e.target.value })}
                                      className="w-full bg-slate-50 p-2 rounded border border-slate-200 text-[11px] font-bold outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="flex-1 relative pl-4 border-l border-slate-100 space-y-4">
                                   <div className="relative">
                                     <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-indigo-600 shadow-sm"></div>
                                     <p className="text-[9px] font-bold text-slate-400">LAUNCH</p>
                                     <p className="text-[10px] font-bold text-slate-900">{action.startDate}</p>
                                   </div>
                                   {action.subTasks.sort((a,b) => a.targetDate.localeCompare(b.targetDate)).map((st, i) => (
                                     <div key={st.id} className="relative">
                                       <div className={`absolute -left-[20px] top-1 w-2 h-2 rounded-full shadow-sm border border-white ${st.status === Status.CLOSED ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                       <p className="text-[9px] font-bold text-slate-400">M{i+1}: {st.targetDate}</p>
                                       <p className={`text-[10px] font-medium leading-tight ${st.status === Status.CLOSED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{st.title}</p>
                                     </div>
                                   ))}
                                   <div className="relative pt-2">
                                     <div className="absolute -left-[20px] top-3 w-2 h-2 rounded-full bg-slate-900 shadow-sm"></div>
                                     <p className="text-[9px] font-bold text-slate-400">FINAL DEADLINE</p>
                                     <p className="text-[10px] font-bold text-slate-900">{action.estimatedCompletionDate || action.dueDate}</p>
                                   </div>
                                </div>
                              </section>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                  {activeCar.status === Status.IN_PROGRESS && (
                    <button onClick={() => addManualAction(activeCar.id)} className="w-full py-3 bg-white border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> APPEND NEW ACTION
                    </button>
                  )}
                </div>
              ) : activeRightTab === 'effectiveness' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500">
                  <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-600 rounded-xl"><Target size={24} /></div>
                      <div>
                        <h3 className="text-lg font-bold">Effectiveness Review</h3>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Expected vs Actual Control Metrics</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                   {/* History trail same ... */}
                   {activeCar.history.length === 0 ? (
                    <p className="text-center py-10 text-slate-400 text-xs italic">Traceability log empty.</p>
                  ) : (
                    <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                      {activeCar.history.map(entry => (
                        <div key={entry.id} className="relative">
                          <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 z-10"></div>
                          <div className="flex flex-col gap-1">
                             <div className="flex justify-between items-baseline"><h4 className="text-sm font-bold text-slate-800">{entry.action}</h4><span className="text-[9px] font-bold text-slate-400 uppercase">{entry.timestamp}</span></div>
                             <div className="flex items-center gap-2"><User size={10} className="text-indigo-400"/><span className="text-[10px] font-bold text-indigo-600">{entry.user}</span></div>
                             {entry.details && <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">{entry.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
