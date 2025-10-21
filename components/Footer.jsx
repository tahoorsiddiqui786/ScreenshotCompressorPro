import { Heart, Code } from 'lucide-react';

export default function Footer({ isDark }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative z-10 mt-16 border-t ${
        isDark
          ? 'border-gray-800 bg-gray-900/50'
          : 'border-gray-200 bg-white/50'
      } backdrop-blur-sm`}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3
              className={`text-lg font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              About
            </h3>
            <p
              className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Screenshot Compressor Pro helps you compress images under 201KB
              with ease. Perfect for web optimization and fast loading times.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3
              className={`text-lg font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Features
            </h3>
            <ul
              className={`text-sm space-y-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <li>• Screenshot Capture</li>
              <li>• Image Upload & Compression</li>
              <li>• Auto-optimize under 201KB</li>
              <li>• Custom folder download</li>
              <li>• Dark/Light Mode</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`pt-6 border-t ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              className={`flex items-center gap-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <span>Made with</span>
              <Heart
                className={`w-4 h-4 ${
                  isDark ? 'text-red-400' : 'text-red-500'
                } animate-pulse`}
              />
              <span>by</span>
              <span
                className={`font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}
              >
                Tahoor Siddiqui
              </span>
            </div>

            <div
              className={`flex items-center gap-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>
                © {currentYear} Screenshot Compressor Pro. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
