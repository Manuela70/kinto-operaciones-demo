import { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ServicesFiltersPanel } from '../components/ServicesFiltersPanel';
import { ServicesTable } from '../components/ServicesTable';
import { ServiceReviewModal } from '../components/ServiceReviewModal';
import { ServiceFormModal } from '../components/ServiceFormModal';
import { mockServices } from '../data/mockServices';
import { filterServices } from '../utils/filterServices';
import { useRole } from '../context/RoleContext';
import type { ServiceFilterValues, ServiceRecord } from '../types';

export function ServicesList() {
  const { role } = useRole();
  const canCreate = role === 'Admin_Local' || role === 'Asesor';
  const [services, setServices] = useState<ServiceRecord[]>(mockServices);
  const [filtered, setFiltered] = useState<ServiceRecord[]>(mockServices);

  const [reviewTarget, setReviewTarget] = useState<ServiceRecord | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);

  const [formTarget, setFormTarget] = useState<ServiceRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSearch = useCallback(
    (filters: Partial<ServiceFilterValues>) => {
      setFiltered(filterServices(services, filters));
    },
    [services],
  );

  const handleClear = useCallback(() => {
    setFiltered(services);
  }, [services]);

  const handleOpenReview = useCallback((s: ServiceRecord) => {
    setReviewTarget(s);
    setReviewOpen(true);
  }, []);

  const handleOpenReadOnly = useCallback((s: ServiceRecord) => {
    setReviewTarget(s);
    setReadOnlyOpen(true);
  }, []);

  const handleOpenForm = useCallback((s: ServiceRecord) => {
    setFormTarget(s);
    setFormOpen(true);
  }, []);

  const handleNewService = useCallback(() => {
    setFormTarget(null);
    setFormOpen(true);
  }, []);

  const updateServiceState = useCallback(
    (idOT: string, changes: Partial<ServiceRecord>) => {
      setServices((prev) => {
        const next = prev.map((s) => (s.idOT === idOT ? { ...s, ...changes } : s));
        setFiltered((prevFiltered) =>
          prevFiltered.map((s) => (s.idOT === idOT ? { ...s, ...changes } : s)),
        );
        return next;
      });
    },
    [],
  );

  const handleApproved = useCallback(() => {
    if (reviewTarget) updateServiceState(reviewTarget.idOT, { estadoOT: 'Aprobado' });
  }, [reviewTarget, updateServiceState]);

  const handleRejected = useCallback(() => {
    if (reviewTarget) updateServiceState(reviewTarget.idOT, { estadoOT: 'Rechazado' });
  }, [reviewTarget, updateServiceState]);

  const handleFormSaved = useCallback(
    (data: Partial<ServiceRecord>) => {
      if (formTarget) {
        updateServiceState(formTarget.idOT, data);
      } else {
        const newRecord: ServiceRecord = {
          idOT: `C2025${10000 + services.length}`,
          idOtDisplay: `C2025${10000 + services.length}`,
          contrato: `CTR-${1000 + services.length}`,
          vin: `NEWVIN${services.length}`,
          serie: data.serie ?? '',
          placa: data.placa ?? '',
          kilometraje: data.kilometraje ?? '0',
          cliente: '',
          ruc: '',
          marca: '',
          modelo: '',
          version: '',
          dealer: data.dealer ?? '',
          local: data.local ?? '',
          asesor: '',
          tipoServicio: data.tipoServicio ?? 'Preventivo',
          estadoOT: 'Por validar',
          comentario: data.comentario ?? '',
          fechaServicio: data.fechaServicio ?? '',
          frecuencia: data.frecuencia ?? '5000 km',
          tipoMoneda: data.tipoMoneda ?? 'Soles',
          monto: data.monto ?? '0.00',
          cobrarCliente: data.cobrarCliente ?? true,
          cotizacionFiles: data.cotizacionFiles ?? [],
          imagenesFiles: data.imagenesFiles ?? [],
          vistoBuenoFiles: data.vistoBuenoFiles ?? [],
        };
        setServices((prev) => [newRecord, ...prev]);
        setFiltered((prev) => [newRecord, ...prev]);
      }
    },
    [formTarget, services.length, updateServiceState],
  );

  return (
    <Box sx={{ px: 3, py: 3, maxWidth: 1800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Servicios
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0d3b4f', '&:hover': { backgroundColor: '#0a2e3d' } }}
            onClick={handleNewService}
          >
            Nuevo servicio
          </Button>
        )}
      </Box>

      <ServicesFiltersPanel onSearch={handleSearch} onClear={handleClear} />

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ServicesTable
          services={filtered}
          onOpenReview={handleOpenReview}
          onOpenForm={handleOpenForm}
          onOpenReadOnly={handleOpenReadOnly}
        />
      </Paper>

      <ServiceReviewModal
        open={reviewOpen}
        service={reviewTarget}
        onClose={() => setReviewOpen(false)}
        onApproved={handleApproved}
        onRejected={handleRejected}
      />

      <ServiceReviewModal
        open={readOnlyOpen}
        service={reviewTarget}
        onClose={() => setReadOnlyOpen(false)}
        readOnly
      />

      <ServiceFormModal
        open={formOpen}
        service={formTarget}
        onClose={() => setFormOpen(false)}
        onSaved={handleFormSaved}
      />
    </Box>
  );
}
