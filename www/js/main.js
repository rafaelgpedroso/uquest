function rand(max) {
	return Math.round(Math.random() * (max - 1) + 1);
}

var main = {
	module: 'home',
	start: function(){
		db.collection('game').doc('nr').get().then(function(doc){
			game.nr = doc.data();
		});
		db.collection('game').doc('set').get().then(function(doc){
			game.time = doc.data().time;
		});

		login.doc.onSnapshot(function(doc) {
			login.score = doc.data().score;
			login.win = doc.data().win;
			$('#score').html(login.score);
			$('#win').html(login.win);
		});

		$('#home').siblings().hide();
		$('#name').html(login.name);
		$('#avatar').attr('src',login.avatar);
		$('button.play').on('click',function(){
			main.open('game');
		});
		$('button.home').hide().on('click',function(){
			main.open('home');
		});
		$('button.ranking').on('click',function(){
			main.open('ranking');
		});
	},
	open: function(module){
		$('button.home').show();
		$('#'+main.module).hide();
		
		
		eval('var o='+module+';');
		if (typeof o.start !== "undefined") o.start();
		
		$('#'+module).show();
		main.module=module;
	},
	
}

var home = {
	start: function(){
		timer.stop();
		console.log("Home");
		$('.home').hide();
	}
}

timer = {
	t:null,
	start:function(count){
		var ini = new Date().getTime();
		timer.t = setInterval(function() {
			var now = new Date().getTime();
			var distance = count - Math.floor((now - ini) / 1000);
			$('#timer').html(distance);
			if (distance <= 0) {
				timer.stop();
				app.msg('Tempo esgotado',2,function(){
					main.open('home');
				});
			}
		}, 1000);
	},
	stop:function(){
		clearInterval(timer.t);
		$('#timer').html('');
	}
}

var game = {
	category:'1',
	question:'',
	answers:[],
	nr:{},
	time:20,
	start: function(){
		$('#result p').empty();
		$('#answers').empty();
		
		console.log(game.nr[game.category]);
		var rnd = rand(game.nr[game.category]);
		db.collection("questions")
		.where("category", "==", game.category).orderBy('cid').startAt(rnd).limit(1)
		.get().then(function(qs){
			qs.forEach(function(doc){
				game.question = doc.data().question;
				var s = [0,1,2,3,4]
				game.answers = [
					[doc.data().correct,''],
					[doc.data().answer1,doc.data().revision1],
					[doc.data().answer2,doc.data().revision2],
					[doc.data().answer3,doc.data().revision3],
					[doc.data().answer4,doc.data().revision4],
				]
				s.sort(function(a, b){return 0.5 - Math.random()});
				
				s.forEach(function(k){
					$(`<button class="tx">${game.answers[k][0]}</button>`).on('click',function(){
						game.answer(k)
					}).appendTo( "#answers" );
				});
				$('#game h1').html(game.question);
				$('#timer').html(game.time);
				
				timer.start(game.time);
			});
		})
		.catch(function(error){console.log("Error getting documents: ", error)});
	},
	answer:function(k){
		timer.stop();
		
		var data = {
			question:game.question,
			answer:game.answers[k][0],
			correct:k==0,
			time:new Date(),
			score:login.score,
			win:login.win
		}

		db.collection("useranswers").doc(login.id).collection("answers").add(data)
		.then(function(doc) {
			console.log("correct: ", k==0);
			if(k==0){
				login.doc.update({score:login.score+20}).then(function(doc){});
			}
		})
		.catch(function(error) {
			console.error("Error: ", error);
		});		

		msg = k==0 ? '¡CORRECTO!' : 'No está correcto. '+game.answers[k][1];
		app.msg(msg,2,function(){
			game.start();
		});
	}
}

var ranking = {
	position:0,
	start: function(){
		console.log("Ranking");
		
		$('#ranking table tbody').empty();
		$('#ranking table tfoot').empty();
		
		db.collection("users").orderBy('score','desc').get().then(function(qs){
			var k=1;
			qs.forEach(function(doc){
				// console.log(doc.id);
				if(k<8){
					var tr = $(`<tr #${doc.id}>`);
					$(`<td>${k}</td>`).appendTo(tr);
					$(`<td>${doc.data().name}</td>`).appendTo(tr);
					$(`<td>${doc.data().score}</td>`).appendTo(tr);
					tr.appendTo($('#ranking table tbody'));
				}
				if(doc.id==login.id) ranking.position=k;  //save position of logged user
				k++;
			});
			$('<tr #trftt><td></td><td>...</td></tr>').appendTo($('#ranking table tfoot'));
			
			tr = $(`<tr #trft></tr>`);
			$(`<td>${ranking.position}</td>`).appendTo(tr);
			$(`<td>${login.name}</td>`).appendTo(tr);
			$(`<td>${login.score}</td>`).appendTo(tr);
			tr.appendTo($('#ranking table tfoot'));
		})
		.catch(function(error){console.log("Error getting documents: ", error)});
	}
}

main.start();
