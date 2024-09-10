import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bold, Italic, Underline, Link, List, GripVertical } from 'lucide-react';
import { setDoc, doc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';

const AUTO_SAVE_INTERVAL = 10000; // Auto-save interval in milliseconds

const DocumentCreate = ({ documentId, onClose }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Auto-save the document every AUTO_SAVE_INTERVAL milliseconds
    const autoSaveInterval = setInterval(() => {
      if (documentId) {
        handleSave(true); // Auto-save without showing alerts
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(autoSaveInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleSave = async (autoSave = false) => {
    if (!documentTitle || !documentContent) {
      return alert('Please provide a title and content for the document.');
    }

    setIsSaving(true);
    try {
      const documentRef = doc(db, 'documents', documentId || new Date().toISOString());
      await setDoc(documentRef, {
        title: documentTitle,
        content: documentContent,
        updatedAt: new Date(),
        userId: localStorage.getItem('userId'), // Store user ID
      });

      if (!autoSave) {
        alert('Document saved successfully.');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save the document.');
    } finally {
      setIsSaving(false);
    }
  };

  const applyFormat = (command) => {
    if (document.execCommand) {
      document.execCommand(command, false, null);
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  // Handle content updates
  const handleInput = (e) => {
    setDocumentContent(e.currentTarget.innerHTML);
  };

  // Save on close if there are changes
  const handleOnClose = () => {
    if (documentTitle || documentContent) {
      handleSave();
    }
    if (typeof onClose === 'function') {
      onClose();
    } else {
      console.error('onClose prop is not a function');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-gray-100">
        <button onClick={handleOnClose} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="flex-grow text-lg font-semibold outline-none border-none bg-gray-100"
          placeholder="Document Title"
        />
      </div>

      {/* Document content */}
      <div
        ref={editorRef}
        contentEditable
        className="flex-grow p-4 text-base outline-none overflow-auto"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: documentContent }}
      />

      {/* Formatting toolbar */}
      <div className="flex justify-between items-center p-2 border-t bg-gray-100">
        <div className="flex space-x-4">
          <button onClick={() => applyFormat('bold')}><Bold size={20} /></button>
          <button onClick={() => applyFormat('italic')}><Italic size={20} /></button>
          <button onClick={() => applyFormat('underline')}><Underline size={20} /></button>
          <button onClick={() => applyFormat('createLink')}><Link size={20} /></button>
          <button onClick={() => applyFormat('insertUnorderedList')}><List size={20} /></button>
          <button><GripVertical size={20} /></button>
        </div>
        <button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="text-blue-500 font-semibold"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

// Prop validation
DocumentCreate.propTypes = {
  documentId: PropTypes.string,
  onClose: PropTypes.func.isRequired, // Ensure onClose is required and should be a function
};

export default DocumentCreate;



