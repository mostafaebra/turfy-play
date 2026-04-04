import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ message }) => (
  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;