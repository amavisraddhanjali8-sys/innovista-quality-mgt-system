
import React, { useState } from 'react';
import { 
  Users, Database, Shield, History, Plus, Search, 
  Edit3, Trash2, CheckCircle2, XCircle, ChevronRight,
  Briefcase, Hammer, Building2, Package, LayoutGrid, Settings,
  ArrowRight, Key, Globe, Activity, Layers, Target, MapPin,
  Monitor, Terminal, Download, Cpu, HardDrive
} from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { Status } from '../types';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'master' | 'desktop' | 'logs'>('projects');

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Governance Control</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Master Configuration • Enterprise Administration</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          {[
            { id: 'projects', icon: Briefcase, label: 'Projects Hub' },
            { id: 'users', icon: Users, label: 'Technical Staff' },
            { id: 'master', icon: Database, label: 'Master Data' },
            { id: 'desktop', icon: Monitor, label: 'Desktop Build' },
            { id: 'logs', icon: History, label: 'Security Ledger' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'desktop' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Desktop Application Builder</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Package QMS Elite into a native Windows (.exe) executable</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                       <h4 className="text-sm font-black uppercase text-slate-900 mb-4 flex items-center gap-2">
                          <Terminal size={18} className="text-indigo-600" /> Terminal Instructions
                       </h4>
                       <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm text-indigo-400 space-y-2 overflow-x-auto shadow-inner">
                          <p># 1. Initialize environment</p>
                          <p className="text-white">npm install electron electron-builder --save-dev</p>
                          <p className="pt-2 text-slate-500"># 2. Package for Windows (Standard Build)</p>
                          <p className="text-white">npm run dist --win</p>
                          <p className="pt-2 text-slate-500"># 3. Locate your binary in /dist folder</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 border border-slate-100 rounded-[28px] hover:border-indigo-200 transition-colors">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                             <Shield size={20} />
                          </div>
                          <h5 className="text-[10px] font-black uppercase text-slate-900 mb-1">Code Signing</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Native .exe files require a Certificate Authority (CA) signature to avoid Windows SmartScreen warnings.</p>
                       </div>
                       <div className="p-6 border border-slate-100 rounded-[28px] hover:border-indigo-200 transition-colors">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                             <Download size={20} />
                          </div>
                          <h5 className="text-[10px] font-black uppercase text-slate-900 mb-1">Installer Logic</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Build generates a "Setup.exe" that handles desktop shortcuts, start menu entry, and local uninstallation.</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10"><Monitor size={120} /></div>
                     <div className="relative z-10 space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest">System Engine</h4>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="text-slate-400">Target OS</span>
                              <span className="text-white">Windows 10/11 x64</span>
                           </div>
                           <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="text-slate-400">Environment</span>
                              <span className="text-white">Electron 30.x</span>
                           </div>
                           <div className="flex justify-between items-center text-[11px] font-bold">
                              <span className="text-slate-400">Offline Cache</span>
                              <span className="text-white">Enabled</span>
                           </div>
                        </div>
                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                           Generate Config JSON
                        </button>
                     </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 space-y-6 shadow-sm text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <Activity size={32} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase text-slate-900">Health Diagnostics</h4>
                        <p className="text-[11px] text-slate-500 font-medium px-4 mt-2">Check local resource availability before bundling for production.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-3 rounded-xl">
                           <Cpu size={14} className="mx-auto mb-1 text-slate-400" />
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">CPU Opt</p>
                           <p className="text-xs font-black text-emerald-600">92%</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                           <HardDrive size={14} className="mx-auto mb-1 text-slate-400" />
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Storage</p>
                           <p className="text-xs font-black text-emerald-600">140MB</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
               <div>
                 <h3 className="text-xl font-black text-slate-900 uppercase">Enterprise Project Registry</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Centralised control of quality performance by project lifecycle</p>
               </div>
               <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                 <Plus size={16}/> Initiate New Project
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-6">Project Identity</th>
                    <th className="px-8 py-6">Client & Location</th>
                    <th className="px-8 py-6">Health Score</th>
                    <th className="px-8 py-6">Operational Status</th>
                    <th className="px-8 py-6 text-right">Ledger Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PROJECTS.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/70 transition-all group cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white text-[11px] font-black uppercase shadow-lg group-hover:bg-indigo-600 transition-colors">
                             {project.code}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{project.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{project.id} • Started {project.startDate}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-700 uppercase">{project.client}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                               <MapPin size={10} /> {project.location}
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="flex-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${project.qualityScore >= 90 ? 'bg-emerald-500' : project.qualityScore >= 75 ? 'bg-amber-500' : 'bg-red-500'} transition-all`} style={{ width: `${project.qualityScore}%` }}></div>
                           </div>
                           <span className={`text-xs font-black ${project.qualityScore >= 90 ? 'text-emerald-600' : project.qualityScore >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{project.qualityScore}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${project.status === Status.IN_PROGRESS ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                           <span className="text-[10px] font-black text-slate-500 uppercase">{project.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm"><Settings size={16}/></button>
                           <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other existing tabs remain unchanged... */}
        {activeTab === 'users' && (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
             <Users size={40} className="mx-auto text-slate-200 mb-4" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User management ledger load pending...</p>
           </div>
        )}
      </div>
    </div>
  );
};
