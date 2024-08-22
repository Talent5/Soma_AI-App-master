import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, onDownload, onRename, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="bi bi-x-lg h-6 w-6"></i>
        </button>
        <ul className="space-y-2">
          <li>
            <button
              className="flex items-center text-blue-600 hover:bg-blue-100 px-4 py-2 rounded w-full text-left"
              onClick={onDownload}
            >
              <i className="bi bi-download mr-2"></i> Download
            </button>
          </li>
          <li>
            <button
              className="flex items-center text-yellow-600 hover:bg-yellow-100 px-4 py-2 rounded w-full text-left"
              onClick={onRename}
            >
              <i className="bi bi-pencil mr-2"></i> Rename
            </button>
          </li>
          <li>
            <button
              className="flex items-center text-red-600 hover:bg-red-100 px-4 py-2 rounded w-full text-left"
              onClick={onDelete}
            >
              <i className="bi bi-trash mr-2"></i> Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Modal;
