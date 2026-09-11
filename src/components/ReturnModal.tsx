import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Contract, ReturnFormData } from '../types';
import { useRole } from '../context/RoleContext';
import { validateReturnForm } from '../utils/validateReturnForm';
import { DatosTab } from './DatosTab';
import { ServiciosTab } from './ServiciosTab';
import { SuccessDialog } from './SuccessDialog';
import { ErrorDialog } from './ErrorDialog';
import { PartialSaveDialog } from './PartialSaveDialog';

interface ReturnModalProps {
  open: boolean;
  contract: Contract | null;
  onClose: () => void;
  /** Datos previamente guardados para el contrato seleccionado (incluye archivos adjuntos) */
  initialFormData?: ReturnFormData | null;
  /** Se invoca en cada cambio de formData para persistirlo en el padre por contrato */
  onFormDataPersist?: (contractId: string, formData: ReturnFormData) => void;
}

export function ReturnModal({ open, contract, onClose, initialFormData, onFormDataPersist }: ReturnModalProps) {
  const { role } = useRole();
  const isReadOnly = role === 'Admin_Kinto';

  const [activeTab, setActiveTab] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPartialSave, setShowPartialSave] = useState(false);

  // Keep a ref to the latest formData reported by DatosTab
  const latestFormDataRef = useRef<ReturnFormData | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const handleFormDataChange = useCallback((formData: ReturnFormData) => {
    latestFormDataRef.current = formData;
    if (contract) {
      onFormDataPersist?.(contract.id, formData);
    }
  }, [contract, onFormDataPersist]);

  /**
   * Run validation and show the appropriate dialog.
   * Returns true if valid (SuccessDialog shown), false if invalid (ErrorDialog shown).
   */
  const attemptSave = useCallback((formData: ReturnFormData): boolean => {
    const result = validateReturnForm(formData);
    if (result.isValid) {
      setShowSuccess(true);
      return true;
    } else {
      setShowError(true);
      return false;
    }
  }, []);

  /**
   * Called by DatosTab when the user clicks "Guardar".
   * Stores the formData and triggers validation.
   */
  const handleSave = useCallback((formData: ReturnFormData) => {
    latestFormDataRef.current = formData;
    attemptSave(formData);
  }, [attemptSave]);

  /**
   * Close/Cancel: if the form is dirty, show PartialSaveDialog; otherwise close.
   * Admin_Kinto never has a dirty form, so this just closes.
   */
  const handleClose = useCallback(() => {
    if (!isReadOnly && isDirty) {
      setShowPartialSave(true);
    } else {
      onClose();
    }
  }, [isReadOnly, isDirty, onClose]);

  const handleCancel = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // --- Dialog handlers ---

  /** SuccessDialog "Aceptar": close everything and return to contracts list */
  const handleSuccessAccept = useCallback(() => {
    setShowSuccess(false);
    setIsDirty(false);
    onClose();
  }, [onClose]);

  /** ErrorDialog "Confirmar": close error dialog, keep modal open */
  const handleErrorConfirm = useCallback(() => {
    setShowError(false);
  }, []);

  /** PartialSaveDialog "Guardar": run validation with the latest formData */
  const handlePartialSave = useCallback(() => {
    setShowPartialSave(false);
    if (latestFormDataRef.current) {
      const valid = attemptSave(latestFormDataRef.current);
      // If invalid, ErrorDialog is now showing — modal stays open
      // If valid, SuccessDialog is now showing — its accept handler will close modal
      if (!valid) {
        // Modal stays open, user can fix data
      }
    } else {
      // No form data available — just close
      onClose();
    }
  }, [attemptSave, onClose]);

  /** PartialSaveDialog "Cancelar": discard changes, close modal */
  const handlePartialCancel = useCallback(() => {
    setShowPartialSave(false);
    setIsDirty(false);
    onClose();
  }, [onClose]);

  // Reset state when the modal opens with a new contract
  const handleEnter = useCallback(() => {
    setActiveTab(0);
    setIsDirty(false);
    setShowSuccess(false);
    setShowError(false);
    setShowPartialSave(false);
    latestFormDataRef.current = null;
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        TransitionProps={{ onEnter: handleEnter }}
        aria-labelledby="return-modal-title"
      >
        <DialogTitle
          id="return-modal-title"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant="h6" component="span" fontWeight="bold">
            Devolución vehículo
          </Typography>
          <IconButton
            aria-label="Cerrar"
            onClick={handleClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Pestañas de devolución"
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              backgroundColor: '#ebebed',
              borderRadius: 999,
              minHeight: 40,
              p: 0.5,
              mb: 1,
              '& .MuiTab-root': {
                borderRadius: 999,
                minHeight: 36,
                textTransform: 'none',
                fontWeight: 400,
                color: '#1c2628',
              },
              '& .MuiTab-root.Mui-selected': {
                backgroundColor: '#a5cdd5',
                fontWeight: 600,
                color: '#1c2628',
              },
            }}
          >
            <Tab label="Datos" id="return-tab-0" aria-controls="return-tabpanel-0" />
            <Tab label="Servicios" id="return-tab-1" aria-controls="return-tabpanel-1" />
          </Tabs>
        </Box>

        <DialogContent sx={{ minHeight: 300 }}>
          {/* Tab panel: Datos */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 0}
            id="return-tabpanel-0"
            aria-labelledby="return-tab-0"
          >
            {activeTab === 0 && contract && (
              <DatosTab
                contract={contract}
                onSave={handleSave}
                onCancel={handleCancel}
                onDirtyChange={handleDirtyChange}
                onFormDataChange={handleFormDataChange}
                initialFormData={initialFormData}
              />
            )}
          </Box>

          {/* Tab panel: Servicios */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 1}
            id="return-tabpanel-1"
            aria-labelledby="return-tab-1"
          >
            {activeTab === 1 && contract && (
              <ServiciosTab contractId={contract.id} />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* System dialogs — rendered outside main Dialog to avoid z-index issues */}
      <SuccessDialog open={showSuccess} onAccept={handleSuccessAccept} />
      <ErrorDialog open={showError} onConfirm={handleErrorConfirm} />
      <PartialSaveDialog
        open={showPartialSave}
        onSave={handlePartialSave}
        onCancel={handlePartialCancel}
      />
    </>
  );
}
