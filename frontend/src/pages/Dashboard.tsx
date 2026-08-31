import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const issueData = [
  { name: 'VLAN', count: 4 },
  { name: 'Routing', count: 5 },
  { name: 'Gateway', count: 3 },
  { name: 'DHCP', count: 3 },
  { name: 'DNS', count: 3 },
  { name: 'ACL', count: 3 },
];

const agreementData = [
  { name: 'Accepted', value: 22, color: '#03DAC6' },
  { name: 'Edited', value: 5, color: '#FFB300' },
  { name: 'Rejected', value: 3, color: '#CF6679' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Overview Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card flex flex-col items-center justify-center p-6 bg-surface border-gray-700 border-l-4 border-l-gray-500">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Cases</span>
          <span className="text-4xl font-bold text-white">30+</span>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 bg-surface border-gray-700 border-l-4 border-l-success">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Accepted</span>
          <span className="text-4xl font-bold text-success">22</span>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 bg-surface border-gray-700 border-l-4 border-l-primary">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Edited</span>
          <span className="text-4xl font-bold text-primary">5</span>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 bg-surface border-gray-700 border-l-4 border-l-error">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Rejected</span>
          <span className="text-4xl font-bold text-error">3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Issues by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} />
                <Bar dataKey="count" fill="#FFB300" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">AI vs Human Agreement</h2>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agreementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {agreementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Recent Reviews</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="pb-3 font-medium">Case</th>
                <th className="pb-3 font-medium">Issue</th>
                <th className="pb-3 font-medium">AI Decision</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                <td className="py-4">NS-007</td>
                <td className="py-4 text-gray-300">Gateway mismatch in DHCP</td>
                <td className="py-4 text-gray-300">Default-router is outside subnet</td>
                <td className="py-4"><span className="badge bg-success/10 text-success border border-success/20">Accepted</span></td>
              </tr>
              <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                <td className="py-4">NS-014</td>
                <td className="py-4 text-gray-300">Missing Static Route</td>
                <td className="py-4 text-gray-300">Route not found in table</td>
                <td className="py-4"><span className="badge bg-primary/10 text-primary border border-primary/20">Edited</span></td>
              </tr>
              <tr className="hover:bg-gray-800/20 transition-colors">
                <td className="py-4">NS-021</td>
                <td className="py-4 text-gray-300">Standard ACL placed wrong</td>
                <td className="py-4 text-gray-300">ACL blocking all traffic</td>
                <td className="py-4"><span className="badge bg-error/10 text-error border border-error/20">Rejected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
