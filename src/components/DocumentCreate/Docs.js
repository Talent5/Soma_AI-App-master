/* eslint-disable react-hooks/exhaustive-deps */
// Docs.js
import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { db } from '../config/firebase';
import styles from './Docs.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

export const Docs = () => {
  const [showModal, setShowModal] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userDocsRef = collection(db, 'userDocs', userId, 'docs');
      const q = query(userDocsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalToggle = () => {
    setShowModal((prev) => !prev);
    setDocumentName('');
  };

  const handleCreate = async () => {
    if (!documentName.trim()) {
      alert("Document name cannot be empty.");
      return;
    }

    try {
      const userDocsRef = collection(db, 'userDocs', userId, 'docs');
      await addDoc(userDocsRef, {
        fileName: documentName.trim(),
        timestamp: serverTimestamp(),
      });
      console.log('Document created successfully');
      setShowModal(false);
      setDocumentName('');
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  return (
    <div className={`${styles.container} min-h-screen w-screen bg-white`}>
      <Header />
      <section className="bg-[#F8F9FA] pb-10 p-4 md:p-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between py-6 flex-nowrap">
            <h2 className="text-gray-700 text-lg whitespace-nowrap">
              Start a new Document
            </h2>
            <button
              type="button"
              aria-label="Grid"
              className="ripple-button text-gray-700 mx-2"
              onClick={handleModalToggle}
            >
              <i className="bi-three-dots-vertical" style={{ fontSize: '20px' }}></i>
            </button>
          </div>
          <div
            className="h-32 w-32 border-2 cursor-pointer hover:border-blue-700 mx-auto"
            onClick={handleModalToggle}
          >
            <img src="https://links.papareact.com/pju" alt="Blank Document" className="w-full h-full object-cover" />
          </div>
          <p className="ml-2 mt-2 font-semibold text-sm text-gray-700 text-center">Blank</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-md mx-auto py-4 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <h2 className="font-medium flex-grow">My Documents</h2>
            <i className="bi bi-folder-fill text-gray-600 text-3xl"></i>
          </div>
          {isLoading ? (
            <p className="text-center">Loading documents...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : documents.length === 0 ? (
            <p className="text-center">No documents found. Create a new one to get started!</p>
          ) : (
            documents.map((doc) => (
              <div 
                onClick={() => navigate(`/doc/${doc.id}`)} // Navigate to the document detail page
                key={doc.id}
                className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer justify-between"
              >
                <div className="flex items-center">
                  <i className="bi bi-file-earmark-text text-primary me-3" style={{ fontSize: '24px' }}></i>
                  <p className="mb-0 text-truncate" style={{ maxWidth: '120px' }}>{doc.filename || 'Untitled'}</p>
                </div>
                <p className="mb-0 text-muted mx-3 text-xs">
                  {doc.timestamp && doc.timestamp.toDate ? 
                    doc.timestamp.toDate().toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) 
                    : 'No date available'}
                </p>
                <button
                  type="button"
                  aria-label="Options"
                  className="ripple-button text-gray-700"
                  onClick={handleModalToggle}
                >
                  <i className="bi-three-dots-vertical" style={{ fontSize: '20px' }}></i>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog" style={{ maxWidth: '400px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Document</h5>
                <button type="button" className="btn-close" onClick={handleModalToggle}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Document Name"
                  className="form-control"
                />
              </div>
              <div className="modal-footer gap-2 flex justify-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
