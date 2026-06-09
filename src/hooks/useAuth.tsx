import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/lib/apiService';
import { Session, AuthResponse } from '@/types/auth';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from localStorage (JWT token)
    const token = localStorage.getItem('auth_token');
    setSession(token ? { token } : null);
    setLoading(false);

    // No real subscription mechanism for simple JWT flow
    const unsub = authService.onAuthStateChange(() => {});
    return () => unsub?.unsubscribe?.();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result: AuthResponse = await authService.signIn(email, password);
    if (result?.token) {
      localStorage.setItem('auth_token', result.token);
      setSession({ token: result.token });
    }
  };

  const signOut = async () => {
    await authService.signOut();
    localStorage.removeItem('auth_token');
    setSession(null);
  };

  const value = {
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}