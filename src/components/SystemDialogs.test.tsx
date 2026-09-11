import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuccessDialog } from './SuccessDialog';
import { ErrorDialog } from './ErrorDialog';
import { PartialSaveDialog } from './PartialSaveDialog';

describe('SuccessDialog', () => {
  it('renders the success message when open', () => {
    render(<SuccessDialog open={true} onAccept={vi.fn()} />);
    expect(screen.getByText('Datos guardados')).toBeInTheDocument();
    expect(
      screen.getByText('La información se guardó correctamente y el estado fue actualizado.')
    ).toBeInTheDocument();
  });

  it('renders the "Aceptar" button', () => {
    render(<SuccessDialog open={true} onAccept={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
  });

  it('calls onAccept when "Aceptar" is clicked', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(<SuccessDialog open={true} onAccept={onAccept} />);

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('does not render content when open is false', () => {
    render(<SuccessDialog open={false} onAccept={vi.fn()} />);
    expect(screen.queryByText('Datos guardados')).not.toBeInTheDocument();
  });
});

describe('ErrorDialog', () => {
  it('renders the error message when open', () => {
    render(<ErrorDialog open={true} onConfirm={vi.fn()} />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(
      screen.getByText('No se pudo completar la operación')
    ).toBeInTheDocument();
  });

  it('renders the "Confirmar" button', () => {
    render(<ErrorDialog open={true} onConfirm={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('calls onConfirm when "Confirmar" is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ErrorDialog open={true} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not render content when open is false', () => {
    render(<ErrorDialog open={false} onConfirm={vi.fn()} />);
    expect(screen.queryByText('No se pudo completar la operación')).not.toBeInTheDocument();
  });
});

describe('PartialSaveDialog', () => {
  it('renders the confirmation message when open', () => {
    render(<PartialSaveDialog open={true} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
    expect(
      screen.getByText('¿Deseas guardar los datos?')
    ).toBeInTheDocument();
  });

  it('renders both "Cancelar" and "Guardar" buttons', () => {
    render(<PartialSaveDialog open={true} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('calls onCancel when "Cancelar" is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<PartialSaveDialog open={true} onCancel={onCancel} onSave={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when "Guardar" is clicked', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<PartialSaveDialog open={true} onCancel={vi.fn()} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('does not render content when open is false', () => {
    render(<PartialSaveDialog open={false} onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByText('¿Deseas guardar los datos?')).not.toBeInTheDocument();
  });
});
