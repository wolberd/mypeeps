import React, { useState } from 'react';

function EditCollection({ collection, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: collection.name,
    description: collection.description
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.description && !isSubmitting) {
      try {
        setIsSubmitting(true);
        const updatedCollection = {
          ...collection,
          name: formData.name,
          description: formData.description,
          updatedAt: new Date().toISOString()
        };

        await onSave(updatedCollection);
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="edit-collection">
      <h2>Edit Collection</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCollection; 