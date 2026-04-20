import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';

const trafficData = [
  { name: '01:00', val: 400 },
  { name: '04:00', val: 300 },
  { name: '08:00', val: 900 },
  { name: '12:00', val: 700 },
  { name: '16:00', val: 1200 },
  { name: '20:00', val: 800 },
  { name: '00:00', val: 500 },
];

const growthData = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 30 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 65 },
  { name: 'Sun', value: 90 },
];

interface StatsOverviewProps {
  stats: {
    projects: number;
    users: number;
    enquiries: number;
    blogs: number;
  };
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const cards = [
    { label: 'Neural Deployments', value: stats.projects, icon: Briefcase, color: '#00f5ff', growth: '+12%' },
    { label: 'Incoming Signals', value: stats.enquiries, icon: Activity, color: '#7b61ff', growth: '+5%' },
    { label: 'Active Profiles', value: stats.users, icon: Users, color: '#00f5ff', growth: '+28%' },
    { label: 'System Uptime', value: '99.9%', icon: Zap, color: '#7b61ff', growth: 'Stable' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover:border-white/10 p-5 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5"
                style={{ backgroundColor: `${card.color}10`, color: card.color }}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black text-secondary">
                <ArrowUpRight className="w-2.5 h-2.5" />
                {card.growth}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">{card.label}</p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">{card.value}</h3>
            </div>
            
            {/* Ambient Back Glow */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 blur-3xl opacity-10 rounded-full" style={{ backgroundColor: card.color }} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Traffic Chart */}
        <div className="glass-card p-8 h-[270px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/60">Data Flux Matrix</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[9px] font-black uppercase text-foreground/40 tracking-widest">Live Streams</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff10" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff30', fontWeight: '900' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#05070d', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '9px',
                    fontWeight: '900',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#00f5ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#00f5ff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Bar Chart */}
        <div className="glass-card p-8 h-[270px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/60">Expansion Node Status</h3>
             <TrendingUp className="w-4 h-4 text-secondary opacity-40" />
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff10" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff30', fontWeight: '900' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#05070d', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {growthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f5ff' : '#7b61ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
