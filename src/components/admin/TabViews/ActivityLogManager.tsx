import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Terminal, 
  Clock, 
  Hash, 
  User, 
  Layers, 
  ShieldCheck,
  AlertCircle,
  Activity
} from 'lucide-react';
import { AuditLogs } from '@/entities';

interface ActivityLogManagerProps {
  logs: AuditLogs[];
}

export const ActivityLogManager = ({ logs }: ActivityLogManagerProps) => {
  // Sort logs by timestamp descending
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getActionStyles = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'UPDATE':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'DELETE':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-foreground/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Neural_Activity_Logs</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Operational Audit Matrix v1.0</p>
        </div>
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
           <Activity className="w-4 h-4 text-secondary animate-pulse" />
           <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">{logs.length} Operations Recorded</span>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedLogs.length === 0 ? (
          <div className="glass-card p-20 text-center space-y-4 border-dashed border-white/5">
             <Terminal className="w-12 h-12 text-foreground/10 mx-auto" />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">No activity detected in current cycle</p>
          </div>
        ) : (
          sortedLogs.map((log, index) => (
            <motion.div
              key={log._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 border-white/5 group hover:border-secondary/20 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {/* Action Badge */}
                <div className="flex-shrink-0">
                  <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black tracking-[0.2em] uppercase italic ${getActionStyles(log.action)}`}>
                    {log.action}
                  </div>
                </div>

                {/* Main Intel */}
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-secondary" />
                    <span className="text-sm font-black uppercase tracking-tight text-foreground">{log.actorName}</span>
                    <span className="text-[10px] font-bold text-foreground/20 italic lowercase tracking-tight">{log.actorId}</span>
                  </div>
                  <p className="text-xs text-foreground/60 font-medium italic">"{log.description}"</p>
                </div>

                {/* Target Metadata */}
                <div className="flex gap-8 border-l border-white/5 pl-8">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-foreground/20 flex items-center gap-1">
                      <Layers className="w-2.5 h-2.5" /> Collection
                    </label>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">{log.collectionId}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-foreground/20 flex items-center gap-1">
                      <Hash className="w-2.5 h-2.5" /> Entity_ID
                    </label>
                    <p className="text-[10px] font-mono text-foreground/40">{log.itemId?.slice(-12) || '---'}</p>
                  </div>
                  <div className="space-y-1 min-w-[120px]">
                    <label className="text-[8px] font-black uppercase text-foreground/20 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Timestamp
                    </label>
                    <p className="text-[10px] font-bold text-foreground/60">
                      {new Date(log.timestamp).toLocaleString('en-US', { 
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
