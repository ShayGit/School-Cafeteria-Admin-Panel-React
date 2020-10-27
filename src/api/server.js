import axios from "axios";
import firebase from '../config/firebase'

const {BASE_URL }= require('../config/keys');

const instance = axios.create({
  baseURL: BASE_URL
 
});

instance.interceptors.request.use( async (config)=> {

  const idToken = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
  config.headers.Authorization = `Bearer ${idToken}`;
  return config;

}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default instance;
