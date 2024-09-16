import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/config/firebase';
import BackButton from '../components/Scholaship/ScholashipDetails/BackButton';
import ScholarshipDetailContent from '../components/Scholaship/ScholashipDetails/ScholarshipDetailContent';

const ScholarshipDetail = () => {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const fetchScholarshipDetail = useCallback(async () => {
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
                setError('No scholarships found for this user.');
                setIsLoading(false);
                return;
            }

            const data = docSnap.data();
            const recommendations = data.recommendations || [];
            const foundScholarship = recommendations.find(s => s.id === id);

            if (foundScholarship) {
                setScholarship(foundScholarship);
            } else {
                setError('Scholarship not found.');
            }
        } catch (error) {
            console.error('Error fetching scholarship details:', error);
            setError(`Failed to fetch scholarship details: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [userId, id]);

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
            fetchScholarshipDetail();
        }
    }, [fetchScholarshipDetail, userId]);

    const handleApply = () => {
        if (scholarship?.application_link) {
            window.open(scholarship.application_link, '_blank');
        } else {
            console.error('No application link available.');
        }
    };

    const handleRetry = () => {
        fetchScholarshipDetail();
    };

    if (isLoading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-4 border border-red-200 rounded">
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
        );
    }

    if (!scholarship) {
        return <div className="text-center mt-4">No scholarship details available.</div>;
    }

    return (
        <div className="relative max-w-md bg-purple-50 min-h-screen p-2 h-full">
            <BackButton />
            <ScholarshipDetailContent scholarship={scholarship} handleApply={handleApply} />
        </div>
    );
};

export default ScholarshipDetail;


