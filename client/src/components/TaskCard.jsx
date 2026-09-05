import React from 'react';
import { Calendar, Edit3, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'TODO':
      default:
        return <AlertCircle className="w-4 h-4 text-sky-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-all flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-lg text-white leading-snug break-words">
            {task.title}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityBadge(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-700/60 mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(task.status)}
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-sky-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-700 rounded-md transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
