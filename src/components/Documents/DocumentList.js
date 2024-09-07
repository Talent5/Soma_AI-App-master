// DocumentList.js

import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase'; // Firebase config
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import DocumentCard from './DocumentCard'
import EmptyState from './EmptyState'

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid; // Ensure user is logged in

    if (!userId) {
      console.log("User not logged in");
      return;
    }

    const q = query(collection(db, 'documents'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDocuments(docs);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  return (
    <div>
      {documents.length > 0 ? (
        documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))
      ) : (
        <EmptyState/>
      )}
    </div>
  );
};

export default DocumentList;




