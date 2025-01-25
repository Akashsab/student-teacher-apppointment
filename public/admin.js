// Firebase Authentication state listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, check if they are an admin
        const userId = user.uid;
        console.log('Admin user is logged in:', userId);

        // Check if user is an admin (could be stored in Firebase Authentication or Firestore)
        const adminRef = firebase.firestore().collection('admins').doc(userId);
        adminRef.get().then((doc) => {
            if (doc.exists) {
                const adminData = doc.data();
                console.log('Admin Data:', adminData);
                // Display admin data in the UI (this is just an example)
                document.getElementById('admin-name').innerText = adminData.name;
            } else {
                console.log('No admin data found!');
                window.location.href = 'login.html'; // If not an admin, redirect to login
            }
        });
    } else {
        // Redirect to login page if the user is not signed in
        window.location.href = 'login.html';
    }
});

// Sign out functionality
function signOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful
        console.log('User signed out');
        window.location.href = 'login.html';  // Redirect to login page
    }).catch(function(error) {
        // An error happened
        console.error('Sign out error:', error);
    });
}

// Add event listener to sign out button
document.getElementById('signOutButton').addEventListener('click', signOut);

// Example of creating a user (admin functionality)
function createUser() {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value; // 'student', 'teacher'

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User created:', user);
            // Add user role to Firestore (admin, teacher, student)
            const userRef = firebase.firestore().collection(role + 's').doc(user.uid);
            userRef.set({
                email: user.email,
                role: role
            }).then(() => {
                alert(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
            }).catch((error) => {
                console.error('Error adding user data to Firestore:', error);
            });
        })
        .catch((error) => {
            console.error('Error creating user:', error.message);
        });
}
