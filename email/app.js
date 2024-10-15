import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

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

document.getElementById('submit').addEventListener('click', async function () {

  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;

  
  const result = await fetch(`https://bite-bazaar-server-private.onrender.com/api/users/${email}`);  

  if(result.status == 200){
    alert("User already exists! Please Sign In Instead!");
  }else{


    fetch('https://bite-bazaar-server-private.onrender.com/api/users/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'OTP sent to email') {
          alert('OTP sent! successfully');
  
          const otp = prompt("Please enter the OTP!");
  
          fetch('https://bite-bazaar-server-private.onrender.com/api/users/signup-with-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password, name })
          })
            .then(response => response.json())
            .then(data => {
              if (data.message === 'User created successfully') {
  
  
                console.log('Sign up successful:', data.user);
  
                signInWithEmailAndPassword(auth, email, password)
                  .then(userCredential => {
                    // Signed in successfully
                    const user = userCredential.user;
                    console.log('User signed in:', user);
  
                    alert("Hola! user congrats!");
                    // Perform any actions after the user is signed in, e.g., redirect to another page
                    window.location.href = '/';  // Example: Redirecting to a dashboard page
                  })
                  .catch(error => {
                    console.error('Error during Firebase sign-in:', error);
                  });
  
              }
            })
            .catch(error => console.error('Error during sign-up:', error));
        }
      })
      .catch(error => console.error('Error sending OTP:', error));


  }



});
