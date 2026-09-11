import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface ErrorDialogProps {
  open: boolean;
  onConfirm: () => void;
  message?: string;
}

export function ErrorDialog({
  open,
  onConfirm,
  message = 'Ocurrió un problema al guardar la solicitud. Inténtalo nuevamente o verifica la información ingresada.',
}: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      aria-labelledby="error-dialog-title"
    >
      <DialogTitle id="error-dialog-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          No se pudo completar la operación
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#c00000',
            '&:hover': { backgroundColor: '#8f0000' },
            minWidth: 120,
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
