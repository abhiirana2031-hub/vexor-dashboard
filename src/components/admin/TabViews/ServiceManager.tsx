import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Cpu, CheckCircle2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Services as ServiceType } from '@/entities';

interface ServiceManagerProps {
  services: ServiceType[];
  onAddNew: () => void;
  onEdit: (service: ServiceType) => void;
  onDelete: (id: string) => void;
}

export const ServiceManager = ({ services, onAddNew, onEdit, onDelete }: ServiceManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter mb-1 uppercase">Core Architecture</h2>
          <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Configure service nodes</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Integrate Service
          </span>
          <div className="btn-glow" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {services.map((service, idx) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card flex p-0 overflow-hidden group hover:border-secondary/20 transition-all duration-500"
            >
              <div className="w-40 sm:w-64 h-full relative overflow-hidden bg-white/[0.02] border-r border-white/5">
                {service.serviceImage ? (
                  <Image
                    src={service.serviceImage}
                    alt={service.serviceName || 'Service'}
                    width={300}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Cpu className="w-12 h-12 text-white/5" />
                  </div>
                )}
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-foreground tracking-tighter group-hover:text-secondary transition-colors">
                      {service.serviceName}
                    </h3>
                    {service.isFeatured && (
                      <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-secondary" />
                        <span className="text-[8px] font-black uppercase text-secondary">Featured Element</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground/40 font-medium leading-relaxed max-w-md italic">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-8 border-t border-white/5">
                  <button 
                    onClick={() => onEdit(service)}
                    className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-secondary hover:border-secondary/40 transition-all"
                  >
                    Modify
                  </button>
                  <button 
                    onClick={() => onDelete(service._id!)}
                    className="px-6 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-[10px] font-black uppercase tracking-widest text-destructive/60 hover:text-white hover:bg-destructive transition-all"
                  >
                    Drop
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
