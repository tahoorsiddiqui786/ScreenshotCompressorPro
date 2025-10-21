export default function ActionCard({ icon: Icon, title, description, buttonText, onClick, isProcessing, isDark, gradientColors }) {
  return (
    <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all transform hover:scale-105 ${
      isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 border border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-8 h-8 ${isDark ? gradientColors.iconDark : gradientColors.iconLight}`} />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
      </div>
      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${gradientColors.button}`}
      >
        <Icon className="w-5 h-5 inline mr-2" />
        {isProcessing ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
