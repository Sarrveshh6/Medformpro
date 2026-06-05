import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Patient Form', path: '/form/EORTC-QLQ-C30-V3', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm hidden md:flex">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
            <FileText size={20} />
          </div>
          MedForm Pro
        </h1>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} className={isActive ? "text-primary" : "text-slate-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} className="text-red-500" />
          Log Out
        </button>
      </div>
    </div>
  );
}
