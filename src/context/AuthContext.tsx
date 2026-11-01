import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { clearSession, readSession, writeSession } from '../utils/session';

interface AuthContextValue {
  user: User | null;
  signIn: (user: User, remember: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);

  const signIn = useCallback((nextUser: User, remember: boolean) => {
    writeSession(nextUser, remember);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}

/** For pages behind <ProtectedRoute>: the signed-in user is guaranteed. */
export function useRequiredUser(): { user: User; signOut: () => void } {
  const { user, signOut } = useAuth();
  if (!user) throw new Error('useRequiredUser must be used inside <ProtectedRoute>');
  return { user, signOut };
}
