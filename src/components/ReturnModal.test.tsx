import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReturnModal } from './ReturnModal';
import { RoleProvider, useRole } from '../context/RoleContext';
import type { Contract, Role } from '../types';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

function createContract(overrides: Partial<Contract> = {}): Contract {
  return {
    id: 'C202509876',
    fechaUIO: '2024-03-15',
    fechaFinContrato: '2025-10-15',
    nombreCliente: 'Juan Carlos Valverde Campo',
    modelo: 'Corolla',
    serie: '12345X',
    placa: 'ABC-123',
    ruc: '20100001234',
    dealerEntrega: 'José Antonio Martínez Vargas',
    localEntrega: 'Local Norte',
    estadoContrato: 'Activo',
    kilometraje: 45000,
    ...overrides,
  };
}

/** Helper to set a role inside RoleProvider before rendering the modal */
function RoleSetup({ role, children }: { role: Role; children: ReactNode }) {
  const { setRole } = useRole();
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);
  return <>{children}</>;
}

function renderWithRole(
  ui: ReactNode,
  role: Role = 'Admin_Local',
) {
  return render(
    <RoleProvider>
      <RoleSetup role={role}>{ui}</RoleSetup>
    </RoleProvider>,
  );
}

describe('ReturnModal', () => {
  describe('General structure', () => {
    it('renders the title "Devolución vehículo"', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      expect(screen.getByText('Devolución vehículo')).toBeInTheDocument();
    });

    it('renders two tabs: "Datos" and "Servicios"', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      expect(screen.getByRole('tab', { name: 'Datos' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Servicios' })).toBeInTheDocument();
    });

    it('renders a close icon button', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
    });

    it('renders a "Cancelar" button for editable roles', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
        'Admin_Local',
      );

      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });
  });

  describe('Default active tab', () => {
    it('shows the Datos tab as active by default', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      const datosTab = screen.getByRole('tab', { name: 'Datos' });
      expect(datosTab).toHaveAttribute('aria-selected', 'true');
    });

    it('shows the Datos tab panel content by default', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      const datosPanel = screen.getByRole('tabpanel');
      expect(datosPanel).toHaveAttribute('id', 'return-tabpanel-0');
    });

    it('does not show the Servicios tab panel by default', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      const serviciosTab = screen.getByRole('tab', { name: 'Servicios' });
      expect(serviciosTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Tab switching', () => {
    it('switches to the Servicios tab when clicked', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Servicios' }));

      const serviciosTab = screen.getByRole('tab', { name: 'Servicios' });
      expect(serviciosTab).toHaveAttribute('aria-selected', 'true');

      const tabPanel = screen.getByRole('tabpanel');
      expect(tabPanel).toHaveAttribute('id', 'return-tabpanel-1');
    });

    it('switches back to the Datos tab when clicked', () => {
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={vi.fn()} />,
      );

      // Switch to Servicios first
      fireEvent.click(screen.getByRole('tab', { name: 'Servicios' }));
      // Switch back to Datos
      fireEvent.click(screen.getByRole('tab', { name: 'Datos' }));

      const datosTab = screen.getByRole('tab', { name: 'Datos' });
      expect(datosTab).toHaveAttribute('aria-selected', 'true');

      const tabPanel = screen.getByRole('tabpanel');
      expect(tabPanel).toHaveAttribute('id', 'return-tabpanel-0');
    });
  });

  describe('Close behavior', () => {
    it('calls onClose when "Cancelar" button is clicked', () => {
      const onClose = vi.fn();
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={onClose} />,
        'Admin_Local',
      );

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close icon is clicked', () => {
      const onClose = vi.fn();
      renderWithRole(
        <ReturnModal open={true} contract={createContract()} onClose={onClose} />,
      );

      fireEvent.click(screen.getByLabelText('Cerrar'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Not rendered when closed', () => {
    it('does not render content when open is false', () => {
      renderWithRole(
        <ReturnModal open={false} contract={createContract()} onClose={vi.fn()} />,
      );

      expect(screen.queryByText('Devolución vehículo')).not.toBeInTheDocument();
    });
  });
});
