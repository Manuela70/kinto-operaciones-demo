import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider, useRole } from '../context/RoleContext';
import { ProtectedLayout } from './ProtectedLayout';
import { useEffect } from 'react';

describe('ProtectedLayout', () => {
  it('redirects to / when no role is set and accessing /contracts', () => {
    render(
      <RoleProvider>
        <MemoryRouter initialEntries={['/contracts']}>
          <Routes>
            <Route path="/" element={<div>RoleSelector</div>} />
            <Route element={<ProtectedLayout />}>
              <Route path="/contracts" element={<div>ContractsList</div>} />
              <Route path="/placeholder" element={<div>PlaceholderPage</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </RoleProvider>,
    );
    expect(screen.getByText('RoleSelector')).toBeInTheDocument();
    expect(screen.queryByText('ContractsList')).not.toBeInTheDocument();
  });

  it('redirects to / when no role is set and accessing /placeholder', () => {
    render(
      <RoleProvider>
        <MemoryRouter initialEntries={['/placeholder']}>
          <Routes>
            <Route path="/" element={<div>RoleSelector</div>} />
            <Route element={<ProtectedLayout />}>
              <Route path="/contracts" element={<div>ContractsList</div>} />
              <Route path="/placeholder" element={<div>PlaceholderPage</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </RoleProvider>,
    );
    expect(screen.getByText('RoleSelector')).toBeInTheDocument();
    expect(screen.queryByText('PlaceholderPage')).not.toBeInTheDocument();
  });

  it('renders Header and child route when role is set', () => {
    function TestApp() {
      return (
        <RoleProvider>
          <SetRoleWrapper />
        </RoleProvider>
      );
    }

    function SetRoleWrapper() {
      const { role, setRole } = useRole();

      useEffect(() => {
        if (!role) setRole('Admin_Kinto');
      }, [role, setRole]);

      if (!role) return null;

      return (
        <MemoryRouter initialEntries={['/contracts']}>
          <Routes>
            <Route path="/" element={<div>RoleSelector</div>} />
            <Route element={<ProtectedLayout />}>
              <Route path="/contracts" element={<div>ContractsList</div>} />
              <Route path="/placeholder" element={<div>PlaceholderPage</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
    }

    render(<TestApp />);
    expect(screen.getByText('KINTO')).toBeInTheDocument();
    expect(screen.getByText('ContractsList')).toBeInTheDocument();
  });

  it('renders Header and placeholder page when role is set and on /placeholder', () => {
    function TestApp() {
      return (
        <RoleProvider>
          <SetRoleWrapper />
        </RoleProvider>
      );
    }

    function SetRoleWrapper() {
      const { role, setRole } = useRole();

      useEffect(() => {
        if (!role) setRole('Asesor');
      }, [role, setRole]);

      if (!role) return null;

      return (
        <MemoryRouter initialEntries={['/placeholder']}>
          <Routes>
            <Route path="/" element={<div>RoleSelector</div>} />
            <Route element={<ProtectedLayout />}>
              <Route path="/contracts" element={<div>ContractsList</div>} />
              <Route path="/placeholder" element={<div>PlaceholderPage</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
    }

    render(<TestApp />);
    expect(screen.getByText('KINTO')).toBeInTheDocument();
    expect(screen.getByText('PlaceholderPage')).toBeInTheDocument();
  });
});
