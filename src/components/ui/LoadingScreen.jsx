import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

const LoadingScreen = ({ message = "Aligning the stars..." }) => {
  return (
    <div className="min-h-screen bg-[#0a0518] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4c1d95_0%,transparent_70%)] opacity-20" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <div className="relative mb-12">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 bg-primary blur-3xl opacity-30"
          />
          <div className="relative w-24 h-24 glass rounded-[2rem] flex items-center justify-center border border-white/20 aura-logo-glow overflow-hidden">
            <motion.div
               animate={{ height: [12, 40, 12, 30, 12] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-0 left-6 w-1.5 bg-primary rounded-full"
            />
            <motion.div
               animate={{ height: [30, 15, 45, 20, 30] }}
               transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-0 left-10 w-1.5 bg-secondary rounded-full"
            />
            <motion.div
               animate={{ height: [15, 35, 20, 48, 15] }}
               transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-0 left-14 w-1.5 bg-accent rounded-full"
            />
            <Music2 size={40} className="text-white z-10" />
          </div>
        </div>

        <div className="text-center">
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4 tracking-[0.2em]">Aura<span className="text-primary">Music</span></h2>
           <div className="flex items-center gap-3 justify-center">
              <div className="flex gap-1.5">
                 {[0, 1, 2].map(i => (
                    <motion.div
                       key={i}
                       animate={{ opacity: [0.2, 1, 0.2] }}
                       transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                       className="w-1.5 h-1.5 bg-primary rounded-full"
                    />
                 ))}
              </div>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.5em]">{message}</p>
           </div>
        </div>
      </div>
      
      {/* Decorative Particle Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-20 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default LoadingScreen;
