
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function updateNavbar() {
    const nav = document.getElementById('navbar');
    const user = getCurrentUser();
    
    if (user) {
        let navHtml = `
            <a href="index.html">Home</a>
            <a href="create-post.html">Create Post</a>
            <a href="profile.html">My Profile</a>
        `;
        if (user.role === 'ADMIN') {
            navHtml += `<a href="admin.html">Admin</a>`;
        }
        navHtml += `
            <a href="#" onclick="logoutUser()">Logout (${user.name})</a>
        `;
        nav.innerHTML = navHtml;
    } else {
        nav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login / Register</a>
        `;
    }
}

async function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Event Listeners for auth pages
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            try {
                const response = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: formData
                });
                localStorage.setItem('token', response.access_token);
                localStorage.setItem('user', JSON.stringify(response.user));
                window.location.href = 'index.html';
            } catch (error) {}
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            try {
                await apiRequest('/auth/register', {
                    method: 'POST',
                    body: { name, email, password }
                });
                showToast('Registration successful! Please login.');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } catch (error) {}
        });
    }
});
