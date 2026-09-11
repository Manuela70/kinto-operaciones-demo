import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import type { Role } from '../types';
import { FiltersPanel } from './FiltersPanel';

// Mock useRole to control the role value in tests
const mockUseRole = vi.fn();

vi.mock('../context/RoleContext', () => ({
  useRole: () => mockUseRole(),
  RoleProvider: ({ children }: { children: ReactNode }) => children,
}));

function setRole(role: Role | null) {
  mockUseRole.mockReturnValue({
    role,
    setRole: vi.fn(),
    clearRole: vi.fn(),
  });
}

describe('FiltersPanel', () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClear.mockClear();
    mockUseRole.mockClear();
  });

  it('renders nothing when role is null', () => {
    setRole(null);
    const { container } = render(
      <FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders 8 filter fields for Admin_Kinto', () => {
    setRole('Admin_Kinto');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByLabelText('Serie')).toBeInTheDocument();
    expect(screen.getByLabelText('Placa')).toBeInTheDocument();
    expect(screen.getByLabelText('Modelo')).toBeInTheDocument();
    expect(screen.getByLabelText('Cliente')).toBeInTheDocument();
    expect(screen.getByLabelText('RUC')).toBeInTheDocument();
    expect(screen.getByLabelText('Dealer entrega')).toBeInTheDocument();
    expect(screen.getByLabelText('Local entrega')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado contrato')).toBeInTheDocument();
  });

  it('renders 7 filter fields for Admin_Local (no Dealer entrega)', () => {
    setRole('Admin_Local');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByLabelText('Serie')).toBeInTheDocument();
    expect(screen.getByLabelText('Local entrega')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado contrato')).toBeInTheDocument();
    expect(screen.queryByLabelText('Dealer entrega')).not.toBeInTheDocument();
  });

  it('renders 6 filter fields for Asesor (no Dealer/Local entrega)', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByLabelText('Serie')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado contrato')).toBeInTheDocument();
    expect(screen.queryByLabelText('Dealer entrega')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Local entrega')).not.toBeInTheDocument();
  });

  it('renders Buscar and Limpiar filtros buttons', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument();
  });

  it('calls onSearch with non-empty filter values when Buscar is clicked', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);

    const serieInput = screen.getByLabelText('Serie');
    fireEvent.change(serieInput, { target: { value: '12345X' } });

    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ serie: '12345X' }),
    );
  });

  it('excludes empty fields from the search filters', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);

    const placaInput = screen.getByLabelText('Placa');
    fireEvent.change(placaInput, { target: { value: 'ABC' } });

    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    const calledWith = mockOnSearch.mock.calls[0][0];
    expect(calledWith.placa).toBe('ABC');
    expect(calledWith.serie).toBeUndefined();
  });

  it('clears all fields and calls onClear when Limpiar filtros is clicked', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);

    const serieInput = screen.getByLabelText('Serie') as HTMLInputElement;
    fireEvent.change(serieInput, { target: { value: '12345X' } });
    expect(serieInput.value).toBe('12345X');

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    expect(serieInput.value).toBe('');
  });

  it('renders text inputs for text-type fields', () => {
    setRole('Asesor');
    render(<FiltersPanel onSearch={mockOnSearch} onClear={mockOnClear} />);
    const serieInput = screen.getByLabelText('Serie');
    expect(serieInput.tagName).toBe('INPUT');
  });
});
