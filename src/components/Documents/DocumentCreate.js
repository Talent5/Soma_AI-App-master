/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill';  // Import Quill

const AUTO_SAVE_INTERVAL = 10000;  // Auto-save interval in milliseconds

const DocumentCreate = ({ documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false); // Track keyboard activity
  const editorRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Fetch document from Firestore if documentId is provided
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

  // Save document to Firestore
  const handleSave = useCallback(async (autoSave = false) => {
    if (!documentTitle.trim() && !documentContent.trim()) {
      if (!autoSave) return;
      return;
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
      }
    } catch (error) {
      console.error('Error saving document:', error);
      if (!autoSave) alert('Failed to save the document.');
    } finally {
      setIsSaving(false);
    }
  }, [documentTitle, documentContent, documentId]);

  // Auto-save content after user stops typing
  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);
  }, [handleSave]);

  // Handle content changes in Quill editor
  const handleEditorChange = (content) => {
    setDocumentContent(content);
    debouncedAutoSave();
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    debouncedAutoSave();
  };

  // Handle keyboard activity to toggle the toolbar
  const handleKeyboardToggle = () => {
    const isKeyboardVisible = window.innerHeight < document.documentElement.clientHeight;
    setIsKeyboardActive(isKeyboardVisible);
  };

  // AI-generated content using OpenAI's GPT API
  const generateAIContent = async (prompt) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 200
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });

      const aiContent = response.data.choices[0].text;
      setDocumentContent(prevContent => prevContent + aiContent);
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Failed to generate AI content.');
    }
  };

  useEffect(() => {
    // Detect keyboard activity on mobile
    window.addEventListener('resize', handleKeyboardToggle);
    return () => {
      window.removeEventListener('resize', handleKeyboardToggle);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex justify-start top-0 left-0">
        <button onClick={() => navigate('/documents')} className="mr-4 text-2xl text-gray-600 hover:text-gray-800">
          ←
        </button>
        <input
          type="text"
          value={documentTitle}
          onChange={handleTitleChange}
          className="flex-grow text-lg font-normal border-none outline-none"
          placeholder="Untitled Document"
        />
      </div>

      <ReactQuill
        ref={editorRef}
        value={documentContent}
        onChange={handleEditorChange}
        modules={{
          toolbar: isKeyboardActive ? [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]] : false
        }}
        className="flex-grow"
      />

      {/* Button to bring up AI prompt */}
      <button
        onClick={() => {
          const userPrompt = prompt('Enter a prompt for AI to generate content:');
          if (userPrompt) generateAIContent(userPrompt);
        }}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg hover:bg-indigo-700 transition-colors"
      >
        🤖
      </button>
    </div>
  );
};

DocumentCreate.propTypes = {
  documentId: PropTypes.string,
};

export default DocumentCreate;





