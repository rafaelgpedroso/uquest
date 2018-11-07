function saveQuestion(){
	var category = document.getElementById('category').value;
	var cid;
	
	db.collection("game").doc('nr').get().then(function(qs){
		cid = qs.data()[category]
		cid = cid ? cid+1 : 1;

		var data = {
			cid:cid,
			category:category,
			question:document.getElementById('question').value,
			correct:document.getElementById('correct').value,
			answer1:document.getElementById('answer1').value,
			revision1:document.getElementById('revision1').value,
			answer2:document.getElementById('answer2').value,
			revision2:document.getElementById('revision2').value,
			answer3:document.getElementById('answer3').value,
			revision3:document.getElementById('revision3').value,
			answer4:document.getElementById('answer4').value,
			revision4:document.getElementById('revision4').value
		};

		db.collection("questions").add(data).then(function(doc) {
			var nr = {};
			nr[category]=cid;
			db.collection("game").doc('nr').update(nr).then(function(doc) {
				console.log('ok');
			}).catch(function(error){console.log("Error: ", error)});
		}).catch(function(error){console.error("Error: ", error)});
	}).catch(function(error){console.log("Error: ", error)});

	

};

function saveUser(){
	var data = {
		name:document.getElementById('name').value,
		username:document.getElementById('username').value,
		pass:document.getElementById('pass').value,
		gender:document.getElementById('gender').value,
		score:0,
		win:0
	}
	// firebase.database().ref().child('users').push(data);
	db.collection("users").add(data)
	.then(function(doc) {
		console.log("ID: ", doc.id);
	})
	.catch(function(error) {
		console.error("Error: ", error);
	});
};

firebase.initializeApp({
	apiKey: "AIzaSyAdRklMWl0hsd0zwm3uEw1XiPk0fzavriQ",
	authDomain: "uquest-217219.firebaseapp.com",
	databaseURL: "https://uquest-217219.firebaseio.com",
	projectId: "uquest-217219",
	storageBucket: "uquest-217219.appspot.com",
	messagingSenderId: "699848641429"
});

firebase.auth().signInAnonymously().then(function(result){
	console.log(result);
}).catch(function(error) {
	console.log(error);
});

var db = firebase.firestore();