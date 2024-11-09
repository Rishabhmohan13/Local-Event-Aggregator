const admin = require('firebase-admin');
const serviceAccount = require('./loca.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'integrated-project-b8308.appspot.com' 
});

const bucket = admin.storage().bucket();
module.exports = { bucket };