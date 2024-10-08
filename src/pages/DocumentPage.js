// src/pages/DocumentPage.js
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../components/config/firebase';
import Header from '../components/Documents/Header';
import DocumentList from '../components/Documents/DocumentList';
import DocumentUpload from '../components/Documents/DocumentUpload';
import DocumentCreate from '../components/Documents/DocumentCreate';
import ActionButton from '../components/Documents/ActionButton';
import { NavBar } from '../components/NavBar';

export const DocumentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true); // Start with true for loading state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'documents'), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
      setLoading(false); // Set loading to false once data is fetched
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const handleDocumentAdded = () => {
    setIsUploadOpen(false);
    setIsCreateOpen(false);
  };

  const closeUploadModal = () => setIsUploadOpen(false);
  const closeCreateModal = () => setIsCreateOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <Header title="Documents" onSearch={handleSearch} />
      
      <main className="rounded-lg m-4 flex-grow overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading documents...</p>
          </div>
        ) : (
          <DocumentList documents={documents} searchTerm={searchTerm} />
        )}
      </main>

      <ActionButton
        onUploadClick={handleUploadClick}
        onCreateClick={handleCreateClick}
      />

      <NavBar />

      {isUploadOpen && (
        <DocumentUpload
          onClose={closeUploadModal} // Ensure this is a function
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      {isCreateOpen && (
        <DocumentCreate
          onClose={closeCreateModal} // Ensure this is a function
          onDocumentAdded={handleDocumentAdded}
        />
      )}
    </div>
  );
};












