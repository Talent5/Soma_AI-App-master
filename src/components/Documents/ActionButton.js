import React, { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentCreate from './DocumentCreate';

const ActionButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
    closeDropdown();
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
    closeDropdown();
  };

  const closeUploadModal = () => setIsUploadModalOpen(false);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="relative">
      <button
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#1E1548] text-white p-4 rounded-lg shadow-lg"
        onClick={toggleDropdown}
      >
        <i className="bi bi-plus h-6 w-6"></i>
      </button>
      {isDropdownOpen && (
        <div className="absolute bottom-16 right-4 bg-white shadow-lg rounded-lg border border-gray-300 w-48">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleUploadClick}
          >
            <i className="bi bi-upload mr-2"></i> Upload Document
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={handleCreateClick}
          >
            <i className="bi bi-file-earmark-text mr-2"></i> Create Document
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={closeDropdown}
          >
            Close
          </button>
        </div>
      )}
      {/* Render the DocumentUpload modal when triggered */}
      {isUploadModalOpen && (
        <DocumentUpload
          onClose={closeUploadModal}
          onDocumentAdded={() => {
            // Perform any action after document is added
            closeUploadModal();
          }}
        />
      )}
      {/* Render the DocumentCreate modal if needed */}
      {isCreateModalOpen && <DocumentCreate onClose={closeCreateModal} />}
    </div>
  );
};

export default ActionButton;




