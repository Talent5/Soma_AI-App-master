/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bot, ArrowLeft, Save, Menu, History, Undo, Redo, X, Share, Download } from 'lucide-react';

const AUTO_SAVE_INTERVAL = 10000;
const WORD_COUNT_LIMIT = 5000;

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const DocumentCreate = ({ documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('Untitled document');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const autoSaveTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      if (documentId) {
        try {
          const docRef = doc(db, 'documents', documentId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDocumentTitle(data.title);
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.content))));
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
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    if (!documentTitle.trim() && !contentState.hasText()) {
      if (!autoSave) return;
    }

    setIsSaving(true);

    try {
      const documentRef = doc(db, 'documents', documentId || new Date().toISOString());
      const downloadUrl = documentUrl || `https://your-storage-url.com/${documentId}`;

      await setDoc(documentRef, {
        title: documentTitle.trim(),
        content: rawContent,
        updatedAt: new Date(),
        userId: localStorage.getItem('userId'),
        url: downloadUrl,
      });

      await addDoc(collection(db, 'documents', documentRef.id, 'history'), {
        content: rawContent,
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
  }, [documentTitle, editorState, documentId, documentUrl]);

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);
  }, [handleSave]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    setIsDirty(true);
    debouncedAutoSave();
    setWordCount(countWords(JSON.stringify(convertToRaw(state.getCurrentContent()))));
  };

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    setIsDirty(true);
    debouncedAutoSave();
  };

  const handleAIPrompt = async () => {
    if (promptInput) {
      try {
        setIsGeneratingAI(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(promptInput);
        const aiContent = result.response.text();

        const formattedAIcontent = formatContent(aiContent);

        const contentState = editorState.getCurrentContent();
        const contentStateWithAI = Modifier.insertText(
          contentState,
          editorState.getSelection(),
          formattedAIcontent
        );

        setEditorState(EditorState.push(editorState, contentStateWithAI, 'insert-characters'));

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
    const contentState = convertFromRaw(JSON.parse(version.content));
    setEditorState(EditorState.createWithContent(contentState));
    setIsDirty(true);
    setIsHistoryDialogOpen(false);
    alert("The selected version has been restored.");
  };

  const countWords = (content) => {
    return content.trim().replace(/<[^>]*>/g, '').split(/\s+/).length;
  };

  const formatContent = (content) => {
    return content.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAIDrawerOpen(false);
  };

  const toggleAIDrawer = () => {
    setIsAIDrawerOpen(!isAIDrawerOpen);
    setIsMenuOpen(false);
  };

  const handleShare = () => {
    // Implement sharing functionality
    alert("Sharing feature coming soon!");
  };

  const handleDownload = () => {
    // Implement download functionality
    alert("Download feature coming soon!");
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={toggleMenu} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
          <input
            type="text"
            value={documentTitle}
            onChange={handleTitleChange}
            style={{
              flexGrow: 1,
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              background: 'transparent',
              outline: 'none'
            }}
            placeholder="Document Title"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile && (
            <>
              <button onClick={handleShare} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Share size={20} />
              </button>
              <button onClick={handleDownload} style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Download size={20} />
              </button>
            </>
          )}
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            style={{
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main style={{
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem'
      }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true }
        }}
      />

      </main>

      <footer style={{
        padding: '0.5rem',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <span>Words: {wordCount}/{WORD_COUNT_LIMIT}</span>
        <button onClick={() => setIsHistoryDialogOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <History size={20} />
        </button>
      </footer>

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
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          background: '#1a73e8',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Bot size={24} />
      </button>

      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: isMobile ? '100%' : '300px',
          background: 'white',
          padding: '1rem',
          zIndex: 10,
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease-in-out',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}>
          <button onClick={toggleMenu} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Document Menu</h2>
          <button onClick={handleBackButtonClick} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back to Documents
          </button>
          <button onClick={() => setEditorState(EditorState.undo(editorState))} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Undo size={18} style={{ marginRight: '0.5rem' }} /> Undo
          </button>
          <button onClick={() => setEditorState(EditorState.redo(editorState))} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Redo size={18} style={{ marginRight: '0.5rem' }} /> Redo
          </button>
          {isMobile && (
            <>
              <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Share size={18} style={{ marginRight: '0.5rem' }} /> Share
              </button>
              <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Download size={18} style={{ marginRight: '0.5rem' }} /> Download
              </button>
            </>
          )}
        </div>
      )}

      {isAIDrawerOpen && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '1rem',
          zIndex: 10,
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s ease-in-out',
          transform: isAIDrawerOpen ? 'translateY(0)' : 'translateY(100%)'
        }}>
          <button onClick={toggleAIDrawer} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Assistant</h2>
          <input
            type="text"
            placeholder="Enter your prompt here..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '0.5rem',
              padding: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '4px'
            }}
          />
          <button
            onClick={handleAIPrompt}
            disabled={isGeneratingAI}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isGeneratingAI ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      )}

      {isHistoryDialogOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Document History</h2>
            {documentHistory.map((version) => (
              <div key={version.id} style={{
                marginBottom: '0.5rem',
                padding: '0.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '0.25rem'
              }}>
                <p>{new Date(version.timestamp.toDate()).toLocaleString()}</p>
                <button
                  onClick={() => restoreVersion(version)}
                  style={{
                    background: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Restore
                </button>
              </div>
            ))}
            <button
              onClick={() => setIsHistoryDialogOpen(false)}
              style={{
                background: '#f1f3f4',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isExitDialogOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            maxWidth: '90%',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Unsaved Changes</h2>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setIsExitDialogOpen(false)}
                style={{
                  marginRight: '0.5rem',
                  background: '#f1f3f4',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/documents')}
                style={{
                  background: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {wordCount > WORD_COUNT_LIMIT && (
        <div style={{
          position: 'fixed',
          top: '4rem',
          right: '1rem',
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
    </div>
  );
};

DocumentCreate.propTypes = {
  documentId: PropTypes.string,
};

export default DocumentCreate;