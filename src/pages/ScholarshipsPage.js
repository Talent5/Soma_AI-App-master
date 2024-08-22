import React, { useState } from 'react';
import SearchFilters from '../components/Scholaship/SearchFilters';
import ScholarshipCards from '../components/Scholaship/ScholarshipCards';
import { NavBar } from '../components/NavBar';

export const ScholarshipsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState('');

  const scholarships = [
    {
      logo: '',
      title: 'XYZ University Scholarship',
      amount: 5000,
      deadline: 'Jul 30, 2024',
    },
    {
      logo: '/frame-2191@2x.png',
      title: 'ABC Foundation Grant',
      amount: 2500,
      deadline: 'Aug 15, 2024',
    },
    {
      logo: '', // Example of missing logo
      title: 'DEF Academic Award',
      amount: 3000,
      deadline: 'Sep 1, 2024',
    },
    {
      logo: '', // Example of missing logo
      title: 'GHI Research Fellowship',
      amount: 4000,
      deadline: 'Oct 10, 2024',
    },
  ];

  // Filter scholarships based on search value and filter
  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.title.toLowerCase().includes(searchValue.toLowerCase())
    // Add more filter conditions as needed
  );

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col overflow-y-auto">
      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filter={filter}
        setFilter={setFilter}
      />
      <div className="flex-1 overflow-y-auto mt-4">
        <ScholarshipCards scholarships={filteredScholarships} />
      </div>
      <NavBar />
    </div>
  );
};



