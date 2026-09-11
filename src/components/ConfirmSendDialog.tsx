import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface ConfirmSendDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmación de envío irreversible — específico de Facturación en Asignaciones.
 * No existe en Devolución: una vez enviado, el registro queda bloqueado para edición.
 */
export function ConfirmSendDialog({ open, onCancel, onConfirm }: ConfirmSendDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-send-dialog-title"
    >
      <DialogTitle id="confirm-send-dialog-title" sx={{ pb: 0 }}>
        <Typography variant="h6" component="span" fontWeight="bold">
          ¿Deseas confirmar el envío?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Una vez confirmado el envío, no podrás editar la información
          ingresada. ¿Estás seguro de confirmar?
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
          onClick={onConfirm}
          variant="contained"
          color="secondary"
          sx={{ minWidth: 120 }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
