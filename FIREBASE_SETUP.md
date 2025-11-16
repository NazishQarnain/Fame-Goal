# Firebase Setup Guide for Fame-Goal

This guide will walk you through setting up Firebase backend for your Fame-Goal Instagram-like social platform.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `fame-goal` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional) or configure it
6. Click **Create project**
7. Wait for project creation to complete
8. Click **Continue**

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon (</>)** to add a web app
2. Enter app nickname: `Fame Goal Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register app**
5. You'll see your Firebase configuration object - **SAVE THIS**

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** switch ON
6. Click **Save**

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (or Test mode for development)
4. Select your preferred location (e.g., `asia-south1` for India)
5. Click **Enable**

### Create Collections:

Firebase will auto-create collections, but here's the structure:

**users collection:**
- Will be created automatically when users sign up
- Structure: uid, email, username, fullname, bio, photoURL, followers[], following[]

**posts collection:**
- Will be created when users create posts
- Structure: userId, imageUrl, caption, likes[], comments[], createdAt

## Step 5: Set Firestore Security Rules

1. Go to **Firestore Database > Rules**
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if true; // Anyone can read user profiles
      allow write: if request.auth != null && request.auth.uid == userId; // Only own profile
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true; // Anyone can read posts
      allow create: if request.auth != null; // Logged in users can create
      allow update: if request.auth != null; // Logged in users can like/comment
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId; // Only owner can delete
    }
  }
}
```

3. Click **Publish**

## Step 6: Enable Firebase Storage

1. In Firebase Console, go to **Build > Storage**
2. Click **Get started**
3. Keep default security rules (or customize)
4. Click **Next**
5. Choose your storage location
6. Click **Done**

### Set Storage Security Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Configure Your App

1. Open `js/firebase-config.js` in your GitHub repository
2. Click **Edit** (pencil icon)
3. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // From Firebase Console
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Where to find these values:

1. In Firebase Console, click the **gear icon** (Settings)
2. Go to **Project settings**
3. Scroll down to **Your apps** section
4. Copy each value from the config object shown

## Step 8: Test Your App

1. Visit your live site: https://nazishqarnain.github.io/Fame-Goal/
2. Click **Sign up**
3. Create an account with:
   - Email: test@example.com
   - Full Name: Test User
   - Username: testuser
   - Password: Test123!
4. Click **Sign Up**
5. You should be redirected to the feed page

## Step 9: Verify Setup

### Check Authentication:
1. Go to Firebase Console > **Authentication > Users**
2. You should see your test user listed

### Check Firestore:
1. Go to Firebase Console > **Firestore Database**
2. You should see a `users` collection with your user document

### Check Storage:
1. Try creating a post with an image
2. Go to Firebase Console > **Storage**
3. You should see uploaded images in `/posts/{userId}/` folder

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure you've updated `js/firebase-config.js` with your actual Firebase credentials

### Error: "Missing or insufficient permissions"
**Solution:** Check your Firestore Security Rules and make sure they're published

### Images not uploading
**Solution:** Verify Firebase Storage is enabled and security rules are set correctly

### Can't see posts
**Solution:** Create some test posts and make sure you're following yourself or other users

## Important Notes

- **Don't share your Firebase credentials publicly**
- For production, use environment variables or Firebase Hosting
- Monitor your Firebase usage in the Console
- Free tier limits:
  - Authentication: 10,000 verifications/month
  - Firestore: 50,000 reads/day, 20,000 writes/day
  - Storage: 1 GB stored, 10 GB transferred/month

## Next Steps

1. Customize the app UI/colors
2. Add more features (comments, stories, direct messages)
3. Implement image compression before upload
4. Add profile picture upload functionality
5. Implement search functionality
6. Add notifications

## Support

If you encounter any issues, check:
1. Browser console for error messages
2. Firebase Console logs
3. Network tab in Developer Tools

---

**Congratulations! Your Instagram-like social platform is now fully functional with Firebase backend!** 🎉
