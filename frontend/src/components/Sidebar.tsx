import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Library, 
  ShieldCheck, 
  Users, 
  ClipboardList, 
  PieChart, 
  Info 
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'New Diagnosis', path: '/diagnose', icon: Search },
  { name: 'Case Library', path: '/cases', icon: Library },
  { name: 'Rule Checker', path: '/checker', icon: ShieldCheck },
  { name: 'Human Review', path: '/review', icon: Users },
  { name: 'Responsible AI Log', path: '/ai-log', icon: ClipboardList },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'About', path: '/about', icon: Info },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-surface border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-gray-900" />
        </div>
        <h1 className="text-xl font-bold text-gray-100 tracking-wide">NetSage <span className="text-primary">AI</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                isActive 
                  ? 'bg-gray-800 text-primary border border-gray-700' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 m-4 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-400">
        <p className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-primary" /> AI Safety</p>
        <p className="text-xs">Recommendations require human review before acceptance.</p>
      </div>
    </div>
  );
}
