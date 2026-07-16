
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, AlertCircle, ShieldCheck, CheckCircle2, Briefcase, 
  Activity, Clock, ChevronRight, ArrowUpRight, ArrowDownRight, Layers,
  Building2, MapPin, Users, Filter, Hammer, Construction
} from 'lucide-react';
import { MOCK_NCRs, MOCK_PROJECTS } from '../constants';
import { Project, Status } from '../types';

const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-rose-500 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
        {trend === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {change}% 
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  </div>
);

const ProjectHealthCard: React.FC<{ project: Project }> = ({ project }) => {
  const scoreColor = project.qualityScore >= 90 ? 'text-emerald-500' : project.qualityScore >= 75 ? 'text-amber-500' : 'text-rose-500';
  const progressColor = project.qualityScore >= 90 ? 'bg-emerald-500' : project.qualityScore >= 75 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg group-hover:bg-rose-600 transition-colors uppercase">
            {project.code}
          </div>
          <div>
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">{project.name}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.client}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${scoreColor}`}>{project.qualityScore}%</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Integrity Index</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor} transition-all duration-1000`} style={{ width: `${project.qualityScore}%` }}></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-slate-50 rounded-xl">
             <p className="text-[8px] font-black text-slate-400 uppercase">NCRs</p>
             <p className="text-xs font-black text-slate-900">{project.totalNCRs}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-xl">
             <p className="text-[8px] font-black text-slate-400 uppercase">CARs</p>
             <p className="text-xs font-black text-slate-900">{project.openCARs}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-xl">
             <p className="text-[8px] font-black text-slate-400 uppercase">Status</p>
             <div className="flex items-center justify-center gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${project.status === Status.IN_PROGRESS ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <MapPin size={12} className="text-slate-300" /> {project.location}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Innovista Command</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Operational Health & Fabrication Intelligence</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
             <Filter size={14} className="text-rose-600" />
             <select 
               value={selectedProjectId}
               onChange={(e) => setSelectedProjectId(e.target.value)}
               className="bg-transparent text-[10px] font-black text-slate-700 uppercase outline-none cursor-pointer"
             >
                <option value="All">All Active Fabrication Jobs</option>
                {MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.id}: {p.name}</option>)}
             </select>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
             <Activity size={14} className="text-rose-500 animate-pulse" /> Status: Normal Operation
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         {MOCK_PROJECTS.map(project => (
           <ProjectHealthCard key={project.id} project={project} />
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Active NCRs" value="14" change={12} icon={AlertCircle} color="bg-rose-500" trend="down" />
        <StatCard title="Open CARs" value="06" change={20} icon={ShieldCheck} color="bg-slate-900" trend="up" />
        <StatCard title="Plant Yield" value="98.2%" change={1.5} icon={CheckCircle2} color="bg-emerald-500" trend="up" />
        <StatCard title="Velocity" value="High" change={0} icon={TrendingUp} color="bg-rose-600" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 space-y-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Fabrication Analytics</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sector-wise integrity score</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_PROJECTS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="qualityScore" fill="#E11D48" radius={[12, 12, 0, 0]} barSize={40}>
                   {MOCK_PROJECTS.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.qualityScore < 80 ? '#F43F5E' : '#E11D48'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Clock size={20} className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Plant Activity</span>
                 </div>
                 <div className="space-y-4">
                    {[
                      { proj: 'Innovista Fab', action: 'Approved NCR-001', time: '12m', color: 'bg-emerald-500' },
                      { proj: 'Marina Towers', action: 'Finished Audit P-101', time: '1h', color: 'bg-rose-500' },
                      { proj: 'Ragama HQ', action: 'Standard V2.1 Auth', time: '3h', color: 'bg-amber-500' },
                      { proj: 'Dubai Mall', action: 'New CAR Initiated', time: '5h', color: 'bg-rose-600' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                         <div className={`w-1.5 h-8 ${act.color} rounded-full`}></div>
                         <div className="flex-1">
                            <p className="text-xs font-bold truncate group-hover:text-rose-400 transition-colors">{act.proj}: {act.action}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">{act.time} ago</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center space-y-6">
              <div className="p-5 bg-rose-50 rounded-[32px] text-rose-600">
                 <Hammer size={32} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-900 uppercase">Resource Map</h4>
                 <p className="text-[11px] text-slate-500 font-medium px-4 mt-2">Plant capacity currently focused on high-precision aluminum fabrication for Marina Towers Project.</p>
              </div>
              <button className="w-full py-4 bg-rose-600 text-white rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-100">
                 View Dispatch Hub <ChevronRight size={16}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
