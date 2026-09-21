import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContractsTable } from './ContractsTable';
import { RoleProvider, useRole } from '../context/RoleContext';
import type { Contract } from '../types';
import type { ReactNode } from 'react';

// Helper to set a role before rendering the table
function RoleWrapper({ role, children }: { role: 'Admin_Kinto' | 'Admin_Local' | 'Asesor'; children: ReactNode }) {
  return (
    <RoleProvider>
      <RoleSetter role={role} />
      {children}
    </RoleProvider>
  );
}

function RoleSetter({ role }: { role: 'Admin_Kinto' | 'Admin_Local' | 'Asesor' }) {
  const { setRole } = useRole();
  // Set role on first render
  if (role) setRole(role);
  return null;
}

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

function createContracts(count: number): Contract[] {
  return Array.from({ length: count }, (_, i) =>
    createContract({
      id: `C20250${String(9876 + i).padStart(4, '0')}`,
      nombreCliente: `Cliente ${i + 1}`,
      serie: `${12345 + i}X`,
    }),
  );
}

describe('ContractsTable', () => {
  describe('Column headers', () => {
    it('renders all required column headers', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={[createContract()]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      const expectedColumns = [
        'Fecha UIO',
        'Fecha fin de contrato',
        'Nombre del cliente',
        'Modelo',
        'Serie',
        'Dealer entrega',
        'Estado contrato',
        'Devolución',
      ];

      for (const col of expectedColumns) {
        expect(screen.getByText(col)).toBeInTheDocument();
      }
    });
  });

  describe('Role-based action icons', () => {
    it('shows eye icon (VisibilityIcon) for Admin_Kinto', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={[createContract()]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      const button = screen.getByLabelText('Ver contrato C202509876');
      expect(button).toBeInTheDocument();
      expect(button.querySelector('[data-testid="VisibilityIcon"]')).toBeInTheDocument();
    });

    it('shows edit icon (EditIcon) for Admin_Local', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Admin_Local">
          <ContractsTable contracts={[createContract()]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      const button = screen.getByLabelText('Editar contrato C202509876');
      expect(button).toBeInTheDocument();
      expect(button.querySelector('[data-testid="EditIcon"]')).toBeInTheDocument();
    });

    it('shows edit icon (EditIcon) for Asesor', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Asesor">
          <ContractsTable contracts={[createContract()]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      const button = screen.getByLabelText('Editar contrato C202509876');
      expect(button).toBeInTheDocument();
      expect(button.querySelector('[data-testid="EditIcon"]')).toBeInTheDocument();
    });
  });

  describe('Action icon callback', () => {
    it('calls onSelectContract with the correct contract when action icon is clicked', () => {
      const onSelect = vi.fn();
      const contract = createContract();
      render(
        <RoleWrapper role="Admin_Local">
          <ContractsTable contracts={[contract]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      fireEvent.click(screen.getByLabelText('Editar contrato C202509876'));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(contract);
    });
  });

  describe('Date formatting', () => {
    it('formats ISO dates as DD/MM/YY', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable
            contracts={[createContract({ fechaUIO: '2024-03-15', fechaFinContrato: '2025-10-15' })]}
            onSelectContract={onSelect}
          />
        </RoleWrapper>,
      );

      expect(screen.getByText('15/03/24')).toBeInTheDocument();
      expect(screen.getByText('15/10/25')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('defaults to page size of 10', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      // Should show 10 data rows (not header)
      const tbody = screen.getAllByRole('row');
      // 1 header + 10 data rows = 11
      expect(tbody).toHaveLength(11);
    });

    it('shows correct pagination label', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      expect(screen.getByText('Mostrando del 1 al 10 de 12 registros')).toBeInTheDocument();
    });

    it('shows correct page label', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    });

    it('navigates to next page when next button is clicked', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      fireEvent.click(screen.getByLabelText('Página siguiente'));
      expect(screen.getByText('Mostrando del 11 al 12 de 12 registros')).toBeInTheDocument();
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });

    it('navigates to last page when last button is clicked', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      fireEvent.click(screen.getByLabelText('Última página'));
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
    });

    it('navigates to first page when first button is clicked', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      // Go to last page first
      fireEvent.click(screen.getByLabelText('Última página'));
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();

      // Go back to first page
      fireEvent.click(screen.getByLabelText('Primera página'));
      expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    });

    it('disables first and previous buttons on first page', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      expect(screen.getByLabelText('Primera página')).toBeDisabled();
      expect(screen.getByLabelText('Página anterior')).toBeDisabled();
    });

    it('disables next and last buttons on last page', () => {
      const onSelect = vi.fn();
      const contracts = createContracts(12);
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={contracts} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      fireEvent.click(screen.getByLabelText('Última página'));
      expect(screen.getByLabelText('Página siguiente')).toBeDisabled();
      expect(screen.getByLabelText('Última página')).toBeDisabled();
    });
  });

  describe('Empty state', () => {
    it('shows empty message when no contracts', () => {
      const onSelect = vi.fn();
      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={[]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      expect(screen.getByText('No se encontraron contratos.')).toBeInTheDocument();
    });
  });

  describe('Contract data rendering', () => {
    it('renders contract data in the correct cells', () => {
      const onSelect = vi.fn();
      const contract = createContract({
        nombreCliente: 'Test Client',
        modelo: 'RAV4',
        serie: '99999Z',
        dealerEntrega: 'Test Dealer',
        estadoContrato: 'Activo',
      });

      render(
        <RoleWrapper role="Admin_Kinto">
          <ContractsTable contracts={[contract]} onSelectContract={onSelect} />
        </RoleWrapper>,
      );

      expect(screen.getByText('Test Client')).toBeInTheDocument();
      expect(screen.getByText('RAV4')).toBeInTheDocument();
      expect(screen.getByText('99999Z')).toBeInTheDocument();
      expect(screen.getByText('Test Dealer')).toBeInTheDocument();
      expect(screen.getByText('Activo')).toBeInTheDocument();
    });
  });
});
