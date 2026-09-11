import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface ConfirmRejectServiceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmRejectServiceDialog({ open, onCancel, onConfirm }: ConfirmRejectServiceDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth aria-labelledby="confirm-reject-service-title">
      <DialogTitle id="confirm-reject-service-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          ¿Deseas rechazar el servicio?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          El servicio será rechazado y podrán editarlo nuevamente. ¿Estás
          seguro de rechazar?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" sx={{ minWidth: 120 }}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="secondary" sx={{ minWidth: 120 }}>
          Sí, rechazar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
