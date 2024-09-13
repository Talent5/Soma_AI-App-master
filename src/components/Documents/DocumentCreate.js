/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import { Editor } from '@tinymce/tinymce-react';

const AUTO_SAVE_INTERVAL = 10000; 

const DocumentCreate = ({ documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(''); 
  const [isDirty, setIsDirty] = useState(false); // To track unsaved changes
  const editorRef = useRef(null);
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
            setDocumentUrl(data.url || ''); 
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
      if (!autoSave) return;  
      return;
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
      setIsDirty(false); // Reset unsaved changes after save

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

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);
  }, [handleSave]);

  const handleEditorChange = (content) => {
    setDocumentContent(content);
    setIsDirty(true); // Mark unsaved changes
    debouncedAutoSave();
  };

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    setIsDirty(true); // Mark unsaved changes
    debouncedAutoSave();
  };

  const handleAIPrompt = async () => {
    const userPrompt = prompt('Enter a prompt for AI to generate content:');
    if (userPrompt && editorRef.current) {
      try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
          model: "text-davinci-003",
          prompt: userPrompt,
          max_tokens: 200
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          }
        });

        const aiContent = response.data.choices[0].text;
        editorRef.current.setContent(aiContent); 
        setIsDirty(true); // Mark unsaved changes
      } catch (error) {
        console.error('Error generating AI content:', error);
        alert('Failed to generate AI content.');
      }
    }
  };

  const handleBackButtonClick = () => {
    if (isDirty) { 
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to leave without saving?');
      if (!confirmDiscard) return;  
    }
    navigate('/documents'); 
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-4 ">
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY} 
        onInit={(evt, editor) => editorRef.current = editor}
        value={documentContent}
        onEditorChange={handleEditorChange}
        init={{
          height: 'calc(100% - 100px)',
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
            'emoticons template codesample toc hr pagebreak nonbreaking',
            'save directionality visualchars noneditable charmap quickbars',
            'autosave autoresize'
          ],
          toolbar: [
            'undo redo | backButton saveButton | formatselect | bold italic underline |',
            'bullist numlist outdent indent | removeformat | link image media | customAIPrompt'
          ].join(' '),
          setup: (editor) => {
            editor.ui.registry.addButton('backButton', {
              text: 'Back',
              onAction: () => {
                handleBackButtonClick();  
              }
            });

            editor.ui.registry.addButton('saveButton', {
              text: 'Save',
              onAction: () => {
                handleSave();  
              }
            });

            editor.ui.registry.addButton('customAIPrompt', {
              text: 'Generate AI Content',
              onAction: () => {
                handleAIPrompt();  
              }
            });
          },
          branding: window.innerWidth > 768 
        }}
      />

      <button
        onClick={handleAIPrompt}
        className="fixed bottom-4 right-4 bg-[#1E1548] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg hover:bg-indigo-700 transition-colors"
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






