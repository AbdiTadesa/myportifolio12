import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const OWNER_EMAIL = 'abditadese112@gmail.com';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Try sign in first
      let { error } = await supabase.auth.signInWithPassword({ email, password });

      // If owner has no account yet, create it once (signups are disabled globally,
      // but if this is the owner email and login fails with "Invalid credentials",
      // we attempt signUp — which will be rejected if signups are off).
      if (error && email === OWNER_EMAIL) {
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpResult.error) throw signUpResult.error;
        // Try sign-in again after signup (auto-confirm is on)
        const retry = await supabase.auth.signInWithPassword({ email, password });
        if (retry.error) throw retry.error;
        error = null;
      }

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      toast({ title: 'Sign-in failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-primary flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to portfolio
      </Link>
      <div className="glass w-full max-w-md p-8 rounded-2xl">
        <h1 className="text-3xl font-display font-bold mb-2 text-gradient">Owner Sign In</h1>
        <p className="text-muted-foreground text-sm mb-6">
          This portal is private. Only the portfolio owner can sign in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  );
}
