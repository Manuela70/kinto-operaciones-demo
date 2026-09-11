import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Header } from '../components/Header';

export function ProtectedLayout() {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
