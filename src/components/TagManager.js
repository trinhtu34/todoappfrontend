import React, { useState, useEffect } from 'react';
import tagService from '../services/tagService';

const TagManager = ({ userType }) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userType === 'premium') {
      loadTags();
    }
  }, [userType]);

  const loadTags = async () => {
    try {
      const data = await tagService.getTags();
      console.log('Loaded tags:', data);
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    console.log('Creating tag:', newTagName);
    
    if (!newTagName.trim()) {
      console.log('Empty tag name');
      return;
    }

    try {
      setLoading(true);
      console.log('Calling tagService.createTag');
      const result = await tagService.createTag(newTagName.trim());
      console.log('Create result:', result);
      
      setNewTagName('');
      await loadTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Lỗi tạo tag: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await tagService.deleteTag(tagId);
      loadTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  if (userType !== 'premium') {
    return (
      <div className="tag-manager premium-only">
        <h3>Tags (Premium Feature)</h3>
        <p>Upgrade to premium to use tags!</p>
      </div>
    );
  }

  return (
    <div className="tag-manager">
      <h3>Manage Tags</h3>
      
      <form onSubmit={handleCreateTag} className="tag-form">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Enter tag name"
          maxLength="50"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Add Tag'}
        </button>
      </form>

      <div className="tags-list">
        {tags.length === 0 ? (
          <p>Chưa có tag nào</p>
        ) : (
          tags.map(tag => (
            <div key={tag.tagId} className="tag-item">
              <span className="tag-name">{tag.tagName}</span>
              <button 
                onClick={() => handleDeleteTag(tag.tagId)}
                className="delete-btn"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TagManager;