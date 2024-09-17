/* eslint-disable no-unused-vars */
// src/pages/ApplicationPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Applications/Header';
import InProgress from '../components/Applications/InProgress';
import Completed from '../components/Applications/Completed';
import { db } from '../components/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('in_progress');
  const [inProgressScholarships, setInProgressScholarships] = useState([]);
  const [completedScholarships, setCompletedScholarships] = useState([]);
  const userId = localStorage.getItem('userId'); // Replace with the actual user ID

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        // Fetch in-progress scholarships
        const inProgressCollection = collection(db, 'inProgressApplications');
        const inProgressSnapshot = await getDocs(inProgressCollection);
        const inProgressData = inProgressSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInProgressScholarships(inProgressData);

        // Fetch completed scholarships
        const completedCollection = collection(db, 'completedApplications');
        const completedSnapshot = await getDocs(completedCollection);
        const completedData = completedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedScholarships(completedData);

      } catch (error) {
        console.error("Error fetching scholarships: ", error);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="container mt-4 mx-auto">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'in_progress' ? (
        <InProgress scholarships={inProgressScholarships} />
      ) : (
        <Completed scholarships={completedScholarships} />
      )}
    </div>
  );
};



