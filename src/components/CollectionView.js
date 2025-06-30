import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CollectionView({ collection, onBack, onUpdateCollection, onPersonClick }) {
  const handleRemovePerson = async (personToRemove) => {
    try {
      const updatedPeople = collection.people.filter(p => p.id !== personToRemove.id);
      
      const collectionRef = doc(db, 'collections', collection.id);
      await updateDoc(collectionRef, {
        people: updatedPeople
      });
      
      // Update the local collection state
      onUpdateCollection({
        ...collection,
        people: updatedPeople
      });
      
      console.log('Person removed from collection successfully');
    } catch (error) {
      console.error('Error removing person from collection:', error);
      alert('Error removing person from collection. Please try again.');
    }
  };

  return (
    <div className="collection-view">
      <div className="collection-header">
        <h2>{collection.name}</h2>
        <p className="collection-description">{collection.description}</p>
      </div>

      {collection.people.length === 0 ? (
        <p>No people in this collection yet.</p>
      ) : (
        <div className="people-grid">
          {collection.people.map((person) => (
            <div 
              key={person.id} 
              className="person-card collection-person-card"
              onClick={() => onPersonClick(person)}
            >
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
                <div className="person-links">
                  {person.linkedinUrl && (
                    <a 
                      href={person.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      LinkedIn
                    </a>
                  )}
                  {person.wikipediaUrl && (
                    <a 
                      href={person.wikipediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Wikipedia
                    </a>
                  )}
                </div>
              </div>
              <button 
                className="remove-person-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePerson(person);
                }}
                title="Remove from collection"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionView; 