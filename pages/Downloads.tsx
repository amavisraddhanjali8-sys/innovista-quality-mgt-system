
import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Search, Filter, FolderOpen, 
  Table, FileSpreadsheet, FileJson, Clock, CheckCircle2,
  Lock, ArrowRight, Share2, MoreVertical
} from 'lucide-react';

interface DownloadItem {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'CSV' | 'JSON' | 'DOCX';
  category: 'Standard' | 'Report' | 'Audit' | 'Certificate';
  date: string;
  size: string;
  status: 'Available' | 'Processing' | 'Archived';
}

const MOCK_DOWNLOADS: DownloadItem[] = [
  { id: 'DL-001', name: 'Marina Towers Weld Map Report', type: 'PDF', category: 'Report', date: '2024-02-20', size: '2.4 MB', status: 'Available' },
  { id: 'DL-002', name: 'Q1 Quality Performance Dataset', type: 'XLSX', category: 'Audit', date: '2024-02-18', size: '15.1 MB', status: 'Available' },
  { id: 'DL-003', name: 'ISO 9001:2015 Gap Analysis', type: 'DOCX', category: 'Standard', date: '2024-02-15', size: '840 KB', status: 'Available' },
  { id: 'DL-004', name: 'Supplier Nonconformance Matrix', type: 'CSV', category: 'Audit', date: '2024-02-10', size: '1.2 MB', status: 'Available' },
  { id: 'DL-005', name: 'Project P-101 Final Certificate', type: 'PDF', category: 'Certificate', date: '2024-02-05', size: '3.1 MB', status: 'Available' },
  { id: 'DL-006', name: 'In-Process Inspection Raw Data', type: 'JSON', category: 'Report', date: '2024-02-01', size: '5.8 MB', status: 'Archived' },
];

export const Downloads: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const filtered = useMemo(() => {
    return MOCK_DOWNLOADS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCat === 'All' || item.category === filterCat;
      return matchesSearch && matchesCat;
    });
  }, [search, filterCat]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Document Vault</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-80">Download controlled artifacts & quality datasets</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text"
              placeholder="Search the vault..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase w-48"
            />
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <Filter size={18} className="text-slate-400 mr-2" />
            <select 
              value={filterCat} 
              onChange={(e) => setFilterCat(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase cursor-pointer"
            >
              <option value="All">All Artifacts</option>
              <option value="Standard">Standards</option>
              <option value="Report">Reports</option>
              <option value="Audit">Audits</option>
              <option value="Certificate">Certificates</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-40 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <FolderOpen size={40} />
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching artifacts found in the vault.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="group bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 relative overflow-hidden">
               {/* Background visual detail */}
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-125 transition-transform">
                  <FileText size={120} />
               </div>

               <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${
                    item.type === 'PDF' ? 'bg-red-50 text-red-600' :
                    item.type === 'XLSX' ? 'bg-emerald-50 text-emerald-600' :
                    item.type === 'CSV' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'JSON' ? 'bg-amber-50 text-amber-600' :
                    'bg-indigo-50 text-indigo-600'
                  }`}>
                    {item.type === 'XLSX' || item.type === 'CSV' ? <FileSpreadsheet size={24} /> : 
                     item.type === 'JSON' ? <FileJson size={24} /> : <FileText size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Share2 size={16}/></button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16}/></button>
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter mb-2 inline-block border border-indigo-100">{item.category}</span>
                    <h3 className="text-base font-black text-slate-900 uppercase leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                  </div>

                  <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                     <div className="flex items-center gap-1.5"><Clock size={12}/> {item.date}</div>
                     <div className="flex items-center gap-1.5"><Table size={12}/> {item.size}</div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</span>
                     </div>
                     <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                        <Download size={14} /> Download
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Audit Ready Footer */}
      <div className="bg-slate-950 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="flex items-center gap-8 text-center md:text-left relative z-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
               <Lock size={32}/>
            </div>
            <div>
               <h4 className="text-2xl font-black uppercase tracking-tighter">Encrypted Data Integrity</h4>
               <p className="text-sm text-slate-400 font-medium max-w-md">All generated documents are digitally signed and timestamped for immutable ISO 9001 traceability.</p>
            </div>
         </div>
         <button className="flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-[28px] text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95 group relative z-10">
            Request Master Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/>
         </button>
      </div>
    </div>
  );
};
