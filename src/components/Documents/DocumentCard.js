import React from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DocumentCard = ({ document }) => {
  const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit document', document.id);
  };

  const handleDownload = () => {
    window.open(document.url, '_blank');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDoc(doc(db, 'documents', document.id));
        console.log('Document deleted successfully');
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const handleRename = async () => {
    const newTitle = prompt('Enter new title for the document:', document.title);
    if (newTitle && newTitle !== document.title) {
      try {
        await updateDoc(doc(db, 'documents', document.id), { title: newTitle });
        console.log('Document renamed successfully');
      } catch (error) {
        console.error('Error renaming document:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">{document.title}</h4>
          <p className="text-sm text-gray-500">Type: {document.type || 'Unknown'}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleEdit} className="text-blue-500">Edit</button>
          <button onClick={handleDownload} className="text-green-500">Download</button>
          <button onClick={handleRename} className="text-yellow-500">Rename</button>
          <button onClick={handleDelete} className="text-red-500">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;





