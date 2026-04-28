import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, Trash2, ExternalLink, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface WorkSample {
  id: string;
  skill_category: string;
  title: string;
  description: string | null;
  image_url: string;
  external_url: string | null;
  created_at: string;
}

const uploadSchema = z.object({
  title: z.string().trim().min(1, 'Title required').max(120),
  description: z.string().trim().max(500).optional(),
  external_url: z.string().trim().url().max(500).optional().or(z.literal('')),
});

export default function SkillWorks({ category }: { category: string }) {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [samples, setSamples] = useState<WorkSample[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('work_samples')
      .select('*')
      .eq('skill_category', category)
      .order('created_at', { ascending: false });
    if (!error && data) setSamples(data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = uploadSchema.safeParse({ title, description, external_url: externalUrl });
    if (!parsed.success) {
      toast({ title: 'Invalid', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    if (!file) {
      toast({ title: 'No file', description: 'Please select an image', variant: 'destructive' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 10MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop();
      const path = `${category}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('work-samples')
        .upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from('work-samples').getPublicUrl(path);

      const { error: insertErr } = await supabase.from('work_samples').insert({
        skill_category: category,
        title,
        description: description || null,
        image_url: pub.publicUrl,
        external_url: externalUrl || null,
        created_by: user.id,
      });
      if (insertErr) throw insertErr;

      toast({ title: 'Uploaded!', description: 'Work sample added.' });
      setTitle(''); setDescription(''); setExternalUrl(''); setFile(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (sample: WorkSample) => {
    if (!confirm('Delete this work sample?')) return;
    try {
      // Extract path from public URL
      const url = new URL(sample.image_url);
      const marker = '/work-samples/';
      const idx = url.pathname.indexOf(marker);
      if (idx >= 0) {
        const path = url.pathname.slice(idx + marker.length);
        await supabase.storage.from('work-samples').remove([path]);
      }
      const { error } = await supabase.from('work_samples').delete().eq('id', sample.id);
      if (error) throw error;
      toast({ title: 'Deleted' });
      load();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    }
  };

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

              {!loading && samples.length === 0 && !showForm && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No work samples yet.
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                {samples.map((s) => (
                  <div key={s.id} className="group relative rounded-lg overflow-hidden bg-muted aspect-square">
                    <img src={s.image_url} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                      {s.description && (
                        <p className="text-[10px] text-muted-foreground line-clamp-2">{s.description}</p>
                      )}
                      <div className="flex gap-1 mt-1">
                        {s.external_url && (
                          <a
                            href={s.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(s)}
                            className="p-1 rounded bg-destructive/20 hover:bg-destructive/40 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isAdmin && !showForm && (
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add work sample
                </Button>
              )}

              {isAdmin && showForm && (
                <form onSubmit={handleUpload} className="space-y-2 p-3 rounded-lg bg-muted/40">
                  <div>
                    <Label htmlFor={`title-${category}`} className="text-xs">Title</Label>
                    <Input
                      id={`title-${category}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`desc-${category}`} className="text-xs">Description (optional)</Label>
                    <Textarea
                      id={`desc-${category}`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`url-${category}`} className="text-xs">External link (optional)</Label>
                    <Input
                      id={`url-${category}`}
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`file-${category}`} className="text-xs">Image</Label>
                    <Input
                      id={`file-${category}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="hero" size="sm" className="flex-1" disabled={uploading}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                      Upload
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
