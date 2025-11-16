// Profile Page Functionality

let currentUser = null;
let profileUserId = null;

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        
        // Get profile user ID from URL or use current user
        const urlParams = new URLSearchParams(window.location.search);
        profileUserId = urlParams.get('userId') || currentUser.uid;
        
        await loadProfile();
        await loadUserPosts();
    } else {
        window.location.href = 'index.html';
    }
});

// Load profile information
async function loadProfile() {
    try {
        const userDoc = await db.collection('users').doc(profileUserId).get();
        
        if (!userDoc.exists) {
            alert('User not found');
            window.location.href = 'feed.html';
            return;
        }
        
        const userData = userDoc.data();
        const isOwnProfile = profileUserId === currentUser.uid;
        
        // Update profile UI
        document.getElementById('profileUsername').textContent = userData.username;
        document.getElementById('profileFullname').textContent = userData.fullname;
        document.getElementById('profileBio').textContent = userData.bio || '';
        
        // Set profile avatar
        if (userData.photoURL) {
            document.getElementById('profileAvatar').src = userData.photoURL;
        }
        
        // Show/hide edit button based on ownership
        const editBtn = document.getElementById('editProfileBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (isOwnProfile) {
            editBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'inline-block';
        } else {
            editBtn.style.display = 'none';
            logoutBtn.style.display = 'none';
            
            // Show follow/unfollow button
            const currentUserDoc = await db.collection('users').doc(currentUser.uid).get();
            const following = currentUserDoc.data().following || [];
            const isFollowing = following.includes(profileUserId);
            
            editBtn.outerHTML = `<button id="followBtn" class="btn-primary">${isFollowing ? 'Unfollow' : 'Follow'}</button>`;
            
            document.getElementById('followBtn').addEventListener('click', () => toggleFollow(isFollowing));
        }
        
        // Load stats
        await loadStats(userData);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile');
    }
}

// Load profile stats
async function loadStats(userData) {
    try {
        // Get post count
        const postsQuery = await db.collection('posts')
            .where('userId', '==', profileUserId)
            .get();
        
        document.getElementById('postsCount').textContent = postsQuery.size;
        document.getElementById('followersCount').textContent = (userData.followers || []).length;
        document.getElementById('followingCount').textContent = (userData.following || []).length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load user posts
async function loadUserPosts() {
    try {
        const postsContainer = document.getElementById('profilePosts');
        postsContainer.innerHTML = '';
        
        const postsQuery = await db.collection('posts')
            .where('userId', '==', profileUserId)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (postsQuery.empty) {
            postsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#8e8e8e;grid-column:1/-1;">No posts yet</div>';
            return;
        }
        
        postsQuery.forEach(doc => {
            const post = doc.data();
            const postDiv = document.createElement('div');
            postDiv.className = 'profile-post';
            postDiv.innerHTML = `<img src="${post.imageUrl}" alt="Post" />`;
            postDiv.addEventListener('click', () => openPost(doc.id, post));
            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Toggle follow/unfollow
async function toggleFollow(isFollowing) {
    try {
        const followBtn = document.getElementById('followBtn');
        followBtn.disabled = true;
        
        if (isFollowing) {
            // Unfollow
            await db.collection('users').doc(currentUser.uid).update({
                following: firebase.firestore.FieldValue.arrayRemove(profileUserId)
            });
            
            await db.collection('users').doc(profileUserId).update({
                followers: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
            });
            
            followBtn.textContent = 'Follow';
        } else {
            // Follow
            await db.collection('users').doc(currentUser.uid).update({
                following: firebase.firestore.FieldValue.arrayUnion(profileUserId)
            });
            
            await db.collection('users').doc(profileUserId).update({
                followers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
            
            followBtn.textContent = 'Unfollow';
        }
        
        followBtn.disabled = false;
        await loadProfile();
    } catch (error) {
        console.error('Error toggling follow:', error);
        alert('Error updating follow status');
    }
}

// Open post modal (placeholder - implement as needed)
function openPost(postId, post) {
    alert(`Post clicked! ID: ${postId}\nCaption: ${post.caption}`);
    // TODO: Implement post detail modal
}

// Edit profile
const editProfileBtn = document.getElementById('editProfileBtn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        const newBio = prompt('Enter new bio:', document.getElementById('profileBio').textContent);
        if (newBio !== null) {
            db.collection('users').doc(currentUser.uid).update({
                bio: newBio
            }).then(() => {
                document.getElementById('profileBio').textContent = newBio;
            }).catch(error => {
                console.error('Error updating bio:', error);
                alert('Error updating bio');
            });
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out');
        }
    });
}
