import { createContext, useState, useContext, type ReactNode } from 'react';
import { setApiToken } from '../api/client';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string | null, refresh: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);

  function setTokens(access: string | null, refresh: string | null) {
    setAccessTokenState(access);
    setRefreshTokenState(refresh);
    setApiToken(access);
  }

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}