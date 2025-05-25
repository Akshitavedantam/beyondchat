import { useEffect, useState } from 'react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  
    setTimeout(() => {
      setCustomers([
        { id: 1, name: "Jane Doe", email: "jane@example.com", phone: "123-456-7890", joined: "2024-01-15" },
        { id: 2, name: "John Smith", email: "john@example.com", phone: "987-654-3210", joined: "2024-03-22" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Loading customers...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Customer Directory</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
