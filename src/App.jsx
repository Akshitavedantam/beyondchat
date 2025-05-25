import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';


import ChatLayout from './components/ChatLayout';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import Customers from './components/Customers';
import Integrations from './components/Integrations'; 
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#0f172a] dark:bg-[#060b17] text-white transition-colors">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Topbar */}
          <Topbar onHamburgerClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto pt-16 px-6 md:pl-0">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatLayout/>} />
              <Route path="/settings" element={<SettingsPanel />} /> 
              <Route path="/customers" element={<Customers />} />
              <Route path="/integrations" element={<Integrations />} />


            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
