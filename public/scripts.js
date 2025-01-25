import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const loginForm = document.getElementById('loginForm');
const signOutButton = document.getElementById('signOutButton');

// Login process
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Authenticate user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (!userData) {
            alert('User data not found in Firestore.');
            return;
        }

        // Redirect based on role
        if (userData.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (userData.role === 'teacher') {
            window.location.href = 'teacher.html';
        } else if (userData.role === 'student') {
            window.location.href = 'student.html';
        } else {
            alert('Role not recognized.');
        }
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
});

// Sign out process
signOutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('You have been signed out.');
        window.location.href = 'index.html'; // Redirect to login page
    } catch (error) {
        alert('Error signing out: ' + error.message);
    }
});

