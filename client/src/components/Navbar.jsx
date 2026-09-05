import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LayoutDashboard, CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white tracking-wide">
                DevSecOps<span className="text-sky-400">Hub</span>
              </span>
            </Link>

            <div className="flex space-x-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-slate-700 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/tasks"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/tasks')
                    ? 'bg-slate-700 text-sky-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700">
              <User className="w-4 h-4 text-sky-400" />
              <span className="font-medium text-slate-200">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-md transition-colors border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
