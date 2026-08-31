import { useState } from 'react';
import { ShieldCheck, Check, Edit2, X, AlertOctagon } from 'lucide-react';

export default function HumanReview() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'edited' | 'rejected'>('pending');

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" /> Human Review Queue
        </h1>
        <p className="text-gray-400">Review pending AI diagnoses before they are finalized.</p>
      </div>

      <div className="card border-l-4 border-l-primary">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="badge bg-primary/10 text-primary border border-primary/20 mb-2 inline-block">Case NS-007</span>
            <h2 className="text-xl font-bold text-white">Pending Review: DHCP Gateway Mismatch</h2>
          </div>
          <span className="text-sm text-gray-500">2 minutes ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">User Input Evidence</h3>
            <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
              <p className="text-sm text-gray-300 font-medium mb-1">Symptom:</p>
              <p className="text-sm text-gray-400 mb-4">Clients get IP but cannot browse.</p>
              
              <p className="text-sm text-gray-300 font-medium mb-1">Command Output:</p>
              <pre className="text-xs text-gray-400 font-mono bg-black/50 p-2 rounded">
{`Router# show run | section dhcp
ip dhcp pool CLIENTS
 network 172.16.0.0 255.255.255.0
 default-router 172.16.1.1`}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Diagnosis</h3>
            <div className="bg-surface p-4 rounded border border-gray-700 space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Root Cause</p>
                <p className="text-sm text-gray-200">Default router in DHCP pool is outside the subnet.</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Layer</p>
                  <p className="text-sm text-gray-200">Layer 3</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Confidence</p>
                  <p className="text-sm text-primary font-bold">92%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Proposed Fix</p>
                <p className="text-sm text-gray-200">Change default-router in DHCP pool to 172.16.0.1.</p>
              </div>
            </div>
          </div>
        </div>

        {status === 'pending' && (
          <div className="border-t border-gray-800 pt-6 flex gap-4">
            <button 
              onClick={() => setStatus('accepted')}
              className="flex-1 btn-secondary bg-success/10 text-success border border-success/30 hover:bg-success/20 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Accept Diagnosis
            </button>
            <button 
              onClick={() => setStatus('edited')}
              className="flex-1 btn-secondary bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-5 h-5" /> Edit & Accept
            </button>
            <button 
              onClick={() => setStatus('rejected')}
              className="flex-1 btn-secondary bg-error/10 text-error border border-error/30 hover:bg-error/20 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Reject Diagnosis
            </button>
          </div>
        )}

        {status !== 'pending' && (
          <div className="border-t border-gray-800 pt-6">
            <div className={`p-4 rounded-lg flex items-center gap-3 ${status === 'accepted' ? 'bg-success/10 text-success border border-success/30' : status === 'edited' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-error/10 text-error border border-error/30'}`}>
              <AlertOctagon className="w-6 h-6" />
              <div>
                <p className="font-bold">Review Completed</p>
                <p className="text-sm opacity-80">This diagnosis was {status} by the human reviewer.</p>
              </div>
            </div>
            <button onClick={() => setStatus('pending')} className="mt-4 text-sm text-gray-400 hover:text-white underline">Reset for Demo</button>
          </div>
        )}
      </div>
    </div>
  );
}
