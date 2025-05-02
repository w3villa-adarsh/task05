async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('/components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header').innerHTML = headerHtml;

        // Load footer
        const footerResponse = await fetch('/components/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer').innerHTML = footerHtml;

        // Update user icon based on auth status
        const userIcon = document.getElementById('userIcon');
        if (userIcon) {
            userIcon.addEventListener('click', () => {
                if (window.auth && window.auth.isLoggedIn()) {
                    window.auth.logout();
                } else {
                    window.location.href = '/login.html';
                }
            });
        }

        // Initialize cart count
        if (window.CartManager) {
            CartManager.initialize();
        }

    } catch (error) {
        console.error('Error loading components:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);
