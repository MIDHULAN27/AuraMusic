import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

const Logo = ({ className = '', size = 32 }) => {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent rounded-xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity"
        />
        <div className="relative w-12 h-12 glass rounded-xl flex items-center justify-center border border-white/20 aura-logo-glow overflow-hidden">
          <motion.div
             animate={{ height: [12, 24, 12, 18, 12] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 left-3 w-1 bg-primary rounded-full"
          />
          <motion.div
             animate={{ height: [18, 10, 22, 12, 18] }}
             transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 left-5 w-1 bg-secondary rounded-full"
          />
          <motion.div
             animate={{ height: [10, 20, 14, 24, 10] }}
             transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 left-7 w-1 bg-accent rounded-full"
          />
          <Music2 size={24} className="text-white z-10" />
        </div>
      </div>
      <span className="text-2xl font-black tracking-tighter text-text-primary group-hover:text-primary transition-all duration-500">
        Aura<span className="text-primary group-hover:text-text-primary transition-colors">Music</span>
      </span>
    </div>
  );
};

export default Logo;
