import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const DocumentCreate = ({ onClose }) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [useAI, setUseAI] = useState(false); // Toggle AI mode
  const [aiPrompt, setAiPrompt] = useState(''); // Store user prompt for AI

  const handleSave = async () => {
    if (!documentTitle || !documentContent) {
      return alert('Please provide a title and content for the document.');
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'documents'), {
        title: documentTitle,
        content: documentContent,
        createdAt: new Date(),
      });
      alert('Document saved successfully.');
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save the document.');
    }
    setIsSaving(false);
  };

  // Function to generate AI content
  const handleAIContent = async () => {
    if (!aiPrompt) return alert('Please enter a prompt for AI assistance.');

    // Placeholder: Here you can call the AI service (OpenAI, etc.)
    const aiResponse = `This is a generated document based on the prompt: ${aiPrompt}. Customize this for your scholarship needs.`;

    setDocumentContent(documentContent + '\n' + aiResponse); // Append AI response
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Document Title"
            className="border border-gray-300 p-2 w-full rounded-lg"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
          />
        </div>

        <div className="flex mb-4">
          <button
            onClick={() => setUseAI(!useAI)}
            className={`px-4 py-2 rounded-lg mr-4 ${useAI ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {useAI ? 'AI Assistance Enabled' : 'Use AI Assistance'}
          </button>
          {!useAI && (
            <p className="text-sm text-gray-600">
              Type manually, or enable AI to assist with creating scholarship documents.
            </p>
          )}
        </div>

        {useAI ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your prompt (e.g., 'Cover letter for a scholarship')"
                className="border border-gray-300 p-2 w-full rounded-lg"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button
                onClick={handleAIContent}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Generate with AI
              </button>
            </div>
            <ReactQuill
              value={documentContent}
              onChange={setDocumentContent}
              className="h-64 mb-4"
            />
          </>
        ) : (
          <ReactQuill
            value={documentContent}
            onChange={setDocumentContent}
            className="h-64 mb-4"
          />
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {isSaving ? 'Saving...' : 'Save Document'}
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCreate;


