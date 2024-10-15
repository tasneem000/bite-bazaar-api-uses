import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, signOut } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

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



window.recaptchaVerifier = new RecaptchaVerifier(auth, 'submit', {
  'size': 'invisible',
  'callback': (response) => {
    onSignInSubmit();
  }
});

document.getElementById('submit').addEventListener('click', function () {

  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  const appVerifier = window.recaptchaVerifier;

  // Phone number sign-in
  signInWithPhoneNumber(auth, phone, appVerifier)
    .then((confirmationResult) => {
      // SMS sent, prompt the user to enter the code
      const verificationCode = window.prompt("Enter the verification code sent to your phone:");
      return confirmationResult.confirm(verificationCode);
    })
    .then((result) => {
      const user = result.user;

      user.getIdToken().then((token) => {


        fetch('https://bite-bazaar-server-private.onrender.com/api/users/signin-with-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            phone: phone,
            password: password,
            token: token
          })
        })
          .then(response => response.json())
          .then(data => {

            if (data.status != "success") {

              signOut(auth)
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

      console.log("User signed in:", user);
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
    });
});
