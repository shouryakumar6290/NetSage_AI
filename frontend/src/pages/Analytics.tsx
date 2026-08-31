import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { TrendingUp, Award, Target } from 'lucide-react';

const accuracyTrend = [
  { month: 'Jan', accuracy: 72 },
  { month: 'Feb', accuracy: 75 },
  { month: 'Mar', accuracy: 78 },
  { month: 'Apr', accuracy: 82 },
  { month: 'May', accuracy: 85 },
  { month: 'Jun', accuracy: 89 },
];

const severityData = [
  { name: 'Low', count: 4, color: '#03DAC6' },
  { name: 'Medium', count: 12, color: '#FFB300' },
  { name: 'High', count: 11, color: '#FF7043' },
  { name: 'Critical', count: 3, color: '#CF6679' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Deep dive into AI performance and common network faults.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase font-medium">Avg AI Accuracy</p>
            <p className="text-2xl font-bold text-white">89%</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase font-medium">Improvement (6mo)</p>
            <p className="text-2xl font-bold text-white">+17%</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <Award className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase font-medium">Most Common Fault</p>
            <p className="text-xl font-bold text-white">Routing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">AI Accuracy Trend Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyTrend}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03DAC6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#03DAC6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} />
                <Area type="monotone" dataKey="accuracy" stroke="#03DAC6" fillOpacity={1} fill="url(#colorAccuracy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Faults by Severity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" stroke="#888" width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333' }} cursor={{fill: '#222'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {
                    severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


