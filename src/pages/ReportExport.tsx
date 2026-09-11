import { useCallback, useMemo, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Paper, Select, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { MultiSelectWithChips } from '../components/MultiSelectWithChips';
import { ReportDynamicFilters } from '../components/ReportDynamicFilters';
import { GeneratingExcelDialog } from '../components/GeneratingExcelDialog';
import { SuccessDialog } from '../components/SuccessDialog';
import { REPORT_CRITERIOS, getReportFilterFields } from '../config/reportFilters';
import { getConcesionarioLabels, getLocalesForConcesionario } from '../data/mockConcesionarios';
import type { ReportCriterio, ReportMode } from '../types';

export function ReportExport() {
  const [mode, setMode] = useState<ReportMode>('Concesionario');
  const [concesionarios, setConcesionarios] = useState<string[]>([]);
  const [localConcesionario, setLocalConcesionario] = useState('');
  const [locales, setLocales] = useState<string[]>([]);
  const [criterio, setCriterio] = useState<ReportCriterio | ''>('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const concesionarioLabels = useMemo(() => getConcesionarioLabels(), []);
  const localesLabels = useMemo(
    () => (localConcesionario ? getLocalesForConcesionario(localConcesionario) : []),
    [localConcesionario],
  );
  const fields = useMemo(() => getReportFilterFields(criterio), [criterio]);

  const handleModeChange = useCallback((_: unknown, next: ReportMode | null) => {
    if (!next) return;
    setMode(next);
    setConcesionarios([]);
    setLocalConcesionario('');
    setLocales([]);
  }, []);

  const handleFieldChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setConcesionarios([]);
    setLocalConcesionario('');
    setLocales([]);
    setCriterio('');
    setValues({});
  }, []);

  const handleExport = useCallback(() => {
    setGenerating(true);
  }, []);

  const handleGenerationComplete = useCallback(() => {
    setGenerating(false);
    setSuccessOpen(true);
  }, []);

  return (
    <Box sx={{ px: 3, py: 3, maxWidth: 1800, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Reporte Excel
      </Typography>

      <Paper variant="outlined" sx={{ mb: 3, p: 2.5, borderRadius: 2, borderColor: 'divider' }}>
        <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} size="small" sx={{ mb: 2.5 }}>
          <ToggleButton
            value="Concesionario"
            sx={{
              px: 3,
              '&.Mui-selected': { backgroundColor: '#a5cdd5', '&:hover': { backgroundColor: '#8fbdc6' } },
            }}
          >
            Concesionario
          </ToggleButton>
          <ToggleButton
            value="Local"
            sx={{
              px: 3,
              '&.Mui-selected': { backgroundColor: '#a5cdd5', '&:hover': { backgroundColor: '#8fbdc6' } },
            }}
          >
            Local
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === 'Concesionario' ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
            <MultiSelectWithChips
              label="Concesionarios"
              options={concesionarioLabels}
              value={concesionarios}
              onChange={setConcesionarios}
              placeholder="Selecciona"
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
            <Box sx={{ flex: '1 1 260px', minWidth: 240 }}>
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary', fontSize: '0.75rem' }}
              >
                Concesionario
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={localConcesionario}
                  displayEmpty
                  onChange={(e) => {
                    setLocalConcesionario(e.target.value as string);
                    setLocales([]);
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                          Selecciona
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                >
                  {concesionarioLabels.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <MultiSelectWithChips
              label="Locales"
              options={localesLabels}
              value={locales}
              onChange={setLocales}
              placeholder="Selecciona"
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2.5 }}>
          <Box sx={{ flex: '1 1 260px', minWidth: 240 }}>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary', fontSize: '0.75rem' }}
            >
              Criterios
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={criterio}
                displayEmpty
                onChange={(e) => {
                  setCriterio(e.target.value as ReportCriterio);
                  setValues({});
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                        Selecciona
                      </Typography>
                    );
                  }
                  return selected;
                }}
              >
                {REPORT_CRITERIOS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <ReportDynamicFilters fields={fields} values={values} onChange={handleFieldChange} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2.5 }}>
          <Button variant="outlined" onClick={handleClear}>
            Limpiar filtros
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#0097a7', '&:hover': { backgroundColor: '#00838f' } }}
            onClick={handleExport}
            disabled={!criterio}
          >
            Exportar
          </Button>
        </Box>
      </Paper>

      <GeneratingExcelDialog open={generating} onComplete={handleGenerationComplete} />

      <SuccessDialog
        open={successOpen}
        onAccept={() => setSuccessOpen(false)}
        title="Excel generado"
        message="El archivo se generó correctamente y está listo para descargar."
      />
    </Box>
  );
}
