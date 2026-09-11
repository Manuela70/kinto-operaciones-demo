import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Role } from '../types';
import { Header } from './Header';

// Mock useRole to control the role value in tests
const mockUseRole = vi.fn();

vi.mock('../context/RoleContext', () => ({
  useRole: () => mockUseRole(),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/contracts' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

function setRole(role: Role | null) {
  mockUseRole.mockReturnValue({
    role,
    setRole: vi.fn(),
    clearRole: vi.fn(),
  });
}

function setLocation(pathname: string) {
  mockLocation.pathname = pathname;
}

describe('Header', () => {
  beforeEach(() => {
    mockUseRole.mockClear();
    mockNavigate.mockClear();
    mockLocation.pathname = '/contracts';
  });

  // -----------------------------------------------------------
  // Requirement 3.3 – Admin_Kinto nav links
  // -----------------------------------------------------------
  describe('nav links for Admin_Kinto', () => {
    const expectedLabels = [
      'Cotizaciones',
      'Contratos',
      'Asignaciones',
      'Servicios',
      'Devolución',
      'Admin',
    ];

    it('renders exactly 6 navigation links', () => {
      setRole('Admin_Kinto');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('renders the correct link labels in order', () => {
      setRole('Admin_Kinto');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      const labels = buttons.map((btn) => btn.textContent);
      expect(labels).toEqual(expectedLabels);
    });
  });

  // -----------------------------------------------------------
  // Requirement 3.4 – Admin_Local nav links
  // -----------------------------------------------------------
  describe('nav links for Admin_Local', () => {
    const expectedLabels = [
      'Solicitudes',
      'Cotizaciones',
      'Contratos',
      'Asignaciones',
      'Servicios',
      'Devolución',
    ];

    it('renders exactly 6 navigation links', () => {
      setRole('Admin_Local');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('renders the correct link labels in order', () => {
      setRole('Admin_Local');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      const labels = buttons.map((btn) => btn.textContent);
      expect(labels).toEqual(expectedLabels);
    });
  });

  // -----------------------------------------------------------
  // Requirement 3.5 – Asesor nav links
  // -----------------------------------------------------------
  describe('nav links for Asesor', () => {
    const expectedLabels = [
      'Solicitudes',
      'Cotizaciones',
      'Contratos',
      'Asignaciones',
      'Servicios',
      'Devolución',
    ];

    it('renders exactly 6 navigation links', () => {
      setRole('Asesor');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      expect(buttons).toHaveLength(6);
    });

    it('renders the correct link labels in order', () => {
      setRole('Asesor');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const buttons = within(nav).getAllByRole('button');
      const labels = buttons.map((btn) => btn.textContent);
      expect(labels).toEqual(expectedLabels);
    });
  });

  // -----------------------------------------------------------
  // Requirement 3.2 – User info section
  // -----------------------------------------------------------
  describe('user info section', () => {
    it('displays the role label for Admin_Kinto', () => {
      setRole('Admin_Kinto');
      render(<Header />);
      expect(screen.getByText('Administrador Kinto')).toBeInTheDocument();
    });

    it('displays the role label for Admin_Local', () => {
      setRole('Admin_Local');
      render(<Header />);
      expect(screen.getByText('Administrador de Local')).toBeInTheDocument();
    });

    it('displays the role label for Asesor', () => {
      setRole('Asesor');
      render(<Header />);
      expect(screen.getByText('Asesor de Concesionario')).toBeInTheDocument();
    });

    it('displays the user name', () => {
      setRole('Admin_Kinto');
      render(<Header />);
      expect(screen.getByText('AGIRALDO')).toBeInTheDocument();
    });

    it('displays the branch (sucursal)', () => {
      setRole('Admin_Kinto');
      render(<Header />);
      expect(screen.getByText('MITSUI-Mitsui C.C. Jockey Plaza')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------
  // Requirement 3.6 – Active link highlighting on /contracts
  // -----------------------------------------------------------
  describe('active link highlighting', () => {
    it('highlights Devolución with bold font weight when on /contracts', () => {
      setRole('Admin_Kinto');
      setLocation('/contracts');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const devolucionBtn = within(nav).getByText('Devolución');
      // Active button has fontWeight 600 via sx prop
      expect(devolucionBtn).toHaveStyle({ fontWeight: 600 });
    });

    it('does not highlight other links when on /contracts', () => {
      setRole('Admin_Kinto');
      setLocation('/contracts');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const cotizacionesBtn = within(nav).getByText('Cotizaciones');
      // Non-active links have fontWeight 400
      expect(cotizacionesBtn).toHaveStyle({ fontWeight: 400 });
    });

    it('does not highlight Devolución when on /placeholder', () => {
      setRole('Admin_Kinto');
      setLocation('/placeholder');
      render(<Header />);
      const nav = screen.getByRole('navigation');
      const devolucionBtn = within(nav).getByText('Devolución');
      expect(devolucionBtn).toHaveStyle({ fontWeight: 400 });
    });
  });

  // -----------------------------------------------------------
  // Edge: renders nothing when role is null
  // -----------------------------------------------------------
  it('renders nothing when role is null', () => {
    setRole(null);
    const { container } = render(<Header />);
    expect(container.innerHTML).toBe('');
  });
});
