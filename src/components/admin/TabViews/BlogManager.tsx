import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, Eye, Calendar } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Blogs as BlogType } from '@/entities';

interface BlogManagerProps {
  blogs: BlogType[];
  onAddNew: () => void;
  onEdit: (blog: BlogType) => void;
  onDelete: (id: string) => void;
}

export const BlogManager = ({ blogs, onAddNew, onEdit, onDelete }: BlogManagerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase">Data Logs</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Knowledge transmission and industry insights</p>
        </div>
        <button 
          onClick={onAddNew}
          className="futuristic-button group"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            New Transmission
          </span>
          <div className="btn-glow" />
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {blogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card flex flex-col md:flex-row p-6 gap-8 group hover:border-secondary/20 transition-all"
            >
              {/* Media */}
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden glass-effect-dark flex-shrink-0">
                {blog.featuredImage ? (
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title || 'Blog'}
                    width={200}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white/5" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-secondary transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-foreground/20">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(blog._createdDate || 0).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-3 h-3" /> {blog.views || 0} Flux</span>
                      <span className="text-secondary opacity-60">/ {blog.category || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${blog.isPublished ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                    {blog.isPublished ? 'Live' : 'Draft'}
                  </div>
                </div>
                <p className="text-xs text-foreground/30 font-medium leading-relaxed max-w-2xl line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-center gap-3 pl-8 md:border-l border-white/5">
                <button 
                  onClick={() => onEdit(blog)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-foreground/40 flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(blog._id!)}
                  className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive/60 flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
