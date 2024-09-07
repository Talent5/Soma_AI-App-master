import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const DocumentUpload = ({ onClose, onDocumentAdded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const storage = getStorage();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccessMessage('');

    if (selectedFile) {
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        setError('Invalid file type. Only PDF, JPEG, and PNG are allowed.');
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds 10MB.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `documents/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        setError('Failed to upload document. Please try again.');
        setUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'documents'), {
            title: file.name,
            url,
            type: file.type,
            createdAt: new Date(),
          });
          setSuccessMessage('Document uploaded successfully!');
          onDocumentAdded(); // Trigger the parent callback
          setFile(null);
          setProgress(0);
        } catch (error) {
          console.error('Error adding document:', error);
          setError('Failed to save document. Please try again.');
        }
        setUploading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
          disabled={uploading}
        />
        {file && (
          <p className="text-sm text-gray-700 mb-3">
            Selected File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        {progress > 0 && uploading && (
          <p className="text-sm text-blue-500 mb-3">Uploading: {Math.round(progress)}%</p>
        )}
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        {successMessage && <p className="text-sm text-green-500 mb-3">{successMessage}</p>}

        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded text-white ${
              uploading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;


