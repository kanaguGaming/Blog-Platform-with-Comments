
document.addEventListener('DOMContentLoaded', async () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const me = await apiRequest('/auth/me');
        document.getElementById('profileName').textContent = me.name;
        document.getElementById('profileEmail').textContent = me.email;
        document.getElementById('profileDate').textContent = new Date(me.created_at).toLocaleDateString();

        const posts = await apiRequest(`/users/${me.id}/posts`);
        const container = document.getElementById('myPostsContainer');
        
        if (posts.length === 0) {
            container.innerHTML = '<p>You haven\'t published any posts yet.</p>';
        } else {
            container.innerHTML = posts.map(post => `
                <div class="post-card">
                    <div class="post-content">
                        <h3 style="margin-bottom: 0.5rem;">${post.title}</h3>
                        <div class="post-meta">
                            ${new Date(post.created_at).toLocaleDateString()}
                            <span class="badge" style="float: right;">${post.category}</span>
                        </div>
                        <div style="margin-top: 1rem; display:flex; gap:0.5rem;">
                            <a href="post.html?id=${post.id}" class="btn" style="flex:1;">View</a>
                            <a href="edit-post.html?id=${post.id}" class="btn" style="flex:1;">Edit</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showToast('Error loading profile', 'error');
    }
});
