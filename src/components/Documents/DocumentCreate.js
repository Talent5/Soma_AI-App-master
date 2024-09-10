/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AUTO_SAVE_INTERVAL = 10000; // Auto-save interval in milliseconds

const DocumentCreate = ({ documentId, onClose }) => {
  const [documentTitle, setDocumentTitle] = useState('untitled document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const autoSaveTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      if (documentId) {
        try {
          const docRef = doc(db, 'documents', documentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDocumentTitle(data.title);
            setDocumentContent(data.content);
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          alert('Failed to load the document.');
        }
      }
    };

    fetchDocument();

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [documentId]);

  const handleSave = useCallback(async (autoSave = false) => {
    if (!documentTitle.trim() && !documentContent.trim()) {
      if (!autoSave) {
        navigate('/documents'); // Navigate to the documents page if no title and content
        return; // Don't save
      }
      return; // Do nothing if auto-save
    }

    if (!documentTitle.trim() || !documentContent.trim()) {
      if (!autoSave) {
        alert('Please provide a title and content for the document.');
      }
      return; // Don't save if title or content is missing
    }

    setIsSaving(true);
    try {
      const documentRef = doc(db, 'documents', documentId || new Date().toISOString());
      await setDoc(documentRef, {
        title: documentTitle.trim(),
        content: documentContent.trim(),
        updatedAt: new Date(),
        userId: localStorage.getItem('userId'),
      });

      if (!autoSave) {
        alert('Document saved successfully.');
        navigate('/documents'); // Navigate to the documents page after saving
      }
    } catch (error) {
      console.error('Error saving document:', error);
      if (!autoSave) {
        alert('Failed to save the document.');
      }
    } finally {
      setIsSaving(false);
    }
  }, [documentTitle, documentContent, documentId, navigate]);

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);
  }, [handleSave]);

  const handleInput = useCallback((e) => {
    const newContent = e.target.value;
    setDocumentContent(newContent);
    cursorPositionRef.current = e.target.selectionStart;
    debouncedAutoSave();
  }, [debouncedAutoSave]);

  const handleTitleChange = useCallback((e) => {
    setDocumentTitle(e.target.value);
    debouncedAutoSave();
  }, [debouncedAutoSave]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
    }
  }, [documentContent]);

  const handleFocusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleBackButtonClick = () => {
    if (!documentTitle.trim() && !documentContent.trim()) {
      navigate('/documents'); // Navigate to the documents page without saving
    } else {
      handleSave(false); // Save the document if there is content
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex items-center p-4 border-b">
        <button onClick={handleBackButtonClick} className="mr-4 text-2xl text-gray-600 hover:text-gray-800">
          ←
        </button>
        <input
          type="text"
          value={documentTitle}
          onChange={handleTitleChange}
          className="flex-grow text-lg font-normal border-none outline-none"
          placeholder="Untitled document"
        />
      </div>

      <textarea
        ref={editorRef}
        value={documentContent}
        onChange={handleInput}
        className="flex-grow p-4 text-base outline-none overflow-auto resize-none"
        placeholder="Start typing your document here..."
      />

      <button
        onClick={handleFocusEditor}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg hover:bg-indigo-700 transition-colors"
      >
        ✏️
      </button>
    </div>
  );
};

DocumentCreate.propTypes = {
  documentId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default DocumentCreate;


