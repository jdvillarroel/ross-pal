

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
                transactions: []
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
                balance: parseFloat((balance - amount).toFixed(2)),
                transactions: [...transactions, {
                    to: to,
                    amount: amount,
                    date: new Date(),
                    description: description
                }]
            })
        } else {
            console.log("Not enough funds to do this transaction.");
        }
    })
    .then(() => {
        // return db.collection("accounts").doc(userID).onSnapshot((account) => {
        //     setupUI(user, account.data());
        // });
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
        // setupUser(user);
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
            db.collection("accounts").doc(user.uid).onSnapshot((account) => {
                setupUI(user, account.data());
            });
            // const accountPromise = getUserData(user.uid);
            // accountPromise.then((account => {
            //     setupUI(user, account)
            // }));
            //setupUI(user);
            console.log("User logged in");
        } else {
            setupUI(null, null);
            console.log("User logged out");
        }
    });

}
