import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import EditCollection from './EditCollection';

function CollectionsList({ collections, onSelectCollection, userId, onUpdateCollection }) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [editingCollection, setEditingCollection] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'collections'), {
        ...newCollection,
        userId: userId,
        createdAt: new Date().toISOString(),
        people: []
      });
      setNewCollection({ name: '', description: '' });
      setShowNewForm(false);
    } catch (error) {
      console.error('Error adding collection:', error);
      alert('Error adding collection. Please try again.');
    }
  };

  const handleEditClick = (e, collection) => {
    e.stopPropagation();
    setEditingCollection(collection);
  };

  if (editingCollection) {
    return (
      <EditCollection
        collection={editingCollection}
        onSave={async (updatedCollection) => {
          await onUpdateCollection(updatedCollection);
          setEditingCollection(null);
        }}
        onCancel={() => setEditingCollection(null)}
      />
    );
  }

  return (
    <div className="collections-list">
      <div className="collections-header">
        <h2>My Collections</h2>
        <button onClick={() => setShowNewForm(true)} className="add-button">+</button>
      </div>

      {showNewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Collection</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowNewForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <p>No collections yet.</p>
      ) : (
        <div className="collections-grid">
          {collections.map((col) => (
            <div key={col.id} className="collection-card" onClick={() => onSelectCollection(col)}>
              <h3>{col.name}</h3>
              <p>{col.description}</p>
              <p className="people-count">{col.people.length} people</p>
              <button 
                className="edit-button"
                onClick={(e) => handleEditClick(e, col)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionsList; 