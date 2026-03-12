// Required for Firebase background messages
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD_T2pumFj4FvOUFAmCiZSk4Zpfb2tJ2TI",
  authDomain: "bybp-3f1aa.firebaseapp.com",
  projectId: "bybp-3f1aa",
  storageBucket: "bybp-3f1aa.firebasestorage.app",
  messagingSenderId: "833661381458",
  appId: "1:833661381458:web:334280a7779c27b1cf688b",
  measurementId: "G-M6GDTK1XMB"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
    tag: 'portfolio-alert'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
