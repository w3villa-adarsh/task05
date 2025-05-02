document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Handle cart icon click
document.getElementById('cartIcon').addEventListener('click', () => {
    window.location.href = 'cart.html';
});
