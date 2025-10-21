export default function AnimatedBackground({ isDark }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
        isDark ? 'bg-purple-500' : 'bg-purple-300'
      }`}></div>
      <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
        isDark ? 'bg-blue-500' : 'bg-blue-300'
      }`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute top-1/2 left-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse ${
        isDark ? 'bg-pink-500' : 'bg-pink-300'
      }`} style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
