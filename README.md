# Fame Goal 🎯

An Instagram-inspired social networking platform built with HTML, CSS, JavaScript, and Firebase.

## Features ✨

- **User Authentication**: Secure signup and login with Firebase Authentication
- **Photo Sharing**: Upload and share photos with captions
- **Social Feed**: View posts from users you follow in a beautiful Instagram-like feed
- **User Profiles**: Customizable profiles with bio, profile picture, and post grid
- **Like & Comment**: Engage with posts through likes and comments
- **Follow System**: Follow and unfollow other users
- **Stories**: Share temporary content with stories (coming soon)
- **Real-time Updates**: Instant updates powered by Firebase Firestore

## Tech Stack 💻

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Styling**: Custom CSS with Instagram-inspired design
- **Responsive**: Mobile-first design approach

## Project Structure 📁

```
Fame-Goal/
├── index.html          # Landing/Login page
├── signup.html         # User registration page
├── feed.html          # Main feed with posts
├── profile.html       # User profile page
├── css/
│   └── styles.css     # All styling
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── auth.js            # Authentication logic
│   ├── feed.js            # Feed functionality (to be created)
│   └── profile.js         # Profile functionality (to be created)
└── README.md
```

## Setup Instructions 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/NazishQarnain/Fame-Goal.git
cd Fame-Goal
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore Database
5. Enable Storage
6. Get your Firebase configuration

### 3. Configure Firebase

Edit `js/firebase-config.js` and replace with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 4. Firestore Database Structure

Create the following collections in Firestore:

**users** collection:
```json
{
  "uid": "user_id",
  "email": "user@example.com",
  "username": "username",
  "fullname": "Full Name",
  "bio": "User bio",
  "photoURL": "profile_image_url",
  "followers": [],
  "following": [],
  "createdAt": "timestamp"
}
```

**posts** collection:
```json
{
  "uid": "post_id",
  "userId": "user_id",
  "imageUrl": "image_url",
  "caption": "Post caption",
  "likes": [],
  "comments": [],
  "createdAt": "timestamp"
}
```

### 5. Run the Application

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then navigate to `http://localhost:8000`

## Features Roadmap 🗺️

- [ ] Direct messaging
- [ ] Stories feature
- [ ] Explore page
- [ ] Hashtags
- [ ] Search functionality
- [ ] Notifications
- [ ] Post editing and deletion
- [ ] Multiple image carousel
- [ ] Video support
- [ ] Dark mode

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Author ✍️

Nazish Qarnain

## Acknowledgments 🙏

- Inspired by Instagram's design and functionality
- Built with Firebase
- Icons and emojis from Unicode

---

Made with ❤️ by Nazish Qarnain
