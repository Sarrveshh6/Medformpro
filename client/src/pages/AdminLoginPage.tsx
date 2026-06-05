import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { FileText, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response: any = await api.post('/auth/login', { username, password });
      if (response && response.success) {
        localStorage.setItem('admin_token', response.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-primary text-white mb-4 shadow-lg shadow-primary/20">
          <FileText size={28} />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">MedForm Pro</h2>
        <p className="mt-2 text-sm text-slate-400 font-medium">Clinical Administration Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 py-8 px-4 shadow-2xl rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
                <span className="text-red-400">⚠</span> {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-300">
                Admin Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-900 text-white sm:text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-slate-900 text-white sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Lock size={16} />
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
