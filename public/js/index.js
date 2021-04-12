
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // ************ Firebase References ********* //
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const accountsRef = db.collection("accounts");
const usersRef = db.collection("users");
const transactionsRef = db.collection("transactions");

// Upadte firestore settings
db.settings({ timestampsInSnapshots: true });


const signUp = document.querySelector("#signup");
const signIn = document.querySelector("#signin");
const signOut = document.querySelector("#signout");

const loggedUser = document.querySelector("#loggedUser");
const regContent = document.querySelector("#reg-content");

// ************* Modals ***************** //
const signUpModal = new bootstrap.Modal(document.querySelector("#signup-modal"), {keyboard: true});
const signUpBtn = document.querySelector("#signup-btn");
const signUpBtnClose = document.querySelector("#signup-btn-close");
const signInModal = new bootstrap.Modal(document.querySelector("#signin-modal"), {keyboard: true});
const signInBtn = document.querySelector("#signin-btn");
const signInBtnClose = document.querySelector("#signin-btn-close");

// ************ Forms ******************* //
const signUpForm = document.querySelector("#signup-form");
const signInForm = document.querySelector("#signin-form");
const transactionForm = document.querySelector("#transaction-form");
const sendBtn = document.querySelector("#send-btn");

// ************ Balance Card **************** //
const balanceAvailable = document.querySelector("#balance-available");

// ************ User account ****************** //
let userAccount = null;
let transactions = null;

// ***************** Functions ********************* //

const setupUI = (user, account) => {
    if (user) {

        regContent.style.display = "block";
        loggedUser.textContent = `Usuario: ${user.email}`;
        balanceAvailable.textContent = `$ ${account.balance}`;

    } else {
        loggedUser.textContent = "";
        regContent.style.display = "none";
        balanceAvailable.textContent = "";
    }
};

