import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface PartialSaveDialogProps {
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function PartialSaveDialog({ open, onCancel, onSave }: PartialSaveDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      aria-labelledby="partial-save-dialog-title"
    >
      <DialogTitle id="partial-save-dialog-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          ¿Deseas guardar los datos?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Se guardará la información ingresada hasta el momento. Podrás
          continuar completando los datos más adelante.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="secondary"
          sx={{ minWidth: 120 }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
