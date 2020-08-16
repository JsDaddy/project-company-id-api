import { ITimelog } from './interfaces/timelog.interface';
import * as firebase from 'firebase-admin';
import * as util from 'util';
import * as fs from 'fs';
import { IUser } from './interfaces/user.interface';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as mongodb from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { Db } from 'mongodb';

export const GOOGLE_APPLICATION_CREDENTIALS =
  'scripts/companyid-74562-firebase-adminsdk-85397-1dbc868ab2.json';

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
const dbName = 'company-id';
const dbPath = 'mongodb://127.0.0.1:27017/company-id';
const asyncFileWriter: (
  filename: string,
  data: any,
  encode: string,
) => Promise<void> = util.promisify(fs.writeFile);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function main(): Promise<any> {
  const connection: mongodb.MongoClient = await mongodb.MongoClient.connect(
    dbPath,
    { useNewUrlParser: true },
  );
  const mongoDb: Db = connection.db(dbName);
  await mongoDb.dropDatabase();
  const allTimelogs: any[] = [];
  const allUsers = [];
  const allProjects: any[] = [];
  const allStack: any[] = [];
  const allVacs: any[] = [];
  const users: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db
    .collection('users')
    .get();
  const projects: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db
    .collection('projects')
    .get();
  const stack: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db
    .collection('technologies')
    .get();
  for (const stackDocument of stack.docs) {
    const stackDoc = stackDocument.data();
    stackDoc._id = mongoose.Types.ObjectId();
    delete stackDoc.id;
    allStack.push({ ...stackDoc, id: stackDocument.id });
  }
  for (const user of users.docs) {
    const userData = user.data() as IUser;
    userData._id = mongoose.Types.ObjectId();
    userData.password = await bcrypt.hash('jsdaddy2020', 10);
    const { email } = userData;
    const payload: { email: string } = {
      email,
    };
    userData.initialLogin = true;
    userData.accessToken = jwt.sign(payload, 'company-id');
    userData.dob = userData.dob.toDate();
    const timelogs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db
      .collection('timelogs')
      .where('uid', '==', user.data().uid)
      .get();
    const vacation: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await db
      .collection('vacation')
      .where('uid', '==', user.data().uid)
      .get();
    for (const vacationDocument of vacation.docs) {
      const vacDoc = vacationDocument.data();
      vacDoc._id = mongoose.Types.ObjectId();
      vacDoc.uid = userData._id;
      vacDoc.date = vacDoc.date.toDate();
      await mongoDb.collection('vacations').insertOne(vacDoc);
      allVacs.push(vacDoc);
    }

    for (const timelogDocument of timelogs.docs) {
      const projectDoc = projects.docs.find(
        project => project.id === timelogDocument.data().project,
      );
      if (projectDoc) {
        const project = projectDoc.data() as any;
        delete project.types;
        delete project.services;
        delete project.methodology;
        delete project.nda;
        project.startDate = project.startDate.toDate();
        if (project.endDate) {
          project.endDate = project.endDate.toDate();
        }
        project._id = mongoose.Types.ObjectId();
        const timelog = timelogDocument.data() as ITimelog;
        timelog._id = mongoose.Types.ObjectId();
        timelog.date = timelog.date.toDate();
        timelog.project = project._id;
        timelog.uid = userData._id;
        if (!allProjects.includes(project)) {
          allProjects.push(project);
        }
        await mongoDb.collection('timelogs').insertOne(timelog);
        allTimelogs.push(timelog);
      }
    }
    delete userData.uid;
    delete userData.activeProjects;
    delete userData.projects;
    await mongoDb.collection('users').insertOne(userData);

    allUsers.push(userData);
  }
  for (const proj of allProjects) {
    proj.stack = proj.stack.map(
      (project: any) => allStack.find(stack => stack.id === project)._id,
    );
    await mongoDb.collection('projects').insertOne(proj);
  }
  for (const stack of allStack) {
    delete stack.id;
    await mongoDb.collection('stack').insertOne(stack);
  }
  await writeFile('users', allUsers);
  await writeFile('projects', allProjects);
  await writeFile('timelogs', allTimelogs);
  await writeFile('stack', allStack);
  await writeFile('vacations', allVacs);
}

async function writeFile(name: string, items: any[]): Promise<void> {
  if (!fs.existsSync(`${__dirname}/output`)) {
    fs.mkdirSync(`${__dirname}/output`);
  }
  try {
    await asyncFileWriter(
      `${__dirname}/output/json-${name}.json`,
      JSON.stringify(items, null, 4),
      'utf8',
    );
  } catch (e) {
    console.log('save', e);
  }
}
main();
