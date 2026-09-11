import { useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FiltersPanel } from '../components/FiltersPanel';
import { ContractsTable } from '../components/ContractsTable';
import { ReturnModal } from '../components/ReturnModal';
import { mockContracts } from '../data/mockContracts';
import { filterContracts } from '../utils/filterContracts';
import type { Contract, FilterValues, ReturnFormData } from '../types';

export function ContractsList() {
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Datos de Devolución guardados por contrato (persisten al cerrar/reabrir el modal,
  // incluyendo archivos adjuntos), tanto para Admin_Local como Asesor.
  const [savedReturnData, setSavedReturnData] = useState<Record<string, ReturnFormData>>({});

  const handleSearch = useCallback((filters: Partial<FilterValues>) => {
    setFilteredContracts(filterContracts(mockContracts, filters));
  }, []);

  const handleClear = useCallback(() => {
    setFilteredContracts(mockContracts);
  }, []);

  const handleSelectContract = useCallback((contract: Contract) => {
    setSelectedContract(contract);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleFormDataPersist = useCallback((contractId: string, formData: ReturnFormData) => {
    setSavedReturnData((prev) => ({ ...prev, [contractId]: formData }));
  }, []);

  return (
    <Box sx={{ px: 3, py: 3, maxWidth: 1600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Devolución
      </Typography>

      <FiltersPanel onSearch={handleSearch} onClear={handleClear} />

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ContractsTable
          contracts={filteredContracts}
          onSelectContract={handleSelectContract}
        />
      </Paper>

      <ReturnModal
        open={modalOpen}
        contract={selectedContract}
        onClose={handleCloseModal}
        initialFormData={selectedContract ? savedReturnData[selectedContract.id] : null}
        onFormDataPersist={handleFormDataPersist}
      />
    </Box>
  );
}
