/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Three dots icon
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi'; // Icons for actions
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods
import { getAuth } from 'firebase/auth'; // Import Auth methods
import './DocumentCard.css';

const DocumentCard = ({ document, isMenuVisible, onMenuToggle }) => {
  const [newTitle, setNewTitle] = useState(document.title || document.name);
  const [isModalOpen, setIsModalOpen] = useState(false); // Toggle visibility of modal
  const db = getFirestore();

  // Function to handle document download
  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank'); // Open document URL in new tab
    } else {
      alert('Document URL not available.');
    }
  };

  // Function to handle renaming the document
  const handleRename = async () => {
    const newTitle = prompt("Enter new title:", document.title || document.name);
    if (newTitle) {
      try {
        const docRef = doc(db, `documents/${document.id}`); // Updated path to the Firestore document
        await updateDoc(docRef, { title: newTitle }); // Update document title
        alert('Document renamed successfully.');
        setNewTitle(newTitle); // Update local state to reflect the new title
      } catch (error) {
        console.error('Error renaming document: ', error);
        alert('Failed to rename document.');
      }
    }
  };

  // Function to handle delete operation
  const handleDelete = () => {
    setIsModalOpen(true); // Open confirmation modal
  };

  // Function to confirm deletion of the document
  const confirmDelete = async () => {
    try {
      const docRef = doc(db, `documents/${document.id}`); // Updated path to the Firestore document
      await deleteDoc(docRef); // Delete the document from Firestore
      alert('Document deleted successfully.');
      setIsModalOpen(false); // Close modal after successful deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Failed to delete document.');
      setIsModalOpen(false);
    }
  };

  // Function to cancel the delete operation
  const cancelDelete = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="relative bg-slate-50 ">
      <div className="flex justify-between items-center border-b p-4">
        <div className="flex items-center gap-2">
          {/* Document Icon */}
          <div className="bg-blue-900 text-white w-8 h-8 flex items-center justify-center rounded-md">
            <span className="text-lg">≡</span> {/* Placeholder for an icon */}
          </div>
          {/* Document Title */}
          <div>
            <h3 className="font-semibold text-base">{newTitle}</h3>
          </div>
        </div>
        {/* Three Dots Menu */}
        <div className="text-gray-500 hover:text-gray-700 cursor-pointer relative" onClick={onMenuToggle}>
          <BsThreeDotsVertical size={20} />
          {/* Dropdown Menu for actions */}
          {isMenuVisible && (
            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg p-3 z-10">
              <div onClick={handleDownload} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                <FiDownload /> <span>Download</span>
              </div>
              <div onClick={handleRename} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                <FiEdit /> <span>Rename</span>
              </div>
              <div onClick={handleDelete} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer text-red-500">
                <FiTrash2 /> <span>Delete</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">Confirm Deletion</div>
            <div className="modal-body">
              <p>Are you sure you want to delete the document titled "{document.title || document.name}"?</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button modal-confirm" onClick={confirmDelete}>Confirm</button>
              <button className="modal-button modal-cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;








