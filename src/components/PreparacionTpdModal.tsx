import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import type { Assignment } from '../types';

interface PreparacionTpdModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * PENDIENTE DE CONFIRMACIÓN: no se localizó el modal real de "Preparación TPD"
 * (ícono de carpeta en la tabla) en las páginas de mockup muestreadas. Este
 * componente sigue el mismo patrón que Preparación DLR (estado + fecha) como
 * mejor estimación, y debe revisarse contra el mockup real antes de darlo
 * por definitivo.
 */
const ESTADOS_TPD = ['Pendiente', 'En proceso', 'Completada'];

export function PreparacionTpdModal({ open, assignment, onClose, onSaved }: PreparacionTpdModalProps) {
  const [estado, setEstado] = useState('Pendiente');

  useEffect(() => {
    if (open) {
      setEstado('Pendiente');
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const handleGuardar = () => {
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Preparación TPD
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Cerrar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Contenido pendiente de confirmar contra el mockup real (no se
          localizó en las páginas revisadas).
        </Alert>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderOpenIcon color="action" />
            <Typography variant="subtitle1" fontWeight="bold">
              Serie {assignment.serie || '—'}
            </Typography>
          </Box>
          <Chip label={estado} size="small" color="info" variant="outlined" />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Estado de preparación TPD*
        </Typography>
        <FormControl fullWidth>
          <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
            {ESTADOS_TPD.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleGuardar} variant="contained" color="secondary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
