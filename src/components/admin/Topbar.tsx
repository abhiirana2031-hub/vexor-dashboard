import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, User, Command, Menu } from 'lucide-react';

interface TopbarProps {
  member: any;
  onToggleSidebar?: () => void;
}

export const Topbar = ({ member, onToggleSidebar }: TopbarProps) => {
  return (
    <div className="h-20 bg-background/50 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 flex items-center justify-between relative z-20 gap-4">
      {/* Mobile Toggle */}
      {onToggleSidebar && (
        <button onClick={onToggleSidebar} className="p-2 rounded-xl text-foreground/40 hover:text-secondary lg:hidden flex-shrink-0 transition-colors">
           <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search Bar - Glass Style */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-secondary group-focus-within:shadow-neon-cyan transition-all" />
          <input 
            type="text" 
            placeholder="Initialize Command Search... (Ctrl + K)" 
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-12 focus:border-secondary/20 focus:bg-white/[0.04] outline-none transition-all text-xs font-black uppercase tracking-widest text-foreground/60 placeholder:text-foreground/10"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 opacity-40">
            <Command className="w-3 h-3" />
            <span className="text-[8px] font-black">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-8">
        {/* Toggle Theme */}
        <button className="p-3 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-secondary transition-all">
          <Moon className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-3 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-secondary transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full shadow-neon-cyan animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-4 pl-8 border-l border-white/5 group cursor-pointer">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
              {member?.profile?.nickname || 'SYS_ADMIN'}
            </p>
            <p className="text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">Root_Level</p>
          </div>
          <div className="w-12 h-12 rounded-2xl border border-white/10 p-1 group-hover:border-secondary transition-all">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-secondary/40 to-neon-purple/40 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
