
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Settings,
  ListTodo,
  DownloadCloud,
  MapPin,
  Phone
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'standards', label: 'Standards & Docs', icon: FileText },
  { id: 'planning', label: 'Inspection Planning', icon: ListTodo },
  { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
  { id: 'ncr', label: 'Nonconformance', icon: AlertTriangle },
  { id: 'car', label: 'Corrective Actions', icon: ShieldCheck },
  { id: 'reports', label: 'Analytics', icon: BarChart3 },
  { id: 'downloads', label: 'Downloads Vault', icon: DownloadCloud },
  { id: 'admin', label: 'Administration', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-slate-950 h-screen fixed left-0 top-0 text-white flex flex-col z-20 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-rose-900/40 relative overflow-hidden group">
            <span className="relative z-10">I</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight leading-none text-rose-500">INNOVISTA</span>
            <span className="font-bold text-[10px] tracking-[0.1em] text-slate-400">METAL FABRICONIX</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-xs font-bold uppercase tracking-wider ${
                isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Reg: PV00326118</p>
          <div className="flex items-start gap-2 text-[8px] text-slate-500 leading-tight">
            <MapPin size={10} className="mt-0.5 flex-shrink-0" />
            <span>No. 50/B, Vishaka Place, Elapitiwela, Ragama.</span>
          </div>
          <div className="flex items-center gap-2 text-[8px] text-slate-500">
            <Phone size={10} className="flex-shrink-0" />
            <span>+94771684620</span>
          </div>
        </div>
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pt-1">
          v2.5.0 • Enterprise QMS
        </div>
      </div>
    </aside>
  );
};
