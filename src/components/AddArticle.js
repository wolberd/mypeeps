import React, { useState } from 'react';

function AddArticle({ onAddArticle, people, onCancel }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddArticle({
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        taggedPeople: selectedPeople
      });
      
      // Reset form
      setTitle('');
      setUrl('');
      setDescription('');
      setSelectedPeople([]);
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePersonSelection = (person) => {
    setSelectedPeople(prev => {
      const isSelected = prev.some(p => p.id === person.id);
      if (isSelected) {
        return prev.filter(p => p.id !== person.id);
      } else {
        return [...prev, person];
      }
    });
  };

  return (
    <div className="add-article">
      <div className="add-article-header">
        <h2>Add New Article</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL *</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the article"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Tag People (Optional)</label>
          <div className="people-selection">
            {people.length === 0 ? (
              <p>No people available to tag. Add some people first!</p>
            ) : (
              <div className="people-tags">
                {people.map((person) => {
                  const isSelected = selectedPeople.some(p => p.id === person.id);
                  return (
                    <button
                      key={person.id}
                      type="button"
                      className={`person-tag ${isSelected ? 'selected' : ''}`}
                      onClick={() => togglePersonSelection(person)}
                    >
                      <div className="person-tag-image">
                        {person.imageUrl ? (
                          <img src={person.imageUrl} alt={person.name} />
                        ) : (
                          <div className="person-tag-placeholder">
                            {person.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span>{person.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Article'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddArticle; 