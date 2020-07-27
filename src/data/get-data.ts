import * as firebase from 'firebase-admin';

export const GOOGLE_APPLICATION_CREDENTIALS =
  'src/data/companyid-74562-firebase-adminsdk-85397-1dbc868ab2.json';
const firebaseConfig = {
  apiKey: 'AIzaSyCNL4nHTApAksYAAknrGMyZF5hBP2rkqIk',
  authDomain: 'companyid-74562.firebaseapp.com',
  credential: firebase.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: 'https://companyid-74562.firebaseio.com',
  projectId: 'companyid-74562',
  storageBucket: 'companyid-74562.appspot.com',
  messagingSenderId: '145681651144',
  appId: '1:145681651144:web:22a49d043d6918c7679cfd',
  measurementId: 'G-E3V680RHTQ',
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// getCollection('holidays');
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getCollection(collectionName: string) {
  const res: (FirebaseFirestore.DocumentData | undefined)[] = [];
  db.collection(collectionName)
    .listDocuments()
    .then(snapshot => {
      snapshot.forEach(doc => {
        doc.get().then(value => {
          res.push(value.data());
        });
      });
    });
  return res;
}

// getUsers();
// async function getUsers() {
//   db.collection('users')
//     .listDocuments()
//     .then(snapshot => {
//       snapshot.forEach(doc => {
//         doc.get().then(value => {
//           console.log(value.data());
//         });
//         doc
//           .collection('tokens')
//           .listDocuments()
//           .then(snapshot => {
//             snapshot.forEach(doc => {
//               doc.get().then(value => {
//                 console.log(value.data());
//               });
//             });
//           });
//       });
//     });
// }

