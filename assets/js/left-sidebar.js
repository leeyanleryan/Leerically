// Get the Sidebar
var mySidebar = document.getElementById("left-sidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("sidebar-overlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = 'none';
    document.body.classList.remove('left-sidebar-open');
    localStorage.setItem('sidebarOpen','false');
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = 'block';
    document.body.classList.add('left-sidebar-open');
    localStorage.setItem('sidebarOpen','true');
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
  document.body.classList.remove('left-sidebar-open');
  localStorage.setItem('sidebarOpen','false');
}

window.addEventListener('DOMContentLoaded', function(){
  // only auto-open on wide screens
  var isDesktop = window.matchMedia('(min-width:1181px)').matches;
  var wasOpen   = localStorage.getItem('sidebarOpen') === 'true';

  if (isDesktop && wasOpen) {
    // restore open
    mySidebar.style.display    = 'block';
    overlayBg.style.display    = 'block';
    document.body.classList.add('left-sidebar-open');
  } else {
    // ensure closed
    mySidebar.style.display    = 'none';
    overlayBg.style.display    = 'none';
    document.body.classList.remove('left-sidebar-open');
  }
});