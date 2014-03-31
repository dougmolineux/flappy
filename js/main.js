var tid = setInterval( function () {
	
	if (document.images) {
		img1 = new Image();
		img1.src = "img/BG2.png";
		img2 = new Image();
		img2.src = "img/frogSprite3.png";
		img2 = new Image();
		img2.src = "img/lilly.png";
	}

    if ( document.readyState !== 'complete' ) 
		return;

	var buildno = 1;
	var startGameElement = document.getElementById('startGame');
    clearInterval(tid);    

	var wh = window.innerHeight;
	var ww = window.innerWidth;
	
	startGameElement.addEventListener('click', startGame, false);
	startGameElement.addEventListener('touchstart', startGame, false);
	startGameElement.innerHTML = "<img src='img/play.png'><br />Build Number "+buildno;
	
	startGameElement.disabled = false; 
    document.getElementById("container").style.height = wh + "px";
    document.getElementById("container").style.width = ww + "px";
	document.getElementById('frog').style.display = "inline";

	var game = {
		ticks : 0,
		container : document.getElementById("container"),
		contw : this.container.style.width.replace("px", ""),
		conth : this.container.style.height.replace("px", ""),
		towers : 0,
		bugs : 0,
		speed : 48,
		startRecycle : 0,
		towerSpeed : 10
	};

	var frog = {
		ele : document.getElementById("frog"),
		x : document.getElementById("frog").getClientRects()[0].left,
		y : document.getElementById("frog").getClientRects()[0].top,
		w : document.getElementById("frog").getClientRects()[0].width,
		h : document.getElementById("frog").getClientRects()[0].height, 
		inity : this.y,
		style : document.getElementById("frog").style,
		onfloor : 1,
		jumpSpeed : 25,
		fallSpeed : 13,
		scoreEle : null
	}; 

	function check() {
		if(!game.ticks) {
			makeTower();
			initFrog();
			addScore();
		} else if(game.ticks == 1) {
			initFrog();
		} else if(game.ticks % 20 === 0) {
			makeTower();
		}

		if(game.ticks % 80 === 0) {
			makeBug();
		}

		updateTowers();
		updateFrog();
		updateBugs();
		updateScore(); 
		game.ticks++;
	}

	function updateScore() {
		game.scoreEle.innerHTML = game.ticks;
	}

	function addScore() {
		var score = document.createElement('div');
		var scoreh = 25;
		var scorew = 100;

		score.setAttribute('id', "score");
		score.style.width = scorew+"px";
		score.style.height = scoreh+"px";
		score.style.position = "absolute";
		score.style.backgroundColor = "black";
		score.style.color = "white";
		container.appendChild(score);
		score.style.left = (game.contw-scorew)+"px";
		score.style.top = scoreh+"px";
		score.innerHTML = "0";
		game.scoreEle = score;
	}

	function makeBug() {
		var bug = document.createElement('div');
		var bugh = 129;
		var bugw = 106;
		
		bug.setAttribute('id', "bug"+game.bugs);
		bug.style.width = bugw+"px";
		bug.style.height = bugh+"px";
		bug.style.position = "absolute";
		bug.style.backgroundColor = "#6c8ff3";
		bug.style.backgroundImage = "url('img/Bird2.gif')";
		container.appendChild(bug);
		bug.style.left = game.contw+"px";
		bug.style.top = 50+"px";
		game.bugs++
	}

	function checkForDeath() {
		if(frog.y > game.conth) {
			document.write(" <div><center>DEATH<br/><br/> <a href='index.html'><img src='img/StartOver.png'></a></center></div>");
			clearInterval(globalInt);
		}
	}

	function checkForFloor() {
		var startingTower = 0;
		if(game.towers > 10) { 
			startingTower = game.towers - 10;
		}
		
		for (var i = 0; i < game.towers; i++) {
			if(document.getElementById("tower"+i) != null) {
				var toweri = document.getElementById("tower"+i);
				var towerx = parseInt(toweri.style.left.replace("px", ""));
				var towery = parseInt(toweri.style.top.replace("px", ""));
				var towerw = parseInt(toweri.style.width.replace("px", ""));
				var tooRight = (frog.x+frog.w) > (towerx+towerw+(frog.w/2));
				var tooLeft = (frog.x+frog.w) < towerx;
				var tooLow = (frog.y+frog.h) > towery;
				var tooHigh = (frog.y+frog.h) < (towery-7);
				if(!tooRight && !tooLeft && !tooLow && !tooHigh) {
					frog.onfloor = 1;			
					return;
				}
			}
		}
		frog.onfloor = 0;
	}

	function initFrog() {
		frog.y = game.conth - 150 - frog.h;
		frog.x = game.contw / 3; 
	}

	function updateTowers() {
		for(var i = 0; i < game.towers; i++) {
			if(document.getElementById("tower"+i) != null) {
				var tower = document.getElementById("tower"+i);
				var towerl = tower.style.left.replace("px", "");
				var towerw = tower.style.width.replace("px", "");
				tower.style.left = (towerl - game.towerSpeed)+"px";
			}	
		}
	}

	function updateBugs() {
		var startingBug = 0;
		if(game.bugs > 10) { 
			startingBug = game.bugs - 10;
		}
		for(var i = startingBug; i < game.bugs; i++) {
			if(document.getElementById("bug"+i) != null) {
				var bug = document.getElementById("bug"+i);
				var bugl = bug.style.left.replace("px", "");
				bug.style.left = (bugl - 4)+"px";
			}	
		}
	}

	function updateFrog() {
		frog.style.left = frog.x+"px";
		frog.style.top = frog.y+"px";
		checkForFloor();
		if(!frog.onfloor) {
			frog.style.background = "url('img/frogSprite3.png') 0 60px";
			frog.y += frog.fallSpeed;
		} else {
			frog.style.background = "url('img/frogSprite3.png') 0 0";
		}
		checkForDeath();
	}

	function makeTower() {
		if(game.towers) {
			var lastTowerl = parseInt(document.getElementById("tower"+(game.towers-1)).style.left.replace("px", ""));
			var lastTowerw = parseInt(document.getElementById("tower"+(game.towers-1)).style.width.replace("px", ""));
			if(lastTowerl > (game.contw + lastTowerw)) {
				return;
			}
		}
		if(game.towers > 30) {
			var tower = document.getElementById("tower"+startRecycle);
			startRecycle++;
		} else {
			var tower = document.createElement('div');	
		}
		if(!game.towers) {
			var towerh = 150;
			var towerw = 200;
		} else {
			var towerh = Math.floor(Math.random()*150)+70;
			var towerw = Math.floor(Math.random()*75+75);
		}

		tower.setAttribute('id', "tower"+game.towers);
		tower.style.width = towerw+"px"
		tower.style.height = towerh+"px";
		tower.style.position = "absolute";
		tower.style.backgroundImage = "url('img/lilly.png')";
		tower.style.backgroundSize = towerw+"px "+towerh+"px";
		tower.style.backgroundRepeat = "no-repeat";
		container.appendChild(tower);

		// for the first tower, place it a third of the way back
		if(!game.towers) {
			tower.style.left = (game.contw / 3)+"px";
		} else {
			// for all subsequent towers place them 80 px ahead of the last one
			tower.style.left = (lastTowerl + lastTowerw + 80)+"px";
		}
		tower.style.top = (game.conth - towerh)+"px";
		game.towers++;
	}

	function touchStart() {
		if(frog.onfloor) {
			frog.onfloor = 0;
			jumpCount = 0;
			clicktimer = setInterval(function(){
				// make the frog jump 8 px every (game.speed)ms
				if(jumpCount > 40) {
					clearInterval(clicktimer);
				}
				frog.y -= frog.jumpSpeed;
				jumpCount++;
			}, game.speed); 
		}	
	}

	function touchEnd() {
		if(typeof clicktimer != "undefined" && clicktimer) {
			clearInterval(clicktimer);
		}
	}	

	var globalInt = 0;
		
	function startGame() {
		globalInt = window.setInterval(check, game.speed);
		document.getElementById('startGame').style.display = "none";
	}
	
	for(var i=0; i<10; i++) {
		makeTower();
	}
	
	var jumpCount = 0;

	document.addEventListener('mousedown', touchStart, false);
	document.addEventListener('touchstart', touchStart, false);
	document.addEventListener("mouseup", touchEnd, false);
	document.addEventListener("touchend", touchEnd, false);

}, 100 );

	