import React, { useState, useEffect } from 'react';
import tagService from '../services/tagService';

const TagSelector = ({ todoId, userType, onTagsChange }) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userType === 'premium') {
      loadTags();
      if (todoId) {
        loadTodoTags();
      }
    }
  }, [userType, todoId]);

  const loadTags = async () => {
    try {
      const data = await tagService.getTags();
      setAvailableTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadTodoTags = async () => {
    try {
      const data = await tagService.getTodoTags(todoId);
      setSelectedTags(data);
      onTagsChange && onTagsChange(data);
    } catch (error) {
      console.error('Error loading todo tags:', error);
    }
  };

  const handleTagToggle = async (tag) => {
    if (!todoId) return;

    try {
      setLoading(true);
      const isSelected = selectedTags.some(t => t.tagId === tag.tagId);
      
      if (isSelected) {
        await tagService.removeTagFromTodo(todoId, tag.tagId);
      } else {
        await tagService.assignTagToTodo(todoId, tag.tagId);
      }
      
      loadTodoTags();
    } catch (error) {
      console.error('Error toggling tag:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userType !== 'premium') {
    return null;
  }

  return (
    <div className="tag-selector">
      <label>Tags:</label>
      <div className="tags-container">
        {availableTags.map(tag => {
          const isSelected = selectedTags.some(t => t.tagId === tag.tagId);
          return (
            <button
              key={tag.tagId}
              type="button"
              className={`tag-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleTagToggle(tag)}
              disabled={loading || !todoId}
            >
              {tag.tagName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelector;