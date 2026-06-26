import { requireAuth } from "./auth-guard.js";
import { auth, signInWithEmailAndPassword } from "./firebaseConfig.js";

let emailInput = document.querySelector("#email-inp");
let passInput = document.querySelector("#password-inp");
let loginForm = document.querySelector("#login-form");

requireAuth(); /// to check user logged-in or not

// helper to show messages in the form using querySelector only
const showUserMessage = (msg = '') => {
    const id = 'login-error'
    let el = document.querySelector('#' + id)
    if(!el){
        el = document.createElement('div')
        el.id = id
        el.style.color = 'red'
        el.style.marginTop = '8px'
        loginForm.appendChild(el)
    }
    el.textContent = msg
}

// map Firebase errors to user-friendly English messages
const userMessage = (err) => {
    if(!err) return 'Login failed. Please try again.'
    const code = err.code || ''
    if(code === 'auth/user-not-found'){
        return 'No account found with that email.'
    } else if(code === 'auth/wrong-password'){
        return 'Incorrect password. Please try again.'
    } else if(code === 'auth/invalid-email'){
        return 'Invalid email address.'
    } else if(code === 'auth/user-disabled'){
        return 'This account has been disabled.'
    } else if(code === 'auth/too-many-requests'){
        return 'Too many attempts. Try again later.'
    } else if(code === 'auth/network-request-failed'){
        return 'Network error. Check your connection.'
    }
    return 'Login failed. Please try again.'
}

let vaidatesUser = ()=>{
    showUserMessage('')

    const email = emailInput.value.replace(/\s/g, '')
    const pass = passInput.value

    if(!email || !pass){
        showUserMessage('All fields must be filled!')
        return false
    }

    if(!email.includes('@')){
        showUserMessage('Please enter a valid email address.')
        return false
    }

    if(pass.length < 6){
        showUserMessage('Password must be at least 6 characters.')
        return false
    }

    return true
}


let loginUser = async () => {
    try {
        if(!vaidatesUser()){
            console.error('validation failed')
            return
        }

        const userCredential = await signInWithEmailAndPassword(auth, emailInput.value.replace(/\s/g, ''), passInput.value);
        const user = userCredential.user;
        console.log("success on login", user);
        window.localStorage.setItem('uid', JSON.stringify(user.uid));
        window.location.replace('./dashboard.html');

    } catch (error) {
        console.error('login error', error);
        showUserMessage(userMessage(error))
    }
}


loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    loginUser()
})