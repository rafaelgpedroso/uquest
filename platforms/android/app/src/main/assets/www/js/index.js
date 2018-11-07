var db;
var app = {
    initialize: function() {
		firebase.initializeApp({
			apiKey: "AIzaSyAdRklMWl0hsd0zwm3uEw1XiPk0fzavriQ",
			authDomain: "uquest-217219.firebaseapp.com",
			databaseURL: "https://uquest-217219.firebaseio.com",
			projectId: "uquest-217219",
			storageBucket: "uquest-217219.appspot.com",
			messagingSenderId: "699848641429"
		});

		firebase.auth().signInAnonymously().then(function(result){
			db = firebase.firestore();
			app.open('login');
		}).catch(function(error) {
			console.log(error);
		});
    },
	open: function(module,f){
		$('#app').load(module+'.html',function(){
			$.getScript('js/'+module+'.js', function() {
				
			});
		});
    },
	
	msg: function(msg,t=1200,f){
		console.log(msg);
		$('<div id="modal" class="modal">').appendTo('body');
		$(`<p>${msg}</p>`).appendTo($('#modal'));
		$('#modal').fadeIn(t/3*1000,'swing',function(){
        	$('#modal').delay(t/3*1000).fadeOut(t/3*1000,'swing',function(){
        		$('#modal').remove();
				if (typeof f !== "undefined") f();
			});
        });
	},

    onDeviceReady: function() {

    },

    receivedEvent: function(id) {

    }
};

app.initialize();