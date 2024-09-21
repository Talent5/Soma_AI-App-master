import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { Bot, ArrowLeft, Save } from 'lucide-react';

const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

const DocumentCreate = ({ documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Fetch document data on mount
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
            setDocumentUrl(data.url || '');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          alert('Failed to load the document.');
        }
      }
    };

    fetchDocument();

    // Clean up timeout when component unmounts
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
    }

    setIsSaving(true);
    try {
      const documentRef = doc(db, 'documents', documentId || new Date().toISOString());
      const downloadUrl = documentUrl || `https://your-storage-url.com/${documentId}`;

      await setDoc(documentRef, {
        title: documentTitle.trim(),
        content: documentContent.trim(),
        updatedAt: new Date(),
        userId: localStorage.getItem('userId'),
        url: downloadUrl,
      });

      setDocumentUrl(downloadUrl);
      setIsDirty(false);

      if (!autoSave) {
        alert('Document saved successfully.');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      if (!autoSave) alert('Failed to save the document.');
    } finally {
      setIsSaving(false);
    }
  }, [documentTitle, documentContent, documentId, documentUrl]);

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);
  }, [handleSave]);

  // Update editor content and trigger auto-save
  const handleEditorChange = (content) => {
    setDocumentContent(content);
    setIsDirty(true);
    debouncedAutoSave();
  };

  // Handle title change and trigger auto-save
  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    setIsDirty(true);
    debouncedAutoSave();
  };

  // AI Content Generation using Gemini API
  const handleAIPrompt = async () => {
    const userPrompt = prompt('Enter a prompt for AI to generate content:');
    if (userPrompt && editorRef.current) {
      try {
        setIsSaving(true); // Show loading state

        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          {
            contents: [{ parts: [{ text: userPrompt }] }]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`
            }
          }
        );

        const aiContent = response.data.candidates[0].content.parts[0].text;
        editorRef.current.setContent(aiContent);
        setIsDirty(true);
      } catch (error) {
        console.error('Error generating AI content:', error);
        alert('Failed to generate AI content.');
      } finally {
        setIsSaving(false); // Hide loading state
      }
    }
  };

  // Handle navigation back with unsaved changes check
  const handleBackButtonClick = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to leave without saving?');
      if (!confirmDiscard) return;
    }
    navigate('/documents');
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-2">
      <div className="flex items-center justify-between mb-2">
        <button onClick={handleBackButtonClick} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <input
          type="text"
          value={documentTitle}
          onChange={handleTitleChange}
          className="flex-grow mx-2 p-2 text-lg font-bold border-b"
          placeholder="Document Title"
        />
        <button onClick={() => handleSave()} className="p-2" disabled={isSaving}>
          <Save size={24} />
        </button>
      </div>

      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        value={documentContent}
        onEditorChange={handleEditorChange}
        init={{
          height: '100%',
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          mobile: {
            theme: 'mobile',
            plugins: ['autosave', 'lists', 'autolink'],
            toolbar: ['undo', 'bold', 'italic', 'styleselect']
          }
        }}
      />

      <button
        onClick={handleAIPrompt}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Bot size={24} />
      </button>
    </div>
  );
};

DocumentCreate.propTypes = {
  documentId: PropTypes.string,
};

export default DocumentCreate;






