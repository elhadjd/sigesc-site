import {initializeApp} from 'firebase/app'
import {getAuth,GoogleAuthProvider,FacebookAuthProvider ,signInWithPopup, GithubAuthProvider} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAXNBpjoaHOJDLuUBhbJXHTGYBRsTTUggk",
    authDomain: "fir-auth-2f13c.firebaseapp.com",
    projectId: "fir-auth-2f13c",
    storageBucket: "fir-auth-2f13c.appspot.com",
    messagingSenderId: "696560786773",
    appId: "1:696560786773:web:a763565db4225a054ae3dc",
    measurementId: "G-L0LH7YCDC5"
  };

  const apps = initializeApp(firebaseConfig)
  const auth = getAuth(apps)
  export const firebase = (()=>{
    return {
      auth,
      GoogleAuthProvider,
      FacebookAuthProvider,
      signInWithPopup,
      GithubAuthProvider
    }
  })
  