import { createContext, useContext, useState, ReactNode } from 'react';
import type { Role } from '../types';

interface RoleContextValue {
  role: Role | null;
  setRole: (role: Role) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);

  const setRole = (newRole: Role) => setRoleState(newRole);
  const clearRole = () => setRoleState(null);

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
}
