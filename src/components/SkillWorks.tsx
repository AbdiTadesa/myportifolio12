import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Loader2, FileText, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WorkSample {
  id: string;
  skill_category: string;
  title: string;
  description: string | null;
  image_url: string;
  external_url: string | null;
  file_type: string;
  created_at: string;
}

export default function SkillWorks({ category }: { category: string }) {
  const [open, setOpen] = useState(false);
  const [samples, setSamples] = useState<WorkSample[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('work_samples')
      .select('*')
      .eq('skill_category', category)
      .order('created_at', { ascending: false });
    if (data) setSamples(data as WorkSample[]);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  return (
    <div className="mt-4 border-t border-border/40 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <span>{open ? 'Hide' : 'View'} work samples</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {!loading && samples.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No work samples yet.
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                {samples.map((s) => (
                  <div key={s.id} className="group relative rounded-lg overflow-hidden bg-muted aspect-square">
                    {s.file_type === 'video' ? (
                      <>
                        <video
                          src={s.image_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        />
                        <div className="absolute top-2 right-2 bg-background/70 rounded-full p-1 text-primary">
                          <Play className="w-3 h-3" />
                        </div>
                      </>
                    ) : s.file_type === 'pdf' ? (
                      <a
                        href={s.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-colors"
                      >
                        <FileText className="w-10 h-10 text-primary" />
                        <span className="text-xs text-foreground px-2 text-center line-clamp-2">{s.title}</span>
                      </a>
                    ) : (
                      <img src={s.image_url} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
                      <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                      {s.description && (
                        <p className="text-[10px] text-muted-foreground line-clamp-2">{s.description}</p>
                      )}
                      {s.external_url && (
                        <a
                          href={s.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[10px] text-primary pointer-events-auto"
                        >
                          <ExternalLink className="w-3 h-3" /> Visit
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
