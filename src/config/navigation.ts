import type { Role } from '../types';

export interface NavItem {
  label: string;
  path: string;
}

const NAV_CONFIG: Record<Role, NavItem[]> = {
  Admin_Kinto: [
    { label: 'Cotizaciones', path: '/placeholder' },
    { label: 'Contratos', path: '/placeholder' },
    { label: 'Asignaciones', path: '/assignments' },
    { label: 'Servicios', path: '/services' },
    { label: 'Devolución', path: '/contracts' },
    { label: 'Reporte', path: '/report' },
    { label: 'Mantenimiento', path: '/placeholder' },
  ],
  Admin_Local: [
    { label: 'Solicitudes', path: '/placeholder' },
    { label: 'Cotizaciones', path: '/placeholder' },
    { label: 'Contratos', path: '/placeholder' },
    { label: 'Asignaciones', path: '/assignments' },
    { label: 'Servicios', path: '/services' },
    { label: 'Devolución', path: '/contracts' },
  ],
  Asesor: [
    { label: 'Cotizaciones', path: '/placeholder' },
    { label: 'Contratos', path: '/placeholder' },
    { label: 'Asignaciones', path: '/assignments' },
    { label: 'Servicios', path: '/services' },
    { label: 'Devolución', path: '/contracts' },
  ],
};

export function getNavItems(role: Role): NavItem[] {
  return NAV_CONFIG[role];
}
