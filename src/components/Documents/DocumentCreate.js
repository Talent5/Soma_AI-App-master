/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Axios for making API calls
import { Editor } from '@tinymce/tinymce-react';

const AUTO_SAVE_INTERVAL = 10000; // Auto-save interval in milliseconds

const DocumentCreate = ({ documentId, onClose }) => {
  const [documentTitle, setDocumentTitle] = useState('untitled document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const cursorPositionRef = useRef(0);
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
      if (!autoSave) return;  // No title and content to save
      return;
    }

    if (!documentTitle.trim() || !documentContent.trim()) {
      if (!autoSave) alert('Please provide a title and content for the document.');
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

  // Handle content changes in the editor
  const handleEditorChange = (content) => {
    setDocumentContent(content);
    debouncedAutoSave();
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    debouncedAutoSave();
  };

  // AI-generated content using OpenAI's GPT API
  const generateAIContent = async (prompt) => {
    if (editorRef.current) {
      try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 200
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          }
        });

        const aiContent = response.data.choices[0].text;
        editorRef.current.setContent(aiContent);  // Insert AI-generated content into the editor
      } catch (error) {
        console.error('Error generating AI content:', error);
        alert('Failed to generate AI content.');
      }
    }
  };

  // Handle back button click and save document before navigating back
  const handleBackButtonClick = () => {
    if (documentContent.trim() || documentTitle.trim()) {
      handleSave(false);  // Save if there is content or a title
    }
    navigate('/documents');
  };

  // Prompt user to input prompt text for AI generation
  const handleAIPrompt = () => {
    const userPrompt = prompt('Enter a prompt for AI to generate content:');
    if (userPrompt) {
      generateAIContent(userPrompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex justify-start top-0 left-0">
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

      {/* TinyMCE Editor */}
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY} // TinyMCE API key
        onInit={(evt, editor) => editorRef.current = editor}
        value={documentContent}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | customAIPrompt',
          setup: (editor) => {
            // Add a custom button for AI content generation
            editor.ui.registry.addButton('customAIPrompt', {
              text: 'Generate AI Content',
              onAction: () => {
                handleAIPrompt();  // Trigger AI content generation
              }
            });
          }
        }}
      />

      {/* Button to bring up AI prompt */}
      <button
        onClick={handleAIPrompt}
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



