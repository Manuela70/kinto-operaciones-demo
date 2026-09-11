import type { Contract, FilterValues } from '../types';

export function filterContracts(
  contracts: Contract[],
  filters: Partial<FilterValues>
): Contract[] {
  return contracts.filter((contract) => {
    if (filters.serie && !contract.serie.toLowerCase().includes(filters.serie.toLowerCase())) return false;
    if (filters.placa && !contract.placa.toLowerCase().includes(filters.placa.toLowerCase())) return false;
    if (filters.modelo && contract.modelo !== filters.modelo) return false;
    if (filters.cliente && !contract.nombreCliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.ruc && !contract.ruc.includes(filters.ruc)) return false;
    if (filters.dealerEntrega && contract.dealerEntrega !== filters.dealerEntrega) return false;
    if (filters.localEntrega && contract.localEntrega !== filters.localEntrega) return false;
    if (filters.estadoContrato && contract.estadoContrato !== filters.estadoContrato) return false;
    return true;
  });
}
