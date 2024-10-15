import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkCVQ2pVncxz6_cdb7XWl2U91u7t8ccgY",
  authDomain: "bite-bazaar-app.firebaseapp.com",
  projectId: "bite-bazaar-app",
  storageBucket: "bite-bazaar-app.appspot.com",
  messagingSenderId: "1055572131373",
  appId: "1:1055572131373:web:cfce59dabb4161f32c02a4",
  measurementId: "G-RV9K1H3F9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In provider
const provider = new GoogleAuthProvider();

// Event listener for Google Sign-In button
document.getElementById('google').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // Successful sign-in
      const user = result.user;
      console.log("User signed in:", user);

      // Get user token if needed
      user.getIdToken().then((token) => {
        console.log("User ID Token:", token);

        // Optionally send the token to your backend
        fetch('https://bite-bazaar-server-private.onrender.com/api/users/signin-with-google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({token})
        })
        .then(response => response.json())
        .then(data => {
          console.log("Response from backend:", data);

          if (data.status != "success") {

            signOut(auth)  // Use signOut(auth) instead of firebase.auth().signOut()
              .then(() => {
                alert(`Authentication failed. ${data.message}`);
              })
              .catch((error) => {
                console.error("Error signing out:", error);
              });

          }

        })
        .catch(error => {
          console.error("Error sending token to backend:", error);
        });
      });
    })
    .catch((error) => {
      console.error("Error during Google Sign-In:", error);
    });
});
