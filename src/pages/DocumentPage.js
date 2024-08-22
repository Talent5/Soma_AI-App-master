// DocumentPage.js
import React, { useState } from 'react';
import Header from '../components/Documents/Header';
import DocumentList from '../components/Documents/DocumentList';
import ActionButton from '../components/Documents/ActionButton';
import { NavBar } from '../components/NavBar';

export const DocumentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 1, type: "pdf", title: "Statement of Purpose for Wix Scholarship" },
    { id: 2, type: "doc", title: "Recommendation Letter for MWI Grant" },
    // Add more documents as needed
  ];

  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter documents based on the search term
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditDocument = () => {
    console.log('Edit document');
  };

  const handleDownloadDocument = () => {
    console.log('Download document');
  };

  const handleDeleteDocument = () => {
    console.log('Delete document');
  };

  const handleRenameDocument = () => {
    console.log('Rename document');
  };

  const handleAddButtonClick = () => {
    console.log('Add button clicked');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Documents" onSearch={handleSearch} />
      <main className="bg-slate-50 border-1 rounded-lg m-4 flex-grow overflow-auto">
        <DocumentList
          documents={filteredDocuments}
          onEdit={handleEditDocument}
          onDownload={handleDownloadDocument}
          onDelete={handleDeleteDocument}
          onRename={handleRenameDocument}
        />
      </main>
      <ActionButton onClick={handleAddButtonClick} />
      <NavBar />
    </div>
  );
};







