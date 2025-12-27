
import React, { useState, useEffect } from 'react';

/**
 * Default URL fallback from environment variables
 */
const DEFAULT_BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  // --- State Management ---
  const [backendUrl, setBackendUrl] = useState(DEFAULT_BACKEND);
  const [urlInput, setUrlInput] = useState(DEFAULT_BACKEND);
  const [input, setInput] = useState('');      
  const [result, setResult] = useState(null);  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);    

  // Load saved backend URL on startup
  useEffect(() => {
    const savedUrl = localStorage.getItem('custom_backend_url');
    if (savedUrl) {
      setBackendUrl(savedUrl);
      setUrlInput(savedUrl);
    }
  }, []);

  // --- API Handlers ---

  const updateBackend = () => {
    try {
      // Basic validation
      new URL(urlInput); 
      setBackendUrl(urlInput);
      localStorage.setItem('custom_backend_url', urlInput);
      alert("✅ Backend URL updated successfully!");
    } catch (e) {
      alert("❌ Invalid URL format. Please include http:// or https://");
    }
  };

  const handleRequest = async (endpoint: string, method: string = 'POST', body: any = null) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Clean up the URL to ensure no double slashes
    const base = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    try {
      const response = await fetch(`${base}${path}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Network error - ensure the backend URL is correct and CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = () => {
    if (!input.trim()) return alert("Please enter something first!");
    handleRequest('/api/process', 'POST', { input });
  };

  const handleTrigger = () => {
    handleRequest('/n8n/trigger', 'POST');
  };

  const handleFlaskSend = () => {
    if (!input.trim()) return alert("Please enter a message!");
    handleRequest('/send', 'POST', { message: input });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 border border-slate-100 relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

        {/* Header */}
        <div className="text-center relative">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <span className="p-2 bg-indigo-600 text-white rounded-lg rotate-3 shadow-lg">B</span>
            Backend Bridge
          </h1>
          <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-[0.2em]">Dynamic Connection Hub</p>
        </div>

        {/* Dynamic Backend Configuration */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${backendUrl === urlInput ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              Target Endpoint URL
            </label>
            <span className="text-[9px] font-mono text-slate-400">Current: {backendUrl}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono shadow-inner"
              placeholder="https://your-api.railway.app"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button
              onClick={updateBackend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all whitespace-nowrap"
            >
              Connect
            </button>
          </div>
        </div>
        
        {/* User Input Section */}
        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">Message Payload</label>
          <textarea
            className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm min-h-[100px] resize-none"
            placeholder="Type content to send to your backend..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleFlaskSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span className="text-lg group-hover:translate-x-1 transition-transform">🚀</span>
            )}
            Transmit to Flask Proxy
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleProcess}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 active:scale-95 disabled:opacity-50 text-xs"
            >
              Process Logic
            </button>
            <button
              onClick={handleTrigger}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl transition duration-200 active:scale-95 disabled:opacity-50 text-xs"
            >
              n8n Workflow
            </button>
          </div>
        </div>

        {/* Results / Feedback Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemetry Output</h3>
            {result && (
              <button 
                onClick={() => setResult(null)}
                className="text-[10px] text-slate-400 hover:text-red-500 font-bold underline"
              >
                Reset
              </button>
            )}
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs border border-red-100 font-bold animate-shake">
              ⚠️ Connection Fault: {error}
            </div>
          )}
          
          {result && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <pre className="p-5 bg-slate-900 text-indigo-300 rounded-2xl text-[11px] overflow-auto max-h-60 font-mono shadow-2xl border border-slate-800 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
              <p className="text-slate-300 italic text-xs font-medium">Listening for response packet...</p>
            </div>
          )}
        </div>
        
        {/* Environment Footer */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest font-black">
              Session Root: {backendUrl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
