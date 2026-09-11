import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
} from '@mui/material';
import { getWorkOrdersByContractId } from '../data/mockContracts';

interface ServiciosTabProps {
  contractId: string;
}

const COLUMNS = [
  'Serie',
  'Placa',
  'Kilometraje',
  'Tipo de servicio',
  'Estado OT',
  'Comentario',
  'ID OT',
];

export function ServiciosTab({ contractId }: ServiciosTabProps) {
  const workOrders = getWorkOrdersByContractId(contractId);

  return (
    <Box sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#a5cdd5' }}>
            {COLUMNS.map((col) => (
              <TableCell
                key={col}
                sx={{
                  color: '#1c2628',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8125rem',
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {workOrders.map((wo) => (
            <TableRow key={wo.idOT} hover>
              <TableCell>{wo.serie}</TableCell>
              <TableCell>{wo.placa}</TableCell>
              <TableCell>{wo.kilometraje.toLocaleString()}</TableCell>
              <TableCell>{wo.tipoServicio}</TableCell>
              <TableCell>{wo.estadoOT}</TableCell>
              <TableCell>{wo.comentario}</TableCell>
              <TableCell>{wo.idOT}</TableCell>
            </TableRow>
          ))}
          {workOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} align="center">
                <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
                  No se encontraron órdenes de trabajo.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
