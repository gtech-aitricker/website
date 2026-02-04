
/* ============================================== */
/* GOTHWAD TECHNOLOGIES PVT. LTD.                */
/* Firebase Configuration & Services              */
/* Author: Gothwad Technologies Team             */
/* ============================================== */

/* ============================================== */
/* TABLE OF CONTENTS                              */
/* ============================================== */
/*
  1. FIREBASE INITIALIZATION
  2. FIRESTORE DATABASE FUNCTIONS
  3. AUTHENTICATION FUNCTIONS
  4. CONTACT FORM HANDLERS
  5. NEWSLETTER HANDLERS
  6. USER MANAGEMENT
  7. UTILITY FUNCTIONS
  8. ERROR HANDLING
  9. EXPORT FUNCTIONS
*/

/* ============================================== */
/* 1. FIREBASE INITIALIZATION                     */
/* ============================================== */

// Firebase SDK Imports (Using CDN/Modular approach)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKpImyRjIPc8Jp7tD63ZarbzNbXoM5KBk",
    authDomain: "websittws.firebaseapp.com",
    projectId: "websittws",
    storageBucket: "websittws.firebasestorage.app",
    messagingSenderId: "530662939445",
    appId: "1:530662939445:web:dbe140cd86b715f3890a7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

console.log('🔥 Firebase Initialized Successfully - Gothwad Technologies');

/* ============================================== */
/* 2. FIRESTORE DATABASE FUNCTIONS                */
/* ============================================== */

/**
 * Collection Names (Constants)
 */
const COLLECTIONS = {
    CONTACTS: 'contacts',
    NEWSLETTER: 'newsletter_subscribers',
    QUICK_CONTACTS: 'quick_contacts',
    USERS: 'users',
    APP_DOWNLOADS: 'app_downloads',
    FEEDBACK: 'feedback',
    INQUIRIES: 'inquiries'
};

/**
 * Add Document to Collection
 * @param {string} collectionName - Name of the collection
 * @param {object} data - Data to add
 * @returns {Promise<string>} - Document ID
 */
async function addDocument(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('✅ Document added with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding document:', error);
        throw error;
    }
}

/**
 * Get All Documents from Collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} - Array of documents
 */
async function getDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return documents;
    } catch (error) {
        console.error('❌ Error getting documents:', error);
        throw error;
    }
}

/**
 * Get Single Document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @returns {Promise<object|null>} - Document data or null
 */
async function getDocumentById(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            console.log('Document not found');
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting document:', error);
        throw error;
    }
}

/**
 * Update Document
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @param {object} data - Data to update
 * @returns {Promise<boolean>}
 */
async function updateDocument(collectionName, documentId, data) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log('✅ Document updated successfully');
        return true;
    } catch (error) {
        console.error('❌ Error updating document:', error);
        throw error;
    }
}

/**
 * Delete Document
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @returns {Promise<boolean>}
 */
async function deleteDocument(collectionName, documentId) {
    try {
        await deleteDoc(doc(db, collectionName, documentId));
        console.log('✅ Document deleted successfully');
        return true;
    } catch (error) {
        console.error('❌ Error deleting document:', error);
        throw error;
    }
}

/**
 * Query Documents with Conditions
 * @param {string} collectionName - Name of the collection
 * @param {Array} conditions - Array of query conditions
 * @param {string} orderByField - Field to order by
 * @param {number} limitCount - Number of documents to limit
 * @returns {Promise<Array>}
 */
async function queryDocuments(collectionName, conditions = [], orderByField = null, limitCount = null) {
    try {
        let q = collection(db, collectionName);
        
        // Build query with conditions
        const queryConstraints = [];
        
        conditions.forEach(condition => {
            queryConstraints.push(where(condition.field, condition.operator, condition.value));
        });
        
        if (orderByField) {
            queryConstraints.push(orderBy(orderByField, 'desc'));
        }
        
        if (limitCount) {
            queryConstraints.push(limit(limitCount));
        }
        
        q = query(q, ...queryConstraints);
        
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return documents;
    } catch (error) {
        console.error('❌ Error querying documents:', error);
        throw error;
    }
}

