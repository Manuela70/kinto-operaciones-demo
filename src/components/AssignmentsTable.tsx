import { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonIcon from '@mui/icons-material/Person';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Assignment } from '../types';
import { paginateRecords, getPaginationLabel, getPageLabel } from '../utils/pagination';

interface AssignmentsTableProps {
  assignments: Assignment[];
  onOpenAccesorios: (a: Assignment) => void;
  onOpenDetalles: (a: Assignment) => void;
  onOpenFacturacion: (a: Assignment) => void;
  onOpenPreparacionTdp: (a: Assignment) => void;
  onOpenDocumentacion: (a: Assignment) => void;
  onOpenPreparacionDlr: (a: Assignment) => void;
  onOpenEntregaCliente: (a: Assignment) => void;
}

const PAGE_SIZE = 10;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/*
 * Nota de diseño: los mockups usan íconos custom (auto con "+", persona con
 * flecha) sin equivalente exacto en @mui/icons-material. Se usan los íconos
 * más cercanos disponibles; pendiente de reemplazo por assets SVG del equipo
 * de diseño, igual que el ícono de "Devolución" en la tabla de Devolución.
 */
const ACTION_ICONS = [
  { key: 'accesorios', label: 'Accesorios', Icon: DirectionsCarFilledIcon },
  { key: 'detalles', label: 'Detalles', Icon: ListAltIcon },
  { key: 'facturacion', label: 'Facturación', Icon: AssignmentIcon },
  { key: 'preparacionTdp', label: 'Preparación TDP', Icon: FolderOpenIcon },
  { key: 'documentacion', label: 'Documentación', Icon: DescriptionIcon },
  { key: 'preparacionDlr', label: 'Preparación DLR', Icon: PersonAddAlt1Icon },
  { key: 'entregaCliente', label: 'Entrega al cliente', Icon: PersonIcon },
] as const;

export function AssignmentsTable({
  assignments,
  onOpenAccesorios,
  onOpenDetalles,
  onOpenFacturacion,
  onOpenPreparacionTdp,
  onOpenDocumentacion,
  onOpenPreparacionDlr,
  onOpenEntregaCliente,
}: AssignmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = assignments.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const pageData = paginateRecords(assignments, safePage, PAGE_SIZE);

  // Todos los roles ven las columnas de identificación de contrato/cliente/
  // vehículo (confirmado contra el mockup real de Administrador Kinto).
  const showContractColumns = true;

  const handleAction = (key: (typeof ACTION_ICONS)[number]['key'], assignment: Assignment) => {
    switch (key) {
      case 'accesorios':
        onOpenAccesorios(assignment);
        break;
      case 'detalles':
        onOpenDetalles(assignment);
        break;
      case 'facturacion':
        onOpenFacturacion(assignment);
        break;
      case 'preparacionTdp':
        onOpenPreparacionTdp(assignment);
        break;
      case 'documentacion':
        onOpenDocumentacion(assignment);
        break;
      case 'preparacionDlr':
        onOpenPreparacionDlr(assignment);
        break;
      case 'entregaCliente':
        onOpenEntregaCliente(assignment);
        break;
    }
  };

  const totalColumns = (showContractColumns ? 11 : 6) + ACTION_ICONS.length;

  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'auto', minWidth: showContractColumns ? 1800 : 1400 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#a5cdd5' }}>
              {showContractColumns && (
                <>
                  <TableCell sx={headerSx}>ID Contrato</TableCell>
                  <TableCell sx={headerSx}>Fecha firma contrato</TableCell>
                  <TableCell sx={headerSx}>Local entrega</TableCell>
                  <TableCell sx={headerSx}>Nombre del cliente</TableCell>
                  <TableCell sx={headerSx}>Vehículo</TableCell>
                </>
              )}
              <TableCell sx={headerSx}>Serie</TableCell>
              <TableCell sx={headerSx}>Fecha de estado</TableCell>
              <TableCell sx={headerSx}>Estado proceso</TableCell>
              <TableCell sx={headerSx}>Estado vehículo</TableCell>
              <TableCell sx={headerSx}>Documentación</TableCell>
              <TableCell sx={headerSx}>Asesor</TableCell>
              {ACTION_ICONS.map(({ key, label }) => (
                <TableCell key={key} sx={{ ...headerSx, textAlign: 'center' }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((a) => (
              <TableRow key={a.id} hover>
                {showContractColumns && (
                  <>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(a.fechaFirmaContrato)}</TableCell>
                    <TableCell>{a.localEntrega}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.nombreCliente}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.vehiculo}</TableCell>
                  </>
                )}
                <TableCell>{a.serie || '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(a.fechaEstado)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {a.estadoProceso}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.estadoVehiculo}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {a.documentacion}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{a.asesor}</TableCell>
                {ACTION_ICONS.map(({ key, label, Icon }) => {
                  if (key === 'accesorios' && !a.tieneAccesorios) {
                    return (
                      <TableCell key={key} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No
                        </Typography>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={key} align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleAction(key, a)}
                        aria-label={`${label} — ${a.id || a.serie}`}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {pageData.length === 0 && (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center">
                  <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
                    No se encontraron registros.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          px: 1.5,
        }}
      >
        <Typography variant="body2">
          {getPaginationLabel(safePage, PAGE_SIZE, totalRecords)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setCurrentPage(1)} disabled={safePage <= 1} aria-label="Primera página">
            <FirstPageIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="body2" sx={{ mx: 1 }}>
            {getPageLabel(safePage, totalRecords, PAGE_SIZE)}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRightIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage >= totalPages}
            aria-label="Última página"
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

const headerSx = {
  color: '#1c2628',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  fontSize: '0.8125rem',
} as const;
