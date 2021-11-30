import kaboom from "kaboom";


//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	debug: true,
	clearColor: [0, 0, 0, 1],
});

// Game logic

let isJumping = true;
var isMobile = navigator.userAgent.match(/Mobile/i) != null;
var isTablet = navigator.userAgent.match(/Tablet/i) != null;

loadAssets()

// controls
function CharacterMovement() {
	// Example
	// createArrow('arrow-up', 'up', width() - 50, height() - 55)

	createArrow("arrow-up", "up", 70 - 50, player.pos.y + 55);
	createArrow("arrow-down", "down", 70 - 50, player.pos.y + 32);
	createArrow("arrow-left", "left", 70 - 75, player.pos.y + 32);
	createArrow("arrow-right", "right", 70 - 25, player.pos.y + 32);

	// Touch
	onClick(up, run);
	onClick(down, run);
	onClick(left, run);
	onClick(right, run);
}

function run(key) {
	if (key === "up") {
		if (player.grounded()) {
			isJumping = true;
			player.jump(CURRENT_JUMP_FORCE);
		}
	} else if (key === "down") {
	} else if (key === "left") {
		player.move(-MOVE_SPEED, 0);

		up.pos.x = player.pos.x - up.width;
		down.pos.x = player.pos.x - down.width;
		left.pos.x = player.pos.x - left.width - 25;
		right.pos.x = player.pos.x - 15;
	} else {
		player.move(MOVE_SPEED, 0);

		up.pos.x = player.pos.x;
		down.pos.x = player.pos.x;
		left.pos.x = player.pos.x - 25;
		right.pos.x = player.pos.x + 25;
		// up.move(MOVE_SPEED, 0);
		// down.move(MOVE_SPEED, 0);

		// left.move(MOVE_SPEED, 0);
		// right.move(MOVE_SPEED, 0);
	}
}

function createArrow(spriteName, key, x, y) {
	const arrow = add([
		pos(x, y),
		sprite(spriteName),
		scale(0.5),
		"button",
		{
			clickAction: () => run(key),
		},
	]);
	window[key] = arrow;
	action("button", (b) => {
		if (b.isHovered()) {
			b.use(color(0.7, 0.7, 0.7));
		} else {
			b.use(color(1, 1, 1));
		}
		if (b.isClicked()) {
			b.clickAction();
		}
	});
	return arrow;
}

function frame() {
	var iframe = window.frameElement;

	// Checking if webpage is embedded
	if (iframe) {
		// The page is in an iFrame
		go("game", { level: 0, score: 0 });
	}
}

function mouseDblClick(cb) {
	document.addEventListener("dblclick", cb);
}

scene("menu", () => {
	add([text("Maskio Game"), origin("center"), pos(width() / 2, 80), scale(3)]);

	add([
		rect(160, 20),
		origin("center"),
		pos(width() / 2, 180),
		"button",
		{
			clickAction: () => go("game", { level: 0, score: 0 }),
		},
	]);

	add([
		text("Play game"),
		origin("center"),
		pos(width() / 2, 180),
		color(0, 0, 0),
	]);
	setTimeout(frame, 500);

	add([
		rect(160, 20),
		origin("center"),
		pos(width() / 2, 210),
		"button",
		{
			clickAction: () =>
				go("info", { infoText: "How To Play", showInfo: false }),
		},
	]);

	add([
		text("How To Play"),
		origin("center"),
		pos(width() / 2, 210),
		color(0, 0, 0),
	]);

	add([
		rect(160, 20),
		origin("center"),
		pos(width() / 2, 240),
		"button",
		{
			clickAction: () => window.open("https://kaboomjs.com/", "_blank"),
		},
	]);

	add([
		text("Learn Kaboom.js"),
		origin("center"),
		pos(width() / 2, 240),
		color(0, 0, 0),
	]);

	add([
		rect(160, 20),
		origin("center"),
		pos(width() / 2, 270),
		"button",
		{
			clickAction: () => window.open("builder.html", "_blank"),
		},
	]);

	add([
		text("Builder"),
		origin("center"),
		pos(width() / 2, 270),
		color(0, 0, 0),
	]);

	add([
		rect(160, 20),
		origin("center"),
		pos(width() / 2, 300),
		"button",
		{
			clickAction: () => install(),
		},
	]);

	add([
		text("Install"),
		origin("center"),
		pos(width() / 2, 300),
		color(0, 0, 0),
	]);

	action("button", (b) => {
		if (b.isHovered()) {
			b.use(color(0.7, 0.7, 0.7));
		} else {
			b.use(color(1, 1, 1));
		}

		if (b.isClicked()) {
			b.clickAction();
		}
	});
});

