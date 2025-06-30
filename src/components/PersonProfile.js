import React from 'react';

function PersonProfile({ person, collections, articles, onEdit, onBack, onAddToCollection, onPersonClick, onCollectionClick }) {
  const personCollections = collections.filter(col => 
    col.people.some(p => p.id === person.id)
  );

  const personArticles = articles.filter(article => 
    article.taggedPeople && article.taggedPeople.some(p => p.id === person.id)
  );

  return (
    <div className="person-profile">
      <div className="profile-header">
        <div className="profile-image">
          {person.imageUrl ? (
            <img src={person.imageUrl} alt={person.name} />
          ) : (
            <div className="placeholder-image">
              {person.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h2>{person.name}</h2>
          <div className="profile-links">
            {person.linkedinUrl && (
              <a 
                href={person.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon linkedin-icon"
                title="View on LinkedIn"
              >
                in
              </a>
            )}
            {person.wikipediaUrl && (
              <a 
                href={person.wikipediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon wikipedia-icon"
                title="View on Wikipedia"
              >
                W
              </a>
            )}
          </div>
          <div className="profile-actions">
            <button 
              onClick={() => onEdit(person)} 
              className="edit-profile-icon"
              title="Edit Profile"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>

      <div className="profile-collections">
        <div className="collections-header">
          <h3>Member of:</h3>
          <button 
            onClick={() => onAddToCollection(person)} 
            className="add-to-collection-icon"
            title="Add to Collection"
          >
            +
          </button>
        </div>
        {personCollections.length === 0 ? (
          <p>Not in any collections yet.</p>
        ) : (
          <div className="collections-list">
            {personCollections.map(collection => (
              <div 
                key={collection.id} 
                className="collection-item"
                onClick={() => onCollectionClick(collection)}
              >
                <h4>{collection.name}</h4>
                <p>{collection.description}</p>
                
                {collection.people.length > 0 && (
                  <div className="collection-people-preview">
                    {collection.people.slice(0, 3).map((person, index) => (
                      <div 
                        key={person.id} 
                        className="preview-person-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPersonClick(person);
                        }}
                        title={`View ${person.name}'s profile`}
                      >
                        {person.imageUrl ? (
                          <img src={person.imageUrl} alt={person.name} />
                        ) : (
                          <div className="preview-placeholder">
                            {person.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                    {collection.people.length > 3 && (
                      <div className="more-people-indicator">
                        +{collection.people.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-articles">
        <div className="articles-header">
          <h3>Tagged in Articles:</h3>
        </div>
        {personArticles.length === 0 ? (
          <p>Not tagged in any articles yet.</p>
        ) : (
          <div className="profile-articles-list">
            {personArticles.map(article => (
              <div key={article.id} className="profile-article-item">
                <h4 className="profile-article-title">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.title}
                  </a>
                </h4>
                <p className="profile-article-description">{article.description}</p>
                <div className="profile-article-meta">
                  <span className="profile-article-date">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  {article.taggedPeople && article.taggedPeople.length > 1 && (
                    <span className="profile-article-other-tags">
                      Also tagged: {article.taggedPeople.filter(p => p.id !== person.id).map(p => p.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonProfile; 