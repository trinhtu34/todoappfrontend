import api from '../config/api';

class TagService {
  async getTags() {
    const response = await api.get('/tags');
    return response.data;
  }

  async createTag(tagName) {
    const response = await api.post('/tags', { TagName: tagName });
    return response.data;
  }

  async deleteTag(tagId) {
    const response = await api.delete(`/tags/${tagId}`);
    return response.data;
  }

  async assignTagToTodo(todoId, tagId) {
    const response = await api.post(`/todos/${todoId}/tags`, { tagId });
    return response.data;
  }

  async removeTagFromTodo(todoId, tagId) {
    const response = await api.delete(`/todos/${todoId}/tags/${tagId}`);
    return response.data;
  }

  async getTodoTags(todoId) {
    const response = await api.get(`/todos/${todoId}/tags`);
    return response.data;
  }
}

export default new TagService();