import type { ServiceFilterValues, ServiceRecord } from '../types';

export function filterServices(
  services: ServiceRecord[],
  filters: Partial<ServiceFilterValues>
): ServiceRecord[] {
  return services.filter((s) => {
    if (filters.vin && !s.vin.toLowerCase().includes(filters.vin.toLowerCase())) return false;
    if (filters.contrato && !s.contrato.toLowerCase().includes(filters.contrato.toLowerCase())) return false;
    if (filters.serie && !s.serie.toLowerCase().includes(filters.serie.toLowerCase())) return false;
    if (filters.placa && !s.placa.toLowerCase().includes(filters.placa.toLowerCase())) return false;
    if (filters.cliente && !s.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    if (filters.ruc && !s.ruc.toLowerCase().includes(filters.ruc.toLowerCase())) return false;
    if (filters.estadoOT && s.estadoOT !== filters.estadoOT) return false;
    if (filters.marca && s.marca !== filters.marca) return false;
    if (filters.modelo && s.modelo !== filters.modelo) return false;
    if (filters.version && s.version !== filters.version) return false;
    if (filters.dealer && s.dealer !== filters.dealer) return false;
    if (filters.local && s.local !== filters.local) return false;
    if (filters.asesor && !s.asesor.toLowerCase().includes(filters.asesor.toLowerCase())) return false;
    if (filters.asesorEntrega && !s.asesorEntrega.toLowerCase().includes(filters.asesorEntrega.toLowerCase())) return false;
    if (filters.tipoServicio && s.tipoServicio !== filters.tipoServicio) return false;
    if (filters.fechaServicioDesde && s.fechaServicio < filters.fechaServicioDesde) return false;
    if (filters.fechaServicioHasta && s.fechaServicio > filters.fechaServicioHasta) return false;
    return true;
  });
}
