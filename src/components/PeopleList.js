import React, { useState } from 'react';
import EditPerson from './EditPerson';

function PeopleList({ people, onPersonClick, onUpdatePerson }) {
  const [editingPerson, setEditingPerson] = useState(null);

  const handleEditClick = (e, person) => {
    e.stopPropagation(); // Prevent triggering the card click
    setEditingPerson(person);
  };

  if (editingPerson) {
    return (
      <EditPerson 
        person={editingPerson}
        onSave={async (updatedPerson) => {
          await onUpdatePerson(updatedPerson);
          setEditingPerson(null);
        }}
        onCancel={() => setEditingPerson(null)}
      />
    );
  }

  return (
    <div className="people-list">
      <h2>People</h2>
      {people.length === 0 ? (
        <p>No people added yet.</p>
      ) : (
        <div className="people-grid">
          {people.map((person) => (
            <div 
              key={person.id} 
              className="person-card"
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
                <p>{person.age} years old</p>
                <button 
                  className="edit-button"
                  onClick={(e) => handleEditClick(e, person)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeopleList; 