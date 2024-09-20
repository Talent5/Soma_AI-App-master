import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchFilters } from '../SearchFilters';
import ScholarshipCards from '../ScholarshipCards';

const ScholarshipFilter = ({ initialScholarships }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [filteredScholarships, setFilteredScholarships] = useState(initialScholarships);

  const [sortCriteria, setSortCriteria] = useState({
    deadline: '',
    amount: 'highest',
    name: ''
  });

  const handleSortChange = (category, value) => {
    setSortCriteria(prev => ({ ...prev, [category]: value }));
  };

  const applyFilters = () => {
    let sorted = [...scholarships];

    // Apply search filter
    if (searchValue) {
      sorted = sorted.filter(scholarship => 
        scholarship.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply sorting
    if (sortCriteria.deadline === 'soonest') {
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortCriteria.deadline === 'latest') {
      sorted.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    }

    if (sortCriteria.amount === 'highest') {
      sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (sortCriteria.amount === 'lowest') {
      sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    }

    if (sortCriteria.name === 'a-z') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortCriteria.name === 'z-a') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredScholarships(sorted);
  };

  useEffect(() => {
    applyFilters();
  }, [searchValue, sortCriteria, scholarships]);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Ensure openFilterModal is passed correctly */}
      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        openFilterModal={openFilterModal} // Passed here
      />
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sort scholarships</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-2xl">&times;</button>
            </div>
            
            <p className="mb-4">Use the options below to sort scholarships</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Application deadline</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deadline"
                    value="soonest"
                    checked={sortCriteria.deadline === 'soonest'}
                    onChange={() => handleSortChange('deadline', 'soonest')}
                    className="mr-2"
                  />
                  Soonest
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deadline"
                    value="latest"
                    checked={sortCriteria.deadline === 'latest'}
                    onChange={() => handleSortChange('deadline', 'latest')}
                    className="mr-2"
                  />
                  Latest
                </label>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Amount</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="amount"
                    value="highest"
                    checked={sortCriteria.amount === 'highest'}
                    onChange={() => handleSortChange('amount', 'highest')}
                    className="mr-2"
                  />
                  Highest
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="amount"
                    value="lowest"
                    checked={sortCriteria.amount === 'lowest'}
                    onChange={() => handleSortChange('amount', 'lowest')}
                    className="mr-2"
                  />
                  Lowest
                </label>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Scholarship name</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="name"
                    value="a-z"
                    checked={sortCriteria.name === 'a-z'}
                    onChange={() => handleSortChange('name', 'a-z')}
                    className="mr-2"
                  />
                  A - Z
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="name"
                    value="z-a"
                    checked={sortCriteria.name === 'z-a'}
                    onChange={() => handleSortChange('name', 'z-a')}
                    className="mr-2"
                  />
                  Z - A
                </label>
              </div>
            </div>
            <button 
              onClick={() => setIsFilterModalOpen(false)} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      <ScholarshipCards scholarships={filteredScholarships} />
    </div>
  );
};

ScholarshipFilter.propTypes = {
  initialScholarships: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    logo: PropTypes.string,
    title: PropTypes.string.isRequired,
    amount: PropTypes.string,
    deadline: PropTypes.string,
  })).isRequired,
};

export default ScholarshipFilter;
