import api from '../config/api';

class TodoService {
  async getTodos() {
    try {
      const response = await api.get('/todos');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy danh sách todo thất bại' 
      };
    }
  }

  async getTodo(id) {
    try {
      const response = await api.get(`/todos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lấy todo thất bại' 
      };
    }
  }

  async createTodo(todoData) {
    try {
      const response = await api.post('/todos', todoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Tạo todo thất bại' 
      };
    }
  }

  async updateTodo(id, todoData) {
    try {
      await api.put(`/todos/${id}`, todoData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật todo thất bại' 
      };
    }
  }

  async deleteTodo(id) {
    try {
      await api.delete(`/todos/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Xóa todo thất bại' 
      };
    }
  }
}

export default new TodoService();