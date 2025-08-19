// Function to apply the stored theme on page load
function applyStoredTheme() {
  // Get the saved theme; default to "dark" if none found
  const theme = localStorage.getItem('theme') || 'dark';
  if (theme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  
  // Set the toggle switch state accordingly
  const toggleSwitch = document.getElementById('toggle-dark-mode');
  if (toggleSwitch) {
    toggleSwitch.checked = (theme === 'dark');
  }
}

// Apply the stored theme when the page loads
applyStoredTheme();

// Listen for changes on the toggle switch to update theme and store preference
document.getElementById('toggle-dark-mode').addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
});