scene("game", ({ level, score }) => {
	layers(["bg", "obj", "ui"], "obj");

	// add([
	// 	sprite("bg"),
	// 	scale(width() / 200, height() / 200),
	// 	layer("bg"),
	// ]);

	const levelCfg = {
		width: 20,
		height: 20,
		"=": [sprite("block"), scale(0.3), solid()],
		$: [sprite("coin"), scale(0.3), "coin"],
		"%": [sprite("surprise"), solid(), scale(0.3), "coin-surprise"],
		"*": [sprite("surprise"), solid(), scale(0.3), "mushroom-surprise"],
		"}": [sprite("unboxed"), solid(), scale(0.3), ],
		"+": [sprite("portal"), solid(), scale(0.3), "portal"],
		"^": [sprite("virus"), solid(), scale(0.2), "dangerous"],
		"#": [sprite("mushroom"), solid(), scale(0.3), "mushroom", body()],
		"!": [sprite("blue-block"), scale(0.3), solid()],
		"£": [sprite("blue-brick"), scale(0.3), solid()],
		z: [sprite("blue-virus"), solid(), scale(0.2), "dangerous"],
		"@": [sprite("blue-surprise"), solid(), scale(0.3), "coin-surprise"],
		x: [sprite("blue-steel"), scale(0.3), solid()],
	};

	const gameLevel = addLevel(maps[level], levelCfg);

	add([text(`MASKIO\n000000`), pos(30, 6)]);

	const scoreLabel = add([
		text("x" + score),
		pos(160, 6),
		layer("ui"),
		{
			value: score,
		},
	]);

	const coinImg = add([sprite("coin"), scale(0.3), pos(160 - 15, 3), layer("ui")]);

	// const builder = add([
	// 	rect(55, 20),
	// 	pos(350, 6),
	// 	// sprite("surprise"),
	// 	"button",
	// 	{
	// 		clickAction: () => window.open("builder.html", "_blank"),
	// 	},
	// ]);

	// add([text("Builder"), pos(350, 6), color(0, 0, 0)]);

	action("button", (b) => {
		if (b.isHovered()) {
			b.use(color(0.7, 0.7, 0.7));
		} else {
			b.use(color(1, 1, 1));
		}

		if (b.isClicked()) {
			b.clickAction();
		}
	});

	add([text(`WORLD\n${parseInt(level + 1)}-${maps.length}`), pos(240, 6)]);

	const timer = add([
		text("TIME\n0"),
		pos(360, 6),
		{
			time: TIME_LEFT,
		},
	]);

	timer.action(() => {
		timer.time -= dt();
		timer.text = "TIME\n" + Math.round(timer.time.toFixed(2));
		if (timer.time <= 0) {
			go("info", {
				score: scoreLabel.value,
				time: "0.00",
				infoText: "Game Over",
			});
			play("hit");
			music.stop();
		}
	});

	function big() {
		let timer = 0;
		let isBig = false;
		return {
			update() {
				if (isBig) {
					CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
					timer -= dt();
					if (timer <= 0) {
						this.smallify();
					}
				}
			},
			isBig() {
				return isBig;
			},
			smallify() {
				this.scale = vec2(1).scale(0.3);
				CURRENT_JUMP_FORCE = JUMP_FORCE;
				timer = 0;
				isBig = false;
			},
			biggify(time) {
				this.scale = vec2(2).scale(0.3);
				timer = time;
				isBig = true;
			},
		};
	}

	const music = play("OtherworldlyFoe", { loop: true });

	music.volume(0.5);

	const player = add([
		sprite("maskio"),
		scale(0.3),
		solid(),
		pos(30, 0),
		body(),
		big(),
		origin("bot"),
	]);

	window.player = player;

	CharacterMovement();

	action("mushroom", (m) => {
		m.move(20, 0);
	});

	player.on("headbump", (obj) => {
		if (obj.is("coin-surprise")) {
			gameLevel.spawn("$", obj.gridPos.sub(0, 1));
			destroy(obj);
			gameLevel.spawn("}", obj.gridPos.sub(0, 0));
			play("blip");
		}
		if (obj.is("mushroom-surprise")) {
			gameLevel.spawn("#", obj.gridPos.sub(0, 1));
			destroy(obj);
			gameLevel.spawn("}", obj.gridPos.sub(0, 0));
			play("blip");
		}
	});

	player.collides("mushroom", (m) => {
		destroy(m);
		play("powerup");
		player.biggify(6);
	});

	let coinPitch = 0;

	action(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100);
		}
	});

	player.collides("coin", (c) => {
		destroy(c);
		play("coin", {
			detune: coinPitch,
		});
		coinPitch += 100;
		scoreLabel.value++;
		scoreLabel.text = "x" + scoreLabel.value;
	});

	action("dangerous", (d) => {
		d.move(-ENEMY_SPEED, 0);
	});

	player.collides("dangerous", (d) => {
		if (isJumping) {
			destroy(d);
			// addKaboom(player.pos);
			play("powerup");
		} else {
			go("info", {
				score: scoreLabel.value,
				time: timer.time.toFixed(2),
				infoText: "Game Over",
			});
			play("hit");
			music.stop();
		}
	});

	player.action(() => {
		camPos(player.pos);
		if (player.pos.y >= FALL_DEATH) {
			go("info", {
				score: scoreLabel.value,
				time: timer.time.toFixed(2),
				infoText: "Game Over",
			});
			play("hit");
			music.stop();
		}
	});

	player.collides("portal", () => {

		play("portal");
		music.stop();
		if (parseInt(level + 1) < maps.length) {
			go("game", {
				level: (level + 1) % maps.length,
				score: scoreLabel.value,
			});
		} else {
			go("info", {
				score: scoreLabel.value,
				time: timer.time.toFixed(2),
				infoText: "You Win!",
			});
		}

		mouseClick(() => {
			play("portal");
			music.stop();
			if (parseInt(level + 1) < maps.length) {
				go("game", {
					level: (level + 1) % maps.length,
					score: scoreLabel.value,
				});
			} else {
				go("info", {
					score: scoreLabel.value,
					time: timer.time.toFixed(2),
					infoText: "You Win!",
				});
			}
		});
	});

	keyDown("left", () => {
		player.move(-MOVE_SPEED, 0);

		up.pos.x = player.pos.x - up.width;
		down.pos.x = player.pos.x - down.width;
		left.pos.x = player.pos.x - left.width - 25;
		right.pos.x = player.pos.x - 15;
	});

	keyDown("right", () => {
		player.move(MOVE_SPEED, 0);

		up.pos.x = player.pos.x;
		down.pos.x = player.pos.x;
		left.pos.x = player.pos.x - 25;
		right.pos.x = player.pos.x + 25;
	});

	player.action(() => {
		if (player.grounded()) {
			isJumping = false;
		}
	});

	keyPress("space", () => {
		if (player.grounded()) {
			isJumping = true;
			player.jump(CURRENT_JUMP_FORCE);
		}
	});

	// if (isMobile || isTablet) {
	// 	mouseClick(() => {
	// 		let position = mousePos();
	// 		player.pos.x = position.x;
	// 		player.pos.y = position.y;
	// 	});
	// }

	mouseClick(() => {
		if (player.grounded()) {
			isJumping = true;
			player.jump(CURRENT_JUMP_FORCE);
		}
	});

	var isMobile = navigator.userAgent.match(/Mobile/i) != null;
	var isTablet = navigator.userAgent.match(/Tablet/i) != null;

	if (isMobile || isTablet) {
		var playerMove = setInterval(() => {
			player.move(MOVE_SPEED, 0);
		}, 30);

		let moveAuto = true;

		mouseDblClick(() => {
			if (moveAuto) {
				clearInterval(playerMove);
			} else {
				playerMove = setInterval(() => {
					player.move(MOVE_SPEED, 0);
				}, 30);
			}

			moveAuto = !moveAuto;

			up.pos.x = player.pos.x;
			down.pos.x = player.pos.x;
			left.pos.x = player.pos.x - 25;
			right.pos.x = player.pos.x + 25;
		});
	}
});

