import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from "../components/Scholaship/SearchFilters";
import ScholarshipItem from '../components/Scholaship/ScholarshipItem';
import { NavBar } from '../components/NavBar';

export const ScholarshipsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScholarships = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://soma-model.onrender.com/matched-scholarsip', {
        mode: 'cors', // Explicitly set CORS mode
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setScholarships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setError('Failed to fetch scholarships. Please check your network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

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
        {!isLoading && !error && filteredScholarships.map((scholarship) => (
          <ScholarshipItem
            key={scholarship.id}
            logo={scholarship.logo}
            title={scholarship.title}
            amount={scholarship.amount}
            deadline={scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'No deadline'}
          />
        ))}
      </div>
      <NavBar />
    </div>
  );
};