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
      setLoading(true);
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setLoading(true);
      await tagService.createTag(newTagName);
      setNewTagName('');
      loadTags();
    } catch (error) {
      console.error('Error creating tag:', error);
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

      {loading ? (
        <p>Loading tags...</p>
      ) : (
        <div className="tags-list">
          {tags.map(tag => (
            <div key={tag.tagId} className="tag-item">
              <span className="tag-name">{tag.tagName}</span>
              <button 
                onClick={() => handleDeleteTag(tag.tagId)}
                className="delete-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagManager;