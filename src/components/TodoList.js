import React, { useState, useEffect } from 'react';
import todoService from '../services/todoService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
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
      const result = await todoService.getTodos();
      if (result.success) {
        setTodos(result.data);
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
    const result = await todoService.createTodo(todoData);
    if (result.success) {
      await loadTodos();
      setShowForm(false);
      return { success: true };
    }
    return result;
  };

  const handleUpdateTodo = async (id, todoData) => {
    const result = await todoService.updateTodo(id, todoData);
    if (result.success) {
      await loadTodos();
      setEditingTodo(null);
      return { success: true };
    }
    return result;
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa todo này?')) {
      const result = await todoService.deleteTodo(id);
      if (result.success) {
        await loadTodos();
      } else {
        setError(result.message);
      }
    }
  };

  const handleToggleComplete = async (todo) => {
    const result = await todoService.updateTodo(todo.todoId, {
      isDone: !todo.isDone
    });
    if (result.success) {
      await loadTodos();
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách Todo</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
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
        />
      )}

      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          onSubmit={(data) => handleUpdateTodo(editingTodo.todoId, data)}
          onCancel={() => setEditingTodo(null)}
          isEditing={true}
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