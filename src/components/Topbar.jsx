import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Menu, Bell, ChevronDown, Settings, X } from "lucide-react";

export default function Topbar({ onHamburgerClick }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Close dropdown on outside click
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.theme = newTheme ? "dark" : "light";
  };

  useEffect(() => {
    const userPref = localStorage.theme;
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = userPref === "dark" || (!userPref && systemPref);
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  // Dummy user data
  const user = {
    name: "Admin Jane",
    avatarUrl: "https://i.pravatar.cc/40?img=47",
    online: true,
  };

  return (
    <header
      className="
        fixed top-0 
        left-0 md:left-64 right-0 z-50
        h-16 px-4 md:px-6 flex items-center justify-between
        bg-white/20 dark:bg-gray-800/20
        backdrop-blur-lg
        border border-white/30 dark:border-gray-700/30
        rounded-b-md
        shadow-lg
        transition-colors duration-300
      "
    >
      {/* Hamburger - visible only on small screens */}
      <button
        onClick={onHamburgerClick}
        className="md:hidden p-2 mr-3 rounded-md bg-white/25 dark:bg-gray-700/25 hover:bg-white/35 dark:hover:bg-gray-600/35 text-white transition"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight flex-1">
        Inbox
      </h1>

      <div className="flex items-center gap-4 relative">
        <input
          type="text"
          placeholder="Search..."
          className="
            bg-white/25 dark:bg-gray-700/25
            border border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-white
            placeholder-gray-700 dark:placeholder-gray-300
            rounded-md px-3 py-1.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-purple-400
            transition
            hidden sm:block
          "
        />

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="
            p-2 rounded-md
            bg-white/25 dark:bg-gray-700/25
            hover:bg-white/35 dark:hover:bg-gray-600/35
            text-white
            transition
          "
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative p-2 rounded-md
            bg-white/25 dark:bg-gray-700/25
            hover:bg-white/35 dark:hover:bg-gray-600/35
            text-white
            transition
          "
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            3
          </span>
        </button>

        {/* User avatar with online status and dropdown */}
        <div
          className="relative flex items-center cursor-pointer select-none"
          onClick={() => setSettingsOpen(!settingsOpen)}
          ref={dropdownRef}
        >
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-green-400"
          />
          <div className="ml-3 text-white text-sm font-medium hidden sm:block">
            <div>{user.name}</div>
            <div className="flex items-center text-xs text-green-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />
              Online
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`ml-2 transition-transform duration-200 ${
              settingsOpen ? "rotate-180" : "rotate-0"
            }`}
          />

          {/* Dropdown */}
          {settingsOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white/90 dark:bg-gray-900/90 rounded-md shadow-lg py-2 text-gray-900 dark:text-white backdrop-blur-md z-40 border border-gray-300 dark:border-gray-700">
              <button
                className="w-full text-left px-4 py-2 hover:bg-purple-600 hover:text-white transition"
                onClick={() => alert("Go to settings")}
              >
                <Settings size={16} className="inline mr-2" />
                Account Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-purple-600 hover:text-white transition"
                onClick={() => alert("Logging out")}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
