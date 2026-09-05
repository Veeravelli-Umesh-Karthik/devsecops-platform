import React from 'react';
import { Search, Filter } from 'lucide-react';

const TaskFilter = ({ filters, setFilters }) => {
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handlePriorityChange = (e) => {
    setFilters((prev) => ({ ...prev, priority: e.target.value }));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-sky-500 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={handlePriorityChange}
          className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;
