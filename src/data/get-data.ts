// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebase = require('firebase-admin');

const firebaseConfig = {
  apiKey: 'AIzaSyCNL4nHTApAksYAAknrGMyZF5hBP2rkqIk',
  authDomain: 'companyid-74562.firebaseapp.com',
  databaseURL: 'https://companyid-74562.firebaseio.com',
  projectId: 'companyid-74562',
  storageBucket: 'companyid-74562.appspot.com',
  messagingSenderId: '145681651144',
  appId: '1:145681651144:web:22a49d043d6918c7679cfd',
  measurementId: 'G-E3V680RHTQ',
};
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const db = firebase.database();
// console.log(db);
const ref = db.ref();
console.log(ref);
ref.once('value', function(snapshot: { val: () => any }) {
  console.log(snapshot.val());
});

const usersRef = ref.child('holidays');
usersRef.set({});
