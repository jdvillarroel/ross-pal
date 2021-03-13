// const signUp = document.querySelector("#signup");
// const signIn = document.querySelector("#signin");
// const signOut = document.querySelector("#signout");

// const dashboardLink = document.querySelector("#dashboardLink");
// const loggedUser = document.querySelector("#loggedUser");
// const content = document.querySelector("#content");

// // ************* Modals ***************** //
// const signUpModal = new bootstrap.Modal(document.querySelector("#signup-modal"), {keyboard: true});
// const signUpBtn = document.querySelector("#signup-btn");
// const signUpBtnClose = document.querySelector("#signup-btn-close");
// const signInModal = new bootstrap.Modal(document.querySelector("#signin-modal"), {keyboard: true});
// const signInBtn = document.querySelector("#signin-btn");
// const signInBtnClose = document.querySelector("#signin-btn-close");

// // ************ Forms ******************* //
// const signUpForm = document.querySelector("#signup-form");
// const signInForm = document.querySelector("#signin-form");

// // ************ References to database ********* //
// const auth = firebase.auth;
// const db = firebase.firestore();


// *********** Functions *************** //
const handleSignUpModalClose = () => {
    signUpForm.reset();
    signUpModal.hide();
};

const handleSignInModalClose = () => {
    signInForm.reset();
    signInModal.hide();
};

// ************* Events Listeners *************** //

// Show sign up modal form.
signUp.addEventListener("click", (e) => {
    e.preventDefault();
    signUpModal.show();
});

// Show sign in modal form.
signIn.addEventListener("click", (e) => {
    e.preventDefault();
    signInModal.show();
});

// Sign up form handle.
signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const fName = signUpForm.fName.value;
    const lName = signUpForm.lName.value;
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;

    if (fName.length === 0 || lName.length === 0 || email.length === 0 || password.length === 0) {
        console.log("Can't proceed. Check your input data.");
    } else {
        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            handleSignUpModalClose();
        })
        .catch(err => {
            console.log(err.code, err.message);
        });
    }
    
});

// Sign up modal form close.
signUpBtnClose.addEventListener("click", handleSignUpModalClose);

// Sign out user.
signOut.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut();
});

// Handle sign in user.
signInBtn.addEventListener("click", (e)=> {
    const email = signInForm.email.value;
    const password = signInForm.password.value;

    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
        setupUser(user);
        handleSignInModalClose();
    })
    .catch(err => {
        console.log(err.code, err.message);
    });
});

// Sign in modal form close.
signInBtnClose.addEventListener("click", handleSignInModalClose);

// Query database
function getUserData(uID) {
    return db.collection("accounts").doc(uID).get()
    .then((doc) => {
        return doc.data();
    })
    .catch(err => console.log(err.message));
}

// Setup user account

function setupUser(user) {
    console.log(user.iud);
    console.log(user.email);
}

window.onload = () => {
    // ************ Auth Realtime Listener ********* //
    auth.onAuthStateChanged((user) => {
        if (user) {
            setupUI(user);
            console.log("User logged in");
            console.log(`${user.uid} - ${user.email}`);
        } else {
            setupUI(null);
            console.log("User logged out");
        }
    });
}




// ************************************ UI Section ***************************** //

// const setupUI = (user) => {
//     if (user) {
//         dashboardLink.style.display = "block";

//         const html = `
//             Usuario: ${user.email}
//         `;

//         loggedUser.textContent = html;
//     } else {
//         loggedUser.textContent = "";
//         dashboardLink.style.display = "none";
//     }
// };



// const user = userCred.user;
// const currentDate = new Date();

// return db.collection("users").doc(user.uid).set({
//     firstName: fName,
//     lastName: lName,
//     email: user.email,
//     dateRegistered: currentDate
// });