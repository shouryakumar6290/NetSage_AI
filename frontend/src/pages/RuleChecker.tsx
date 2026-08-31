import { useState } from 'react';
import { ShieldCheck, Play, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RuleChecker() {
  const [output, setOutput] = useState('');
  const [results, setResults] = useState<{status: string, message: string}[] | null>(null);

  const handleCheck = () => {
    // Deterministic mock checking based on python logic
    const res = [];
    if (output.includes('administratively down') || output.includes('line protocol is down')) {
      res.push({ status: 'warn', message: 'Interface is administratively down.' });
    }
    if (output.includes('192.168.1.10') && output.includes('0000.1111.2222') && output.includes('0000.3333.4444')) {
      res.push({ status: 'warn', message: 'Possible duplicate IP address detected in ARP table.' });
    }
    if (output.includes('show vlan brief') && output.includes('30')) {
      res.push({ status: 'ok', message: 'VLAN 30 exists.' });
    }
    if (res.length === 0 && output.length > 5) {
      res.push({ status: 'ok', message: 'No common deterministic faults detected.' });
    }
    
    setResults(res.length > 0 ? res : null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Deterministic Rule Checker</h1>
        <p className="text-gray-400">Run fast, rule-based checks on command output to catch common faults before AI analysis.</p>
      </div>

      <div className="card space-y-4">
        <label className="block text-sm font-medium text-gray-300">Command Output</label>
        <textarea 
          className="input-field h-64 font-mono text-sm bg-gray-900 border-gray-700" 
          placeholder="Paste Cisco show command output here (e.g. show ip interface brief)..."
          value={output}
          onChange={(e) => setOutput(e.target.value)}
        />
        
        <div className="flex justify-end gap-3">
          <button 
            className="btn-secondary border border-gray-700 text-sm py-2"
            onClick={() => setOutput("GigabitEthernet0/0 unassigned YES unset administratively down down")}
          >
            Load Example
          </button>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={handleCheck}
            disabled={!output}
          >
            <Play className="w-4 h-4" /> Run Rule Checker
          </button>
        </div>
      </div>

      {results && (
        <div className="card animate-in fade-in slide-in-from-bottom-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-primary w-5 h-5" /> Results
          </h2>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded bg-gray-900/50 border ${r.status === 'warn' ? 'border-error/30 text-error' : 'border-success/30 text-success'}`}>
                {r.status === 'warn' ? <AlertTriangle className="w-5 h-5 mt-0.5" /> : <CheckCircle className="w-5 h-5 mt-0.5" />}
                <span>{r.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
