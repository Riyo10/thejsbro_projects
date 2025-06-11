const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
let passwordVisible = false;

togglePassword.addEventListener('click', () => {
  passwordVisible = !passwordVisible;

  // Toggle input type
  passwordInput.type = passwordVisible ? 'text' : 'password';

  // Swap icon
  togglePassword.src = passwordVisible 
    ? 'images/eye-open.png' 
    : 'images/eye-closed.png';

  // Re-set the placeholder manually to fix placeholder flicker (optional fallback)
  passwordInput.placeholder = '.......';
});
