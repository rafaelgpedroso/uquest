var login = {
	id:'',
	name:'',
	username:'ned',
	pass:'123',
	doc:null,
	auth: function(){
		// login.username = $('#username').val();
		// login.pass = $('#pass').val();
		db.collection("users").where("username", "==", login.username).get().then(function(qs){
			qs.forEach(function(doc) {
				if(doc.data().pass==login.pass){
					login.doc = db.collection("users").doc(doc.id);
					login.id = doc.id;
					login.name = doc.data().name;
					login.avatar = 'img/avatar/'+doc.data().gender+'.png';
					login.score = doc.data().score;
					login.win = doc.data().win;
				}
			});
			
			if(login.name==''){
				$('#username').val('');
				$('#pass').val('');
				app.msg('El usuario o contraseña son incorrectos.',2);
			}
			else{
				app.open('main');
			}
		})
		.catch(function(error){
			console.log("Error: ", error);
		});
	}
}

// $('#btlogin').on('click',login.auth);
login.auth();