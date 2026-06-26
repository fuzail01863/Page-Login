import { requireGuest } from "./auth-guard.js";
import { auth, collection, db, deleteDoc, deleteUser, doc, getAuth, getDocs, onAuthStateChanged, query, signOut, where } from "./firebaseConfig.js"

// let deleteAccBtn = document.querySelector("#deleteAcc-btn");
let currentUserData = null;
let userId = null;
let userEmail = document.getElementById("user-email");
let avatarLetter = document.getElementById("avatar-letter");

const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const mainContent = document.getElementById('main-content');


// Sidebar Kholne ke liye
if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Click event ko baahar phailne se rokne ke liye
        sidebar.classList.add('active');
    });
}

// Sidebar Band karne ke liye
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// Agar screen par kahin bhi baahar click ho to mobile par sidebar band ho jaye
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        // Agar click sidebar ke andar nahi hua aur menu button par bhi nahi hua
        if (!sidebar.contains(e.target) && e.target !== openSidebarBtn) {
            sidebar.classList.remove('active');
        }
    }
});

// --- Touch / Swipe support for mobile: open from left edge, swipe to close ---
let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;

const isSidebarActive = () => sidebar && sidebar.classList.contains('active');

document.addEventListener('touchstart', (e) => {
    if (!sidebar || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    // Start gesture if sidebar is open, or user touches near left edge
    if (isSidebarActive() || touchStartX <= 30) {
        isTouching = true;
        // Temporarily disable CSS transition while dragging
        sidebar.style.transition = 'none';
    }
});

document.addEventListener('touchmove', (e) => {
    if (!isTouching || !sidebar || e.touches.length !== 1) return;
    touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    const swWidth = sidebar.offsetWidth || 260;

    if (!isSidebarActive()) {
        // User is dragging from edge to open
        if (deltaX > 0) {
            const translateX = Math.min(0, -swWidth + deltaX);
            sidebar.style.transform = `translateX(${translateX}px)`;
        }
    } else {
        // Sidebar is open; allow dragging left to close
        if (deltaX < 0) {
            const translateX = Math.max(-swWidth, deltaX);
            sidebar.style.transform = `translateX(${translateX}px)`;
        }
    }
});

document.addEventListener('touchend', () => {
    if (!isTouching || !sidebar) return;
    isTouching = false;
    // Restore transition
    sidebar.style.transition = '';
    const deltaX = touchCurrentX - touchStartX;
    const threshold = (sidebar.offsetWidth || 260) / 3;

    if (!isSidebarActive()) {
        if (deltaX > threshold) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
        }
    } else {
        if (deltaX < -threshold) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.add('active');
        }
    }

    // Clear inline transform so CSS takes over
    sidebar.style.transform = '';
    touchStartX = touchCurrentX = 0;
});

// requireGuest(); /// auth-guard check

/// get uid from localstorage
let getUserfromLocalStorage = () => {
    userId = JSON.parse(window.localStorage.getItem("uid"));
    console.log("uid = >", userId)
}
getUserfromLocalStorage();

// // keep localStorage in sync with Firebase auth state
// onAuthStateChanged(auth, (user) => {
//     if (!user) {
//         console.log('user signed out - cleared uid from localStorage');
//         // if we are on dashboard, redirect to index
//         if (window.location.pathname.endsWith('dashboard.html')) {
//             window.location.replace('./index.html');    
//         window.localStorage.removeItem('uid');
//         }
//     } else {
//         // ensure uid stored    
//         window.localStorage.setItem('uid', JSON.stringify(user.uid));
// get user from db using uid
let getUser = async () => {
    
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            currentUserData = { id: doc.id, ...doc.data() }
                // populate UI when we have DB record
                populateUserUI();
        });
    } catch (error) {
        console.error(new Error('error in getting user data from db'));
        console.error(error);

    }
}
getUser().then(() => {

    console.log(currentUserData)
    populateUserUI();
})

function populateUserUI() {
    const email = (currentUserData && currentUserData.email) || (auth && auth.currentUser && auth.currentUser.email) || 'user@example.com';
    if (userEmail) userEmail.textContent = email;
    if (avatarLetter) avatarLetter.textContent = email ? email.charAt(0).toUpperCase() : 'U';
}

//     }
// });


const deleteUserBtn = document.getElementById("deleteAcc-btn");

deleteUserBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    try {
        await deleteDoc(doc(db, "user", user.uid));
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
    try {
        await deleteUser(user);
        console.log("User account deleted successfully");
        window.localStorage.removeItem('uid');
        window.location.replace('./index.html');
    }
    catch (error) {
        console.error("Error deleting user account: ", error);
    }
});

let signOutBtn = document.getElementById("signOut-btn");



signOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("User signed out successfully");
        window.localStorage.removeItem('uid');
        window.location.replace('./index.html');
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});




// if (signOutBtn) signOutBtn.addEventListener("click", () => userSignOut())
