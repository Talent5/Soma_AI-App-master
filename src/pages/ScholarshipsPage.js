import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '../components/Scholarship/SearchFilters';
import ScholarshipCards from '../components/Scholarship/ScholarshipCards';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Modal state
  const [sortOption, setSortOption] = useState(''); // Sorting option state

  const openFilterModal = () => {
    setIsFilterModalOpen(true); // Open modal
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false); // Close modal
  };

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

  // Sort scholarships based on the selected sorting option
  const sortedScholarships = scholarships.slice().sort((a, b) => {
    if (sortOption === 'soonest') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortOption === 'latest') {
      return new Date(b.deadline) - new Date(a.deadline);
    } else if (sortOption === 'highest') {
      return b.amount - a.amount;
    } else if (sortOption === 'lowest') {
      return a.amount - b.amount;
    } else if (sortOption === 'a-z') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'z-a') {
      return b.title.localeCompare(a.title);
    }
    return 0; // No sorting if no option is selected
  });

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
        openFilterModal={openFilterModal}  // Pass the function as a prop
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
        {!isLoading && !error && sortedScholarships.length === 0 && (
          <p>No scholarships found. Try adjusting your search.</p>
        )}
        {!isLoading && !error && <ScholarshipCards scholarships={sortedScholarships} />}
      </div>

      {/* Modal with filter and sorting options */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sort scholarships</h2>
              <button
                onClick={closeFilterModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                style={{ marginLeft: 'auto' }} // Ensure it stays on the right
              >
                &times;
              </button>
            </div>

            <p className="text-gray-600 mb-4">Use the options below to sort scholarships</p>

            <form className="space-y-6">
              <div>
                <p className="font-medium mb-2">Application deadline</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-deadline"
                      value="soonest"
                      checked={sortOption === 'soonest'}
                      onChange={() => setSortOption('soonest')}
                      className="mr-2"
                    />
                    Soonest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-deadline"
                      value="latest"
                      checked={sortOption === 'latest'}
                      onChange={() => setSortOption('latest')}
                      className="mr-2"
                    />
                    Latest
                  </label>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Amount</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-amount"
                      value="highest"
                      checked={sortOption === 'highest'}
                      onChange={() => setSortOption('highest')}
                      className="mr-2"
                    />
                    Highest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-amount"
                      value="lowest"
                      checked={sortOption === 'lowest'}
                      onChange={() => setSortOption('lowest')}
                      className="mr-2"
                    />
                    Lowest
                  </label>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Scholarship name</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-name"
                      value="a-z"
                      checked={sortOption === 'a-z'}
                      onChange={() => setSortOption('a-z')}
                      className="mr-2"
                    />
                    A - Z
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-name"
                      value="z-a"
                      checked={sortOption === 'z-a'}
                      onChange={() => setSortOption('z-a')}
                      className="mr-2"
                    />
                    Z - A
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
};




