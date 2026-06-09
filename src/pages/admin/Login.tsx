import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn, session, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (!loading && session) {
      navigate('/admin/dashboard');
    }
  }, [session, loading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen section-navy flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Southern Maldives" className="h-16 w-16 rounded-full border-2 border-emerald-700 mx-auto mb-4" />
          <span className="block text-sm font-bold tracking-[0.2em] uppercase text-white">Southern Maldives</span>
          <span className="font-serif italic text-emerald-400 text-sm">Admin Portal</span>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-brand" />

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-brand rounded-xl mb-4 shadow-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">Admin Login</h1>
              <p className="text-slate-500 text-sm mt-1">Sign in to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                  })}
                  placeholder="admin@southernmaldives.com"
                  className="rounded-lg border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className="rounded-lg border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-5 text-sm font-semibold shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}