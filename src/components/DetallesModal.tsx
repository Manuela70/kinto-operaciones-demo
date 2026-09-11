import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { Assignment } from '../types';

interface DetallesModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>
        {label}
      </Typography>
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          borderRadius: 1,
          px: 1.5,
          py: 1,
          fontSize: '0.875rem',
        }}
      >
        {value || '—'}
      </Box>
    </Box>
  );
}

export function DetallesModal({ open, assignment, onClose }: DetallesModalProps) {
  if (!assignment) return null;
  const { cotizacion } = assignment;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6" fontWeight="bold">
          Detalle de la cotización
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Cerrar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
          <ReceiptLongIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1 }}>
            <ReadOnlyField label="RUC" value={cotizacion.ruc} />
            <ReadOnlyField label="Razón Social" value={cotizacion.razonSocial} />
            <ReadOnlyField label="Rubro" value={cotizacion.rubro} />
            <ReadOnlyField label="Nombres" value={cotizacion.nombres} />
            <ReadOnlyField label="Teléfono" value={cotizacion.telefono} />
            <ReadOnlyField label="Email" value={cotizacion.email} />
          </Box>
        </Paper>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
          Información Comercial
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <ReadOnlyField label="Dealer entrega" value={cotizacion.dealerEntrega} />
          <ReadOnlyField label="Zona de Operación" value={cotizacion.zonaOperacion} />
          <ReadOnlyField label="Kilometraje" value={cotizacion.kilometraje} />
          <Box sx={{ flex: '1 1 100%' }}>
            <ReadOnlyField label="Comentarios adicional" value={cotizacion.comentariosAdicional} />
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
          Información del Vehículo
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 100%' }}>
            <ReadOnlyField label="Vehículo (marca, modelo versión)" value={cotizacion.vehiculo} />
          </Box>
          <ReadOnlyField label="Marca" value={cotizacion.marca} />
          <ReadOnlyField label="Modelo" value={cotizacion.modelo} />
          <ReadOnlyField label="Versión" value={cotizacion.version} />
          <ReadOnlyField label="Cantidad de unidades" value={cotizacion.cantidadUnidades} />
          <ReadOnlyField label="Plazo" value={cotizacion.plazo} />
          <ReadOnlyField label="Color" value={cotizacion.color} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
