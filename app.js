import { requireAuth } from "./auth-guard.js";
import { auth, createUserWithEmailAndPassword, db, addDoc, doc, collection, setDoc } from "./firebaseConfig.js";
// requireAuth(); /// redirect to dashboard if already signed-in

let emailInput = document.querySelector("#email-inp");
let passInput = document.querySelector("#password-inp");
let registerForm = document.querySelector("#register-form");
let messageBox = document.querySelector("#message-box");

const msg = {
    show(message, type = "error") {
        if (!messageBox) return;
        messageBox.textContent = message;
        // Reset previous state then add new variant
        messageBox.classList.remove('show', 'success', 'error', 'message-active');
        messageBox.classList.add('show', type === 'success' ? 'success' : 'error');
        // briefly add the active shadow to draw attention
        messageBox.classList.add('message-active');
        setTimeout(() => {
            messageBox.classList.remove('message-active');
        }, 1600);
    },
    clear() {
        if (!messageBox) return;
        messageBox.textContent = "";
        messageBox.classList.remove('show', 'success', 'error', 'message-active');
    }
};

// let validateForm = () => {
//     if (emailInput.value.length < 1 || passInput.value.length < 1) {
//         console.error('Please fill in all fields.');
//         return false;
//     }
//     return true;
// };





// let addUserInDb = async (user) => {
//     // try {
//     //     console.log("user for add func =>", user)
//     //     // window.localStorage.setItem('uid', JSON.stringify(user.uid));
//     //     // write user doc using the uid as document id for easier lookups
//     //     if (!user || !user.uid) {
//     //         console.error('Invalid user object, missing uid')
//     //         return false
//     //     }

//     //     let userData = {
//     //         uid: user?.uid,
//     //         displayName: user?.displayName || null,
//     //         email: user?.email || null,
//     //         phoneNumber: user?.phoneNumber || null,
//     //         createdAt: new Date()
//     //     }


//     //     // // Add a new document with a generated id.
//     //     // const docRef = await addDoc(collection(db, "user"), userData); {
//     //     //     console.log("successfully user added in db.");

//     // }


// }

//  catch (error) {
//     console.error(error)
//     return false
// }
// // }


const addUserData = async () => {


    const user = auth.currentUser;
    let userData = {
        uid: user?.uid,
        displayName: user?.displayName || null,
        email: user?.email || null,
        phoneNumber: user?.phoneNumber || null,
        createdAt: new Date()
    }
    window.localStorage.setItem('uid', JSON.stringify(user.uid));
    let userId = user?.uid;
    try {
        await setDoc(doc(db, "user", userId), {
            ...userData
        }
        );
        console.log("successfully user added in db.")
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

let createUser = async () => {
    try {
        if (!validateForm()) {
            console.error(new Error('user account can not be created!'))
            return
        }

        const userCredential = await createUserWithEmailAndPassword(auth, emailInput.value, passInput.value).then((userCredential) => {

            const user = userCredential.user;
            console.log("Autentication successful, user created");
            console.log("user created =>", user);

            addUserData().then(() => {
                msg.show("Account created successfully!");

                setTimeout(() => {
                    window.location.replace("./dashboard.html");
                }, 1500);
                // window.location.replace("./dashboard.html");
            })
        }
        );


    } catch (error) {
        console.error(error)
    }
}

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createUser();
});

