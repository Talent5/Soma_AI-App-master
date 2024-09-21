/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchFilters } from '../components/Scholarship/SearchFilters';
import ScholarshipCards from '../components/Scholarship/ScholarshipCards';
import { NavBar } from '../components/NavBar';
import { db } from '../components/config/firebase';
import { getDoc, doc } from 'firebase/firestore';

export const ScholarshipsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOptions, setSortOptions] = useState({
    deadline: '',
    amount: '',
    name: ''
  });

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
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
      const scholarships = data.recommendations || [];
      
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

  const handleSortOptionChange = (category, value) => {
    setSortOptions(prevOptions => ({
      ...prevOptions,
      [category]: value
    }));
  };

  const sortScholarships = (scholarships) => {
    return scholarships.slice().sort((a, b) => {
      if (sortOptions.deadline) {
        const dateComparison = sortOptions.deadline === 'soonest'
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
        if (dateComparison !== 0) return dateComparison;
      }

      if (sortOptions.amount) {
        const amountComparison = sortOptions.amount === 'highest'
          ? b.amount - a.amount
          : a.amount - b.amount;
        if (amountComparison !== 0) return amountComparison;
      }

      if (sortOptions.name) {
        return sortOptions.name === 'a-z'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      return 0;
    });
  };

  const filteredAndSortedScholarships = useMemo(() => {
    let result = scholarships;

    // Apply search filter
    if (searchValue.trim() !== '') {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(scholarship => 
        scholarship.title.toLowerCase().includes(searchLower) ||
        scholarship.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    return sortScholarships(result);
  }, [scholarships, searchValue, sortOptions]);

  const handleRetry = () => {
    fetchScholarships();
  };

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col overflow-y-auto">
      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        openFilterModal={openFilterModal}
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
        {!isLoading && !error && filteredAndSortedScholarships.length === 0 && (
          <p>No scholarships found. Try adjusting your search.</p>
        )}
        {!isLoading && !error && <ScholarshipCards scholarships={filteredAndSortedScholarships} />}
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50">
          <nav className="bg-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Sort scholarships</h2>
            <button
              onClick={closeFilterModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </nav>
          <div className="flex-grow overflow-y-auto bg-white p-6">
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
                      checked={sortOptions.deadline === 'soonest'}
                      onChange={() => handleSortOptionChange('deadline', 'soonest')}
                      className="mr-2"
                    />
                    Soonest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-deadline"
                      value="latest"
                      checked={sortOptions.deadline === 'latest'}
                      onChange={() => handleSortOptionChange('deadline', 'latest')}
                      className="mr-2"
                    />
                    Latest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-deadline"
                      value=""
                      checked={sortOptions.deadline === ''}
                      onChange={() => handleSortOptionChange('deadline', '')}
                      className="mr-2"
                    />
                    No preference
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
                      checked={sortOptions.amount === 'highest'}
                      onChange={() => handleSortOptionChange('amount', 'highest')}
                      className="mr-2"
                    />
                    Highest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-amount"
                      value="lowest"
                      checked={sortOptions.amount === 'lowest'}
                      onChange={() => handleSortOptionChange('amount', 'lowest')}
                      className="mr-2"
                    />
                    Lowest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-amount"
                      value=""
                      checked={sortOptions.amount === ''}
                      onChange={() => handleSortOptionChange('amount', '')}
                      className="mr-2"
                    />
                    No preference
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
                      checked={sortOptions.name === 'a-z'}
                      onChange={() => handleSortOptionChange('name', 'a-z')}
                      className="mr-2"
                    />
                    A - Z
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-name"
                      value="z-a"
                      checked={sortOptions.name === 'z-a'}
                      onChange={() => handleSortOptionChange('name', 'z-a')}
                      className="mr-2"
                    />
                    Z - A
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort-name"
                      value=""
                      checked={sortOptions.name === ''}
                      onChange={() => handleSortOptionChange('name', '')}
                      className="mr-2"
                    />
                    No preference
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




