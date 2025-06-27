import React from 'react';

function PeopleList({ people, onPersonClick, onAddPerson }) {
  return (
    <div className="people-list">
      <div className="people-header">
        <h2>People</h2>
        <button onClick={onAddPerson} className="add-button">+</button>
      </div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PeopleList; 