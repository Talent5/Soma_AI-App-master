import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Metrics } from './Metrics';
import { Applications } from './Applications';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export const Dashboard = () => {
  const [userName, setUserName] = useState('James');
  const [profilePicture, setProfilePicture] = useState(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          // Fetch user data
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.firstName || 'James');
            setProfilePicture(userData.profilePicture);
          }

          // Fetch scholarship recommendations
          const recommendationDoc = doc(db, 'scholarship_recommendations', userId);
          const docSnap = await getDoc(recommendationDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const scholarships = data.recommendations || [];
            
            // Count matched scholarships
            setMatchedCount(scholarships.length);

            // Count upcoming deadlines (within the next 7 days)
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
          const favoriteList = favoritesSnapshot.docs.map(doc => doc.data());
          setSavedCount(favoriteList.length);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  const handleProfileClick = () => {
    navigate('/profile');
  };

return (
  <div className="bg-white rounded-lg shadow-md p-8 mb-4 max-w-sm mx-auto">
    <div className="flex justify-between items-center pb-2">
      <div className="flex items-center">
        <div
          className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
          onClick={handleProfileClick}
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
        <p className="text-lg font-medium ml-2 cursor-pointer" onClick={handleProfileClick}>
          Welcome! {userName}
        </p>
      </div>
    </div>
    <div className="border border-gray-200 rounded-lg ps-3">
      <div className="p-4 ps-2 space-y-4">
        <div>
          <Metrics type="matched" title="Matched scholarships" count={matchedCount} />
        </div>
        <div className="border-t border-gray-200"></div>
        <div>
          <Metrics type="deadline" title="Upcoming deadlines" count={upcomingDeadlines} />
        </div>
        <div className="border-t border-gray-200"></div>
        <div>
          <Metrics type="saved" title="Saved scholarships" count={savedCount} />
        </div>
      </div>
    </div>
    <div className="pt-4">
      <h3 className="text-lg font-medium">Application progress</h3>
      <Applications />
    </div>
  </div>
);
}