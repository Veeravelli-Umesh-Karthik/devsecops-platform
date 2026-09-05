import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilter from '../components/TaskFilter';
import { Plus, CheckSquare, RefreshCw } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <CheckSquare className="w-7 h-7 text-sky-400" />
            <span>Task Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, filter, and organize project tasks & security requirements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Component */}
      <TaskFilter filters={filters} setFilters={setFilters} />

      {/* Task List Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-400"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-base mb-4">No tasks found matching your filter criteria.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialTask={editingTask}
      />
    </div>
  );
};

export default Tasks;
