import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminLoginPage from '@/pages/AdminLoginPage';
import PatientFormPage from '@/pages/PatientFormPage';
import DashboardPage from '@/pages/DashboardPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Form Route (No sidebar, pure form view) */}
        <Route path="/form/:templateId" element={<PatientFormPage />} />
        
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes (Rendered inside AdminLayout with sidebar) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        
        {/* Fallback redirect to form */}
        <Route path="*" element={<Navigate to="/form/EORTC-QLQ-C30-V3" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
