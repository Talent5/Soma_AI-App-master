import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection } from 'firebase/firestore';

const ScholarshipDetailContent = ({ scholarship }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState('not_started');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const checkIfFavorite = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const favoriteRef = doc(db, 'favoriteScholarships', userId, 'favorites', scholarship.id);
            const favoriteDoc = await getDoc(favoriteRef);
            setIsFavorite(favoriteDoc.exists());
        };

        const checkApplicationStatus = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const inProgressRef = doc(db, 'inProgressApplications', `${userId}_${scholarship.id}`);
            const inProgressDoc = await getDoc(inProgressRef);

            if (inProgressDoc.exists()) {
                setApplicationStatus('in_progress');
            } else {
                const submittedRef = doc(db, 'applications', userId, 'submitted', scholarship.id);
                const submittedDoc = await getDoc(submittedRef);

                if (submittedDoc.exists()) {
                    setApplicationStatus('submitted');
                } else {
                    setApplicationStatus('not_started');
                }
            }
        };

        checkIfFavorite();
        checkApplicationStatus();
    }, [scholarship.id]);

    const deadline = scholarship.deadline ? (
        scholarship.deadline.toDate ? (
            scholarship.deadline.toDate().toLocaleDateString()
        ) : (
            new Date(scholarship.deadline).toLocaleDateString()
        )
    ) : 'No deadline';

    const eligibility = Array.isArray(scholarship.eligibility) ? scholarship.eligibility : [];
    const requirements = Array.isArray(scholarship.requirements) ? scholarship.requirements : [];
    const process = scholarship.process ? scholarship.process : [];

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

    const handleApply = async () => {
        setLoading(true);

        try {
            window.open(scholarship.application_link, '_blank');

            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found. Cannot apply.');
                setLoading(false);
                return;
            }

            const inProgressRef = doc(db, 'inProgressApplications', `${userId}_${scholarship.id}`);

            await setDoc(inProgressRef, {
                userId,
                scholarshipId: scholarship.id,
                status: 'in_progress',
                title: scholarship.title || 'No title',
                amount: scholarship.amount || 0,
                deadline: deadline,
                eligibility: scholarship.eligibility || [],
                description: scholarship.description || 'No description available',
                contactEmail: scholarship.contactEmail || 'No contact email',
                contactPhone: scholarship.contactPhone || 'No contact phone',
                startedAt: new Date(),
            });

            setApplicationStatus('in_progress');
            console.log('Application marked as in progress!');
        } catch (error) {
            console.error('Error updating application status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSubmission = async () => {
        setLoading(true);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found. Cannot confirm submission.');
                setLoading(false);
                return;
            }

            // Delete from in-progress applications
            const inProgressRef = doc(db, 'inProgressApplications', `${userId}_${scholarship.id}`);
            await deleteDoc(inProgressRef);

            // Add to submitted applications
            const submittedRef = doc(db, 'applications', userId, 'submitted', scholarship.id);
            await setDoc(submittedRef, {
                status: 'submitted',
                submittedAt: new Date(),
            }, { merge: true });

            // Add to completed applications collection
            const completedRef = doc(collection(db, 'completedApplications'), `${userId}_${scholarship.id}`);
            await setDoc(completedRef, {
                userId,
                scholarshipId: scholarship.id,
                title: scholarship.title,
                amount: scholarship.amount || 0,
                deadline: deadline,
                submittedAt: new Date(),
            });

            setApplicationStatus('submitted');
            setShowConfirmation(false);
            console.log('Application marked as submitted!');

        } catch (error) {
            console.error('Error confirming submission:', error);
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
                    {applicationStatus === 'not_started' && (
                        <button 
                            className="flex-grow h-10 py-2 px-4 rounded-full bg-[#1E1548] text-white"
                            onClick={handleApply}
                            disabled={loading}
                        >
                            Apply
                        </button>
                    )}
                    {applicationStatus === 'in_progress' && (
                        <button 
                            className="flex-grow h-10 py-2 px-4 rounded-full border-blue-950 border bg-white text-[#1e1548]"
                            onClick={() => setShowConfirmation(true)}
                            disabled={loading}
                        >
                            Application Submitted?
                        </button>
                    )}
                    {applicationStatus === 'submitted' && (
                        <button 
                            className="flex-grow h-10 py-2 px-4 rounded-full bg-[#c1c546] text-black"
                            disabled
                        >
                            You've Applied!
                        </button>
                    )}
                    <button 
                        className="p-2 border w-10 h-10 rounded-full flex items-center justify-center" 
                        aria-label="Add to favorites"
                        onClick={handleAddToFavorites}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loader"></span>
                        ) : (
                            <Heart className={`h-5 w-5 ${isFavorite ? 'text-[#1e1548] fill-current' : 'text-[#1E1548]'} ${isFavorite ? 'fill-[#1e1548]' : 'fill-none'}`} />
                        )}
                    </button>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white mb-2 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Have you completed your application?</h3>
                        <div className="flex justify-end space-x-4 gap-2">
                            <button 
                                className="px-4 py-2 bg-gray-300 rounded-full "
                                onClick={() => setShowConfirmation(false)}
                            >
                                Not yet
                            </button>
                            <button 
                                className="px-4 py-2 bg-blue-950 text-white rounded-full"
                                onClick={handleConfirmSubmission}
                            >
                                Yes, I've submitted
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 mb-4 gap-2">
                <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {eligibility.length > 0 ? (
                        eligibility.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No eligibility information available, Click apply for more.</li>
                    )}
                </ul>
            </div>

            <div className="p-4 mb-4 gap-2">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{scholarship.description}</p>
            </div>

            <div className='p-4 mb-4 gap-2'>
                <h3 className="text-lg font-semibold mb-2">Application requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {requirements.length > 0 ? (
                        requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No application requirements available, Click apply for more.</li>
                    )}
                </ul>
            </div>

            <div className='p-4 mb-4 gap-2'>
                <h3 className="text-lg font-semibold mb-2">Application process</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {process.length > 0 ? (
                        process.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))
                    ) : (
                        <li>No application process available, click apply for more</li>
                    )}
                </ul>
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


