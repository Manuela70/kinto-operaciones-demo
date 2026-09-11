import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RoleProvider, useRole } from './RoleContext';

// Helper component that exposes context values for testing
function TestConsumer() {
  const { role, setRole, clearRole } = useRole();
  return (
    <div>
      <span data-testid="role">{role ?? 'null'}</span>
      <button onClick={() => setRole('Admin_Kinto')}>Set Admin_Kinto</button>
      <button onClick={() => setRole('Admin_Local')}>Set Admin_Local</button>
      <button onClick={() => setRole('Asesor')}>Set Asesor</button>
      <button onClick={() => clearRole()}>Clear Role</button>
    </div>
  );
}

describe('RoleContext', () => {
  it('provides null as the initial role', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );
    expect(screen.getByTestId('role')).toHaveTextContent('null');
  });

  it('updates role when setRole is called with Admin_Kinto', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );

    fireEvent.click(screen.getByText('Set Admin_Kinto'));
    expect(screen.getByTestId('role')).toHaveTextContent('Admin_Kinto');
  });

  it('updates role when setRole is called with Admin_Local', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );

    fireEvent.click(screen.getByText('Set Admin_Local'));
    expect(screen.getByTestId('role')).toHaveTextContent('Admin_Local');
  });

  it('updates role when setRole is called with Asesor', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );

    fireEvent.click(screen.getByText('Set Asesor'));
    expect(screen.getByTestId('role')).toHaveTextContent('Asesor');
  });

  it('resets role to null when clearRole is called', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>,
    );

    fireEvent.click(screen.getByText('Set Admin_Kinto'));
    expect(screen.getByTestId('role')).toHaveTextContent('Admin_Kinto');

    fireEvent.click(screen.getByText('Clear Role'));
    expect(screen.getByTestId('role')).toHaveTextContent('null');
  });

  it('throws an error when useRole is called outside RoleProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useRole must be used within a RoleProvider',
    );

    spy.mockRestore();
  });
});
