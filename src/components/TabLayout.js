import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PeopleList from './PeopleList';
import AddPerson from './AddPerson';
import CollectionsList from './CollectionsList';
import CollectionView from './CollectionView';
import PersonProfile from './PersonProfile';
import EditPerson from './EditPerson';
import ArticlesList from './ArticlesList';
import AddArticle from './AddArticle';

function TabLayout({ userId }) {
  const [activeTab, setActiveTab] = useState('list');
  const [people, setPeople] = useState([]);
  const [collections, setCollections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    // People listener
    const peopleQuery = query(
      collection(db, 'people'),
      where('userId', '==', userId)
    );
    
    const unsubscribePeople = onSnapshot(peopleQuery, (snapshot) => {
      const peopleData = [];
      snapshot.forEach((doc) => {
        peopleData.push({ id: doc.id, ...doc.data() });
      });
      setPeople(peopleData);
    });

    // Collections listener
    const collectionsQuery = query(
      collection(db, 'collections'),
      where('userId', '==', userId)
    );

    const unsubscribeCollections = onSnapshot(collectionsQuery, (snapshot) => {
      const collectionsData = [];
      snapshot.forEach((doc) => {
        collectionsData.push({ id: doc.id, ...doc.data() });
      });
      setCollections(collectionsData);
    });

    // Articles listener
    const articlesQuery = query(
      collection(db, 'articles'),
      where('userId', '==', userId)
    );

    const unsubscribeArticles = onSnapshot(articlesQuery, (snapshot) => {
      const articlesData = [];
      snapshot.forEach((doc) => {
        articlesData.push({ id: doc.id, ...doc.data() });
      });
      // Sort articles by creation date (most recent first)
      articlesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setArticles(articlesData);
    });

    return () => {
      unsubscribePeople();
      unsubscribeCollections();
      unsubscribeArticles();
    };
  }, [userId]);

  const handleAddPerson = async (person) => {
    try {
      console.log('Starting to add person:', person);
      
      if (!userId) {
        throw new Error('No user ID available');
      }

      const docRef = await addDoc(collection(db, 'people'), {
        ...person,
        userId: userId,
        createdAt: new Date().toISOString()
      });
      
      console.log('Person added with ID:', docRef.id);
      setActiveTab('list'); // Return to people list after adding
      return docRef.id;
    } catch (error) {
      console.error('Error adding person: ', error);
      throw error;
    }
  };

  const handleAddArticle = async (article) => {
    try {
      console.log('Starting to add article:', article);
      
      if (!userId) {
        throw new Error('No user ID available');
      }

      const docRef = await addDoc(collection(db, 'articles'), {
        ...article,
        userId: userId,
        createdAt: new Date().toISOString()
      });
      
      console.log('Article added with ID:', docRef.id);
      setActiveTab('articles'); // Return to articles list after adding
      return docRef.id;
    } catch (error) {
      console.error('Error adding article: ', error);
      throw error;
    }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      const collectionRef = doc(db, 'collections', collectionId);
      const targetCollection = collections.find(c => c.id === collectionId);
      
      await updateDoc(collectionRef, {
        people: [...targetCollection.people, selectedPerson]
      });
      
      setShowCollectionPicker(false);
      setSelectedPerson(null);
    } catch (error) {
      console.error('Error adding to collection:', error);
      alert('Error adding to collection. Please try again.');
    }
  };

  const handleUpdatePerson = async (updatedPerson) => {
    try {
      const personRef = doc(db, 'people', updatedPerson.id);
      await updateDoc(personRef, {
        name: updatedPerson.name,
        linkedinUrl: updatedPerson.linkedinUrl,
        wikipediaUrl: updatedPerson.wikipediaUrl,
        imageUrl: updatedPerson.imageUrl,
        updatedAt: new Date().toISOString()
      });
      console.log('Person updated successfully');
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  const handleUpdateCollection = async (updatedCollection) => {
    try {
      const collectionRef = doc(db, 'collections', updatedCollection.id);
      await updateDoc(collectionRef, {
        name: updatedCollection.name,
        description: updatedCollection.description,
        updatedAt: new Date().toISOString()
      });
      console.log('Collection updated successfully');
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  };

  return (
    <div className="tab-container">
      <div className="tabs">
        <button 
          className={activeTab === 'list' ? 'active' : ''} 
          onClick={() => {
            setActiveTab('list');
            setViewingPerson(null);
            setEditingPerson(null);
          }}
        >
          People
        </button>
        <button 
          className={activeTab === 'collections' ? 'active' : ''} 
          onClick={() => {
            setActiveTab('collections');
            setSelectedCollection(null);
            setViewingPerson(null);
            setEditingPerson(null);
          }}
        >
          Collections
        </button>
        <button 
          className={activeTab === 'articles' ? 'active' : ''} 
          onClick={() => {
            setActiveTab('articles');
            setViewingPerson(null);
            setEditingPerson(null);
          }}
        >
          Articles
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'list' && !viewingPerson && !editingPerson && (
          <PeopleList 
            people={people} 
            onPersonClick={(person) => setViewingPerson(person)}
            onUpdatePerson={handleUpdatePerson}
            onAddPerson={() => setActiveTab('add')}
          />
        )}
        {activeTab === 'list' && viewingPerson && (
          <PersonProfile 
            person={viewingPerson}
            collections={collections}
            articles={articles}
            onEdit={(person) => {
              setEditingPerson(person);
              setActiveTab('edit');
            }}
            onBack={() => setViewingPerson(null)}
            onAddToCollection={(person) => {
              setSelectedPerson(person);
              setShowCollectionPicker(true);
            }}
            onPersonClick={(person) => setViewingPerson(person)}
            onCollectionClick={(collection) => {
              setSelectedCollection(collection);
              setActiveTab('collections');
            }}
          />
        )}
        {activeTab === 'collections' && !selectedCollection && (
          <CollectionsList 
            collections={collections}
            onSelectCollection={setSelectedCollection}
            userId={userId}
            onUpdateCollection={handleUpdateCollection}
            onPersonClick={(person) => {
              setViewingPerson(person);
              setActiveTab('list');
            }}
          />
        )}
        {activeTab === 'collections' && selectedCollection && (
          <CollectionView 
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
            onUpdateCollection={(updatedCollection) => {
              setSelectedCollection(updatedCollection);
            }}
            onPersonClick={(person) => {
              setViewingPerson(person);
              setActiveTab('list');
            }}
          />
        )}
        {activeTab === 'articles' && (
          <ArticlesList 
            articles={articles}
            onAddArticle={() => setActiveTab('add-article')}
            onPersonClick={(person) => {
              setViewingPerson(person);
              setActiveTab('list');
            }}
          />
        )}
        {activeTab === 'add' && <AddPerson onAddPerson={handleAddPerson} />}
        {activeTab === 'add-article' && (
          <AddArticle 
            onAddArticle={handleAddArticle}
            people={people}
            onCancel={() => setActiveTab('articles')}
          />
        )}
        {activeTab === 'edit' && editingPerson && (
          <EditPerson 
            person={editingPerson}
            onSave={async (updatedPerson) => {
              await handleUpdatePerson(updatedPerson);
              setEditingPerson(null);
              setActiveTab('list');
              setViewingPerson(null);
            }}
            onCancel={() => {
              setEditingPerson(null);
              setActiveTab('list');
            }}
          />
        )}
      </div>

      {showCollectionPicker && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add to Collection</h3>
            <p>Select a collection for {selectedPerson.name}:</p>
            <div className="collections-list">
              {collections
                .filter(col => !col.people.some(p => p.id === selectedPerson.id))
                .map(col => (
                  <button 
                    key={col.id}
                    onClick={() => handleAddToCollection(col.id)}
                    className="collection-choice"
                  >
                    {col.name}
                  </button>
                ))}
            </div>
            {collections.filter(col => !col.people.some(p => p.id === selectedPerson.id)).length === 0 && (
              <p>No available collections to add to.</p>
            )}
            <button onClick={() => setShowCollectionPicker(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabLayout; 