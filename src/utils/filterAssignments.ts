import type { Assignment, AssignmentFilterValues } from '../types';

export function filterAssignments(
  assignments: Assignment[],
  filters: Partial<AssignmentFilterValues>,
): Assignment[] {
  return assignments.filter((a) => {
    if (filters.serie && !a.serie.toLowerCase().includes(filters.serie.toLowerCase())) return false;
    if (filters.placa && !a.placa.toLowerCase().includes(filters.placa.toLowerCase())) return false;
    if (filters.marca && a.marca !== filters.marca) return false;
    if (filters.modelo && a.modelo !== filters.modelo) return false;
    if (filters.cliente && !a.nombreCliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.ruc && !a.ruc.includes(filters.ruc)) return false;
    if (filters.dealerEntrega && a.dealerEntrega !== filters.dealerEntrega) return false;
    if (filters.localEntrega && a.localEntrega !== filters.localEntrega) return false;
    if (filters.estadoProceso && a.estadoProceso !== filters.estadoProceso) return false;
    if (filters.estadoVehiculo && a.estadoVehiculo !== filters.estadoVehiculo) return false;
    if (filters.estadoDocumentacion && a.documentacion !== filters.estadoDocumentacion) return false;
    if (filters.asesor && !a.asesor.toLowerCase().includes(filters.asesor.toLowerCase())) return false;
    if (filters.asesorEntrega && !a.asesorEntrega.toLowerCase().includes(filters.asesorEntrega.toLowerCase())) return false;
    return true;
  });
}
