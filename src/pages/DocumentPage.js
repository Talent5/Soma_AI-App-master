import React, { useState } from 'react';
import Header from '../components/Documents/Header';
import DocumentList from '../components/Documents/DocumentList';
import DocumentUpload from '../components/Documents/DocumentUpload';
import DocumentCreate from '../components/Documents/DocumentCreate';
import ActionButton from '../components/Documents/ActionButton';
import { NavBar } from '../components/NavBar';

export const DocumentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');    // State to manage search input
  const [isUploadOpen, setIsUploadOpen] = useState(false);  // State for upload modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);  // State for create modal
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true); // Loading state for documents

  // Handle search input from Header component
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle upload document button click
  const handleUploadClick = () => {
    setIsUploadOpen(true);  // Open the upload modal
  };

  // Handle create document button click
  const handleCreateClick = () => {
    setIsCreateOpen(true);  // Open the create modal
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with search functionality */}
      <Header title="Documents" onSearch={handleSearch} />
      
      {/* Main content area for displaying documents */}
      <main className="rounded-lg m-4 flex-grow overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading documents...</p>
          </div>
        ) : (
          <DocumentList searchTerm={searchTerm} />
        )}
      </main>

      {/* Action Button for Upload and Create document functionality */}
      <ActionButton
        onUploadClick={handleUploadClick}
        onCreateClick={handleCreateClick}
      />

      {/* Bottom navigation bar */}
      <NavBar />

      {/* Modal for uploading a document */}
      {isUploadOpen && (
        <DocumentUpload onClose={() => setIsUploadOpen(false)} />
      )}

      {/* Modal for creating a new document */}
      {isCreateOpen && (
        <DocumentCreate onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};











