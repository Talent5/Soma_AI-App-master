import React, { useState, useEffect } from 'react';
import Header from '../components/Applications/Header';
import InProgress from '../components/Applications/InProgress';
import Completed from '../components/Applications/Completed';
import { db } from '../components/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('in_progress');
  const [inProgressScholarships, setInProgressScholarships] = useState([]);
  const [completedScholarships, setCompletedScholarships] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        // Fetch in-progress scholarships
        const inProgressCollection = collection(db, 'inProgressApplications');
        const inProgressQuery = query(inProgressCollection, where("userId", "==", userId));
        const inProgressSnapshot = await getDocs(inProgressQuery);
        const inProgressData = inProgressSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInProgressScholarships(inProgressData);

        // Fetch completed scholarships
        const completedCollection = collection(db, 'completedApplications');
        const completedQuery = query(completedCollection, where("userId", "==", userId));
        const completedSnapshot = await getDocs(completedQuery);
        const completedData = completedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedScholarships(completedData);
      } catch (error) {
        console.error("Error fetching scholarships: ", error);
      }
    };

    if (userId) {
      fetchScholarships();
    }
  }, [userId]);

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



