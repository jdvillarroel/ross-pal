// *************** Functions ********************* //
// Create user in firebase using email and password. Returns new user created.
const createUser = async (userInfo) => {
    const userCredential = await auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password);
    const userAccount = await usersRef.doc(userCredential.user.uid).set({
        firstName: userInfo.fName,
        lastName: userInfo.lName,
        email: userInfo.email,
        createdAt: new Date()
    });

    return userCredential.user;
}

// Create account to user.
const createAccount = async (user) => {
    const account = await accountsRef.doc(user.uid).set({
        balance: 0
    });

    return account;
}

// Get user account.
const getAccount = async (user) => {
    const account = await accountsRef.doc(user.uid).get();

    return account;
}

// Withdraw from account.
const withdrawFromAccount = async (amount) => {
    return accountsRef.doc().update({

    })
}

// Get transactions
const getTransactions = async (user) => {
    let transactions = await transactionsRef.where("to", "==", user.email).get();

    return transactions;
}

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

    const userInfo = {
        fName: signUpForm.fName.value,
        lName: signUpForm.lName.value,
        email: signUpForm.email.value.toLowerCase(),
        password: signUpForm.password.value
    }

    if (userInfo.fName.length === 0 || userInfo.lName.length === 0 || userInfo.email.length === 0 || userInfo.password.length === 0) {
        console.log("Can't proceed. Check your input data.");
    } else {
        createUser(userInfo)
        .then((user) => {
            return createAccount(user);            
        })
        .then(() => {
            handleSignUpModalClose();
        })
        .catch(err => console.log(err.message));
    }
    
});

// Send money form
sendBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const amount = parseFloat(transactionForm.amount.value);
    const to = transactionForm.email.value.toLowerCase();
    const description = transactionForm.description.value;
    let user = auth.currentUser;
    let userID = user.uid;
    let balance = userAccount.data().balance;

    if (amount <= balance) {
        db.collection("accounts").doc(userID).update({
        balance: firebase.firestore.FieldValue.increment(-amount)
        // balance: parseFloat((balance - amount).toFixed(2)),
        // transactions: [...transactions, {
        //     to: to,
        //     amount: amount,
        //     date: new Date(),
        //     description: description
        // }]
        })
        .then(() => {
            return db.collection("transactions").add({
                from: user.email,
                to: to,
                amount: parseFloat(amount.toFixed(2)),
                date: new Date(),
                description: description,
                status: "pending"
            })
        })
        .then(console.log("Money Sent!"))
        .catch(err => console.log(err.message));
    } else {
        console.log("Not enough funds to do this transaction.");
    }
    
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

    auth.signInWithEmailAndPassword(email.toLowerCase(), password)
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


// ************ Auth Realtime Listener ********* //
auth.onAuthStateChanged((user) => {

    if (user) {
        // Get user's account.
        getAccount(user)
        .then(account => {
            userAccount = account;
        });

        // Get transactions
        // getTransactions(user)
        // .then(lastTransactions => {
        //     transactions = lastTransactions;
        // })

        transactionsRef.where("to", "==", user.email).orderBy("date").limit(10).onSnapshot(trans => {
            transactions = trans;
        })

        // Real time account listener.
        accountsRef.doc(user.uid).onSnapshot((account) => {
            userAccount = account;
            setupUI(user, account.data());
        });
        
        console.log("User logged in");
    } else {
        setupUI(null, null);
        console.log("User logged out");
    }
});
