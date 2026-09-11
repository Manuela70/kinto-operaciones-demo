import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders RoleSelector on the root route when no role is set', () => {
    render(<App />);
    expect(screen.getByText('KINTO')).toBeInTheDocument();
  });
});
