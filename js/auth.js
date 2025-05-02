class AuthManager {
    static init() {
        this.setupDropdown();
        this.updateUI();
        this.setupLogout();
    }

    static setupDropdown() {
        const userIcon = document.getElementById('userIcon');
        const dropdown = document.getElementById('profileDropdown');

        if (userIcon && dropdown) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const username = localStorage.getItem('username');
                if (!username) {
                    window.location.href = 'login.html';
                    return;
                }
                dropdown.classList.toggle('active');
            });

            // Handle clicks on dropdown items
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                const link = e.target.closest('a');
                if (link) {
                    if (link.id === 'logoutBtn') {
                        this.logout();
                    } else {
                        window.location.href = link.getAttribute('href');
                    }
                    dropdown.classList.remove('active');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }
    }

    static updateUI() {
        const username = localStorage.getItem('username');
        const userSpan = document.getElementById('username');
        const dropdown = document.getElementById('profileDropdown');

        if (username) {
            userSpan.textContent = username;
            // Remove the anchor tag if it exists
            const userIcon = document.getElementById('userIcon');
            if (userIcon.querySelector('a')) {
                userIcon.innerHTML = `<span id="username">${username}</span>`;
            }
            dropdown?.classList.add('logged-in');
        } else {
            userSpan.textContent = 'Login';
            dropdown?.classList.remove('logged-in');
        }
    }

    static setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    static logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
}

// Initialize auth management
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
