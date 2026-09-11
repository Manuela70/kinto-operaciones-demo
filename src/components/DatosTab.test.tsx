import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatosTab } from './DatosTab';
import { RoleProvider, useRole } from '../context/RoleContext';
import type { Contract, Role } from '../types';
import { ReactNode, useEffect } from 'react';

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

function RoleSetup({ role, children }: { role: Role; children: ReactNode }) {
  const { setRole } = useRole();
  useEffect(() => {
    setRole(role);
  }, [role, setRole]);
  return <>{children}</>;
}

function renderWithRole(ui: ReactNode, role: Role = 'Admin_Local') {
  return render(
    <RoleProvider>
      <RoleSetup role={role}>{ui}</RoleSetup>
    </RoleProvider>,
  );
}

describe('DatosTab', () => {
  describe('Fixed fields', () => {
    it('renders Fecha fin contrato field pre-populated from contract', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      const input = screen.getByLabelText(/Fecha fin contrato/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('2025-10-15');
    });

    it('renders Kilometraje field pre-populated from contract', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      const input = screen.getByLabelText(/Kilometraje/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(45000);
    });

    it('renders Dealer dropdown pre-populated from contract', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByText('José Antonio Martínez Vargas')).toBeInTheDocument();
    });

    it('renders Tipo de devolución dropdown', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByLabelText(/Tipo de devolución/i)).toBeInTheDocument();
    });

    it('renders Fecha de devolución field', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByLabelText(/Fecha de devolución/i)).toBeInTheDocument();
    });

    it('renders Devolver para stock checkbox', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByLabelText(/Devolver para stock/i)).toBeInTheDocument();
    });

    it('renders Comentarios textarea', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.getByLabelText(/Comentarios/i)).toBeInTheDocument();
    });
  });

  describe('Dynamic upload fields', () => {
    it('shows no upload fields when no tipo de devolución is selected', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );
      expect(screen.queryByText('Documentos requeridos')).not.toBeInTheDocument();
    });

    it('shows 3 upload fields for "Devolución" type', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );

      // Open the Tipo de devolución dropdown and select Devolución
      const select = screen.getByLabelText(/Tipo de devolución/i);
      fireEvent.mouseDown(select);
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText('Devolución'));

      expect(screen.getByText('Documentos requeridos')).toBeInTheDocument();
      expect(screen.getByText('Acta documentación')).toBeInTheDocument();
      expect(screen.getByText('Imágenes')).toBeInTheDocument();
      expect(screen.getByText('Informe técnico')).toBeInTheDocument();
    });

    it('shows 3 upload fields for "Anticipada" type', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );

      const select = screen.getByLabelText(/Tipo de devolución/i);
      fireEvent.mouseDown(select);
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText('Anticipada'));

      expect(screen.getByText('Acta documentación')).toBeInTheDocument();
      expect(screen.getByText('Informe técnico')).toBeInTheDocument();
      expect(screen.getByText('Imágenes')).toBeInTheDocument();
    });

    it('shows 2 upload fields for "Robo" type (no Acta documentación)', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
      );

      const select = screen.getByLabelText(/Tipo de devolución/i);
      fireEvent.mouseDown(select);
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText('Robo'));

      expect(screen.queryByText('Acta documentación')).not.toBeInTheDocument();
      expect(screen.getByText('Imágenes')).toBeInTheDocument();
      expect(screen.getByText('Informe técnico')).toBeInTheDocument();
    });
  });

  describe('Admin_Kinto — read-only mode', () => {
    it('disables all form fields', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Kinto',
      );

      expect(screen.getByLabelText(/Fecha fin contrato/i)).toBeDisabled();
      expect(screen.getByLabelText(/Kilometraje/i)).toBeDisabled();
      expect(screen.getByLabelText(/Fecha de devolución/i)).toBeDisabled();
      expect(screen.getByLabelText(/Devolver para stock/i)).toBeDisabled();
      expect(screen.getByLabelText(/Comentarios/i)).toBeDisabled();
    });

    it('hides Guardar and Cancelar buttons', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Kinto',
      );

      expect(screen.queryByRole('button', { name: 'Guardar' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();
    });

    it('pre-populates with mock data including tipoDevolucion', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Kinto',
      );

      // Should show upload fields because tipoDevolucion is pre-populated
      expect(screen.getByText('Documentos requeridos')).toBeInTheDocument();
    });

    it('shows download icons for attached files', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Kinto',
      );

      expect(screen.getByLabelText(/Descargar Acta documentación/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Descargar Imágenes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Descargar Informe técnico/i)).toBeInTheDocument();
    });
  });

  describe('Admin_Local / Asesor — editable mode', () => {
    it('enables all form fields for Admin_Local', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Local',
      );

      expect(screen.getByLabelText(/Fecha fin contrato/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/Kilometraje/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/Fecha de devolución/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/Devolver para stock/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/Comentarios/i)).not.toBeDisabled();
    });

    it('enables all form fields for Asesor', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Asesor',
      );

      expect(screen.getByLabelText(/Fecha fin contrato/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/Kilometraje/i)).not.toBeDisabled();
    });

    it('shows Guardar and Cancelar buttons', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Local',
      );

      expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });

    it('calls onCancel when Cancelar is clicked', () => {
      const onCancel = vi.fn();
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={onCancel} />,
        'Admin_Local',
      );

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onSave with form data when Guardar is clicked', () => {
      const onSave = vi.fn();
      renderWithRole(
        <DatosTab contract={createContract()} onSave={onSave} onCancel={vi.fn()} />,
        'Admin_Local',
      );

      fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          fechaFinContrato: '2025-10-15',
          kilometraje: 45000,
          dealer: 'José Antonio Martínez Vargas',
        }),
      );
    });

    it('shows "Subir" buttons for upload fields when no files selected', () => {
      renderWithRole(
        <DatosTab contract={createContract()} onSave={vi.fn()} onCancel={vi.fn()} />,
        'Admin_Local',
      );

      // Select a return type to show upload fields
      const select = screen.getByLabelText(/Tipo de devolución/i);
      fireEvent.mouseDown(select);
      const listbox = within(screen.getByRole('listbox'));
      fireEvent.click(listbox.getByText('Devolución'));

      const uploadButtons = screen.getAllByRole('button', { name: /Subir/i });
      expect(uploadButtons.length).toBe(3);
    });
  });
});
