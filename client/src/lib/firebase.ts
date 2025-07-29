// Mock Firebase configuration for development
// This will be replaced with actual Firebase when the package is installed

export const app = {
  name: 'mock-firebase-app',
  options: {
    apiKey: "AIzaSyBi8eCS09GiBLTdfw_DcfTHYOj_SuwDjlw",
    authDomain: "bjpconnect-8d894.firebaseapp.com",
    projectId: "bjpconnect-8d894",
    storageBucket: "bjpconnect-8d894.firebasestorage.app",
    messagingSenderId: "91629113818",
    appId: "1:91629113818:web:1860d892eb42af98f030e3",
    measurementId: "G-T30ZBY4KST"
  }
};

export const analytics = {
  logEvent: (eventName: string, parameters?: any) => {
    console.log('Analytics event:', eventName, parameters);
  }
};

export const auth = {
  currentUser: {
    uid: 'mock-user-id',
    email: 'admin@bjp.org',
    displayName: 'Pravin Patil'
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state change with a mock user
    const mockUser = {
      uid: 'mock-user-id',
      email: 'admin@bjp.org',
      displayName: 'Pravin Patil',
      photoURL: null
    };
    callback(mockUser);
    return () => {}; // unsubscribe function
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log('Mock sign in:', email, password);
    return { 
      user: { 
        uid: 'mock-user-id', 
        email,
        displayName: 'Pravin Patil'
      } 
    };
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log('Mock sign up:', email, password);
    return { 
      user: { 
        uid: 'mock-user-id', 
        email,
        displayName: 'Pravin Patil'
      } 
    };
  },
  signOut: async () => {
    console.log('Mock sign out');
    return Promise.resolve();
  }
};

export const db = {
  collection: (path: string) => ({
    doc: (id: string) => ({
      get: () => Promise.resolve({ data: () => null, exists: false }),
      set: (data: any) => Promise.resolve(),
      update: (data: any) => Promise.resolve(),
      delete: () => Promise.resolve()
    }),
    add: (data: any) => Promise.resolve({ id: 'mock-doc-id' }),
    get: () => Promise.resolve({ docs: [] })
  })
};

export const storage = {
  ref: (path: string) => ({
    put: (file: File) => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } }),
    getDownloadURL: () => Promise.resolve('mock-url')
  })
}; 