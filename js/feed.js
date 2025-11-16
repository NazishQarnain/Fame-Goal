// Feed Page Functionality

let currentUser = null;

// Check authentication status
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await loadUserProfile();
        await loadFeed();
        await loadSuggestions();
    } else {
        window.location.href = 'index.html';
    }
});

// Load current user profile
async function loadUserProfile() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            document.getElementById('profileIcon').innerHTML = userData.photoURL ? 
                `<img src="${userData.photoURL}" alt="Profile" style="width:24px;height:24px;border-radius:50%;" />` : 
                '👤';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load feed posts
async function loadFeed() {
    try {
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = '';
        
        // Get current user's following list
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const following = userDoc.data().following || [];
        
        // Include current user's posts
        following.push(currentUser.uid);
        
        // Get posts from followed users
        const postsQuery = await db.collection('posts')
            .where('userId', 'in', following.slice(0, 10)) // Firestore limit
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        for (const doc of postsQuery.docs) {
            const post = doc.data();
            const postElement = await createPostElement(doc.id, post);
            postsContainer.appendChild(postElement);
        }
        
        if (postsQuery.empty) {
            postsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#8e8e8e;">No posts yet. Follow users to see their posts!</div>';
        }
    } catch (error) {
        console.error('Error loading feed:', error);
        document.getElementById('postsContainer').innerHTML = '<div style="text-align:center;padding:40px;color:#8e8e8e;">Error loading feed. Please refresh.</div>';
    }
}

// Create post element
async function createPostElement(postId, post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    
    // Get post author info
    const authorDoc = await db.collection('users').doc(post.userId).get();
    const author = authorDoc.data();
    
    // Check if current user liked the post
    const isLiked = post.likes && post.likes.includes(currentUser.uid);
    
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${author.photoURL || 'https://via.placeholder.com/32'}" alt="${author.username}" class="post-avatar">
            <span class="post-username">${author.username}</span>
        </div>
        <img src="${post.imageUrl}" alt="Post" class="post-image">
        <div class="post-actions">
            <span class="like-btn" data-post-id="${postId}">${isLiked ? '❤️' : '🤍'}</span>
            <span>💬</span>
            <span>✈️</span>
        </div>
        <div class="post-likes">${post.likes ? post.likes.length : 0} likes</div>
        <div class="post-caption"><strong>${author.username}</strong> ${post.caption || ''}</div>
        <div class="post-time">${getTimeAgo(post.createdAt)}</div>
    `;
    
    // Add like functionality
    postDiv.querySelector('.like-btn').addEventListener('click', () => toggleLike(postId, post));
    
    return postDiv;
}

// Toggle like on post
async function toggleLike(postId, post) {
    try {
        const postRef = db.collection('posts').doc(postId);
        const likes = post.likes || [];
        
        if (likes.includes(currentUser.uid)) {
            // Unlike
            await postRef.update({
                likes: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
            });
        } else {
            // Like
            await postRef.update({
                likes: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
        }
        
        // Reload feed
        await loadFeed();
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// Load user suggestions
async function loadSuggestions() {
    try {
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        suggestionsContainer.innerHTML = '';
        
        // Get current user's following list
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const following = userDoc.data().following || [];
        
        // Get users not followed
        const usersQuery = await db.collection('users')
            .limit(5)
            .get();
        
        usersQuery.docs.forEach(doc => {
            const user = doc.data();
            if (doc.id !== currentUser.uid && !following.includes(doc.id)) {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;';
                suggestionDiv.innerHTML = `
                    <div style="display:flex;align-items:center;">
                        <img src="${user.photoURL || 'https://via.placeholder.com/32'}" style="width:32px;height:32px;border-radius:50%;margin-right:12px;" />
                        <div>
                            <div style="font-weight:600;font-size:14px;">${user.username}</div>
                            <div style="font-size:12px;color:#8e8e8e;">${user.fullname}</div>
                        </div>
                    </div>
                    <button class="btn-follow" data-user-id="${doc.id}" style="color:#0095f6;background:none;border:none;font-weight:600;cursor:pointer;">Follow</button>
                `;
                suggestionDiv.querySelector('.btn-follow').addEventListener('click', () => followUser(doc.id));
                suggestionsContainer.appendChild(suggestionDiv);
            }
        });
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

// Follow user
async function followUser(userId) {
    try {
        await db.collection('users').doc(currentUser.uid).update({
            following: firebase.firestore.FieldValue.arrayUnion(userId)
        });
        
        await db.collection('users').doc(userId).update({
            followers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });
        
        await loadSuggestions();
        await loadFeed();
    } catch (error) {
        console.error('Error following user:', error);
    }
}

// Create post modal functionality
const createPostBtn = document.getElementById('createPostBtn');
const createPostModal = document.getElementById('createPostModal');
const closeModal = document.querySelector('.close');

if (createPostBtn) {
    createPostBtn.addEventListener('click', () => {
        createPostModal.style.display = 'block';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        createPostModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === createPostModal) {
        createPostModal.style.display = 'none';
    }
});

// Submit post
const submitPostBtn = document.getElementById('submitPost');
if (submitPostBtn) {
    submitPostBtn.addEventListener('click', async () => {
        const imageFile = document.getElementById('postImage').files[0];
        const caption = document.getElementById('postCaption').value;
        
        if (!imageFile) {
            alert('Please select an image');
            return;
        }
        
        try {
            submitPostBtn.disabled = true;
            submitPostBtn.textContent = 'Uploading...';
            
            // Upload image to Firebase Storage
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`posts/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
            await imageRef.put(imageFile);
            const imageUrl = await imageRef.getDownloadURL();
            
            // Create post document
            await db.collection('posts').add({
                userId: currentUser.uid,
                imageUrl: imageUrl,
                caption: caption,
                likes: [],
                comments: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Close modal and reload feed
            createPostModal.style.display = 'none';
            document.getElementById('postImage').value = '';
            document.getElementById('postCaption').value = '';
            submitPostBtn.disabled = false;
            submitPostBtn.textContent = 'Share';
            
            await loadFeed();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post: ' + error.message);
            submitPostBtn.disabled = false;
            submitPostBtn.textContent = 'Share';
        }
    });
}

// Get time ago helper
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const postDate = timestamp.toDate();
    const seconds = Math.floor((now - postDate) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}
