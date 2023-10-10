  // Wait for the DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Your Firebase-related code
    const signupButton = document.getElementById('signup-button');
    const signupForm = document.getElementById('signupOverlay');
    signupButton.addEventListener('click', () => {
      const signupEmail = document.getElementById('signupEmail');
      const signupPassword = document.getElementById('signupPassword');

      // Reset animation styles to remove previous animations
      signupEmail.style.animation = 'none';
      signupPassword.style.animation = 'none';

      // Create a new user with the provided email and password
      firebase
        .auth()
        .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
        .then((userCredential) => {
          // Sign-up successful, you can now do something with the user data
          const user = userCredential.user;
          console.log('Sign-up successful:', user);
          signupForm.style.display = 'none';
        })
        .catch((error) => {
          // Handle sign-up errors
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === 'auth/email-already-in-use') {
            // The email address is already in use
            alert('Email address is already in use.');
            // Add red background and shake animation
            signupEmail.style.animation = 'turnRed 1s, shake 0.5s';
          } else if (errorCode === 'auth/weak-password') {
            // The password is too weak
            alert('Password is too weak. Choose a stronger password.');
            // Add red background and shake animation
            signupPassword.style.animation = 'turnRed 1s, shake 0.5s';
          } else {
            // Handle other errors
            console.error('Sign-up error:', errorCode, errorMessage);
          }
        });
    });
  });
