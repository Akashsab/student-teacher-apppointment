// Firebase Authentication state listener
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userId = user.uid;
        console.log('Teacher user is logged in:', userId);

        // Fetch and display appointments for the teacher
        fetchAppointments(userId);
    } else {
        // Redirect to login page if the user is not signed in
        window.location.href = 'login.html';
    }
});

// Fetch and display appointments for the logged-in teacher
function fetchAppointments(teacherId) {
    const appointmentsList = document.getElementById('appointments-list'); // Container for appointments
    appointmentsList.innerHTML = ''; // Clear previous content

    firebase.firestore().collection('appointments')
        .where('teacherId', '==', teacherId)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                appointmentsList.innerHTML = '<li>No appointments found.</li>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const appointment = doc.data();
                const appointmentItem = document.createElement('li');
                appointmentItem.textContent = `Student ID: ${appointment.studentId}, Date: ${appointment.date}`;
                appointmentsList.appendChild(appointmentItem);
            });
        })
        .catch((error) => {
            console.error('Error fetching appointments:', error.message);
            alert('Error fetching appointments: ' + error.message);
        });
}

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

