import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const DocumentCreate = ({ onClose, onDocumentAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = async () => {
    if (!title || !content) return;

    try {
      await addDoc(collection(db, 'documents'), {
        title,
        content,
        type: 'text',
        createdAt: new Date(),
      });
      onDocumentAdded();
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="bi bi-x-lg h-6 w-6"></i>
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Document Content"
          className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2 h-40"
        />
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleCreate}
        >
          Create Document
        </button>
      </div>
    </div>
  );
};

export default DocumentCreate;
