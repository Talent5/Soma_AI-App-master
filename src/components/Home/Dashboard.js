import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Metrics } from './Metrics';
import { Applications } from './Applications';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not authenticated');
        }

        // Fetch user data with error handling
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName || 'User');
          setProfilePicture(userData.profilePicture);
        }

        // Fetch scholarship recommendations with error handling
        const recommendationDoc = doc(db, 'scholarship_recommendations', userId);
        const docSnap = await getDoc(recommendationDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const scholarships = data.recommendations || [];
          
          setMatchedCount(scholarships.length);

          // Calculate upcoming deadlines
          const now = new Date();
          const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const upcomingCount = scholarships.filter(scholarship => {
            const deadline = new Date(scholarship.deadline);
            return deadline > now && deadline <= oneWeekFromNow;
          }).length;
          
          setUpcomingDeadlines(upcomingCount);
        }

        // Fetch favorite scholarships
        const favoritesColRef = collection(db, 'favoriteScholarships', userId, 'favorites');
        const favoritesSnapshot = await getDocs(favoritesColRef);
        setSavedCount(favoritesSnapshot.docs.length);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className="bi bi-person text-2xl"></i>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Welcome!</p>
              <p className="text-lg font-semibold">{userName}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div 
            className="cursor-pointer mb-4" 
            onClick={() => navigate('/scholarships')}
          >
            <Metrics 
              type="matched" 
              title="Matched scholarships" 
              count={matchedCount}
              icon="bi-trophy"
            />
          </div>
          
          <div className="border-t border-gray-100 my-4" />
          
          <div className="mb-4">
            <Metrics 
              type="deadline" 
              title="Upcoming deadlines" 
              count={upcomingDeadlines}
              icon="bi-calendar"
            />
          </div>
          
          <div className="border-t border-gray-100 my-4" />
          
          <div>
            <Metrics 
              type="saved" 
              title="Saved scholarships" 
              count={savedCount}
              icon="bi-bookmark"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4">Application Progress</h3>
          <Applications />
        </div>
      </div>
    </div>
  );
};
