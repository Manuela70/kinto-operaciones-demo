import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface ConfirmApproveServiceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmApproveServiceDialog({ open, onCancel, onConfirm }: ConfirmApproveServiceDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth aria-labelledby="confirm-approve-service-title">
      <DialogTitle id="confirm-approve-service-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          ¿Deseas aprobar el servicio?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Una vez aprobado el servicio, no podrán editar la información
          ingresada. ¿Estás seguro de aprobar?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" sx={{ minWidth: 120 }}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="secondary" sx={{ minWidth: 120 }}>
          Sí, aprobar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
