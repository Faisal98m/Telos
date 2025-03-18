import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const initializeUserData = async (userId = 'test-user-1') => {
  try {
    // Check if user document exists
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create initial user data
      await setDoc(userRef, {
        createdAt: Date.now(),
        totalHours: 0
      });

      // Create initial project (Programming)
      const projectRef = doc(db, 'users', userId, 'projects', 'project-1');
      await setDoc(projectRef, {
        name: 'Programming',
        completedHours: 0,
        createdAt: Date.now()
      });

      // Initialize active session document
      const sessionRef = doc(db, 'users', userId, 'activeSession', 'current');
      await setDoc(sessionRef, null);

      console.log('Initialized user data successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing user data:', error);
    return false;
  }
};
