
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Nonconformance } from './pages/Nonconformance';
import { CorrectiveActions } from './pages/CorrectiveActions';
import { Inspections } from './pages/Inspections';
import { InspectionPlanning } from './pages/InspectionPlanning';
import { Standards } from './pages/Standards';
import { Reports } from './pages/Reports';
import { Admin } from './pages/Admin';
import { Downloads } from './pages/Downloads';
import { Login } from './pages/Login';
import { User } from './types';
import { apiService } from './services/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with local backend
  useEffect(() => {
    const savedUser = localStorage.getItem('qms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('qms_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('qms_user');
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest">Initialising Innovista Systems...</div>;

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const components: Record<string, React.ReactNode> = {
      dashboard: <Dashboard />,
      planning: <InspectionPlanning />,
      ncr: <Nonconformance searchQuery={searchQuery} />,
      car: <CorrectiveActions />,
      inspections: <Inspections />,
      standards: <Standards searchQuery={searchQuery} />,
      reports: <Reports />,
      downloads: <Downloads />,
      admin: <Admin />,
    };

    return components[activeTab] || <Dashboard />;
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onLogout={handleLogout}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
