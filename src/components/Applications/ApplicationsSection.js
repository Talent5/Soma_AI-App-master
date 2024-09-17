// src/components/ApplicationsSection.js
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Header from './Header';
import ApplicationCard from './ApplicationCard';

export const ApplicationsSection = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('in_progress');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const appCollection = collection(db, activeTab === 'in_progress' ? 'inProgressApplications' : 'applications');
        const appSnapshot = await getDocs(appCollection);
        const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [activeTab]);

  return (
    <div className="">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          applications.length > 0 ? (
            applications.map(app => <ApplicationCard key={app.id} scholarship={app} />)
          ) : (
            <p>No applications available</p>
          )
        )}
      </div>
    </div>
  );
};

