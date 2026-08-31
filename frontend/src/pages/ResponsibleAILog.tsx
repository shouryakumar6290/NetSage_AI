import { FileEdit, AlertCircle } from 'lucide-react';

const corrections = [
  {
    id: "NS-019",
    ai_diag: "ACL blocking traffic.",
    correction: "Missing default gateway.",
    reason: "ACL output contained no deny rule affecting the source network. The actual issue was the host missing a default gateway in the ipconfig output.",
    reviewer: "admin@netsage",
    timestamp: "2023-10-24 14:30"
  },
  {
    id: "NS-021",
    ai_diag: "VLAN mismatch.",
    correction: "Standard ACL applied too close to source.",
    reason: "AI hallucinated a VLAN issue based on symptom, but the evidence clearly showed Standard ACL 10 blocking the host.",
    reviewer: "j.doe@netsage",
    timestamp: "2023-10-22 09:15"
  },
  {
    id: "NS-004",
    ai_diag: "Port Security Violation.",
    correction: "Native VLAN mismatch.",
    reason: "AI misclassified CDP errors as port security. Output showed trunking native vlan mismatch (1 vs 99).",
    reviewer: "admin@netsage",
    timestamp: "2023-10-20 16:45"
  },
  {
    id: "NS-032",
    ai_diag: "Duplicate IP.",
    correction: "Wrong Subnet Mask.",
    reason: "AI saw two IP addresses in the text but they were just gateway and host. The actual issue was a /16 mask on a /24 network.",
    reviewer: "s.smith@netsage",
    timestamp: "2023-10-18 11:20"
  },
  {
    id: "NS-015",
    ai_diag: "ISP link down.",
    correction: "Wrong Next Hop.",
    reason: "Evidence showed a static route with next hop 198.51.100.2, but topology note said ISP is .1. AI failed to correlate.",
    reviewer: "admin@netsage",
    timestamp: "2023-10-15 08:30"
  }
];

export default function ResponsibleAILog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <FileEdit className="w-8 h-8 text-primary" /> Responsible AI Log
        </h1>
        <p className="text-gray-400">Record of human corrections to AI diagnoses. Used to improve future model accuracy.</p>
      </div>

      <div className="space-y-6">
        {corrections.map((c) => (
          <div key={c.id} className="card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Case {c.id} Correction
              </h2>
              <div className="text-right">
                <p className="text-sm text-gray-400">{c.timestamp}</p>
                <p className="text-xs text-gray-500">{c.reviewer}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Original AI Diagnosis</p>
                <p className="text-sm text-gray-400 line-through decoration-error/50">{c.ai_diag}</p>
              </div>
              <div className="bg-primary/5 p-4 rounded border border-primary/20">
                <p className="text-xs font-semibold text-primary uppercase mb-2">Human Correction</p>
                <p className="text-sm text-gray-200">{c.correction}</p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded border border-gray-700">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Why AI was wrong
              </p>
              <p className="text-sm text-gray-300 italic">"{c.reason}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
