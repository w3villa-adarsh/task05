document.addEventListener('DOMContentLoaded', function() {
    // Wait for the header content to load
    setTimeout(() => {
        initializeHeader();
    }, 100);
});

function initializeHeader() {
    // User popup functionality
    const userIcon = document.querySelector('.user-icon');
    const userPopup = document.querySelector('.user-popup');
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    if (userIcon && userPopup) {
        userIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            userPopup.classList.toggle('active');
        });

        // Close popup when clicking outside
        document.addEventListener('click', function(e) {
            if (!userIcon.contains(e.target)) {
                userPopup.classList.remove('active');
            }
        });
    }

    // Hamburger menu functionality
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
}

fetch('./components/header.html')
.then(res => res.text())
.then(data => {
  document.getElementById('header').innerHTML = data;
});
fetch('./components/footer.html')
.then(res => res.text())
.then(data => {
  document.getElementById('footer').innerHTML = data;
});