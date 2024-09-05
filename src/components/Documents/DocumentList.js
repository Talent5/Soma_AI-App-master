import React from 'react';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

const DocumentList = ({ documents, searchTerm }) => {
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="grid gap-4">
      {filteredDocuments.length > 0 ? (
        filteredDocuments.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))
      ) : (
        <EmptyState/>
      )}
    </div>
  );
};

export default DocumentList;

