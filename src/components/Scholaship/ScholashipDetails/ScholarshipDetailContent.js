import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db } from '../../config/firebase'; // Adjust this import to match your firebase config file location
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const ScholarshipDetailContent = ({ scholarship, handleApply }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkIfFavorite = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const favoriteRef = doc(db, 'favoriteScholarships', userId, 'favorites', scholarship.id);
            const favoriteDoc = await getDoc(favoriteRef);
            setIsFavorite(favoriteDoc.exists());
        };

        checkIfFavorite();
    }, [scholarship.id]);

    const deadline = scholarship.deadline ? (
        scholarship.deadline.toDate ? (
            scholarship.deadline.toDate().toLocaleDateString()
        ) : (
            new Date(scholarship.deadline).toLocaleDateString()
        )
    ) : 'No deadline';

    const eligibility = Array.isArray(scholarship.eligibility) ? scholarship.eligibility : [];

    const handleAddToFavorites = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                console.error('User ID not found. Cannot add to favorites.');
                setLoading(false);
                return;
            }

            const favoriteRef = doc(db, 'favoriteScholarships', userId, 'favorites', scholarship.id);

            if (isFavorite) {
                await deleteDoc(favoriteRef);
                console.log('Scholarship removed from favorites!');
            } else {
                await setDoc(favoriteRef, {
                    title: scholarship.title ?? 'No title',
                    amount: scholarship.amount ?? 0,
                    deadline: scholarship.deadline ?? 'No deadline',
                    eligibility: scholarship.eligibility ?? [],
                    description: scholarship.description ?? 'No description available',
                    contactEmail: scholarship.contactEmail ?? 'No contact email',
                    contactPhone: scholarship.contactPhone ?? 'No contact phone',
                });
                console.log('Scholarship added to favorites!');
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error updating favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-2 mb-4 mt-12">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-indigo-700 rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold">{scholarship.title}</h2>
                </div>
                <p className="text-sm mb-2">
                    Amount: ${scholarship.amount?.toLocaleString()} · Deadline: {deadline}
                </p>
                <div className="flex space-x-2 gap-2">
                    <button 
                        className="flex-grow bg-[#1E1548] h-10 text-white py-2 px-4 rounded-full"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                    <button 
                        className="p-2 border w-10 h-10 rounded-full flex items-center justify-center" 
                        aria-label="Add to favorites"
                        onClick={handleAddToFavorites}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loader"></span> // Add a loading spinner
                        ) : (
                            <Heart className={`h-5 w-5  ${isFavorite ? 'text-[#1e1548] fill-current' : 'text-[#1E1548]'} ${isFavorite ? 'fill-[#1e1548]' : 'fill-none'}`} />
                        )}
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

