// components/ScholarshipDetailContent.js
import React from 'react';
import { Heart } from 'lucide-react';

const ScholarshipDetailContent = ({ scholarship, handleApply }) => {
    const deadline = scholarship.deadline ? (
        scholarship.deadline.toDate ? (
            scholarship.deadline.toDate().toLocaleDateString()
        ) : (
            new Date(scholarship.deadline).toLocaleDateString()
        )
    ) : 'No deadline';

    const eligibility = Array.isArray(scholarship.eligibility) ? scholarship.eligibility : [];

    return (
        <>
            <div className=" p-4 mb-4 mt-12">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-indigo-700 rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold">{scholarship.title}</h2>
                </div>
                <p className="text-sm mb-2">
                    Amount: ${scholarship.amount?.toLocaleString()} · Deadline: {deadline}
                </p>
                <div className="flex space-x-2 gap-2">
                    <button 
                        className="flex-grow bg-indigo-700 text-white py-2 px-4 rounded"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                    <button className="p-2 border border-gray-300 rounded" aria-label="Add to favorites">
                        <Heart className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {eligibility.length > 0 ? (
                        eligibility.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No eligibility information available.</li>
                    )}
                </ul>
            </div>

            <div className="p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{scholarship.description}</p>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p>Email: {scholarship.contactEmail}</p>
                <p>Phone: {scholarship.contactPhone}</p>
            </div>
        </>
    );
};

export default ScholarshipDetailContent;
