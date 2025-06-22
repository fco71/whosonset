import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
export const addToCollection = async (userId, type, itemId) => {
    const userRef = doc(db, 'UserCollections', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            savedProjects: [],
            savedCrew: [],
            [type]: [itemId],
        });
    }
    else {
        await updateDoc(userRef, {
            [type]: arrayUnion(itemId),
        });
    }
};
export const removeFromCollection = async (userId, type, itemId) => {
    const userRef = doc(db, 'UserCollections', userId);
    await updateDoc(userRef, {
        [type]: arrayRemove(itemId),
    });
};
export const getUserCollections = async (userId) => {
    const userRef = doc(db, 'UserCollections', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
