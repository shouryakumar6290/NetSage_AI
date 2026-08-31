import { useState } from 'react';
import { Search, ShieldAlert, Activity, Play } from 'lucide-react';
import { mockCases } from '../data/mockCases';

export default function NewDiagnosis() {
  const [symptom, setSymptom] = useState('');
  const [topology, setTopology] = useState('');
  const [output, setOutput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDemoCase = () => {
    const demoCase = mockCases[0];
    setSymptom(demoCase.symptom);
    setTopology(demoCase.topology_note);
    setOutput(demoCase.show_output);
    setResult(null);
  };

  const handleAnalyze = () => {
    if (!symptom || !output) return;
    setAnalyzing(true);
    
    // Simulate AI delay
    setTimeout(() => {
      setResult({
        root_cause: "Possible missing route/inter-VLAN routing configuration",
        confidence: 82,
        osi_layer: "Layer 3 - Network",
        concept: "Routing / Inter-VLAN Routing",
        evidence: "The routing table does not show a route for the server network.",
        next_command: "show ip route",
        fix: "Verify the server network and configure the required routing path.",
        verification: "Ping the server IP after the routing configuration is corrected."
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">New Diagnosis</h1>
          <p className="text-gray-400">Describe the problem and provide command outputs for AI analysis.</p>
        </div>
        <button onClick={handleDemoCase} className="btn-secondary flex items-center gap-2 border border-gray-700">
          <Play className="w-4 h-4 text-primary" /> Load Demo Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Network Symptom</label>
              <textarea 
                className="input-field h-24 resize-none" 
                placeholder="e.g. PC gets an IP address but cannot reach the server in VLAN 30."
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Topology Notes</label>
              <textarea 
                className="input-field h-24 resize-none" 
                placeholder="e.g. PC1 is connected to Switch1 on VLAN 30..."
                value={topology}
                onChange={(e) => setTopology(e.target.value)}
              />
            </div>
          </div>

          <div className="card space-y-4">
            <label className="block text-sm font-medium text-gray-300">Command Output</label>
            <textarea 
              className="input-field h-48 font-mono text-sm bg-gray-900 border-gray-700" 
              placeholder="Paste Cisco show command output here..."
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>

          <button 
            className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
            onClick={handleAnalyze}
            disabled={analyzing || !symptom || !output}
          >
            {analyzing ? (
              <><Activity className="w-5 h-5 animate-spin" /> Analyzing Evidence...</>
            ) : (
              <><Search className="w-5 h-5" /> Analyze with NetSage AI</>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="card bg-gray-900/50 flex flex-col">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <ShieldAlert className="text-primary w-6 h-6" /> AI Diagnosis Result
          </h2>

          {!result && !analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>Provide evidence and click analyze to see results.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="bg-surface p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm text-gray-400 font-medium uppercase mb-1">Likely Root Cause</h3>
                <p className="text-lg text-white font-semibold">{result.root_cause}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm text-gray-400 font-medium uppercase mb-2">Confidence</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                    </div>
                    <span className="font-bold text-white">{result.confidence}%</span>
                  </div>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm text-gray-400 font-medium uppercase mb-1">OSI Layer</h3>
                  <p className="font-semibold text-gray-200">{result.osi_layer}</p>
                </div>
              </div>

              <div className="bg-surface p-4 rounded-lg border border-gray-700 border-l-4 border-l-primary">
                <h3 className="text-sm text-gray-400 font-medium uppercase mb-2">Evidence</h3>
                <p className="italic text-gray-300">"{result.evidence}"</p>
              </div>

              <div className="bg-surface p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm text-gray-400 font-medium uppercase mb-2">Recommended Next Command</h3>
                <code className="bg-gray-800 px-3 py-2 rounded text-primary font-mono block">
                  {result.next_command}
                </code>
              </div>

              <div className="bg-surface p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm text-gray-400 font-medium uppercase mb-2">Suggested Fix</h3>
                <p className="text-gray-300">{result.fix}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <p className="text-primary text-sm font-semibold mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> HUMAN REVIEW REQUIRED
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-success/20 hover:bg-success/30 text-success font-semibold py-2 rounded border border-success/30 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 rounded border border-primary/30 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-error/20 hover:bg-error/30 text-error font-semibold py-2 rounded border border-error/30 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
