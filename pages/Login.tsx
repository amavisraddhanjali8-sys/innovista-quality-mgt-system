
import React, { useState } from 'react';
import { Shield, Key, ArrowRight, User as UserIcon, Lock, Fingerprint, Loader2, AlertCircle, Building2, Globe, Mail } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [email, setEmail] = useState('admin@innovistametal.com');
  const [password, setPassword] = useState('password');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@innovistametal.com' && password === 'password') {
        setStep('mfa');
      } else {
        setError('Unauthorized credentials. Access denied.');
      }
      setLoading(false);
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onLogin({
        id: 'U-001',
        name: 'Technical Admin',
        role: 'Quality Lead • INNOVISTA',
        avatar: 'IM'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/20 border border-white/10 group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
             <Building2 size={40} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">INNOVISTA METAL FABRICONIX</h1>
            <p className="text-rose-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Quality Management Infrastructure</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm rounded-[40px] z-50 flex flex-col items-center justify-center space-y-4">
              <Loader2 size={40} className="text-rose-500 animate-spin" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Securing Session...</p>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Endpoint</label>
                  <div className="relative group">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@innovistametal.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10 transition-all placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
                    <button type="button" className="text-[9px] font-black text-rose-500 uppercase hover:text-rose-400 transition-colors">Emergency Reset</button>
                  </div>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Master Credentials"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10 transition-all placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-wide animate-in shake duration-300">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-5 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-rose-600/20 hover:bg-rose-700 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Authenticate Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-500 mb-4">
                  <Fingerprint size={24} />
                </div>
                <h3 className="text-white font-black uppercase tracking-tight">Biometric Secondary Auth</h3>
                <p className="text-slate-400 text-[11px] font-medium leading-relaxed">System awaiting 6-digit sync code from the Innovista Security Hub.</p>
              </div>

              <div className="space-y-2">
                <input 
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="0 0 0 0 0 0"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-6 text-center text-3xl font-black text-rose-500 tracking-[0.5em] outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-600/10 transition-all placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform active:scale-[0.98]"
                >
                  Confirm Entry
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep('credentials')}
                  className="w-full py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                  Switch Identity
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
           <div className="flex flex-col items-center gap-1.5 p-4 rounded-3xl bg-white/5 border border-white/5">
              <Globe size={16} className="text-slate-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">innovistametalfabriconix.com</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 p-4 rounded-3xl bg-white/5 border border-white/5">
              <Mail size={16} className="text-slate-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">innovistametal@gmail.com</span>
           </div>
        </div>

        <p className="text-center mt-8 text-[9px] font-black text-slate-700 uppercase tracking-widest">
          No. 50/B, Vishaka Place , Elapitiwela, Ragama • PV00326118
        </p>
      </div>
    </div>
  );
};
