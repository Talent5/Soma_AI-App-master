import React from 'react';
import PropTypes from 'prop-types';
import placeholderImage from '../assets/logo192.png';
import ScholarshipItem from './ScholarshipItem';

const ScholarshipCards = ({ scholarships }) => {
  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <ScholarshipItem
          key={scholarship.id}
          logo={scholarship.logo || placeholderImage}
          title={scholarship.title}
          amount={scholarship.amount}
          deadline={scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'No deadline'}
          applicationLink={scholarship.application_link}
          description={scholarship.description}
          eligibility={scholarship.eligibility}
          score={scholarship.score}
        />
      ))}
    </div>
  );
};

ScholarshipCards.propTypes = {
  scholarships: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    logo: PropTypes.string,
    title: PropTypes.string.isRequired,
    amount: PropTypes.string,
    deadline: PropTypes.string,
    application_link: PropTypes.string,
    description: PropTypes.string,
    eligibility: PropTypes.string,
    score: PropTypes.number,
  })).isRequired,
};

export default ScholarshipCards;






