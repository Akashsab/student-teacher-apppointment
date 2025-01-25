// Firebase Authentication state listener
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userId = user.uid;
        console.log('Student user is logged in:', userId);

        // Load student-specific data
        const studentRef = firebase.firestore().collection('students').doc(userId);
        studentRef.get().then((doc) => {
            if (doc.exists) {
                const studentData = doc.data();
                console.log('Student Data:', studentData);
                document.getElementById('student-name').innerText = studentData.name;
            } else {
                console.log('No student data found!');
            }
        });
    } else {
        // Redirect to login page if the user is not signed in
        window.location.href = 'login.html';
    }
});

// Sign-out functionality
function signOut() {
    firebase.auth().signOut()
        .then(() => {
            alert('You have been signed out successfully.');
            window.location.href = 'login.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error('Sign-out error:', error.message);
            alert('Error signing out: ' + error.message);
        });
}

// Add event listener for the Sign-Out button
document.getElementById('signOutButton').addEventListener('click', signOut);

// Function to create an appointment
function createAppointment() {
    const userId = firebase.auth().currentUser.uid;
    const teacherId = document.getElementById('teacher-id').value; // Teacher ID input
    const appointmentDate = document.getElementById('appointment-date').value;

    if (!teacherId || !appointmentDate) {
        alert('Please select a teacher and appointment date.');
        return;
    }

    firebase.firestore().collection('appointments').add({
        teacherId: teacherId,
        studentId: userId,
        date: appointmentDate,
        status: 'Pending', // Optional: You can track appointment status
    })
        .then((docRef) => {
            console.log('Appointment created with ID:', docRef.id);
            alert('Your appointment has been fixed successfully!');
        })
        .catch((error) => {
            console.error('Error creating appointment:', error.message);
            alert('Error fixing appointment: ' + error.message);
        });
}
import { db } from './firebaseConfig.js'; // Ensure Firebase Firestore is imported

const loadTeachers = async () => {
    const teacherDropdown = document.getElementById('teacherName');
    try {
        const teacherSnapshot = await db.collection('teachers').get();
        if (teacherSnapshot.empty) {
            console.warn('No teachers found in the database!');
            alert('No teachers available. Please contact admin.');
            return;
        }

        teacherSnapshot.forEach((doc) => {
            const teacher = doc.data();
            console.log('Teacher Data:', teacher); // Log teacher data for debugging
            if (teacher.name) {
                const option = document.createElement('option');
                option.value = doc.id; // Use document ID as the value
                option.textContent = teacher.name; // Display teacher name
                teacherDropdown.appendChild(option);
            } else {
                console.warn('Teacher document missing name field:', doc.id);
            }
        });
    } catch (error) {
        console.error('Error fetching teachers:', error.message);
        alert('Error loading teachers: ' + error.message);
    }
};

// Call the function when the page loads
window.onload = () => {
    loadTeachers();
};


