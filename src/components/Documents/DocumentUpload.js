import React, { useState } from 'react';
import { storage, db } from '../config/firebase';

const DocumentUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title) return;

    const storageRef = storage.ref(`documents/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        await db.collection('documents').add({
          title,
          url: downloadURL,
          createdAt: new Date(),
        });
        setFile(null);
        setTitle('');
        onClose(); // Close the modal
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 relative">
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
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-2"
        />
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;
