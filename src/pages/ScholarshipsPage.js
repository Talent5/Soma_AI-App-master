import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '../components/Scholaship/SearchFilters';
import ScholarshipCards from '../components/Scholaship/ScholarshipCards';
import { NavBar } from '../components/NavBar';
import { db } from '../components/config/firebase'; // Import your Firebase configuration
import { getDoc, doc } from 'firebase/firestore';

export const ScholarshipsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const fetchScholarships = useCallback(async () => {
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
        setError('No scholarships found.');
        setScholarships([]);
        return;
      }

      const data = docSnap.data();
      const scholarships = data.recommendations || []; // Access the 'recommendations' field in the document
      
      setScholarships(scholarships);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setError(`Failed to fetch scholarships: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('Stored User ID:', storedUserId); // Check if the correct userId is retrieved
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User ID not found in localStorage.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchScholarships();
    }
  }, [fetchScholarships, userId]);

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleRetry = () => {
    fetchScholarships();
  };

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col overflow-y-auto">
      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filter={filter}
        setFilter={setFilter}
      />
      <div className="flex-1 overflow-y-auto mt-4 p-4 bg-white shadow rounded-lg">
        {isLoading && <p>Loading scholarships...</p>}
        {error && (
          <div>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <p className="mt-2 text-sm text-gray-600">
              If the problem persists, please try the following:
              <ul className="list-disc list-inside mt-1">
                <li>Check your internet connection</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try accessing the page in an incognito/private browsing window</li>
                <li>If none of the above work, the server might be temporarily unavailable. Please try again later.</li>
              </ul>
            </p>
          </div>
        )}
        {!isLoading && !error && filteredScholarships.length === 0 && (
          <p>No scholarships found. Try adjusting your search.</p>
        )}
        {!isLoading && !error && <ScholarshipCards scholarships={filteredScholarships} />}
      </div>
      <NavBar />
    </div>
  );
};