scene("info", ({ score, time, infoText, showInfo }) => {
	if (showInfo == undefined) {
		showInfo = true;
	}

	add([rect(width(), height()), color(0, 0, 0), layer("bg")]);

	add([
		text("Maskio", 14),
		origin("center"),
		pos(width() / 2, 15),
		color(rgb(0.98, 0.6, 0.01)),
		layer("ui"),
	]);

	add([
		text(infoText, 12),
		origin("center"),
		pos(width() / 2, 35),
		color(rgb(0.98, 0.6, 0.01)),
		layer("ui"),
	]);

	add([
		sprite("maskio"),
		scale(0.3),
		origin("center"),
		pos(width() / 2, height() / 2 - 20),
		scale(1),
		layer("obj"),
	]);
	if (showInfo) {
		add([
			sprite("coin"),
			scale(0.3),
			layer("obj"),
			pos(width() / 2 - 5, height() / 2 + 13),
			origin("center"),
		]);

		add([
			text("x" + score),
			origin("center"),
			pos(width() / 2 + 10, height() / 2 + 10),
			color(rgb(0.98, 0.6, 0.0)),
			layer("ui"),
			{
				value: score,
			},
		]);

		add([
			text("TIME: " + time),
			origin("right"),
			pos(width() / 2 - 27, height() / 2 + 10),
			color(rgb(0.98, 0.6, 0.0)),
			layer("ui"),
			{
				value: score,
			},
		]);
	}

	add([
		text("Click up or hit 'space' to jump", 8),
		origin("center"),
		pos(width() / 2 + 10, height() / 2 + 30),
		color(rgb(0.98, 0.6, 0.0)),
		layer("ui"),
	]);

	if (isMobile || isTablet) {
		add([
			text("Double click to stop moving and get manual control.", 8),
			origin("center"),
			pos(width() / 2 + 10, height() / 2 + 45),
			color(rgb(0.98, 0.6, 0.0)),
			layer("ui"),
		]);
		add([
			text("Click on the portal to go to the next level.", 8),
			origin("center"),
			pos(width() / 2 + 10, height() / 2 + 60),
			color(rgb(0.98, 0.6, 0.0)),
			layer("ui"),
		]);
	}

	add([
		text("Press 'space' or click to start!", 8),
		origin("center"),
		pos(width() / 2, height() - 15),
		color(rgb(0.98, 0.6, 0.0)),
		layer("ui"),
	]);
	if (showInfo) {
		keyPress("space", () => {
			go("game", { level: 0, score: 0 });
		});

		mouseClick(() => {
			go("game", { level: 0, score: 0 });
		});
	} else {
		keyPress("space", () => {
			go("menu");
		});

		mouseClick(() => {
			go("menu");
		});
	}
});

start("menu");
