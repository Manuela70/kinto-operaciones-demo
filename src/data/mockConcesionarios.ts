import type { ReportConcesionario } from '../types';

export const mockConcesionarios: ReportConcesionario[] = [
  {
    code: '2215',
    name: 'AUTOMOTORES MOPAL',
    locales: [
      { code: '101', name: 'MOPAL SURCO' },
      { code: '102', name: 'MOPAL SAN ISIDRO' },
      { code: '103', name: 'MOPAL LA MOLINA' },
    ],
  },
  {
    code: '2046',
    name: 'AUTOESPAR',
    locales: [
      { code: '301', name: 'AUTOESPAR C.C. PLAZA SAN MIGUEL' },
      { code: '302', name: 'AUTOESPAR MIRAFLORES' },
    ],
  },
  {
    code: '2103',
    name: 'TOYOTA DEL PERU',
    locales: [
      { code: '401', name: 'TOYOTA DEL PERU CANADA' },
      { code: '402', name: 'TOYOTA DEL PERU JAVIER PRADO' },
      { code: '403', name: 'TOYOTA DEL PERU AREQUIPA' },
    ],
  },
  {
    code: '2078',
    name: 'AUTOMOTRIZ SAN ISIDRO',
    locales: [
      { code: '501', name: 'A.S.I. SAN ISIDRO' },
      { code: '502', name: 'A.S.I. TRUJILLO' },
    ],
  },
  {
    code: '2190',
    name: 'DIVEMOTOR',
    locales: [
      { code: '601', name: 'DIVEMOTOR CHORRILLOS' },
      { code: '602', name: 'DIVEMOTOR CHICLAYO' },
      { code: '603', name: 'DIVEMOTOR PIURA' },
    ],
  },
];

export function getAllLocalesLabels(): string[] {
  return mockConcesionarios.flatMap((c) => c.locales.map((l) => `${l.code} - ${l.name}`));
}

export function getConcesionarioLabels(): string[] {
  return mockConcesionarios.map((c) => `${c.code} - ${c.name}`);
}

export function getLocalesForConcesionario(concesionarioLabel: string): string[] {
  const code = concesionarioLabel.split(' - ')[0];
  const conc = mockConcesionarios.find((c) => c.code === code);
  return conc ? conc.locales.map((l) => `${l.code} - ${l.name}`) : [];
}
