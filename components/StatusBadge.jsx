import { Check } from 'lucide-react';

export default function StatusBadge({ status, fileSize, isDark }) {
  if (!status) return null;
  
  const isSuccess = fileSize > 0 && fileSize <= 201;
  
  return (
    <div className={`mb-6 p-4 rounded-2xl text-center font-semibold shadow-lg animate-pulse ${
      isSuccess
        ? isDark ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-300'
        : isDark ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-700 border border-blue-300'
    }`}>
      {isSuccess && <Check className="w-5 h-5 inline mr-2" />}
      {status}
    </div>
  );
}