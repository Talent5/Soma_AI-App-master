import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import TextEditor from './TextEditor';
import { db } from '../config/firebase';
import { doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedSession = JSON.parse(localStorage.getItem('session'));
    
    if (!storedUserId || !storedSession) {
      setSession(null);
      setUserId(null);
    } else {
      setSession(storedSession);
      setUserId(storedUserId);
    }
  }, []);

  const [snapshot, loading, error] = useDocumentOnce(
    userId ? doc(db, 'userDocs', userId, 'docs', id) : null
  );

  const documentData = snapshot?.data();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">Error: {error.message}</div>;
  }

  if (!session || !userId) {
    return <div className="text-center text-danger mt-5">User not logged in or session missing</div>;
  }

  return (
    <div>
      <header className="d-flex justify-content-between align-items-center p-3 pb-1">
        <span onClick={() => navigate(-1)} className="cursor-pointer">
          <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: '40px' }}></i>
        </span>
        <div className="flex-grow-1 px-2">
          <h2>{documentData?.fileName}</h2>
          <div className="d-flex align-items-center text-sm space-x-1 ml-1 h-8 text-gray-600">
            <p className="mx-2 cursor-pointer hover:bg-light p-1">File</p>
            <p className="mx-2 cursor-pointer hover:bg-light p-1">Edit</p>
            <p className="mx-2 cursor-pointer hover:bg-light p-1">View</p>
            <p className="mx-2 cursor-pointer hover:bg-light p-1">Insert</p>
            <p className="mx-2 cursor-pointer hover:bg-light p-1">Format</p>
            <p className="mx-2 cursor-pointer hover:bg-light p-1">Tools</p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-primary d-flex align-items-center me-3">
            <i className="bi bi-people me-2"></i> SHARE
          </button>
          <img
            className="cursor-pointer rounded-circle"
            src={session?.user?.image || '/default-avatar.png'}
            alt="User Avatar"
            style={{ height: '40px', width: '40px' }}
          />
        </div>
      </header>
      <TextEditor documentData={documentData} />
    </div>
  );
};
