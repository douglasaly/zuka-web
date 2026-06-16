import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
}

export const app =
	getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
// const analytics = getAnalytics(app);
