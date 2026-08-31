import { useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { mockCases } from '../data/mockCases';

export default function CaseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = mockCases.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.concept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Case Library</h1>
        <p className="text-gray-400">Search and review past troubleshooting scenarios.</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text"
              placeholder="Search cases by title or concept..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Concept</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Layer</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCases.map((c) => (
                <tr key={c.case_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                  <td className="py-4 text-gray-400 font-mono">{c.case_id}</td>
                  <td className="py-4 text-gray-200 font-medium">{c.title}</td>
                  <td className="py-4 text-gray-400">{c.concept}</td>
                  <td className="py-4">
                    <span className={`badge ${c.severity === 'High' || c.severity === 'Critical' ? 'bg-error/10 text-error' : c.severity === 'Medium' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{c.osi_layer}</td>
                  <td className="py-4 text-right">
                    <button className="text-primary hover:text-white transition-colors flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                      View Case <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No cases found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
