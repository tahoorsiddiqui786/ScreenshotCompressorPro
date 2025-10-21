import { Image } from 'lucide-react';

export default function UploadCard({ onFileUpload, isProcessing, isDark }) {
  return (
    <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all transform hover:scale-105 ${
      isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Image className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upload Image
        </h2>
      </div>
      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Choose an image from your device to compress it under 201KB
      </p>
      <label className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 cursor-pointer shadow-lg flex items-center justify-center ${
        isDark
          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Image className="w-5 h-5 inline mr-2" />
        {isProcessing ? 'Processing...' : 'Upload Image'}
        <input
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          disabled={isProcessing}
          className="hidden"
        />
      </label>
    </div>
  );
}