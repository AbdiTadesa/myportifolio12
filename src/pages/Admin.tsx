import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogOut, Upload, Loader2, Trash2, FileText, Video as VideoIcon, ImageIcon, ExternalLink } from 'lucide-react';
import { z } from 'zod';

const CATEGORIES = [
  'Programming & Tech',
  'Graphic Design',
  'Logo Design',
  'Poster Design',
  'Video Editing',
  'Digital Marketing',
];

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

const detectFileType = (file: File): 'image' | 'video' | 'pdf' => {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return 'image';
};

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title required').max(120),
  description: z.string().trim().max(500).optional(),
  external_url: z.string().trim().url().max(500).optional().or(z.literal('')),
  category: z.string().min(1, 'Pick a category'),
});

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [samples, setSamples] = useState<WorkSample[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const load = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from('work_samples')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setSamples(data as WorkSample[]);
    setLoadingList(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = formSchema.safeParse({ title, description, external_url: externalUrl, category });
    if (!parsed.success) {
      toast({ title: 'Invalid', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    if (!file) {
      toast({ title: 'No file', description: 'Please select a file', variant: 'destructive' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 50MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileType = detectFileType(file);
      const ext = file.name.split('.').pop();
      const path = `${category}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('work-samples')
        .upload(path, file, { contentType: file.type });
      if (uploadErr) throw uploadErr;

      const { data: pub } = supabase.storage.from('work-samples').getPublicUrl(path);

      const { error: insertErr } = await supabase.from('work_samples').insert({
        skill_category: category,
        title,
        description: description || null,
        image_url: pub.publicUrl,
        external_url: externalUrl || null,
        file_type: fileType,
        created_by: user!.id,
      });
      if (insertErr) throw insertErr;

      toast({ title: 'Uploaded!', description: `${title} added to ${category}` });
      setTitle(''); setDescription(''); setExternalUrl(''); setFile(null);
      (document.getElementById('admin-file') as HTMLInputElement | null)?.value && ((document.getElementById('admin-file') as HTMLInputElement).value = '');
      load();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (sample: WorkSample) => {
    if (!confirm(`Delete "${sample.title}"?`)) return;
    try {
      const url = new URL(sample.image_url);
      const marker = '/work-samples/';
      const idx = url.pathname.indexOf(marker);
      if (idx >= 0) {
        const path = decodeURIComponent(url.pathname.slice(idx + marker.length));
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

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  if (user && !isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-muted-foreground">Access denied. Owner only.</p>
        <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}>
          Sign out
        </Button>
      </main>
    );
  }

  const TypeIcon = ({ t }: { t: string }) =>
    t === 'video' ? <VideoIcon className="w-4 h-4" /> :
    t === 'pdf' ? <FileText className="w-4 h-4" /> :
    <ImageIcon className="w-4 h-4" />;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to portfolio
        </Link>
        <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}>
          <LogOut className="w-4 h-4 mr-1" /> Sign out
        </Button>
      </header>

      <h1 className="text-4xl font-display font-bold mb-2 text-gradient">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Upload your CV, images, and videos. They'll appear on your portfolio under the chosen skill.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-display font-semibold mb-4">Add New Work</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label>Skill category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="t">Title</Label>
              <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
            </div>
            <div>
              <Label htmlFor="d">Description (optional)</Label>
              <Textarea id="d" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={3} />
            </div>
            <div>
              <Label htmlFor="u">External link (optional)</Label>
              <Input id="u" type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="admin-file">File (image, video, or PDF — max 50MB)</Label>
              <Input
                id="admin-file"
                type="file"
                accept="image/*,video/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-1">
                  {detectFileType(file).toUpperCase()} · {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </Button>
          </form>
        </section>

        <section className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-display font-semibold mb-4">Your Uploads ({samples.length})</h2>
          {loadingList ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : samples.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nothing uploaded yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {samples.map((s) => (
                <li key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                  <div className="w-12 h-12 rounded bg-background flex items-center justify-center text-primary shrink-0">
                    <TypeIcon t={s.file_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.skill_category}</p>
                  </div>
                  <a href={s.image_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-1">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(s)} className="text-destructive/80 hover:text-destructive p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
