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

const createUser = (user, userInfo) => {
    return db.collection("users").doc(userCredential.user.uid).set({
        firstName: userInfo.fName,
        lastName: userInfo.lName,
        email: userInfo.email,
        createdAt: new Date(),
        type: "regUser"
    })
}

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

    const userInfo = {
        fName: signUpForm.fName.value,
        lName: signUpForm.lName.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value
    }
    // const fName = signUpForm.fName.value;
    // const lName = signUpForm.lName.value;
    // const email = signUpForm.email.value;
    // const password = signUpForm.password.value;

    if (userInfo.fName.length === 0 || userInfo.lName.length === 0 || userInfo.email.length === 0 || userInfo.password.length === 0) {
        console.log("Can't proceed. Check your input data.");
    } else {
        auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((userCredential) => {
            return db.collection("users").doc(userCredential.user.uid).set({
                firstName: userInfo.fName,
                lastName: userInfo.lName,
                email: userInfo.email,
                createdAt: new Date()
            }), userCredential.user;
            
        })
        .then((user) => {
            return db.collection("accounts").doc(user.uid).set({
                balance: 0,
                transactions: [{}]
            });
        })
        .then(handleSignUpModalClose())
        .catch(err => {
            console.log(err.message);
        });
    }
    
});

// Send money form
sendBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const amount = transactionForm.amount.value;
    const to = transactionForm.email.value;
    const description = transactionForm.description.value;
    let user = auth.currentUser;
    let userID = user.uid;

    db.collection("accounts").doc(userID).get()
    .then((account) => {
        let balance = account.data().balance;
        let transactions = account.data().transactions;

        if (amount <= account.data().balance) {
            return db.collection("accounts").doc(userID).update({
                balance: (balance - amount),
                transactions: [...transactions, {
                    to: to,
                    amount: amount,
                    date: new Date(),
                    description: description
                }]
            })
        } else {
            console.log("Not enough funds to this transaction.");
        }
    })
    .then(() => {
        console.log("Sent successfully!");
    })
    .catch(err => console.log(err.message));

    
    transactionForm.reset();
    
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
            // let unsubscribe = db.collection("accounts").doc(auth.currentUser.uid).onSnapshot((account) => {
            //     setupUI(user, account);
            // });

            const accountPromise = getUserData(user.uid);
            accountPromise.then((account => {
                setupUI(user, account)
            }));
            //setupUI(user);
            console.log("User logged in");
        } else {
            unsubscribe();
            setupUI(null, null);
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