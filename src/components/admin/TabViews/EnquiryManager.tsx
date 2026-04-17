import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Clock, MapPin, CornerUpLeft, Trash2, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

interface EnquiryManagerProps {
  enquiries: any[];
  onDelete: (id: string) => void;
  onUpdateEnquiry?: (id: string, updates: any) => void;
}

export const EnquiryManager = ({ enquiries, onDelete, onUpdateEnquiry }: EnquiryManagerProps) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied' | 'deleted'>('all');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');

  // Filter and Sort Logic
  const filteredData = [...enquiries]
    .filter(enq => {
       const status = enq.status || 'pending';
       if (statusFilter === 'all') return status !== 'deleted'; // Hide deleted from all by default, unless they click deleted tab
       return status === statusFilter;
    })
    .sort((a, b) => {
       const dA = new Date(a._createdDate || 0).getTime();
       const dB = new Date(b._createdDate || 0).getTime();
       return dateSort === 'newest' ? dB - dA : dA - dB;
    });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase">Incoming Signals</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Direct communication flux from potential partners</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Status Filters */}
          <div className="flex gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/5">
             {(['all', 'pending', 'replied', 'deleted'] as const).map(f => (
               <button
                 key={f}
                 onClick={() => setStatusFilter(f)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === f 
                    ? 'bg-secondary text-black shadow-neon-cyan' 
                    : 'text-foreground/40 hover:text-white hover:bg-white/5'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>

          {/* Date Sort Toggle */}
          <button 
            onClick={() => setDateSort(s => s === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-white transition-colors"
          >
            <Clock className="w-3 h-3" />
            Sort: {dateSort}
          </button>
          
          <div className="flex items-center gap-3 px-6 py-2 rounded-full glass-effect-dark border-white/10 ml-auto">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{enquiries.length} Total Waves</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredData.map((enquiry, idx) => {
            const currentStatus = enquiry.status || 'pending';
            return (
            <motion.div
              key={enquiry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-0 group flex flex-col md:flex-row items-stretch transition-all overflow-hidden ${
                 currentStatus === 'deleted' ? 'border-destructive/30 bg-destructive/5 opacity-60' :
                 currentStatus === 'replied' ? 'border-secondary/20 bg-secondary/5' :
                 'border-white/5 hover:border-secondary/10'
              }`}
            >
              {/* Left Badge Indicator */}
              <div className={`w-2 transition-opacity ${
                 currentStatus === 'deleted' ? 'bg-destructive opacity-100' :
                 currentStatus === 'replied' ? 'bg-neon-green opacity-100' :
                 'bg-secondary opacity-0 group-hover:opacity-100'
              }`} />

              <div className="flex-1 p-8 grid md:grid-cols-4 gap-8">
                {/* Meta */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Source Node</h4>
                      {currentStatus !== 'pending' && (
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                          currentStatus === 'deleted' ? 'bg-destructive/20 text-destructive' : 'bg-neon-green/20 text-neon-green'
                        }`}>
                          {currentStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-black text-foreground truncate">{enquiry.name || 'ANONYMOUS'}</p>
                    <p className="text-[10px] text-foreground/40 font-medium truncate">{enquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-foreground/20 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {new Date(enquiry._createdDate || 0).toLocaleString()}
                  </div>
                </div>

                {/* Message Payload */}
                <div className="md:col-span-2 relative">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-3">Signal Payload</h4>
                   <p className="text-sm text-foreground/60 leading-relaxed font-medium italic">
                    "{enquiry.message || 'No data stream provided.'}"
                   </p>
                   
                   {/* Decorative Mesh Background */}
                   <div className="absolute inset-0 bg-secondary/[0.02] -z-10 rounded-xl blur-sm" />
                </div>

                {/* Response Matrix */}
                <div className="flex flex-col justify-center items-end gap-3 border-l border-white/5 pl-8">
                  {currentStatus === 'pending' && onUpdateEnquiry && (
                     <button 
                       onClick={() => onUpdateEnquiry(enquiry._id, { status: 'replied' })}
                       className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary hover:bg-neon-green hover:text-black hover:border-neon-green transition-all group/btn"
                     >
                       <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mark Replied</span>
                     </button>
                  )}

                  {currentStatus === 'replied' && onUpdateEnquiry && (
                     <button 
                       onClick={() => onUpdateEnquiry(enquiry._id, { status: 'pending' })}
                       className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground/60 hover:bg-white hover:text-black hover:border-white transition-all group/btn"
                     >
                       <RotateCcw className="w-4 h-4 group-hover/btn:-rotate-45 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Revert Pending</span>
                     </button>
                  )}

                  {currentStatus !== 'deleted' ? (
                     <button 
                       onClick={() => onUpdateEnquiry?.(enquiry._id, { status: 'deleted' })}
                       className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive/60 hover:bg-destructive hover:text-white transition-all"
                     >
                       <Trash2 className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Soft Delete</span>
                     </button>
                  ) : (
                     <div className="w-full flex gap-2">
                        <button 
                          onClick={() => onUpdateEnquiry?.(enquiry._id, { status: 'pending' })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground/60 hover:bg-white hover:text-black transition-all"
                          title="Restore Signal"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(enquiry._id!)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive/60 hover:bg-destructive hover:text-white transition-all"
                          title="Permanent Purge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {enquiries.length === 0 && (
         <div className="h-64 glass-effect border-dashed flex flex-col items-center justify-center space-y-4 opacity-20">
            <Mail className="w-12 h-12" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">No active signals in sector.</p>
         </div>
      )}
    </div>
  );
};
