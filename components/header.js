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

    initializeHeader(); 

    const userCart = document.getElementById('user-cart');
    const loginBtn = document.getElementById('login-btn');
    const isLoggedIn =  localStorage.getItem('isLoggedIn');


    if (isLoggedIn) {
        userCart.style.display = 'flex';
        loginBtn.style.display = 'none';
    } else {
        userCart.style.display = 'none';
        loginBtn.style.display = 'block';
    }


    
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-item');
    console.log('method executed')
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productBrand = card.querySelector('.brand')?.textContent.toLowerCase() || '';
        const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || 
            productBrand.includes(searchTerm) || 
            productDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
    
});

fetch('./components/footer.html')
.then(res => res.text())
.then(data => {
  document.getElementById('footer').innerHTML = data;
});




