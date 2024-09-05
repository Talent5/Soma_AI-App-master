import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

const DocumentList = ({ searchTerm }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Use Firestore's modular SDK methods
    const docCollectionRef = collection(db, 'documents');

    // Subscribe to the collection
    const unsubscribe = onSnapshot(docCollectionRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Filter documents based on the search term
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredDocuments.length === 0) return <EmptyState />;

  return (
    <div className="mt-4">
      {filteredDocuments.map((doc) => (
        <DocumentCard
          key={doc.id}
          documentType={doc.url.split('.').pop()} // Assuming 'url' exists and is a valid URL
          documentTitle={doc.title}
          onEdit={() => console.log('Edit document', doc.id)}
          onDownload={() => window.open(doc.url, '_blank')}
          onDelete={() => console.log('Delete document', doc.id)}
          onRename={() => console.log('Rename document', doc.id)}
        />
      ))}
    </div>
  );
};

export default DocumentList;
