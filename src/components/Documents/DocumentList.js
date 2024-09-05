import React from 'react';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

const DocumentList = ({ documents, searchTerm }) => {
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredDocuments.length === 0) return <EmptyState />;

  return (
    <div className="mt-4">
      {filteredDocuments.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
        />
      ))}
    </div>
  );
};

export default DocumentList;
