import React from 'react';

const DocumentCard = ({ document }) => {
  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      alert('Document URL not available.');
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="font-semibold text-lg">{document.title}</h3>
      <p className="text-gray-600 mb-2">{document.description}</p>
      <div className="flex gap-2">
        {document.tags && document.tags.map(tag => (
          <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm">{tag}</span>
        ))}
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download
      </button>
    </div>
  );
};

export default DocumentCard;






