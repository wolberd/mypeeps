import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PeopleList from './PeopleList';
import AddPerson from './AddPerson';
import CollectionsList from './CollectionsList';
import CollectionView from './CollectionView';

function TabLayout({ userId }) {
  const [activeTab, setActiveTab] = useState('list');
  const [people, setPeople] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

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

    return () => {
      unsubscribePeople();
      unsubscribeCollections();
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
      return docRef.id; // Return the ID so AddPerson knows it succeeded
    } catch (error) {
      console.error('Error adding person: ', error);
      throw error; // Rethrow the error so AddPerson can handle it
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
        age: updatedPerson.age,
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
          onClick={() => setActiveTab('list')}
        >
          People List
        </button>
        <button 
          className={activeTab === 'collections' ? 'active' : ''} 
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''} 
          onClick={() => setActiveTab('add')}
        >
          Add Person
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'list' && (
          <PeopleList 
            people={people} 
            onPersonClick={(person) => {
              setSelectedPerson(person);
              setShowCollectionPicker(true);
            }}
            onUpdatePerson={handleUpdatePerson}
          />
        )}
        {activeTab === 'collections' && !selectedCollection && (
          <CollectionsList 
            collections={collections}
            onSelectCollection={setSelectedCollection}
            userId={userId}
            onUpdateCollection={handleUpdateCollection}
          />
        )}
        {activeTab === 'collections' && selectedCollection && (
          <CollectionView 
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
          />
        )}
        {activeTab === 'add' && <AddPerson onAddPerson={handleAddPerson} />}
      </div>

      {showCollectionPicker && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add to Collection</h3>
            <p>Select a collection for {selectedPerson.name}:</p>
            <div className="collections-list">
              {collections.map(col => (
                <button 
                  key={col.id}
                  onClick={() => handleAddToCollection(col.id)}
                  className="collection-choice"
                >
                  {col.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCollectionPicker(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabLayout; 