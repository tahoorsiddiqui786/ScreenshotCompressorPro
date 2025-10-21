import { Moon, Sun, Zap } from 'lucide-react';

export default function Header({ isDark, toggleTheme }) {
  return (
    <div className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-2xl ${
          isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
        } shadow-lg`}>
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Screenshot Compressor Pro
          </h1>
          <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
            Compress images under 201KB instantly
          </p>
        </div>
      </div>
      
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
          isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
        } shadow-lg`}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}