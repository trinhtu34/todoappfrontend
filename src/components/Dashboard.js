import React from 'react';
import { useAuth } from '../context/AuthContext';
import TodoList from './TodoList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Xin chào, {user.name || user.username}!
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <TodoList />
      </main>
    </div>
  );
};

export default Dashboard;