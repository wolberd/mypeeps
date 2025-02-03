import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CollectionView({ collection, onBack }) {
  return (
    <div className="collection-view">
      <div className="collection-header">
        <button onClick={onBack} className="back-button">← Back to Collections</button>
        <h2>{collection.name}</h2>
        <p className="collection-description">{collection.description}</p>
      </div>

      {collection.people.length === 0 ? (
        <p>No people in this collection yet.</p>
      ) : (
        <div className="people-grid">
          {collection.people.map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-image">
                {person.imageUrl ? (
                  <img src={person.imageUrl} alt={person.name} />
                ) : (
                  <div className="placeholder-image">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="person-info">
                <h3>{person.name}</h3>
                <p>{person.age} years old</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionView; 