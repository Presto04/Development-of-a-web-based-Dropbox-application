
import React from 'react';
import { ShieldCheck, Lock, Eye, AlertCircle, FileWarning, Search, Code, Cpu } from 'lucide-react';

const SecurityReport: React.FC = () => {
  return (
    <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
      <div className="border-b border-slate-100 pb-6 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Security Architecture Analysis</h1>
        <p className="text-slate-500">Official Report for Dropbox Prototype Protocol</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 border-l-4 border-indigo-600 pl-3">
            Implemented Measures
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="shrink-0 text-indigo-600"><Lock size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Role-Based Access Control (RBAC)</p>
                <p className="text-xs text-slate-500 leading-relaxed">System strictly segregates data access between Admin (Full), Uploader (CRUD own), and Viewer (Read-only) identities.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="shrink-0 text-emerald-600"><Search size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Input Sanitization</p>
                <p className="text-xs text-slate-500 leading-relaxed">Filenames are automatically sanitized using regex pattern <code>/[^a-zA-Z0-9.-]/g</code> to prevent path traversal and script injection.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="shrink-0 text-rose-600"><ShieldCheck size={20} /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">AI-Powered Heuristics</p>
                <p className="text-xs text-slate-500 leading-relaxed">Gemini 3 Flash analyzes file metadata patterns to detect anomalous structures or potential malicious payloads before storage.</p>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 border-l-4 border-amber-500 pl-3">
            Potential Threats & Mitigations
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Threat: XSS / Filename Injection</p>
              <p className="text-xs text-slate-700">Mitigation: String sanitization and React's built-in escaping prevent arbitrary code execution via file metadata.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Threat: Privilege Escalation</p>
              <p className="text-xs text-slate-700">Mitigation: Immutable state-based role checking ensures UI components only render based on verified session claims.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Threat: Malware Propagation</p>
              <p className="text-xs text-slate-700">Mitigation: Real-time scan engine blocks download functionality for any object with a threat status of INFECTED.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Cpu size={22} className="text-indigo-400" />
            Workflow Architecture
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full text-center">CLIENT UPLOAD</div>
            <div className="hidden md:block text-indigo-400">→</div>
            <div className="p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/30 w-full text-center">SANITIZER (Regex)</div>
            <div className="hidden md:block text-indigo-400">→</div>
            <div className="p-3 bg-rose-900/40 rounded-lg border border-rose-500/30 w-full text-center">GEMINI AI SCAN</div>
            <div className="hidden md:block text-indigo-400">→</div>
            <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-500/30 w-full text-center">SECURE REPOSITORY</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FileWarning className="text-rose-500" size={18} />
            Limitations
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            As a prototype, this application uses browser LocalStorage. In a production environment, files should be stored in S3/Cloud Storage with encryption-at-rest (AES-256) and scanned with heavy-duty tools like ClamAV.
          </p>
        </div>
        <div className="border border-slate-200 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Code className="text-indigo-500" size={18} />
            Comparison
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Unlike standard Dropbox, Dropbox Prototype integrates **Proactive AI Security** directly into the upload lifecycle, ensuring that metadata is vetted before it enters the application context.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityReport;
