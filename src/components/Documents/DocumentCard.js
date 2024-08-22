// DocumentCard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal'; // Import the Modal component

const DocumentCard = ({ documentType, documentTitle, onEdit, onDownload, onDelete, onRename }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex items-center p-4 m-6 border-b border-gray-300">
      <span className="flex-1 text-base text-gray-900 font-medium ml-2">{documentTitle}</span>
      <i className="bi bi-three-dots-vertical h-6 w-6 text-gray-400 cursor-pointer" onClick={handleOpenModal}></i>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={onDownload}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
};

DocumentCard.propTypes = {
  documentType: PropTypes.oneOf(["doc", "pdf"]),
  documentTitle: PropTypes.string,
  onEdit: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
  onRename: PropTypes.func,
};

export default DocumentCard;


