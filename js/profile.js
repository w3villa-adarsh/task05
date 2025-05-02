class ProfileManager {
    static async fetchUserProfile() {
        const username = localStorage.getItem('username');
        if (!username) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('https://fakestoreapi.com/users');
            const users = await response.json();
            const user = users.find(u => u.username === username);
            
            if (user) {
                this.displayProfile(user);
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            document.getElementById('profileContent').innerHTML = `
                <div class="error-message">
                    Error loading profile information. Please try again later.
                </div>
            `;
        }
    }

    static displayProfile(user) {
        const profileContent = document.getElementById('profileContent');
        profileContent.innerHTML = `
            <div class="profile-section">
                <h2>Personal Information</h2>
                <div class="profile-info">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${user.name.firstname} ${user.name.lastname}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Username</div>
                        <div class="info-value">${user.username}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${user.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${user.phone || 'Not provided'}</div>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h2>Address</h2>
                <div class="profile-info">
                    <div class="info-item">
                        <div class="info-label">Street</div>
                        <div class="info-value">${user.address?.street || 'Not provided'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">City</div>
                        <div class="info-value">${user.address?.city || 'Not provided'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Zipcode</div>
                        <div class="info-value">${user.address?.zipcode || 'Not provided'}</div>
                    </div>
                </div>
            </div>

            <button class="edit-profile-btn">Edit Profile</button>
        `;

        // Add event listener for edit button
        const editBtn = profileContent.querySelector('.edit-profile-btn');
        editBtn.addEventListener('click', () => {
            alert('Edit profile functionality will be available soon');
        });
    }
}

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', () => {
    ProfileManager.fetchUserProfile();
});
