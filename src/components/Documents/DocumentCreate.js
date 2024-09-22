/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, ArrowLeft, Save, Menu, History, Undo, Redo, X } from 'lucide-react';

const AUTO_SAVE_INTERVAL = 10000; // 10 seconds
const WORD_COUNT_LIMIT = 5000;

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const DocumentCreate = ({ documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [documentHistory, setDocumentHistory] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
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
            setWordCount(countWords(data.content));
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          alert("Failed to load the document. Please try again.");
        }
      }
    };

    fetchDocument();
    fetchDocumentHistory();

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [documentId]);

  const handleSave = useCallback(async (autoSave = false) => {
    if (!documentTitle.trim() && !documentContent.trim()) {
      if (!autoSave) return; 
    }

    setIsSaving(true);
    try {
      const documentRef = doc(db, 'documents', documentId || new Date().toISOString());
      const downloadUrl = documentUrl || `https://your-storage-url.com/${documentId}`; // Update with your actual storage URL

      await setDoc(documentRef, {
        title: documentTitle.trim(),
        content: documentContent.trim(),
        updatedAt: new Date(),
        userId: localStorage.getItem('userId'),
        url: downloadUrl,
      });

      // Add to document history
      await addDoc(collection(db, 'documents', documentRef.id, 'history'), {
        content: documentContent.trim(),
        timestamp: new Date(),
      });

      setDocumentUrl(downloadUrl);
      setIsDirty(false);

      if (!autoSave) {
        alert("Document saved successfully.");
      }
    } catch (error) {
      console.error('Error saving document:', error);
      if (!autoSave) {
        alert("Failed to save the document. Please try again.");
      }
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
    setIsDirty(true);
    debouncedAutoSave();
    setWordCount(countWords(content));
  };

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    setIsDirty(true);
    debouncedAutoSave();
  };

  const handleAIPrompt = async () => {
    if (promptInput && editorRef.current) {
      try {
        setIsGeneratingAI(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(promptInput);
        const aiContent = result.response.text();
        const formattedContent = formatContent(aiContent);
        editorRef.current.setContent(formattedContent);
        setIsDirty(true);
        setIsAIDrawerOpen(false);
        alert("AI-generated content has been added to your document.");
      } catch (error) {
        console.error('Error generating AI content:', error);
        alert("Failed to generate AI content. Please try again.");
      } finally {
        setIsGeneratingAI(false);
      }
    }
  };

  const handleBackButtonClick = () => {
    if (isDirty) {
      setIsExitDialogOpen(true);
    } else {
      navigate('/documents');
    }
  };

  const fetchDocumentHistory = async () => {
    if (documentId) {
      try {
        const historyRef = collection(db, 'documents', documentId, 'history');
        const historySnapshot = await getDocs(historyRef);
        const history = historySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocumentHistory(history);
      } catch (error) {
        console.error('Error fetching document history:', error);
        alert("Failed to load document history.");
      }
    }
  };

  const restoreVersion = (version) => {
    if (editorRef.current) {
      editorRef.current.setContent(version.content);
      setIsDirty(true);
      setIsHistoryDialogOpen(false);
      alert("The selected version has been restored.");
    }
  };

  const countWords = (content) => {
    return content.trim().split(/\s+/).length;
  };

  const formatContent = (content) => {
    const lines = content.split('\n');
    const formattedLines = lines.map((line) => {
      if (line.startsWith('* ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      return `<p>${line}</p>`;
    });
    return `<ul>${formattedLines.join('')}</ul>`; 
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAIDrawerOpen(false); // Close AI drawer if open
  };

  const toggleAIDrawer = () => {
    setIsAIDrawerOpen(!isAIDrawerOpen);
    setIsMenuOpen(false); // Close menu if open
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {!isMenuOpen && !isAIDrawerOpen && ( 
        <header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.5rem', 
          borderBottom: '1px solid #ccc',
          position: 'relative' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={toggleMenu}><Menu size={24} /></button>
          </div>
          <input
            type="text"
            value={documentTitle}
            onChange={handleTitleChange}
            style={{ flexGrow: 1, margin: '0 0.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
            placeholder="Document Title"
          />
          <button onClick={() => handleSave()} disabled={isSaving}>
            <Save size={24} />
          </button>

          {wordCount > WORD_COUNT_LIMIT && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '0.75rem', 
              borderRadius: '0.25rem', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 10 
            }}>
              <p>You have exceeded the {WORD_COUNT_LIMIT} word limit. Please reduce your content.</p>
            </div>
          )}
        </header>
      )}

      <main style={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        paddingTop: isMenuOpen || isAIDrawerOpen ? '0' : '0.5rem',
        paddingBottom: isMenuOpen || isAIDrawerOpen ? '0' : '0.5rem'
      }}>
        <Editor 
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY} 
          onInit={(evt, editor) => editorRef.current = editor}
          value={documentContent}
          onEditorChange={handleEditorChange}
          init={{
            height: '100%',
            menubar: false,
            plugins: [
              'advlist autolink lists link image',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            mobile: {
              theme: 'mobile',
              plugins: ['autosave', 'lists', 'autolink'],
              toolbar: ['undo', 'bold', 'italic', 'styleselect', 'bullist', 'numlist']
            }
          }}
        />
      </main>

      {/* Footer */}
      {!isMenuOpen && !isAIDrawerOpen && (
        <footer style={{ padding: '0.5rem', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Words: {wordCount}/{WORD_COUNT_LIMIT}</span>
          <button onClick={() => setIsHistoryDialogOpen(true)}>
            <History size={24} />
          </button>
        </footer>
      )}

      {/* AI Button */}
      {!isMenuOpen && !isAIDrawerOpen && (
        <button
          onClick={toggleAIDrawer}
          style={{ 
            position: 'fixed', 
            bottom: '1rem', 
            right: '1rem', 
            borderRadius: '50%', 
            width: '3rem', 
            height: '3rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}
        >
          <Bot size={24} />
        </button>
      )}

      {/* Menu */}
      {isMenuOpen && (
        <div className='gap-2' style={{ 
          position: '', 
          top: 0,  
          bottom: 0, 
          width: '80%', 
          maxWidth: '300px', 
          background: 'white', 
          padding: '1rem', 
          zIndex: 10, 
          
        }}>
          <span onClick={toggleMenu} className='top-2 text-left text-xl cursor-pointer'>X</span>
          <button onClick={handleBackButtonClick} className='' style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Documents
          </button>
          <button onClick={() => editorRef.current?.execCommand('Undo')} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Undo size={18} style={{ marginRight: '0.5rem' }} /> Undo
          </button>
          <button onClick={() => editorRef.current?.execCommand('Redo')} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Redo size={18} style={{ marginRight: '0.5rem' }} /> Redo
          </button>
          {/* ... Add other menu items as needed ... */}
        </div>
      )}

      {/* AI Drawer */}
      {isAIDrawerOpen && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: '1rem', zIndex: 10 }}>
          <button onClick={toggleAIDrawer} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
            <X size={24} />
          </button>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Assistant</h2>
          <input
            type="text"
            placeholder="Enter your prompt here..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          <button onClick={handleAIPrompt} disabled={isGeneratingAI} style={{ width: '100%', padding: '0.5rem' }}>
            {isGeneratingAI ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      )}

      {/* History Dialog */}
      {isHistoryDialogOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Document History</h2>
            {documentHistory.map((version) => (
              <div key={version.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}>
                <p>{new Date(version.timestamp.toDate()).toLocaleString()}</p>
                <button onClick={() => restoreVersion(version)}>Restore</button>
              </div>
            ))}
            <button onClick={() => setIsHistoryDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Exit Dialog */}
      {isExitDialogOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Unsaved Changes</h2>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setIsExitDialogOpen(false)} style={{ marginRight: '0.5rem' }}>Cancel</button>
              <button onClick={() => navigate('/documents')}>Leave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DocumentCreate.propTypes = {
  documentId: PropTypes.string,
};

export default DocumentCreate;





