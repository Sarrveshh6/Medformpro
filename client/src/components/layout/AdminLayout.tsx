import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
