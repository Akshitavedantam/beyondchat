import { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "WhatsApp", description: "Connect your WhatsApp number for chat support.", connected: false },
    { id: 2, name: "Facebook Messenger", description: "Integrate with your Facebook page inbox.", connected: true },
    { id: 3, name: "Slack", description: "Get chat alerts in your Slack channels.", connected: false },
    { id: 4, name: "Email (IMAP)", description: "Handle customer emails from a shared inbox.", connected: true },
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration
      )
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">App Integrations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white dark:bg-gray-800 text-black dark:text-white p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{integration.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
              </div>
              <button
                onClick={() => toggleIntegration(integration.id)}
                className="text-purple-500 hover:text-purple-700 transition"
              >
                {integration.connected ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

