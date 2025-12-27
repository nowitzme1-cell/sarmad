
import React from 'react';
import { ApiState } from '../types';

interface ResultViewProps {
  state: ApiState;
}

const ResultView: React.FC<ResultViewProps> = ({ state }) => {
  const { data, isLoading, error } = state;

  if (isLoading && !data && !error) {
    return (
      <div className="p-6 text-center text-gray-500 italic bg-white rounded-xl border border-gray-100 shadow-sm">
        Awaiting response from backend...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Error Encountered
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (data) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden transition-all duration-300">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
          <span className="text-xs font-mono text-slate-300">HTTP 200 OK</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Response Payload</h4>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono text-gray-800 border border-gray-100">
              {JSON.stringify(data.data || data, null, 2)}
            </pre>
          </div>
          {data.message && (
            <div className="text-sm text-gray-600 italic border-l-4 border-blue-400 pl-4 py-1">
              {data.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
      <div className="text-gray-400 mb-2">
        <svg className="w-12 h-12 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-400 font-medium">No activity data yet</p>
      <p className="text-gray-400 text-xs">Execute a command to see the results here</p>
    </div>
  );
};

export default ResultView;
