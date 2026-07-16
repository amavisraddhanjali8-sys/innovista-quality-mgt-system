
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Filter, Calendar, Download, ChevronRight, TrendingUp, AlertCircle, 
  ShieldCheck, CheckCircle2, Factory, Hammer, Construction, Package, Compass 
} from 'lucide-react';
import { MOCK_NCRs } from '../constants';

const trendData = [
  { name: 'Week 1', ncr: 4, car: 2, pass: 95 },
  { name: 'Week 2', ncr: 7, car: 3, pass: 92 },
  { name: 'Week 3', ncr: 2, car: 1, pass: 98 },
  { name: 'Week 4', ncr: 5, car: 4, pass: 94 },
  { name: 'Week 5', ncr: 3, car: 2, pass: 96 },
  { name: 'Week 6', ncr: 1, car: 0, pass: 99 },
];

const sectorData = [
  { name: 'Welding', value: 35, color: '#6366f1' },
  { name: 'Alu Fab', value: 25, color: '#8b5cf6' },
  { name: 'Interior', value: 15, color: '#ec4899' },
  { name: 'Construction', value: 20, color: '#10b981' },
  { name: 'Other', value: 5, color: '#f59e0b' },
];

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Quality Analytics</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Deep-dive technical intelligence & performance metrics</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar size={16} className="text-slate-400 mr-2" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-700 uppercase outline-none cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Full Year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Download size={16} /> Export Dataset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Analysis */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Compliance Trajectory</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NCR Frequency vs Corrective Action Completion</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Nonconformance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Corrective Actions</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorNcr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="ncr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNcr)" />
                <Area type="monotone" dataKey="car" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vertical Distribution */}
        <div className="lg:col-span-4 bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Vertical Load</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Defect volume by industrial sector</p>
           </div>
           <div className="h-[250px] flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={sectorData}
                   innerRadius={60}
                   outerRadius={90}
                   paddingAngle={8}
                   dataKey="value"
                 >
                   {sectorData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 uppercase">92%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase">Overall Yield</span>
             </div>
           </div>
           <div className="space-y-3">
             {sectorData.map(item => (
               <div key={item.name} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                   <span className="text-[10px] font-black text-slate-700 uppercase">{item.name}</span>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 tracking-widest">{item.value}%</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-950 rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl"><ShieldCheck size={24}/></div>
              <div>
                <h4 className="text-sm font-black uppercase">Audit Maturity</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ISO 9001 Compliance Level</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase">Internal Accuracy</span>
                <span className="text-lg font-black tracking-tight">98.4%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[98.4%]"></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">"Statistical control parameters are within standard deviations for all Marina Towers lots."</p>
         </div>

         <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24}/></div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase">Yield Efficiency</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Process optimization index</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">+4.2%</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Trending Up</span>
            </div>
            <div className="h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Line type="monotone" dataKey="pass" stroke="#10b981" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><AlertCircle size={24}/></div>
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase">Defect Density</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Avg defects per work lot</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">0.12</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Risk</span>
            </div>
            <div className="pt-4 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span>Target: &lt; 0.25</span>
               <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 size={12} /> WITHIN SPECS
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
