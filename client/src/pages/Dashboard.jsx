import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTaskStats, getTasks } from '../api/taskApi';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Layers
} from 'lucide-react';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, tasksData] = await Promise.all([
        getTaskStats(),
        getTasks()
      ]);
      setStats(statsData);
      setRecentTasks(tasksData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard metrics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900/40 via-slate-800 to-slate-800 border border-sky-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-sky-400">{user?.name}</span>!
          </h1>
          <p className="text-slate-300 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
            Phase 1 Foundation Core active. Track your development tasks, set security priorities, and manage project workflows.
          </p>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-sky-500/20 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Manage Tasks</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tasks */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-slate-700/50 text-slate-300 rounded-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '...' : stats.total}</p>
          </div>
        </div>

        {/* Todo */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">To Do</p>
            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '...' : stats.todo}</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '...' : stats.inProgress}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '...' : stats.completed}</p>
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">High Priority</p>
            <p className="text-2xl font-bold text-white mt-0.5">{loading ? '...' : stats.highPriority}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="flex items-center space-x-1 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-4">No tasks found yet. Start by creating your first task.</p>
            <Link
              to="/tasks"
              className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => {}}
                onDelete={() => {}}
                onStatusChange={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
