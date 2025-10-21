import { Check, X } from 'lucide-react';

export default function CompressionDetails({ fileSize, isDark }) {
  return (
    <div>
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Compression Details
      </h3>
      
      <div className={`p-6 rounded-2xl mb-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-4">
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>File Size</span>
          <span className={`text-2xl font-bold ${
            fileSize <= 201 
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {fileSize} KB
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all rounded-full ${
              fileSize <= 201
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
            style={{ width: `${Math.min((fileSize / 201) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">0 KB</span>
          <span className="text-xs text-gray-500">201 KB Target</span>
        </div>
      </div>

      {fileSize <= 201 ? (
        <div className={`p-4 rounded-xl mb-4 ${
          isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-300'
        }`}>
          <div className="flex items-center gap-2">
            <Check className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
              Perfect! Image is under 201KB
            </span>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-xl mb-4 ${
          isDark ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'
        }`}>
          <div className="flex items-center gap-2">
            <X className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <span className={`font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
              Compressed to minimum possible size
            </span>
          </div>
        </div>
      )}
    </div>
  );
}