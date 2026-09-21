import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import type { Assignment } from '../types';

interface AccesoriosModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
}

const TARIFA_REGULAR = 1718;

export function AccesoriosModal({ open, assignment, onClose, onSaved }: AccesoriosModalProps) {
  const [nombre, setNombre] = useState('Accesorio 1');
  const [valor, setValor] = useState('150.00');
  const [polarizados, setPolarizados] = useState(false);

  useEffect(() => {
    if (open) {
      setNombre('Accesorio 1');
      setValor('150.00');
      setPolarizados(false);
    }
  }, [open, assignment]);

  const accesoriosTotal = useMemo(() => {
    const num = parseFloat(valor) || 0;
    // Coincide con el cálculo mostrado en el mockup (3.03% del valor ingresado)
    return num * 0.0303;
  }, [valor]);

  const total = TARIFA_REGULAR + accesoriosTotal;

  const handleGuardar = () => {
    onSaved();
    onClose();
  };

  if (!assignment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6" fontWeight="bold">
          Accesorios
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Cerrar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre del accesorio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Valor accesorio USD
        </Typography>
        <TextField
          fullWidth
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          InputProps={{ startAdornment: '$' }}
          sx={{ mb: 1 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={polarizados}
              onChange={(e) => setPolarizados(e.target.checked)}
            />
          }
          label="Las unidades necesitan polarizados."
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Tarifa USD*
        </Typography>
        <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tarifa regular</Typography>
            <Typography variant="body2" fontWeight={600}>
              ${TARIFA_REGULAR.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Accesorios</Typography>
            <Typography variant="body2" fontWeight={600}>
              ${accesoriosTotal.toFixed(2)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 1,
              mb: 1,
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Total (No incluye IGV)
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              ${total.toFixed(2)}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Valor calculado automáticamente. No incluye IGV.
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ mt: 2 }}
        >
          Descargar cotización
        </Button>
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
