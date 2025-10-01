import React, { useState } from 'react';
import TagSelector from './TagSelector';
import TagSelectorForForm from './TagSelectorForForm';

const TodoForm = ({ todo, onSubmit, onCancel, isEditing = false, userType }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Adjust for timezone offset to show local time
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    description: todo?.description || '',
    dueDate: formatDateForInput(todo?.dueDate),
    tagIds: todo?.tags?.map(tag => tag.tagId) || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        description: formData.description,
        dueDate: formData.dueDate ? formData.dueDate : null,
        tagIds: formData.tagIds
      };

      const result = await onSubmit(submitData);

      if (result.success) {
        // Form will be closed by parent component
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Chỉnh sửa Todo' : 'Thêm Todo mới'}
          </h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Mô tả *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập mô tả todo..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Hạn hoàn thành
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            {userType === 'premium' && (
              isEditing ? (
                <TagSelector 
                  todoId={todo?.todoId}
                  userType={userType}
                  onTagsChange={(tags) => {
                    setFormData(prev => ({
                      ...prev,
                      tagIds: tags.map(tag => tag.tagId)
                    }));
                  }}
                />
              ) : (
                <TagSelectorForForm
                  userType={userType}
                  selectedTagIds={formData.tagIds}
                  onTagsChange={(tagIds) => {
                    setFormData(prev => ({
                      ...prev,
                      tagIds: tagIds
                    }));
                  }}
                />
              )
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;