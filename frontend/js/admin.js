
document.addEventListener('DOMContentLoaded', async () => {
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        window.location.href = 'index.html';
        return;
    }

    try {
        const stats = await apiRequest('/admin/stats');
        document.getElementById('totalUsers').textContent = stats.users;
        document.getElementById('totalPosts').textContent = stats.posts;
        document.getElementById('totalComments').textContent = stats.comments;

        const users = await apiRequest('/admin/users');
        const usersContainer = document.getElementById('adminUsersContainer');
        usersContainer.innerHTML = `<table style="width:100%; text-align:left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 0.5rem;">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
            </tr>
            ${users.map(u => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.5rem;">${u.name}</td>
                    <td>${u.email}</td>
                    <td><span class="badge">${u.role}</span></td>
                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('')}
        </table>`;

        // We can just fetch all posts using existing endpoint
        const posts = await apiRequest('/posts');
        const postsContainer = document.getElementById('adminPostsContainer');
        postsContainer.innerHTML = `<table style="width:100%; text-align:left; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 0.5rem;">Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
            ${posts.map(p => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 0.5rem;">
                        <a href="post.html?id=${p.id}">${p.title.substring(0, 30)}...</a>
                    </td>
                    <td>${p.author.name}</td>
                    <td>${new Date(p.created_at).toLocaleDateString()}</td>
                    <td>
                        <button onclick="deletePostAdmin(${p.id})" class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </table>`;

    } catch (error) {
        showToast('Error loading admin dashboard', 'error');
    }
});

async function deletePostAdmin(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await apiRequest(`/posts/${id}`, { method: 'DELETE' });
        showToast('Post deleted successfully');
        window.location.reload();
    } catch (error) {}
}
