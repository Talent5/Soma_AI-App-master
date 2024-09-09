import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Three dots icon
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi'; // Icons for actions
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods
import { getAuth } from 'firebase/auth'; // Import Auth methods
import './DocumentCard.css'

const DocumentCard = ({ document }) => {
  const [menuVisible, setMenuVisible] = useState(false); // Toggle visibility of menu
  const [newTitle, setNewTitle] = useState(document.title || document.name);
  const [isModalOpen, setIsModalOpen] = useState(false); // Toggle visibility of modal
  const db = getFirestore();
  const auth = getAuth();

  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      alert('Document URL not available.');
    }
  };

  const handleRename = async () => {
    const newTitle = prompt("Enter new title:", document.title || document.name);
    if (newTitle) {
      try {
        const docRef = doc(db, `users/${auth.currentUser.uid}/documents/${document.id}`);
        await updateDoc(docRef, { title: newTitle });
        alert('Document renamed successfully.');
        setNewTitle(newTitle);
      } catch (error) {
        console.error('Error renaming document: ', error);
        alert('Failed to rename document.');
      }
    }
  };

  const handleDelete = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const docRef = doc(db, `users/${auth.currentUser.uid}/documents/${document.id}`);
      await deleteDoc(docRef);
      alert('Document deleted successfully.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Failed to delete document.');
      setIsModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center border-b p-3">
        <div className="flex items-center gap-3">
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
        <div className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setMenuVisible(!menuVisible)}>
          <BsThreeDotsVertical size={20} />
        </div>
      </div>

      {/* Menu for actions */}
      {menuVisible && (
        <div className="absolute right-0 bg-white border shadow-lg rounded-lg p-3">
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






