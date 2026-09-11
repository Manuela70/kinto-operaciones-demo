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
import type { Contract } from '../types';
import { useRole } from '../context/RoleContext';
import { paginateRecords, getPaginationLabel, getPageLabel } from '../utils/pagination';

interface ContractsTableProps {
  contracts: Contract[];
  onSelectContract: (contract: Contract) => void;
}

const PAGE_SIZE = 10;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

interface ColumnDef {
  label: string;
  width: string;   // percentage — tuned so the table fits at 1280px without horizontal scroll
}

const COLUMNS: ColumnDef[] = [
  { label: 'Fecha UIO',             width: '10%' },
  { label: 'Fecha fin de contrato', width: '12%' },
  { label: 'Nombre del cliente',    width: '22%' },
  { label: 'Modelo',                width: '9%'  },
  { label: 'Serie',                 width: '10%' },
  { label: 'Dealer entrega',        width: '18%' },
  { label: 'Estado contrato',       width: '12%' },
  { label: 'Devolución',            width: '7%'  },
];

export function ContractsTable({ contracts, onSelectContract }: ContractsTableProps) {
  const { role } = useRole();
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecords = contracts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

  // Clamp page if contracts list changes (e.g. after filtering)
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const pageData = paginateRecords(contracts, safePage, PAGE_SIZE);

  const isAdminKinto = role === 'Admin_Kinto';

  return (
    <Box>
      <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#a5cdd5' }}>
            {COLUMNS.map((col) => (
              <TableCell
                key={col.label}
                sx={{
                  color: '#1c2628',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8125rem',
                  width: col.width,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pageData.map((contract) => (
            <TableRow key={contract.id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(contract.fechaUIO)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(contract.fechaFinContrato)}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {contract.nombreCliente}
              </TableCell>
              <TableCell>{contract.modelo}</TableCell>
              <TableCell>{contract.serie}</TableCell>
              <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {contract.dealerEntrega}
              </TableCell>
              <TableCell>{contract.estadoContrato}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onSelectContract(contract)}
                  aria-label={
                    isAdminKinto
                      ? `Ver contrato ${contract.id}`
                      : `Editar contrato ${contract.id}`
                  }
                >
                  {isAdminKinto ? <VisibilityIcon /> : <EditIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {pageData.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
                  No se encontraron contratos.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
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
          <IconButton
            size="small"
            onClick={() => setCurrentPage(1)}
            disabled={safePage <= 1}
            aria-label="Primera página"
          >
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
