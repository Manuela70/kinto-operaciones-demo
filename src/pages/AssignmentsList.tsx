import { useCallback, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AssignmentsFiltersPanel } from '../components/AssignmentsFiltersPanel';
import { AssignmentsTable } from '../components/AssignmentsTable';
import { AccesoriosModal } from '../components/AccesoriosModal';
import { DetallesModal } from '../components/DetallesModal';
import { FacturacionModal } from '../components/FacturacionModal';
import { PreparacionTdpModal } from '../components/PreparacionTdpModal';
import { DocumentacionModal } from '../components/DocumentacionModal';
import { PreparacionDlrModal } from '../components/PreparacionDlrModal';
import { EntregaClienteModal } from '../components/EntregaClienteModal';
import { mockAssignments } from '../data/mockAssignments';
import { filterAssignments } from '../utils/filterAssignments';
import type { Assignment, AssignmentFilterValues } from '../types';

type ModalKey =
  | 'accesorios'
  | 'detalles'
  | 'facturacion'
  | 'preparacionTdp'
  | 'documentacion'
  | 'preparacionDlr'
  | 'entregaCliente'
  | null;

export function AssignmentsList() {
  const [filtered, setFiltered] = useState<Assignment[]>(mockAssignments);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  const handleSearch = useCallback((filters: Partial<AssignmentFilterValues>) => {
    setFiltered(filterAssignments(mockAssignments, filters));
  }, []);

  const handleClear = useCallback(() => {
    setFiltered(mockAssignments);
  }, []);

  const openWith = useCallback((key: Exclude<ModalKey, null>) => {
    return (assignment: Assignment) => {
      setSelected(assignment);
      setOpenModal(key);
    };
  }, []);

  const handleClose = useCallback(() => {
    setOpenModal(null);
  }, []);

  const handleSaved = useCallback(() => {
    // En esta demo no hay backend: el cierre del modal ya refleja el estado.
  }, []);

  return (
    <Box sx={{ px: 3, py: 3, maxWidth: 1800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Asignaciones y entrega
      </Typography>

      <AssignmentsFiltersPanel onSearch={handleSearch} onClear={handleClear} />

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <AssignmentsTable
          assignments={filtered}
          onOpenAccesorios={openWith('accesorios')}
          onOpenDetalles={openWith('detalles')}
          onOpenFacturacion={openWith('facturacion')}
          onOpenPreparacionTdp={openWith('preparacionTdp')}
          onOpenDocumentacion={openWith('documentacion')}
          onOpenPreparacionDlr={openWith('preparacionDlr')}
          onOpenEntregaCliente={openWith('entregaCliente')}
        />
      </Paper>

      <AccesoriosModal
        open={openModal === 'accesorios'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
      />
      <DetallesModal
        open={openModal === 'detalles'}
        assignment={selected}
        onClose={handleClose}
      />
      <FacturacionModal
        open={openModal === 'facturacion'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
        onSent={handleSaved}
      />
      <PreparacionTdpModal
        open={openModal === 'preparacionTdp'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
        onSent={handleSaved}
      />
      <DocumentacionModal
        open={openModal === 'documentacion'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
      />
      <PreparacionDlrModal
        open={openModal === 'preparacionDlr'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
        onSent={handleSaved}
      />
      <EntregaClienteModal
        open={openModal === 'entregaCliente'}
        assignment={selected}
        onClose={handleClose}
        onSaved={handleSaved}
        onSent={handleSaved}
      />
    </Box>
  );
}
