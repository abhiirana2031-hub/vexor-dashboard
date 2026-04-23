import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Quote, Star, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { Testimonials as TestimonialType } from '@/entities';

interface TestimonialManagerProps {
  testimonials: TestimonialType[];
  onAddNew: () => void;
  onEdit: (item: TestimonialType) => void;
  onDelete: (id: string) => void;
}

export const TestimonialManager = ({ testimonials, onAddNew, onEdit, onDelete }: TestimonialManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Feedback_Synthesis</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Client transmission moderation matrix</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Integrate Feedback
          </span>
          <div className="btn-glow" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card flex flex-col p-10 border-white/5 group relative overflow-hidden"
            >
              {/* Status Indicator Overlay */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary to-transparent opacity-40" />
              
              <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                  {item.clientImage ? (
                     <img src={item.clientImage} alt={item.clientName} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg" />
                  ) : (
                     <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                        <Quote className="w-8 h-8 text-secondary/40" />
                     </div>
                  )}
                  <div className="space-y-1">
                     <h3 className="font-heading text-xl font-black tracking-tighter text-foreground uppercase italic">{item.clientName || 'Anonymous Operative'}</h3>
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary/60">{item.clientRoleCompany || 'Sector Unknown'}</p>
                  </div>
                </div>
                
                {/* Rating Display */}
                <div className="flex gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < (item.rating || 5) ? 'text-secondary fill-secondary' : 'text-foreground/10'}`} />
                   ))}
                </div>
              </div>

              <div className="flex-1 relative mb-16">
                 <Quote className="w-12 h-12 absolute -top-4 -left-4 text-secondary/5 z-0" />
                 <p className="relative z-10 text-foreground/60 text-sm leading-relaxed font-medium italic">
                    "{item.reviewText || 'No transmission data decoded.'}"
                 </p>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-center gap-4">
                    {(item as any).isApproved ? (
                       <div className="flex items-center gap-2 text-[9px] font-black text-[#39FF14] uppercase tracking-widest italic">
                          <ShieldCheck className="w-4 h-4" />
                          Validated
                       </div>
                    ) : (
                       <div className="flex items-center gap-2 text-[9px] font-black text-destructive uppercase tracking-widest italic">
                          <ShieldAlert className="w-4 h-4" />
                          Pending_Review
                       </div>
                    )}
                 </div>

                 <div className="flex gap-3">
                    <button 
                      onClick={() => onEdit(item)}
                      className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-secondary hover:border-secondary/40 transition-all flex items-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" />
                      Modify
                    </button>
                    <button 
                      onClick={() => onDelete(item._id)}
                      className="px-6 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-[9px] font-black uppercase tracking-widest text-destructive/60 hover:text-white hover:bg-destructive transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Purge
                    </button>
                 </div>
              </div>

              {/* Ambient Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/5 blur-[50px] pointer-events-none group-hover:bg-secondary/10 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {testimonials.length === 0 && (
           <div className="col-span-full h-64 glass-card flex flex-col items-center justify-center border-dashed border-white/10">
              <Quote className="w-12 h-12 text-white/5 mb-4" />
              <p className="text-[10px] uppercase font-black tracking-[0.5em] text-foreground/20 italic">No feedback entries detected in local matrix</p>
           </div>
        )}
      </div>
    </div>
  );
};

