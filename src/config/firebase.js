import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

import * as firebase from "firebase";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "./keys";

// Initialize Firebase
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  appId: APP_ID,
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();

export default firebase;
