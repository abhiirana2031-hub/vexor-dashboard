import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, X, Terminal, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CommandPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'info' | 'warning';
}

export const CommandPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Authorize Command", 
  type = 'danger' 
}: CommandPopupProps) => {
  const isDanger = type === 'danger';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none no-scrollbar">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
           animate={{ opacity: 1, scale: 1, rotateX: 0 }}
           exit={{ opacity: 0, scale: 0.95, rotateX: -10 }}
           className="relative"
        >
          {/* Neural Card Shell */}
          <div className={`relative glass-card border-none p-8 overflow-hidden ${
            isDanger ? 'bg-destructive/5' : 'bg-secondary/5'
          }`}>
             {/* Cyber Accents */}
             <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent" />
             <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent" />
             <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="text-foreground/20 hover:text-foreground transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-8 relative z-10">
                {/* Header Phase */}
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                      isDanger ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-secondary/10 border-secondary/20 text-secondary'
                   }`}>
                      {isDanger ? <ShieldAlert className="w-8 h-8" /> : <Terminal className="w-8 h-8" />}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 italic">System_Protocol_Authorization</p>
                      <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase italic">{title}</h2>
                   </div>
                </div>

                {/* Message Phase */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                   <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                      {message}
                   </p>
                </div>

                {/* Action Phase */}
                <div className="flex gap-4">
                   <button 
                     onClick={onClose} 
                     className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-all"
                   >
                      Abort_Action
                   </button>
                   <button
                     onClick={onConfirm}
                     className={`flex-[2] futuristic-button overflow-hidden group ${
                        isDanger ? 'border-destructive/40 hover:border-destructive' : ''
                     }`}
                   >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                         {confirmText}
                         <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {isDanger ? (
                         <div className="absolute inset-0 bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      ) : (
                         <div className="btn-glow" />
                      )}
                   </button>
                </div>

                {/* Status Bar */}
                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                   <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                         <div key={i} className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-destructive/20' : 'bg-secondary/20'}`} />
                      ))}
                   </div>
                   <span className="text-[7px] font-bold uppercase tracking-widest text-foreground/20 italic">Vexora_Secure_Module_Active</span>
                </div>
             </div>
          </div>

          {/* Background Grid Accent */}
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none -z-10" />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
