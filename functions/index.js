const functions = require('firebase-functions');
const admin = require('firebase-admin');
var request = require("request");

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord, context) => {
  return db
    .collection('Users')
    .doc(userRecord.email)
    .set({
      uid: userRecord.uid,
      deviceToken: "",
    })
    .catch(console.error);
}

const addContact = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const name = req.query.name;
  const number = req.query.number;
  // Push the new message into the cloud firestore using the Firebase Admin SDK.
  // Use add instead of set when auto-generating the doc id
  // Every cloud function should return a promise	
	

	// return db.collection('user-add-contacts')
	// .add({
	//   displayName: name,
	//   contactNumber: number,
	// })
	// .then(function(docRef) {
 //    	console.log("Document written with ID: ", docRef.id);
 //    	res.status(200).send({status:'success'})
 //    	return null;
	// })
	// .catch(function(error) {
 //    	console.error("Error adding document: ", error);
 //    	res.status(200).send({status:'error'})
	// });

	// This registration token comes from the client FCM SDKs.
	// var registrationToken = 'e66ApQT2Zqg:APA91bFmjeBvKak2iccwAisLvMPhWIu8AxioRpI8P1lL8lo-7knTkgf6cqdyF0_Vy6xkSIw9x_65OplzRbrrAd_2bCrAz8F_3iIO8usCLPzMXeu7tBkxfWd7TCyGChXQ6LYBbx59DxaG';

	// var message = {
	//   data: {
	//     name: 'Test record',
	//     number: '900803422'
	//   },
	//   token: registrationToken
	// };

	// Send a message to the device corresponding to the provided
	// registration token.
	// admin.messaging().send(message)
	//   .then((response) => {
	//     // Response is a message ID string.
	//     console.log('Successfully sent message:', response);
	//     res.status(200).send({status:'success'})
	//     return null;
	//   })
	//   .catch((error) => {
	//     console.log('Error sending message:', error);
	//     res.status(200).send({status:'error'})
	//   });

	  var options = { method: 'POST',
	  url: 'https://fcm.googleapis.com/fcm/send',
	  headers: 
	   { 
	     'cache-control': 'no-cache',
	     'Authorization': 'key=AIzaSyBianP2B6TkuFzzPOY4RYqJJAcMAYt7r3U',
	     'Content-Type': 'application/json' },
	  body: 
	   { notification: 
	      { title: 'New Contacts',
	        body: 'Request for adding new contact was initiated',
	        sound: 'default',
	        click_action: 'FCM_PLUGIN_ACTIVITY',
	        icon: 'fcm_push_icon' },
	     data: { name: this.name , number: "" + this.number  },
	     to: 'e66ApQT2Zqg:APA91bFmjeBvKak2iccwAisLvMPhWIu8AxioRpI8P1lL8lo-7knTkgf6cqdyF0_Vy6xkSIw9x_65OplzRbrrAd_2bCrAz8F_3iIO8usCLPzMXeu7tBkxfWd7TCyGChXQ6LYBbx59DxaG',
	     priority: 'high',
	     restricted_package_name: 'com.gps.beerapp' },
	  json: true };

	  request(options, function (error, response, body) {
	  if (error) {
	  	res.status(200).send({status:'error'})
	  } else {
	  	res.status(200).send({status:'success'})
	  }

	  console.log(body);
	});

});

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  addContact: addContact
};