import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useApplicationCounts = (userId) => {
  const [counts, setCounts] = useState({
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // Count in-progress applications
        const inProgressQuery = query(collection(db, 'inProgressApplications'), where('userId', '==', userId));
        const inProgressSnapshot = await getDocs(inProgressQuery);
        const inProgressCount = inProgressSnapshot.size;

        // Count completed applications
        const completedQuery = query(collection(db, 'applications', userId, 'submitted'));
        const completedSnapshot = await getDocs(completedQuery);
        const completedCount = completedSnapshot.size;

        setCounts({
          inProgress: inProgressCount,
          completed: completedCount,
        });
      } catch (error) {
        console.error('Error fetching application counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [userId]);

  return { counts, loading };
};

export default useApplicationCounts;
