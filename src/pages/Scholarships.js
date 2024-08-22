import React from 'react';
import FrameComponent from '../components/FrameComponent';
import { NavBar } from '../components/NavBar';
import ScholarshipItem from './ScholarshipItem';

export const Scholarships = () => {
  const scholarships = [
    {
      logo: '/frame-219@2x.png',
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
      logo: '/frame-2192@2x.png',
      title: 'DEF Academic Award',
      amount: 3000,
      deadline: 'Sep 1, 2024',
    },
    // Add more scholarships as needed
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col">
      <FrameComponent />
      <main className="flex-1 mt-4 space-y-4">
        {scholarships.map((scholarship, index) => (
          <ScholarshipItem
            key={index}
            logo={scholarship.logo}
            title={scholarship.title}
            amount={scholarship.amount}
            deadline={scholarship.deadline}
          />
        ))}
      </main>
      <NavBar />
    </div>
  );
};

