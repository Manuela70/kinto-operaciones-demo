import type { EstadoOT, ServiceRecord, TipoServicio } from '../types';

const NOMBRES = [
  'María Torres Vargas',
  'Carlos Ramírez Soto',
  'Ana Gutiérrez Paredes',
  'Luis Fernández Rojas',
  'Patricia Chávez León',
  'Jorge Salazar Mendoza',
  'Rosa Delgado Vega',
  'Miguel Ortega Campos',
  'Silvia Núñez Bravo',
  'Diego Castillo Prado',
];

const ESTADOS: EstadoOT[] = ['Por validar', 'Aprobado', 'Pendiente', 'Rechazado'];
const TIPOS: TipoServicio[] = ['Preventivo', 'Correctivo', 'Carrocería y Pintura', 'Cambio de neumáticos'];

const ASESORES_ENTREGA = [
  'Mariana Salcedo Ibáñez',
  'Renzo Vidal Quispe',
  'Camila Herrera Zúñiga',
  'Fabián Rojas Medina',
];

function buildService(index: number): ServiceRecord {
  const estado = ESTADOS[index % ESTADOS.length];
  const tipo = TIPOS[index % TIPOS.length];
  const nombre = NOMBRES[index % NOMBRES.length];

  return {
    idOT: `C20250${9876 + index}`,
    idOtDisplay: `C20250${9876 + index}`,
    contrato: `CTR-${1000 + index}`,
    vin: `1HGCM82633A${100000 + index}`,
    serie: '12345X',
    placa: 'ABC-123',
    kilometraje: '12000',
    cliente: nombre,
    ruc: '98465720130',
    marca: 'Toyota',
    modelo: 'Corolla',
    version: 'SEG CVT',
    dealer: 'Juan Carlos Díaz Contreras',
    local: 'C.C. Jockey Plaza',
    asesor: 'Juan Carlos Díaz Contreras',
    asesorEntrega: ASESORES_ENTREGA[index % ASESORES_ENTREGA.length],

    tipoServicio: tipo,
    estadoOT: estado,
    comentario: '',
    fechaServicio: '2026-09-15',
    frecuencia: '5000 km',
    tipoMoneda: tipo === 'Preventivo' ? 'Soles' : 'USD',
    monto: '200.00',
    cobrarCliente: true,

    cotizacionFiles: [],
    imagenesFiles: [],
    vistoBuenoFiles: [],
    ordenesCompra: [],
  };
}

export const mockServices: ServiceRecord[] = Array.from({ length: 97 }, (_, i) => buildService(i));
