import React from 'react';

const TodoItem = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      todo.isDone ? 'border-green-500 bg-gray-50' : 'border-blue-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={() => onToggleComplete(todo)}
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <p className={`text-lg ${
              todo.isDone ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.description}
            </p>
            
            {todo.dueDate && (
              <p className="text-sm text-gray-600">
                Hạn: {formatDate(todo.dueDate)}
              </p>
            )}
            
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {todo.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag.tagName}
                  </span>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              Tạo: {formatDate(todo.createAt)}
              {todo.updateAt !== todo.createAt && (
                <span> • Cập nhật: {formatDate(todo.updateAt)}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="text-indigo-600 hover:text-indigo-900 p-1"
            title="Chỉnh sửa"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(todo.todoId)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Xóa"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;