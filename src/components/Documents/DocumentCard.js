import React from 'react';

const DocumentCard = ({ documentType, documentTitle, onEdit, onDownload, onDelete, onRename }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">{documentTitle}</h4>
          <p className="text-sm text-gray-500">Type: {documentType}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-blue-500">Edit</button>
          <button onClick={onDownload} className="text-green-500">Download</button>
          <button onClick={onRename} className="text-yellow-500">Rename</button>
          <button onClick={onDelete} className="text-red-500">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;





