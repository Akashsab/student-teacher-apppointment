const { onRequest } = require('firebase-functions/v2').https;
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const logger = require('firebase-functions/logger');

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();
const auth = getAuth();

// Example HTTP Function: Hello World
exports.helloWorld = onRequest((req, res) => {
  logger.info('HelloWorld function invoked!');
  res.send('Hello from Firebase!');
});

// Example: Create a user document in Firestore
exports.createUser = onRequest(async (req, res) => {
  const { email, name, role } = req.body;

  if (!email || !name || !role) {
    res.status(400).send('Missing required fields: email, name, or role');
    return;
  }

  try {
    const newUser = {
      email,
      name,
      role,
      createdAt: new Date(),
    };

    const docRef = await db.collection('users').add(newUser);
    logger.info(`User created with ID: ${docRef.id}`);
    res.status(201).send(`User created with ID: ${docRef.id}`);
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

// Example: Fetch all users from Firestore
exports.getAllUsers = onRequest(async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Example: Sign-out user (server-side - example use case)
exports.signOutUser = onRequest(async (req, res) => {
  const { uid } = req.body; // This would be passed from the client-side

  if (!uid) {
    res.status(400).send('Missing UID');
    return;
  }

  try {
    // You cannot directly sign out a user from the server side using Firebase Admin SDK.
    // Firebase authentication tokens are handled client-side. But you can revoke the user's tokens.

    await auth.revokeRefreshTokens(uid);
    const user = await auth.getUser(uid);
    logger.info(`User signed out and refresh tokens revoked: ${user.uid}`);

    res.status(200).send(`User with UID: ${user.uid} has been signed out and their refresh tokens revoked.`);
  } catch (error) {
    logger.error('Error signing out user:', error);
    res.status(500).send('Error signing out user');
  }
});
