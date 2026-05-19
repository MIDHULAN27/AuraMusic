import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AuraMusic Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0518] text-white flex flex-col items-center justify-center p-6 font-sans">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#4c1d95_0%,transparent_50%)] opacity-30" />
          
          <div className="relative glass p-12 rounded-[3.5rem] border border-white/10 max-w-2xl w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
               <AlertCircle size={48} className="text-red-500" />
            </div>
            
            <h1 className="text-5xl font-black mb-6 tracking-tighter uppercase">Cosmic Disturbance</h1>
            <p className="text-xl text-white/60 mb-10 font-bold leading-relaxed">
              Something went wrong in the music galaxy. Don't worry, your playlists are safe!
            </p>
            
            <div className="bg-black/40 rounded-3xl p-6 mb-10 text-left border border-white/5 overflow-hidden">
               <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Error Log</p>
               <p className="text-sm font-mono text-white/80 break-words opacity-70">
                 {this.state.error?.message || "Unknown Runtime Error"}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 px-10 py-5 bg-primary text-white font-black rounded-3xl hover:scale-105 transition-all shadow-xl neon-glow uppercase tracking-widest"
              >
                <RotateCcw size={20} />
                <span>Reload App</span>
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-3 px-10 py-5 bg-white/5 text-white font-black rounded-3xl hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest"
              >
                <Home size={20} />
                <span>Go Home</span>
              </button>
            </div>
          </div>
          
          <p className="mt-12 text-white/30 text-xs font-black uppercase tracking-[0.3em]">AuraMusic Stability Protocol</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
