import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import LiveMap from './components/Map/LiveMap';
import TripHistory from './components/Trips/TripHistory';
import AlertsPanel from './components/Alerts/AlertsPanel';
import RemoteControl from './components/Remote/RemoteControl';
import Settings from './components/Settings/Settings';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading VehicleGuard Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'live-map':
        return <LiveMap />;
      case 'trips':
        return <TripHistory />;
      case 'alerts':
        return <AlertsPanel />;
      case 'remote':
        return <RemoteControl />;
      case 'vehicles':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Management</h2>
            <p className="text-gray-600">Vehicle management features coming soon...</p>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6 lg:ml-0">
            <div className="max-w-7xl mx-auto">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export default App;