import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Cpu, 
  MessageSquare, 
  Users, 
  Star, 
  Settings, 
  Mail, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  QrCode,
  History
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onSetActiveTab: (tab: string) => void;
  activeTab: string;
}

const menuItems = [
  { id: 'stats', label: 'Ecosystem Analytics', icon: TrendingUp },
  { id: 'projects', label: 'Deployments', icon: Briefcase },
  { id: 'services', label: 'Core Architecture', icon: Cpu },
  { id: 'blogs', label: 'Data Logs', icon: FileText },
  { id: 'users', label: 'Neural Profiles', icon: Users },
  { id: 'testimonials', label: 'Client Feedback', icon: MessageSquare },
  { id: 'team', label: 'Squad Matrix', icon: Star },
  { id: 'enquiries', label: 'Incoming Signals', icon: Mail },
  { id: 'scanner', label: 'Neural QR Scanner', icon: QrCode },
  { id: 'auditlogs', label: 'Neural Activity Logs', icon: History },
];

export const Sidebar = ({ onSetActiveTab, activeTab }: SidebarProps) => {
  return (
    <div className="h-full bg-background border-r border-white/5 flex flex-col relative preserve-3d">
      {/* Logo Section */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center overflow-hidden">
            <img src="/vexor-logo.png" alt="Vexor Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="font-heading font-black text-xl tracking-tighter text-foreground">VEXOR</h1>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-secondary">Control_Panel v2.4</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSetActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
              activeTab === item.id 
              ? 'text-secondary bg-secondary/5' 
              : 'text-foreground/40 hover:text-foreground hover:bg-white/[0.02]'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-secondary animate-pulse' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-paragraph">
              {item.label}
            </span>

            {/* Active Highlight Pill */}
            {activeTab === item.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-1/2 bg-secondary rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
           onClick={() => window.location.href = '/'}
           className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-destructive/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-500 font-black uppercase tracking-widest text-[10px]"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* Cyber Grid Background Element */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
    </div>
  );
};
