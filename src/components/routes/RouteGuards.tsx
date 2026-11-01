import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface GuardProps {
  children: ReactElement;
}

/** Renders children only for signed-in users. */
export function ProtectedRoute({ children }: GuardProps) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/** Renders children only for signed-out users (e.g. the login page). */
export function PublicOnlyRoute({ children }: GuardProps) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}
