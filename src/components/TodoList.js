import React, { useState, useEffect } from 'react';
import todoService from '../services/todoService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = ({ userType }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const result = await todoService.getTodos();
      if (result.success) {
        setTodos(result.data);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải danh sách todo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      setLoading(true);
      const result = await todoService.createTodo(todoData);
      if (result.success) {
        await loadTodos();
        setShowForm(false);
        return { success: true };
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      setLoading(true);
      const result = await todoService.updateTodo(id, todoData);
      if (result.success) {
        await loadTodos();
        setEditingTodo(null);
        return { success: true };
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa todo này?')) {
      try {
        setLoading(true);
        const result = await todoService.deleteTodo(id);
        if (result.success) {
          setTodos(prev => prev.filter(todo => todo.todoId !== id));
        } else {
          setError(result.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      setLoading(true);
      const result = await todoService.updateTodo(todo.todoId, {
        isDone: !todo.isDone
      });
      if (result.success) {
        setTodos(prev => prev.map(t => 
          t.todoId === todo.todoId ? { ...t, isDone: !t.isDone } : t
        ));
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      <span className="ml-3 text-gray-600">Đang tải...</span>
    </div>
  );

  if (loading && todos.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {loading && todos.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-2 text-gray-600">Đang xử lý...</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách Todo</h1>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg"
        >
          Thêm Todo
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={() => setShowForm(false)}
          userType={userType}
        />
      )}

      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          onSubmit={(data) => handleUpdateTodo(editingTodo.todoId, data)}
          onCancel={() => setEditingTodo(null)}
          isEditing={true}
          userType={userType}
        />
      )}

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có todo nào. Hãy tạo todo đầu tiên!
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.todoId}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;