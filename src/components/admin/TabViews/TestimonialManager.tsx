import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Quote, Star } from 'lucide-react';
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
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase">Client Feedback</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Manage testimonials and reviews</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Add Feedback
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
              className="glass-card flex flex-col p-8 border-white/5 group relative"
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  {item.clientPhoto ? (
                     <img src={item.clientPhoto} alt={item.clientName} className="w-14 h-14 rounded-[1rem] object-cover border border-white/10" />
                  ) : (
                     <div className="w-14 h-14 rounded-[1rem] bg-white/[0.03] border border-white/10 flex items-center justify-center">
                        <Quote className="w-6 h-6 text-secondary/40" />
                     </div>
                  )}
                  <div>
                     <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">{item.clientName || 'Anonymous Partner'}</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{item.clientRole || 'Client'}, {(item as any).companyName || 'Corporate Entity'}</p>
                  </div>
                </div>
                
                {/* Rating Display */}
                <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < (item.rating || 5) ? 'text-[#e9f243] fill-[#e9f243]' : 'text-foreground/20'}`} />
                   ))}
                </div>
              </div>

              <div className="flex-1 relative mb-12">
                 <Quote className="w-10 h-10 absolute -top-2 -left-2 text-white/5 z-0" />
                 <p className="relative z-10 text-foreground/60 text-sm leading-relaxed font-medium italic">
                    "{item.testimonialText || 'No transmission data.'}"
                 </p>
              </div>

              {/* Actions */}
              <div className="absolute right-8 bottom-8 flex gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                 <button 
                   onClick={() => onEdit(item)}
                   className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center hover:bg-secondary text-secondary hover:text-black transition-colors"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => onDelete(item._id)}
                   className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center hover:bg-destructive text-destructive hover:text-white transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {testimonials.length === 0 && (
           <div className="col-span-full h-48 glass-effect rounded-[2rem] flex items-center justify-center border-white/5">
              <p className="text-[10px] uppercase font-black tracking-widest text-foreground/20">No feedback entries found</p>
           </div>
        )}
      </div>
    </div>
  );
};
