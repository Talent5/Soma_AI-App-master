import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/config/firebase';
import ScholarshipCard from '../components/Scholaship/ScholashipDetails/ScholarshipCard';
import ErrorDisplay from '../components/Scholaship/ScholashipDetails/ErrorDisplay';
import LoadingDisplay from '../components/Scholaship/ScholashipDetails/LoadingDisplay';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const fetchScholarshipDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!userId) {
      setError('No user ID found.');
      setIsLoading(false);
      return;
    }

    try {
      const recommendationDoc = doc(db, 'scholarship_recommendations', userId);
      const docSnap = await getDoc(recommendationDoc);

      if (!docSnap.exists()) {
        setError('No scholarships found for this user.');
        setIsLoading(false);
        return;
      }

      const data = docSnap.data();
      const recommendations = data.recommendations || [];
      const foundScholarship = recommendations.find(s => s.id === id);

      if (foundScholarship) {
        setScholarship(foundScholarship);
      } else {
        setError('Scholarship not found.');
      }
    } catch (error) {
      console.error('Error fetching scholarship details:', error);
      setError(`Failed to fetch scholarship details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId, id]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User ID not found in localStorage.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchScholarshipDetail();
    }
  }, [fetchScholarshipDetail, userId]);

  const handleApply = () => {
    if (scholarship?.application_link) {
      window.open(scholarship.application_link, '_blank');
    } else {
      console.error('No application link available.');
    }
  };

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchScholarshipDetail} />;
  }

  if (!scholarship) {
    return <div className="text-center my-4">No scholarship details available.</div>;
  }

      const handleBackClick = () => {
        navigate(-1);
    };

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4 text-left">
        <i onClick={handleBackClick} className="bi bi-arrow-left text-2xl px-2 font-normal"></i>
      </div>
      <ScholarshipCard 
        scholarship={scholarship}
        handleApply={handleApply}
      />
    </div>
  );
};

export default ScholarshipDetail;