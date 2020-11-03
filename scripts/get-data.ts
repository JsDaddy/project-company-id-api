import { ProjectStatus } from './../src/project/enums/project-status.enum';
import * as firebase from 'firebase-admin';
import * as util from 'util';
import * as fs from 'fs';
import { IUserFb } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import * as mongodb from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { Db } from 'mongodb';
import { Types } from 'mongoose';
import moment from 'moment';
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
const dbName: string = process.env.DATABASE_NAME as string;
const dbPath: string = `${process.env.DATABASE_PATH}/${dbName}` as string;
const asyncFileWriter: (
  filename: string,
  data: any,
  encode: string,
) => Promise<void> = util.promisify(fs.writeFile);
const fileName = 'holidays.json';
const fileRules = 'rules.json';
const asyncFileReader: (filename: string) => Promise<Buffer> = util.promisify(
  fs.readFile,
);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// tslint:disable-next-line: cyclomatic-complexity
export async function main(): Promise<any> {
  const buffer: Buffer = await asyncFileReader(`${__dirname}/${fileName}`);
  const bufferRules: Buffer = await asyncFileReader(
    `${__dirname}/${fileRules}`,
  );
  const json: any = JSON.parse(buffer.toString());
  const jsonRules: any = JSON.parse(bufferRules.toString());
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

  for (const holiday of json.holidays) {
    holiday._id = Types.ObjectId();
    holiday.date = new Date(holiday.date);
    await mongoDb.collection('holidays').insertOne(holiday);
  }
  for (const rule of jsonRules) {
    rule._id = Types.ObjectId();
    await mongoDb.collection('rules').insertOne(rule);
  }
  for (const stackDocument of stack.docs) {
    const stackDoc = stackDocument.data();
    stackDoc._id = Types.ObjectId();
    delete stackDoc.id;
    allStack.push({ ...stackDoc, id: stackDocument.id });
  }
  for (const projectDoc of projects.docs) {
    let project = projectDoc.data();
    delete project.types;
    delete project.services;
    delete project.ongoing;
    delete project.methodology;
    delete project.nda;
    project.startDate = project.startDate.toDate();

    if (project.endDate) {
      project.status = ProjectStatus.FINISHED;
      project.endDate = project.endDate.toDate();
    } else {
      project.status = ProjectStatus.ONGOING;
    }
    if (project.isRejected) {
      project.status = ProjectStatus.REJECTED;
    }
    delete project.isRejected;
    project._id = Types.ObjectId();
    project = { ...project, fbId: projectDoc.id };
    allProjects.push(project);
  }

  let oldId: Types.ObjectId = new Types.ObjectId();
  let newId: Types.ObjectId = new Types.ObjectId();

  for (const user of users.docs) {
    const userData = user.data() as IUserFb;
    userData._id = Types.ObjectId();
    userData.password = await bcrypt.hash('jsdaddy2020', 10);
    const { email } = userData;
    const payload: { email: string } = {
      email,
    };
    userData.initialLogin = true;
    userData.accessToken = jwt.sign(payload, 'company-id');
    userData.dob = userData.dob.toDate();
    userData.dob = moment(userData.dob)
      .utcOffset(0)
      .set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
      .toDate();
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
      vacDoc._id = Types.ObjectId();
      vacDoc.uid = userData._id;
      vacDoc.date = vacDoc.date.toDate();
      await mongoDb.collection('vacations').insertOne(vacDoc);
      allVacs.push(vacDoc);
    }

    for (const timelogDocument of timelogs.docs) {
      const timelog = timelogDocument.data();

      timelog.project = allProjects.find(
        (item) => item.fbId === timelog.project,
      )._id;
      timelog._id = Types.ObjectId();
      timelog.date = timelog.date.toDate();
      timelog.uid = userData._id;
      await mongoDb.collection('timelogs').insertOne(timelog);
      allTimelogs.push(timelog);
    }

    let projects = [];
    let activeProjects = [];

    if (userData.projects && userData.projects.length > 0) {
      for (let project of userData.projects) {
        const newProject = allProjects.find(
          // tslint:disable-next-line:no-any
          (fullProject: any) => fullProject.fbId === project,
        )._id;
        projects.push(newProject);
      }
    } else {
      // tslint:disable-next-line:no-any
      projects = [...allProjects.map((project: any) => project._id)];
    }

    if (userData.activeProjects && userData.activeProjects.length > 0) {
      for (let project of userData.activeProjects) {
        const newActiveProject = allProjects.find(
          // tslint:disable-next-line:no-any
          (fullProject: any) => fullProject.fbId === project,
        )._id;
        activeProjects.push(newActiveProject);
      }
    } else {
      // tslint:disable-next-line:no-any
      activeProjects = [...allProjects.map((project: any) => project._id)];
    }
    userData.isActive = true;
    userData.projects = [...projects];
    userData.activeProjects = [...activeProjects];
    delete userData.uid;

    if (userData.email === 'vloban@jsdaddy.com') {
      oldId = userData._id;
    }

    if (userData.email === 'juncker8888@gmail.com') {
      newId = userData._id;
    }
    userData.position = userData.position.toLowerCase();
    if (userData.position === 'manager') {
      userData.position = 'owner';
    }
    delete userData.role;
    await mongoDb.collection('users').insertOne(userData);
    allUsers.push(userData);
  }

  await mongoDb
    .collection('timelogs')
    .updateMany({ uid: oldId }, { $set: { uid: newId } });
  await mongoDb.collection('users').deleteOne({ _id: oldId });

  for (const proj of allProjects) {
    proj.stack = proj.stack.map(
      (project: any) => allStack.find((stack) => stack.id === project)._id,
    );
    delete proj.fbId;
    await mongoDb.collection('projects').insertOne(proj);
  }
  for (const stack of allStack) {
    delete stack.id;
    await mongoDb.collection('stacks').insertOne(stack);
  }
  await writeFile('users', allUsers);
  await writeFile('projects', allProjects);
  await writeFile('timelogs', allTimelogs);
  await writeFile('stack', allStack);
  await writeFile('json', json.holidays);
  await writeFile('vacations', allVacs);

  console.log('FINISHED');
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
