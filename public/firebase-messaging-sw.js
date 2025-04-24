
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

firebase.initializeApp({
  'apiKey': "AIzaSyCnWHEmjGekrSqNsIXApiYwG5AnAAPYbKg",
  'authDomain': "e-fatorh.firebaseapp.com",
  'projectId': "e-fatorh",
  'storageBucket': "e-fatorh.appspot.com",
  'messagingSenderId': "562616822606",
  'appId': "1:562616822606:web:0723c181bf931b65b78c1f",
  'measurementId': "G-ZZJFPKW8ZS",
  });

const messaging = firebase.messaging();
