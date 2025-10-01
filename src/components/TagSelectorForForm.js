import React, { useState, useEffect } from 'react';
import tagService from '../services/tagService';

const TagSelectorForForm = ({ userType, selectedTagIds = [], onTagsChange }) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userType === 'premium') {
      loadTags();
    }
  }, [userType]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getTags();
      setAvailableTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId) => {
    const newSelectedIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    onTagsChange(newSelectedIds);
  };

  if (userType !== 'premium') {
    return null;
  }

  return (
    <div className="tag-selector">
      <label className="block text-sm font-medium text-gray-700 mb-2">Tags:</label>
      <div className="tags-container">
        {loading ? (
          <p className="text-sm text-gray-500">Đang tải tags...</p>
        ) : availableTags.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có tags nào</p>
        ) : (
          availableTags.map(tag => {
            const isSelected = selectedTagIds.includes(tag.tagId);
            return (
              <button
                key={tag.tagId}
                type="button"
                className={`tag-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag.tagId)}
              >
                {tag.tagName}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TagSelectorForForm;