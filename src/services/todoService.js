import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

class TodoService {
  async getTodos() {
    try {
      const response = await axios.get(API_ENDPOINTS.TODOS);
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
      const response = await axios.get(`${API_ENDPOINTS.TODOS}/${id}`);
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
      const response = await axios.post(API_ENDPOINTS.TODOS, todoData);
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
      await axios.put(`${API_ENDPOINTS.TODOS}/${id}`, todoData);
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
      await axios.delete(`${API_ENDPOINTS.TODOS}/${id}`);
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