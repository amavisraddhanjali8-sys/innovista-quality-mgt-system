
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { 
  Bell, 
  Search, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Clock, 
  LogOut, 
  Settings, 
  Shield, 
  Building2, 
  Sun, 
  Moon 
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
  user: User | null;
}

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, searchQuery, setSearchQuery, onLogout, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('qms_theme') as 'light' | 'dark') || 'light';
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'critical', title: 'Critical NCR', message: 'In-process weld failure at Ragama HQ Line 2.', time: '2m ago', read: false },
    { id: '2', type: 'warning', title: 'Plan Expiring', message: 'Maintenance cycle for CNC Plasma Cutter overdue.', time: '1h ago', read: false },
    { id: '3', type: 'info', title: 'System Updated', message: 'Innovista QMS v2.5.0 protocol deployed.', time: '5h ago', read: true },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Theme Mode Handler
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qms_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-slate-100/50 transition-colors duration-300">
          <div className="flex items-center bg-slate-100 rounded-2xl px-5 py-2.5 w-[450px] transition-all focus-within:ring-2 focus-within:ring-rose-500/10 focus-within:bg-white border border-transparent focus-within:border-rose-100">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search Innovista standards, fabrication logs..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X size={14} className="text-slate-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Dark/Light Toggle Button */}
            <button 
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-3 rounded-xl transition-all flex items-center gap-2 group border ${
                theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-amber-400 shadow-lg' 
                : 'bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="animate-in zoom-in spin-in-90 duration-500" />
              ) : (
                <Moon size={20} className="animate-in zoom-in duration-500" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                {theme === 'dark' ? "Light" : "Dark"}
              </span>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-xl transition-all ${showNotifications ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'}`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-rose-600 text-white text-[10px] flex items-center justify-center rounded-full font-black border-2 border-white animate-in zoom-in duration-300">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                  <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">System Integrity Feed</h4>
                    <button onClick={markAllRead} className="text-[10px] font-black text-rose-600 hover:text-rose-800 uppercase tracking-widest transition-colors">Acknowledge All</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <Check size={40} className="mx-auto text-emerald-500 mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operational Status Green</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!n.read ? 'bg-rose-50/20' : ''}`}>
                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              n.type === 'critical' ? 'bg-rose-100 text-rose-600' : 
                              n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {n.type === 'critical' ? <AlertCircle size={16} /> : n.type === 'warning' ? <AlertCircle size={16} /> : <Info size={16} />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{n.title}</p>
                                <button onClick={() => clearNotification(n.id)} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={12} /></button>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                              <div className="flex items-center gap-1.5 pt-1">
                                <Clock size={10} className="text-slate-300" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-4 group hover:bg-slate-50 p-2 pr-4 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform uppercase border-2 border-white">
                  {user?.avatar || 'IM'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{user?.name || 'Technical User'}</p>
                  <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest leading-none">INNOVISTA STAFF</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                  <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated ID</p>
                     <p className="text-sm font-black text-slate-900 uppercase">{user?.name}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors uppercase tracking-tight">
                      <Building2 size={16} className="text-slate-400" /> Plant Access
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors uppercase tracking-tight">
                      <Shield size={16} className="text-slate-400" /> Protocol Ledger
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors uppercase tracking-tight border-b border-slate-100 mb-2">
                      <Settings size={16} className="text-slate-400" /> System Settings
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-4 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors uppercase tracking-widest group"
                    >
                      <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out from QMS
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
