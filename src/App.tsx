import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { kintoTheme } from './theme/kintoTheme';
import { RoleProvider } from './context/RoleContext';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { RoleSelector } from './pages/RoleSelector';
import { ContractsList } from './pages/ContractsList';
import { AssignmentsList } from './pages/AssignmentsList';
import { ServicesList } from './pages/ServicesList';
import { ReportExport } from './pages/ReportExport';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <ThemeProvider theme={kintoTheme}>
      <CssBaseline />
      <RoleProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<RoleSelector />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/contracts" element={<ContractsList />} />
              <Route path="/assignments" element={<AssignmentsList />} />
              <Route path="/services" element={<ServicesList />} />
              <Route path="/report" element={<ReportExport />} />
              <Route path="/placeholder" element={<PlaceholderPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
