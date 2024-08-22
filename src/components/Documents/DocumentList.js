// DocumentList.js
import React from 'react';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';

const DocumentList = ({ documents, onEdit, onDownload, onDelete, onRename }) => {
  if (documents.length === 0) return <EmptyState />;

  return (
    <div className="mt-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          documentType={doc.type}
          documentTitle={doc.title}
          onEdit={onEdit}
          onDownload={onDownload}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
};

export default DocumentList;

