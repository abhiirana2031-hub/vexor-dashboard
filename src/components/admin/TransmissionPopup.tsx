import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

interface TransmissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const TransmissionPopup = ({ isOpen, onClose, message = 'Transmission_Successful' }: TransmissionPopupProps) => {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="fixed bottom-10 right-10 z-[200] pointer-events-none"
        >
          <div className="glass-card p-0 overflow-hidden border-secondary/40 shadow-neon-cyan/20 w-80">
            <div className="bg-secondary/10 border-b border-white/5 p-3 flex justify-between items-center">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary">Neural_Link_Status</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/40" />
              </div>
            </div>
            
            <div className="p-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <ShieldCheck className="w-6 h-6 text-secondary" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tighter text-foreground italic">{message}</h3>
                <p className="text-[9px] text-foreground/40 font-bold uppercase tracking-widest">Node synchronized with central matrix</p>
              </div>
            </div>
            
            <div className="h-1 bg-white/5 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-secondary"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
