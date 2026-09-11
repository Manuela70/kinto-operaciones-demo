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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ServiceRecord } from '../types';
import { useRole } from '../context/RoleContext';
import { paginateRecords, getPaginationLabel, getPageLabel } from '../utils/pagination';

interface ServicesTableProps {
  services: ServiceRecord[];
  onOpenReview: (s: ServiceRecord) => void; // Admin Kinto: ver / aprobar / rechazar
  onOpenForm: (s: ServiceRecord) => void; // Local/Asesor: crear o editar (estados no aprobados)
  onOpenReadOnly: (s: ServiceRecord) => void; // Local/Asesor: ver (estado Aprobado)
}

const PAGE_SIZE = 10;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function ServicesTable({ services, onOpenReview, onOpenForm, onOpenReadOnly }: ServicesTableProps) {
  const { role } = useRole();
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = services.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const pageData = paginateRecords(services, safePage, PAGE_SIZE);
  const isAdminKinto = role === 'Admin_Kinto';
  const totalColumns = isAdminKinto ? 10 : 10;

  return (
    <Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'auto', minWidth: 1400 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#a5cdd5' }}>
              {isAdminKinto ? (
                <>
                  <TableCell sx={headerSx}>VIN</TableCell>
                  <TableCell sx={headerSx}>Placa</TableCell>
                  <TableCell sx={headerSx}>Cliente</TableCell>
                  <TableCell sx={headerSx}>RUC</TableCell>
                  <TableCell sx={headerSx}>Estado OT</TableCell>
                  <TableCell sx={headerSx}>Modelo</TableCell>
                  <TableCell sx={headerSx}>Dealer</TableCell>
                  <TableCell sx={headerSx}>Local</TableCell>
                  <TableCell sx={headerSx}>Tipo de servicio</TableCell>
                  <TableCell sx={headerSx}>Fecha de servicio</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={headerSx}>Placa</TableCell>
                  <TableCell sx={headerSx}>Serie</TableCell>
                  <TableCell sx={headerSx}>Kilometraje</TableCell>
                  <TableCell sx={headerSx}>Tipo de servicio</TableCell>
                  <TableCell sx={headerSx}>Estado OT</TableCell>
                  <TableCell sx={headerSx}>Comentario</TableCell>
                  <TableCell sx={headerSx}>ID OT</TableCell>
                  <TableCell sx={headerSx}>Asesor</TableCell>
                  <TableCell sx={headerSx}>Dealer</TableCell>
                  <TableCell sx={headerSx}>Local</TableCell>
                </>
              )}
              <TableCell sx={{ ...headerSx, textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((s) => (
              <TableRow key={s.idOT} hover>
                {isAdminKinto ? (
                  <>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.vin}</TableCell>
                    <TableCell>{s.placa}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.cliente}</TableCell>
                    <TableCell>{s.ruc}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {s.estadoOT}
                      </Typography>
                    </TableCell>
                    <TableCell>{s.modelo}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.dealer}</TableCell>
                    <TableCell>{s.local}</TableCell>
                    <TableCell>{s.tipoServicio}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(s.fechaServicio)}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{s.placa}</TableCell>
                    <TableCell>{s.serie}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.kilometraje} km</TableCell>
                    <TableCell>{s.tipoServicio}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {s.estadoOT}
                      </Typography>
                    </TableCell>
                    <TableCell>{s.comentario || ''}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.idOtDisplay}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.asesor}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.dealer}</TableCell>
                    <TableCell>{s.local}</TableCell>
                  </>
                )}
                <TableCell align="center">
                  {isAdminKinto ? (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onOpenReview(s)}
                      aria-label={`Gestionar servicio ${s.idOT}`}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : s.estadoOT === 'Aprobado' ? (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onOpenReadOnly(s)}
                      aria-label={`Ver servicio ${s.idOT}`}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onOpenForm(s)}
                      aria-label={`Editar servicio ${s.idOT}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
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
