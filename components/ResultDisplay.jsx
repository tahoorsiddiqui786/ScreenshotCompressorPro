import { Download } from 'lucide-react';
import CompressionDetails from './CompressionDetails';

export default function ResultDisplay({ compressedImage, fileSize, onDownload, isDark }) {
  if (!compressedImage) return null;

  return (
    <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-sm ${
      isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 border border-gray-200'
    }`}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Compressed Result
          </h3>
          <div className={`rounded-2xl overflow-hidden shadow-lg border-2 ${
            fileSize <= 201 
              ? isDark ? 'border-green-500' : 'border-green-400'
              : isDark ? 'border-yellow-500' : 'border-yellow-400'
          }`}>
            <img src={compressedImage} alt="Compressed" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <CompressionDetails fileSize={fileSize} isDark={isDark} />
          
          <button
            onClick={onDownload}
            className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            <Download className="w-5 h-5 inline mr-2" />
            Download Compressed Image
          </button>
        </div>
      </div>
    </div>
  );
}
