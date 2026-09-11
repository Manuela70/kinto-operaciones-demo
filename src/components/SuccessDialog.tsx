import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface SuccessDialogProps {
  open: boolean;
  onAccept: () => void;
  title?: string;
  message?: string;
}

export function SuccessDialog({
  open,
  onAccept,
  title = 'Datos guardados',
  message = 'La información se guardó correctamente y el estado fue actualizado.',
}: SuccessDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      aria-labelledby="success-dialog-title"
    >
      <DialogTitle id="success-dialog-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button
          onClick={onAccept}
          variant="contained"
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#388e3c' },
            minWidth: 120,
          }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
