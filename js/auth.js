// Authentication handling for login and signup

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        const currentPage = window.location.pathname;
        if (currentPage.includes('index.html') || currentPage.includes('signup.html') || currentPage === '/') {
            window.location.href = 'feed.html';
        }
    } else {
        // User is signed out
        const currentPage = window.location.pathname;
        if (currentPage.includes('feed.html') || currentPage.includes('profile.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'feed.html';
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
}

// Signup form handling
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        
        try {
            // Create user account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create user profile in Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                fullname: fullname,
                username: username,
                bio: '',
                photoURL: '',
                followers: [],
                following: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            window.location.href = 'feed.html';
        } catch (error) {
            alert('Signup failed: ' + error.message);
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            window.location.href = 'index.html';
        } catch (error) {
            alert('Logout failed: ' + error.message);
        }
    });
}
