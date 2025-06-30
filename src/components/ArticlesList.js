import React from 'react';

function ArticlesList({ articles, onAddArticle, onPersonClick }) {
  return (
    <div className="articles-container">
      <div className="articles-header">
        <h2>Articles</h2>
        <button onClick={onAddArticle} className="add-button" title="Add Article">
          +
        </button>
      </div>
      
      {articles.length === 0 ? (
        <p>No articles yet. Click the + button to add your first article.</p>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-content">
                <h3 className="article-title">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="article-description">{article.description}</p>
                
                {article.taggedPeople && article.taggedPeople.length > 0 && (
                  <div className="article-tagged-people">
                    <div className="tagged-people-images">
                      {article.taggedPeople.map((person) => (
                        <div 
                          key={person.id} 
                          className="tagged-person-image"
                          onClick={() => onPersonClick(person)}
                          title={`View ${person.name}'s profile`}
                        >
                          {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.name} />
                          ) : (
                            <div className="tagged-person-placeholder">
                              {person.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="article-meta">
                  <span className="article-date">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  {article.taggedPeople && article.taggedPeople.length > 0 && (
                    <span className="article-tags">
                      {article.taggedPeople.length} person{article.taggedPeople.length !== 1 ? 's' : ''} tagged
                    </span>
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

export default ArticlesList; 