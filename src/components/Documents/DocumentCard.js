import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Three dots icon
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi'; // Icons for actions

const DocumentCard = ({ document }) => {
  const [menuVisible, setMenuVisible] = useState(false); // Toggle visibility of menu

  const handleDownload = () => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      alert('Document URL not available.');
    }
  };

  const handleRename = () => {
    // Implement the rename functionality here
    alert(`Rename document: ${document.title}`);
  };

  const handleDelete = () => {
    // Implement the delete functionality here
    alert(`Delete document: ${document.title}`);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center border-b p-3">
        <div className="flex items-center gap-3">
          {/* Document Icon */}
          <div className="bg-blue-900 text-white w-8 h-8 flex items-center justify-center rounded-md">
            <span className="text-lg">≡</span> {/* Placeholder for an icon */}
          </div>
          {/* Document Title */}
          <div>
            <h3 className="font-semibold text-base">{document.title || document.name}</h3>
          </div>
        </div>
        {/* Three Dots Menu */}
        <div className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setMenuVisible(!menuVisible)}>
          <BsThreeDotsVertical size={20} />
        </div>
      </div>

      {/* Menu for actions */}
      {menuVisible && (
        <div className="absolute right-0 bg-white border shadow-lg rounded-lg p-3">
          <div onClick={handleDownload} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
            <FiDownload /> <span>Download</span>
          </div>
          <div onClick={handleRename} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
            <FiEdit /> <span>Rename</span>
          </div>
          <div onClick={handleDelete} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer text-red-500">
            <FiTrash2 /> <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;





