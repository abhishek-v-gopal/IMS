import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Test function to verify Firestore access
 * Run this from a component method to check if Firestore is working
 */
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test collection - just for testing, will be deleted after
    const testCollection = collection(db, '_test_connection');
    
    // Try to add a document
    const testData = {
      test: true,
      timestamp: Date.now()
    };
    
    const docRef = await addDoc(testCollection, testData);
    console.log('Test document created with ID:', docRef.id);
    
    // Try to read documents
    const querySnapshot = await getDocs(testCollection);
    console.log('Test query returned', querySnapshot.size, 'documents');
    
    return {
      success: true,
      message: 'Firestore connection is working properly'
    };
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return {
      success: false,
      message: `Firestore connection failed: ${error.message}`,
      error
    };
  }
};
