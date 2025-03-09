import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add axios configuration with auth token
  const getAxiosConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      }
    };
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/todos/', getAxiosConfig());
      setTodos(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch todos. Please try again.');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    
    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/todos/', newTodo, getAxiosConfig());
      setNewTodo({ title: '', description: '' });
      setShowAddForm(false);
      fetchTodos();
      setError(null);
    } catch (error) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8000/api/todos/${id}/`, {
        completed: !completed,
      }, getAxiosConfig());
      fetchTodos();
      setError(null);
    } catch (error) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/api/todos/${id}/`, getAxiosConfig());
      fetchTodos();
      setError(null);
    } catch (error) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                My Tasks
                <span className="block text-lg font-normal text-gray-300 mt-1">Stay organized, stay productive</span>
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {showAddForm ? '− Close' : '+ New Task'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-400/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-3 rounded-xl mb-4 animate-fadeIn">
                {error}
              </div>
            )}

            <div className={`transition-all duration-500 ease-in-out ${showAddForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:border-white/30 focus:ring-0 transition-all duration-300 shadow-lg"
                  required
                />
                <textarea
                  placeholder="Add details (optional)"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full p-4 rounded-xl border-2 border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:border-white/30 focus:ring-0 transition-all duration-300 shadow-lg"
                  rows="2"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
              </form>
            </div>
          </div>

          <div className="p-8 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
              <div className="text-sm font-medium text-gray-600 bg-gray-100 px-6 py-3 rounded-full border border-gray-200 shadow-sm">
                {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
              </div>
              <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl backdrop-blur-sm border border-gray-200">
                {['all', 'active', 'completed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                      filter === filterType
                        ? 'bg-white text-gray-800 shadow-md font-medium'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading && todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <button
                          onClick={() => toggleComplete(todo.id, todo.completed)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            todo.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {todo.completed && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            </svg>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                              {todo.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {new Date(todo.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-300"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredTodos.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                      {filter === 'all' 
                        ? "No tasks yet. Create one to get started!" 
                        : `No ${filter} tasks found.`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList; 