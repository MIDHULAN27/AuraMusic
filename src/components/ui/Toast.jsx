import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: <CheckCircle2 className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Info className="text-primary" size={20} />,
  };

  const colors = {
    success: 'border-green-500/20 bg-green-500/5',
    error: 'border-red-500/20 bg-red-500/5',
    info: 'border-primary/20 bg-primary/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 px-6 py-4 rounded-[2rem] border backdrop-blur-2xl shadow-2xl min-w-[300px] ${colors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-bold text-text-primary tracking-tight">{message}</p>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-full transition-colors text-text-secondary"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