/**
 * Real-time Listener for Collection
 * @param {string} collectionName - Name of the collection
 * @param {function} callback - Callback function with documents
 * @returns {function} - Unsubscribe function
 */
function subscribeToCollection(collectionName, callback) {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(documents);
    }, (error) => {
        console.error('❌ Error in real-time listener:', error);
    });
    
    return unsubscribe;
}

/* ============================================== */
/* 3. AUTHENTICATION FUNCTIONS                    */
/* ============================================== */

/**
 * Register User with Email & Password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise<object>} - User object
 */
async function registerWithEmail(email, password, displayName = '') {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        if (displayName) {
            await updateProfile(user, {
                displayName: displayName
            });
        }
        
        // Send email verification
        await sendEmailVerification(user);
        
        // Create user document in Firestore
        await addDocument(COLLECTIONS.USERS, {
            uid: user.uid,
            email: user.email,
            displayName: displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            provider: 'email',
            role: 'user',
            status: 'active'
        });
        
        console.log('✅ User registered successfully:', user.email);
        
        return {
            success: true,
            user: user,
            message: 'Registration successful! Please verify your email.'
        };
    } catch (error) {
        console.error('❌ Registration error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Sign In with Email & Password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - User object
 */
async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ User signed in successfully:', user.email);
        
        // Update last login in Firestore
        await updateUserLastLogin(user.uid);
        
        return {
            success: true,
            user: user,
            message: 'Sign in successful!'
        };
    } catch (error) {
        console.error('❌ Sign in error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Sign In with Google
 * @returns {Promise<object>} - User object
 */
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const existingUser = await queryDocuments(COLLECTIONS.USERS, [
            { field: 'uid', operator: '==', value: user.uid }
        ]);
        
        if (existingUser.length === 0) {
            // Create new user document
            await addDocument(COLLECTIONS.USERS, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                emailVerified: user.emailVerified,
                provider: 'google',
                role: 'user',
                status: 'active'
            });
        } else {
            // Update last login
            await updateUserLastLogin(user.uid);
        }
        
        console.log('✅ Google sign in successful:', user.email);
        
        return {
            success: true,
            user: user,
            message: 'Google sign in successful!'
        };
    } catch (error) {
        console.error('❌ Google sign in error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Sign Out User
 * @returns {Promise<object>}
 */
async function signOutUser() {
    try {
        await signOut(auth);
        console.log('✅ User signed out successfully');
        return {
            success: true,
            message: 'Signed out successfully!'
        };
    } catch (error) {
        console.error('❌ Sign out error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Send Password Reset Email
 * @param {string} email - User email
 * @returns {Promise<object>}
 */
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('✅ Password reset email sent to:', email);
        return {
            success: true,
            message: 'Password reset email sent! Check your inbox.'
        };
    } catch (error) {
        console.error('❌ Password reset error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Update User Profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise<object>}
 */
async function updateUserProfile(profileData) {
    try {
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No user signed in');
        }
        
        await updateProfile(user, profileData);
        
        // Update in Firestore
        const userDocs = await queryDocuments(COLLECTIONS.USERS, [
            { field: 'uid', operator: '==', value: user.uid }
        ]);
        
        if (userDocs.length > 0) {
            await updateDocument(COLLECTIONS.USERS, userDocs[0].id, profileData);
        }
        
        console.log('✅ Profile updated successfully');
        return {
            success: true,
            message: 'Profile updated successfully!'
        };
    } catch (error) {
        console.error('❌ Profile update error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update User Email
 * @param {string} newEmail - New email address
 * @param {string} currentPassword - Current password for re-authentication
 * @returns {Promise<object>}
 */
async function updateUserEmail(newEmail, currentPassword) {
    try {
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No user signed in');
        }
        
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update email
        await updateEmail(user, newEmail);
        
        // Send verification email
        await sendEmailVerification(user);
        
        console.log('✅ Email updated successfully');
        return {
            success: true,
            message: 'Email updated! Please verify your new email.'
        };
    } catch (error) {
        console.error('❌ Email update error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Update User Password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<object>}
 */
async function updateUserPassword(currentPassword, newPassword) {
    try {
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No user signed in');
        }
        
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        
        console.log('✅ Password updated successfully');
        return {
            success: true,
            message: 'Password updated successfully!'
        };
    } catch (error) {
        console.error('❌ Password update error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Delete User Account
 * @param {string} password - Current password for re-authentication
 * @returns {Promise<object>}
 */
async function deleteUserAccount(password) {
    try {
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('No user signed in');
        }
        
        // Re-authenticate if email provider
        if (user.providerData[0]?.providerId === 'password') {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
        }
        
        // Delete user document from Firestore
        const userDocs = await queryDocuments(COLLECTIONS.USERS, [
            { field: 'uid', operator: '==', value: user.uid }
        ]);
        
        if (userDocs.length > 0) {
            await deleteDocument(COLLECTIONS.USERS, userDocs[0].id);
        }
        
        // Delete user account
        await deleteUser(user);
        
        console.log('✅ Account deleted successfully');
        return {
            success: true,
            message: 'Account deleted successfully!'
        };
    } catch (error) {
        console.error('❌ Account deletion error:', error);
        return {
            success: false,
            error: getAuthErrorMessage(error.code),
            code: error.code
        };
    }
}

/**
 * Auth State Observer
 * @param {function} callback - Callback function with user
 * @returns {function} - Unsubscribe function
 */
function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('👤 User is signed in:', user.email);
            callback(user);
        } else {
            console.log('👤 User is signed out');
            callback(null);
        }
    });
}

/**
 * Get Current User
 * @returns {object|null} - Current user or null
 */
function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Update User Last Login
 * @param {string} uid - User ID
 */
async function updateUserLastLogin(uid) {
    try {
        const userDocs = await queryDocuments(COLLECTIONS.USERS, [
            { field: 'uid', operator: '==', value: uid }
        ]);
        
        if (userDocs.length > 0) {
            await updateDocument(COLLECTIONS.USERS, userDocs[0].id, {
                lastLogin: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error updating last login:', error);
    }
}

/* ============================================== */
/* 4. CONTACT FORM HANDLERS                       */
/* ============================================== */

/**
 * Submit Contact Form
 * @param {object} formData - Contact form data
 * @returns {Promise<object>}
 */
async function submitContactForm(formData) {
    try {
        const contactData = {
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            service: formData.service || '',
            subject: formData.subject || '',
            message: formData.message || '',
            source: formData.source || 'Contact Form',
            status: 'new',
            isRead: false,
            ipAddress: await getClientIP(),
            userAgent: navigator.userAgent
        };
        
        const docId = await addDocument(COLLECTIONS.CONTACTS, contactData);
        
        console.log('✅ Contact form submitted:', docId);
        
        return {
            success: true,
            id: docId,
            message: 'Your message has been sent successfully!'
        };
    } catch (error) {
        console.error('❌ Contact form submission error:', error);
        return {
            success: false,
            error: 'Failed to send message. Please try again.'
        };
    }
}

/**
 * Submit Quick Contact (Drawer Form)
 * @param {object} formData - Quick contact form data
 * @returns {Promise<object>}
 */
async function submitQuickContact(formData) {
    try {
        const contactData = {
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            message: formData.message || '',
            source: 'Quick Contact Drawer',
            status: 'new',
            isRead: false
        };
        
        const docId = await addDocument(COLLECTIONS.QUICK_CONTACTS, contactData);
        
        console.log('✅ Quick contact submitted:', docId);
        
        return {
            success: true,
            id: docId,
            message: 'Message sent! We\'ll contact you shortly.'
        };
    } catch (error) {
        console.error('❌ Quick contact submission error:', error);
        return {
            success: false,
            error: 'Failed to send message. Please try again.'
        };
    }
}

/**
 * Get All Contacts (Admin)
 * @param {number} limitCount - Limit number of contacts
 * @returns {Promise<Array>}
 */
async function getAllContacts(limitCount = 50) {
    try {
        return await queryDocuments(COLLECTIONS.CONTACTS, [], 'createdAt', limitCount);
    } catch (error) {
        console.error('❌ Error getting contacts:', error);
        throw error;
    }
}

/**
 * Mark Contact as Read
 * @param {string} contactId - Contact document ID
 * @returns {Promise<boolean>}
 */
async function markContactAsRead(contactId) {
    try {
        await updateDocument(COLLECTIONS.CONTACTS, contactId, {
            isRead: true,
            status: 'read'
        });
        return true;
    } catch (error) {
        console.error('❌ Error marking contact as read:', error);
        return false;
    }
}

/* ============================================== */
/* 5. NEWSLETTER HANDLERS                         */
/* ============================================== */

/**
 * Subscribe to Newsletter
 * @param {string} email - Subscriber email
 * @returns {Promise<object>}
 */
async function subscribeNewsletter(email) {
    try {
        // Check if already subscribed
        const existing = await queryDocuments(COLLECTIONS.NEWSLETTER, [
            { field: 'email', operator: '==', value: email.toLowerCase() }
        ]);
        
        if (existing.length > 0) {
            return {
                success: false,
                error: 'This email is already subscribed!'
            };
        }
        
        const subscriberData = {
            email: email.toLowerCase(),
            status: 'active',
            source: 'Website',
            subscribedAt: serverTimestamp()
        };
        
        const docId = await addDocument(COLLECTIONS.NEWSLETTER, subscriberData);
        
        console.log('✅ Newsletter subscription:', docId);
        
        return {
            success: true,
            id: docId,
            message: 'Successfully subscribed! Welcome to Gothwad Technologies.'
        };
    } catch (error) {
        console.error('❌ Newsletter subscription error:', error);
        return {
            success: false,
            error: 'Subscription failed. Please try again.'
        };
    }
}

/**
 * Unsubscribe from Newsletter
 * @param {string} email - Subscriber email
 * @returns {Promise<object>}
 */
async function unsubscribeNewsletter(email) {
    try {
        const subscribers = await queryDocuments(COLLECTIONS.NEWSLETTER, [
            { field: 'email', operator: '==', value: email.toLowerCase() }
        ]);
        
        if (subscribers.length === 0) {
            return {
                success: false,
                error: 'Email not found in subscribers list.'
            };
        }
        
        await updateDocument(COLLECTIONS.NEWSLETTER, subscribers[0].id, {
            status: 'unsubscribed',
            unsubscribedAt: serverTimestamp()
        });
        
        console.log('✅ Newsletter unsubscription successful');
        
        return {
            success: true,
            message: 'Successfully unsubscribed.'
        };
    } catch (error) {
        console.error('❌ Newsletter unsubscription error:', error);
        return {
            success: false,
            error: 'Unsubscription failed. Please try again.'
        };
    }
}

/**
 * Get All Newsletter Subscribers (Admin)
 * @returns {Promise<Array>}
 */
async function getAllSubscribers() {
    try {
        return await queryDocuments(COLLECTIONS.NEWSLETTER, [
            { field: 'status', operator: '==', value: 'active' }
        ], 'subscribedAt');
    } catch (error) {
        console.error('❌ Error getting subscribers:', error);
        throw error;
    }
}

/* ============================================== */
/* 6. USER MANAGEMENT                             */
/* ============================================== */

/**
 * Get User Profile from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<object|null>}
 */
async function getUserProfile(uid) {
    try {
        const users = await queryDocuments(COLLECTIONS.USERS, [
            { field: 'uid', operator: '==', value: uid }
        ]);
        
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('❌ Error getting user profile:', error);
        return null;
    }
}

/**
 * Check if User is Admin
 * @param {string} uid - User ID
 * @returns {Promise<boolean>}
 */
async function isUserAdmin(uid) {
    try {
        const userProfile = await getUserProfile(uid);
        return userProfile?.role === 'admin';
    } catch (error) {
        console.error('❌ Error checking admin status:', error);
        return false;
    }
}

/* ============================================== */
/* 7. UTILITY FUNCTIONS                           */
/* ============================================== */

/**
 * Get Client IP Address
 * @returns {Promise<string>}
 */
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

/**
 * Track App Download
 * @param {string} appName - Name of the app
 * @param {string} appId - App ID
 * @returns {Promise<void>}
 */
async function trackAppDownload(appName, appId) {
    try {
        await addDocument(COLLECTIONS.APP_DOWNLOADS, {
            appName: appName,
            appId: appId,
            userId: auth.currentUser?.uid || 'anonymous',
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });
        console.log('📱 App download tracked:', appName);
    } catch (error) {
        console.error('Error tracking download:', error);
    }
}

/**
 * Submit Feedback
 * @param {object} feedbackData - Feedback data
 * @returns {Promise<object>}
 */
async function submitFeedback(feedbackData) {
    try {
        const docId = await addDocument(COLLECTIONS.FEEDBACK, {
            ...feedbackData,
            userId: auth.currentUser?.uid || 'anonymous',
            status: 'pending'
        });
        
        return {
            success: true,
            id: docId,
            message: 'Thank you for your feedback!'
        };
    } catch (error) {
        console.error('❌ Feedback submission error:', error);
        return {
            success: false,
            error: 'Failed to submit feedback.'
        };
    }
}

/* ============================================== */
/* 8. ERROR HANDLING                              */
/* ============================================== */

/**
 * Get User-Friendly Auth Error Message
 * @param {string} errorCode - Firebase error code
 * @returns {string} - User-friendly message
 */
function getAuthErrorMessage(errorCode) {
    const errorMessages = {
        // Sign Up Errors
        'auth/email-already-in-use': 'This email is already registered. Please sign in or use a different email.',
        'auth/invalid-email': 'Invalid email address format.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        
        // Sign In Errors
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        
        // Google Sign In Errors
        'auth/popup-closed-by-user': 'Sign in was cancelled. Please try again.',
        'auth/popup-blocked': 'Popup was blocked by browser. Please allow popups.',
        'auth/cancelled-popup-request': 'Sign in was cancelled.',
        
        // Password Reset Errors
        'auth/expired-action-code': 'Password reset link has expired. Please request a new one.',
        'auth/invalid-action-code': 'Invalid password reset link. Please request a new one.',
        
        // General Errors
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/requires-recent-login': 'Please sign in again to complete this action.',
        
        // Default
        'default': 'An error occurred. Please try again.'
    };
    
    return errorMessages[errorCode] || errorMessages['default'];
}

/* ============================================== */
/* 9. EXPORT FUNCTIONS (Global Access)            */
/* ============================================== */

// Make functions available globally for script.js integration
window.FirebaseService = {
    // Database
    db,
    addDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    queryDocuments,
    subscribeToCollection,
    
    // Auth
    auth,
    registerWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    onAuthStateChange,
    getCurrentUser,
    getUserProfile,
    isUserAdmin,
    
    // Contact Forms
    submitContactForm,
    submitQuickContact,
    getAllContacts,
    markContactAsRead,
    
    // Newsletter
    subscribeNewsletter,
    unsubscribeNewsletter,
    getAllSubscribers,
    
    // Utilities
    trackAppDownload,
    submitFeedback,
    getAuthErrorMessage,
    
    // Collections
    COLLECTIONS
};

// Legacy support - Direct function access
window.sendToFirebase = async function(collectionName, data) {
    return await addDocument(collectionName, data);
};

// Initialize Auth State Observer
onAuthStateChange((user) => {
    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: user } 
    }));
});

console.log('🔥 Firebase Services Ready - Gothwad Technologies');
console.log('📚 Access via: window.FirebaseService');

/* ============================================== */
/* END OF FIREBASE-CONFIG.JS                      */
/* ============================================== */
