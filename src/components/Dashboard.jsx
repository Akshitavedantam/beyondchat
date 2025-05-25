import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const dummyMetrics = [
  { label: "Active Conversations", value: 12 },
  { label: "Avg. Response Time", value: "2.3 min" },
  { label: "Agents Online", value: 4 },
];

const conversationData = [
  { day: 'Mon', conversations: 10 },
  { day: 'Tue', conversations: 14 },
  { day: 'Wed', conversations: 9 },
  { day: 'Thu', conversations: 16 },
  { day: 'Fri', conversations: 20 },
  { day: 'Sat', conversations: 12 },
  { day: 'Sun', conversations: 8 },
];

const team = [
  { name: "Akshita", status: "Online", chats: 3 },
  { name: "Amit", status: "Offline", chats: 0 },
  { name: "John", status: "Online", chats: 5 },
  { name: "Priya", status: "Away", chats: 1 },
];

export default function Dashboard() {
  return (
    <div className="py-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyMetrics.map((item, idx) => (
          <div key={idx} className="bg-white/10 dark:bg-gray-800/20 p-4 rounded-xl shadow-md border border-white/10">
            <h3 className="text-sm font-medium text-gray-300">{item.label}</h3>
            <p className="text-xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white/10 dark:bg-gray-800/20 p-4 rounded-xl shadow-md border border-white/10">
          <h3 className="text-md font-semibold text-white mb-4">Conversation Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={conversationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="conversations" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Overview */}
        <div className="bg-white/10 dark:bg-gray-800/20 p-4 rounded-xl shadow-md border border-white/10">
          <h3 className="text-md font-semibold text-white mb-4">Team Overview</h3>
          <ul className="space-y-3">
            {team.map((member, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.status}</p>
                </div>
                <span className="text-sm text-gray-300">{member.chats} chats</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
