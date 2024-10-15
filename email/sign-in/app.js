import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

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

document.getElementById('submit').addEventListener('click', function () {

  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;


  fetch('https://bite-bazaar-server-private.onrender.com/api/users/signin-with-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(response => response.json())
    .then(data => {

      if (data.status == 'success') {

        signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            // Signed in successfully
            const user = userCredential.user;
            console.log('User signed in:', user);

            alert("Hola! user congrats!");

            window.location.href = '/';
          })
          .catch(error => {
            console.error('Error during sign-in:', error.code);

            if (error.code.includes('invalid-login-credentials')) {
              alert('Wrong Password');
            }
          });

      } else {
        alert('User not exists! Please Signup');
        window.location.href = '/email'
      }

    })
    .catch(error => console.error('Error during sign-up:', error));



});
