import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Trash, Shield, Download, LogOut } from "lucide-react";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function SettingsPanel() {
  const [profile, setProfile] = useState({
    name: "Akshita",
    email: "akshita@example.com",
    password: "",
    profilePicture: "",
  });

  const [prefs, setPrefs] = useState({
    language: "English",
    timeZone: "IST",
    timeFormat: "24h",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [privacy, setPrivacy] = useState({
    twoFA: false,
  });

  const [theme, setTheme] = useState({
    darkMode: true,
    accentColor: "#9333ea", // Tailwind purple-600
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePicture: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-12">
      {/* Profile Settings */}
      <Section title="👤 Profile Settings">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium">Profile Picture</label>
          <input type="file" onChange={handleFileChange} className="mt-1" />
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>
        <div>
          <label className="block font-medium">Change Password</label>
          <input
            type="password"
            placeholder="New password"
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 mt-1"
          />
        </div>
      </Section>

      {/* Preferences */}
      <Section title="🌐 Account Preferences">
        <select
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
          value={prefs.language}
          onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>French</option>
        </select>
        <select
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
          value={prefs.timeZone}
          onChange={(e) => setPrefs({ ...prefs, timeZone: e.target.value })}
        >
          <option>IST</option>
          <option>GMT</option>
          <option>PST</option>
        </select>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.timeFormat === "24h"}
              onChange={() =>
                setPrefs({
                  ...prefs,
                  timeFormat: prefs.timeFormat === "24h" ? "12h" : "24h",
                })
              }
            />
            24-Hour Time Format
          </label>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="🔔 Notification Settings">
        {["email", "sms", "push"].map((type) => (
          <label key={type} className="flex items-center gap-3">
            <Switch
              checked={notifications[type]}
              onChange={(val) =>
                setNotifications((prev) => ({ ...prev, [type]: val }))
              }
              className={`${
                notifications[type] ? "bg-purple-600" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="inline-block h-4 w-4 transform bg-white rounded-full transition" />
            </Switch>
            Enable {type.toUpperCase()} notifications
          </label>
        ))}
      </Section>

      {/* Privacy & Security */}
      <Section title="🔐 Privacy & Security">
        <label className="flex items-center gap-3">
          <Switch
            checked={privacy.twoFA}
            onChange={(val) => setPrivacy({ ...privacy, twoFA: val })}
            className={`${
              privacy.twoFA ? "bg-purple-600" : "bg-gray-600"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="inline-block h-4 w-4 transform bg-white rounded-full transition" />
          </Switch>
          Enable 2FA (Two-Factor Authentication)
        </label>
        <button className="flex items-center gap-2 text-sm text-blue-400 underline">
          <Shield size={16} /> View Active Sessions
        </button>
        <button className="flex items-center gap-2 text-sm text-blue-400 underline">
          <Download size={16} /> Download My Data
        </button>
      </Section>

      {/* Theme */}
      <Section title="🎨 Theme Customization">
        <label className="flex items-center gap-3">
          <Switch
            checked={theme.darkMode}
            onChange={(val) => setTheme({ ...theme, darkMode: val })}
            className={`${
              theme.darkMode ? "bg-purple-600" : "bg-gray-600"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="inline-block h-4 w-4 transform bg-white rounded-full transition" />
          </Switch>
          Dark Mode
        </label>
        <label className="block mt-2">
          Accent Color:
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) =>
              setTheme({ ...theme, accentColor: e.target.value })
            }
            className="ml-2 w-8 h-8 p-0 border-0 rounded"
          />
        </label>
      </Section>

      {/* Danger Zone */}
      <Section title="🛑 Danger Zone">
        <button className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <LogOut size={16} /> Deactivate Account
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Trash size={16} /> Delete Account
        </button>
      </Section>
    </div>
  );
}
