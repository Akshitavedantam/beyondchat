import { Home, MessageSquare, Users, Settings, Layers, Moon, Sun, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: <MessageSquare size={20} />, label: "Conversations", path: "/chat", panel: "chat" },
  { icon: <Users size={20} />, label: "Customers", path: "/customers", panel: "customers" },
  { icon: <Settings size={20} />, label: "Settings", path: "/settings", panel: "settings" },
  { icon: <Layers size={20} />, label: "Integrations", path: "/integrations", panel: "integrations" },
  { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard", panel: "dashboard" },
];

export default function Sidebar({ isOpen, onClose, activePanel, setActivePanel }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {/* Overlay for small screen when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-[#1f2937] to-[#111827] dark:from-[#0f172a] dark:to-[#0a0f1e] text-white
          shadow-lg backdrop-blur-sm flex flex-col py-6 px-2
          w-64 md:w-64
          transform md:translate-x-0
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="text-2xl font-extrabold tracking-tight">BeyondChats</div>

          {/* Close button visible only on small screens */}
          <button
            onClick={onClose}
            className="md:hidden text-white hover:text-purple-400"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              onClick={() => {
                onClose(); // close sidebar on mobile
                setActivePanel(item.panel); // switch panel view
              }}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  activePanel === item.panel || isActive
                    ? 'bg-purple-600 text-purple-300'
                    : 'hover:bg-white/10 dark:hover:bg-white/5 text-white'
                }`
              }
            >
              <div className="group-hover:text-purple-400">{item.icon}</div>
              <span className="text-sm font-medium group-hover:text-purple-400">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className="px-4 mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
