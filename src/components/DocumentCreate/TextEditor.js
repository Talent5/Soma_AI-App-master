import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false } 
);

export const TextEditor = () => {
  // Initialize with empty content
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Function to handle editor state changes
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // If you need to get the HTML content
  const getHTMLContent = () => {
    const contentState = editorState.getCurrentContent();
    return draftToHtml(convertToRaw(contentState));
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border"
      />

      {/* Optional: Button to log the HTML content */}
      <button onClick={() => console.log(getHTMLContent())}>
        Log HTML Content
      </button>
    </div>
  );
};
