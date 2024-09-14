import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase'; // Ensure this path is correct
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ExtracurricularActivities = () => {
    const [activities, setActivities] = useState({
        sports: [],
        clubs: '',
        volunteerExperience: '',
        leadershipRoles: '',
    });
    const [currentSport, setCurrentSport] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setActivities({
                        sports: data.sports || [],
                        clubs: data.clubs || '',
                        volunteerExperience: data.volunteerExperience || '',
                        leadershipRoles: data.leadershipRoles || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (field, value) => {
        setActivities(prevState => ({ ...prevState, [field]: value }));
    };

    const handleAddSport = (e) => {
        e.preventDefault();
        if (currentSport && !activities.sports.includes(currentSport)) {
            setActivities(prevState => ({
                ...prevState,
                sports: [...prevState.sports, currentSport]
            }));
            setCurrentSport('');
        }
    };

    const handleRemoveSport = (sport) => {
        setActivities(prevState => ({
            ...prevState,
            sports: prevState.sports.filter(s => s !== sport)
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        const userDocRef = doc(db, 'users', userId);
        try {
            await updateDoc(userDocRef, { ...activities });
            alert('Information updated successfully!');
        } catch (error) {
            console.error('Error updating information:', error);
            alert('Failed to update information.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <main className='p-4'>
            <div className="mb-4">
                <i onClick={handleBackClick} className="bi bi-arrow-left text-2xl text-black"> Extracurricular Activities</i>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label className="block text-black text-xl gap-2 font-medium mb-2">Sports (optional)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {activities.sports.map(sport => (
                                <span key={sport} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                                    {sport}
                                    <button type="button" onClick={() => handleRemoveSport(sport)} className="ml-1 text-gray-500 hover:text-gray-700">
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={currentSport}
                                    onChange={(e) => setCurrentSport(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSport(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Type a sport e.g running"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSport}
                                className="ml-2 px-4 w-5 h-10 py-2 bg-[#1E1548] text-white rounded-md hover:bg-indigo-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black text-xl font-medium mb-2">Clubs (optional)</label>
                        <input
                            type="text"
                            value={activities.clubs}
                            onChange={(e) => handleInputChange('clubs', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Type a club e.g debate club"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black text-xl font-medium mb-2">Volunteer experience (optional)</label>
                        <textarea
                            value={activities.volunteerExperience}
                            onChange={(e) => handleInputChange('volunteerExperience', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            placeholder="Type your experience"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black text-xl font-medium mb-2">Leadership roles (optional)</label>
                        <textarea
                            value={activities.leadershipRoles}
                            onChange={(e) => handleInputChange('leadershipRoles', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md box-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            placeholder="Type your experience"
                        ></textarea>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-2 bg-[#1E1548] text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300"
                        >
                            {loading ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ExtracurricularActivities;

