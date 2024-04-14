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

loadAssets();

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
    "&": [sprite("surprise"), solid(), scale(0.3), "vaccine-surprise"],
    "}": [sprite("unboxed"), solid(), scale(0.3)],
    "+": [sprite("portal"), solid(), scale(0.3), "portal"],
    "^": [sprite("virus"), solid(), scale(0.15), "dangerous"],
    "#": [sprite("mushroom"), solid(), scale(0.3), "mushroom", body()],
    ">": [sprite("vaccine"), solid(), scale(0.3), "vaccine", body()],
    "!": [sprite("blue-block"), scale(0.3), solid()],
    "£": [sprite("blue-brick"), scale(0.3), solid()],
    z: [sprite("blue-virus"), solid(), scale(0.15), "dangerous"],
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

  const coinImg = add([
    sprite("coin"),
    scale(0.3),
    pos(160 - 15, 3),
    layer("ui"),
  ]);

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

  action("vaccine", (v) => {
    v.move(20, 0);
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
    if (obj.is("vaccine-surprise")) {
      gameLevel.spawn(">", obj.gridPos.sub(0, 1));
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

  player.collides("vaccine", (v) => {
    destroy(v);
    play("powerup");
    window.vaccine = true;
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
    player.flipX(-1);
    current_direction = directions.LEFT;
    player.move(-MOVE_SPEED, 0);

    up.pos.x = player.pos.x - up.width;
    down.pos.x = player.pos.x - down.width;
    left.pos.x = player.pos.x - left.width - 25;
    right.pos.x = player.pos.x - 15;
  });

  keyDown("right", () => {
    player.flipX(1);
    current_direction = directions.RIGHT;
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

  keyPress("up", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  keyPress("down", () => {
    player.weight = 3;
  });

  keyRelease("down", () => {
    player.weight = 1;
  });
  function spawnBullet(bulletpos) {
    if (current_direction == directions.LEFT) {
      bulletpos = bulletpos.sub(10, 0);
    } else if (current_direction == directions.RIGHT) {
      bulletpos = bulletpos.add(10, 0);
    }
    add([
      sprite("injection"),
      scale(0.5),
      pos(bulletpos),
      origin("center"),
      "bullet",
      {
        bulletSpeed:
          current_direction == directions.LEFT
            ? -1 * BULLET_SPEED
            : BULLET_SPEED,
      },
    ]);

    play("shoot", {
      volume: 0.2,
      detune: rand(-1200, 1200),
    });
  }

  action("bullet", (b) => {
    b.move(b.bulletSpeed, 0);
    if (b.pos.x < 0) {
      destroy(b);
    }
  });

  keyPress("space", () => {
    if (window.vaccine) {
      spawnBullet(player.pos);
    }
  });

  collides("bullet", "dangerous", (b, d) => {
    destroy(b);
    destroy(d);
    camShake(4);
    play("explosion", {
      volume: 0.2,
      detune: rand(0, 1200),
    });
  });

  // if (isMobile || isTablet) {
  // 	mouseClick(() => {
  // 		let position = mousePos();
  // 		player.pos.x = position.x;
  // 		player.pos.y = position.y;
  // 	});
  // }

  //   mouseClick(() => {
  //     if (player.grounded()) {
  //       isJumping = true;
  //       player.jump(CURRENT_JUMP_FORCE);
  //     }
  //   });

  var isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  if (isTouchDevice) {
    var playerMove = setInterval(() => {
      player.move(MOVE_SPEED, 0);
    }, 30);

    let moveAuto = true;

    window.addEventListener("click", function (evt) {
      if (evt.detail === 1) {
        if (player.grounded()) {
          isJumping = true;
          player.jump(CURRENT_JUMP_FORCE);
        }
      } else if (evt.detail === 2) {
        if (window.vaccine) {
          spawnBullet(player.pos);
        }
      } else if (evt.detail === 3) {
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
      }
    });
  }
});

scene("info", ({ score, time, infoText, showInfo, startScreen }) => {
  if (showInfo == undefined) {
    showInfo = true;
  }

  var isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

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
    origin("center"),
    pos(width() / 2, height() / 2 - 20),
    scale(0.3),
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
    text("Click or hit 'up' to jump", 8),
    origin("center"),
    pos(width() / 2 + 10, height() / 2 + 30),
    color(rgb(0.98, 0.6, 0.0)),
    layer("ui"),
  ]);

  if (isTouchDevice) {
    add([
      text("Double click to shoot vaccines.", 8),
      origin("center"),
      pos(width() / 2 + 10, height() / 2 + 45),
      color(rgb(0.98, 0.6, 0.0)),
      layer("ui"),
    ]);
    add([
      text("Thriple click to stop moving and get manual control.", 8),
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

  if (showInfo || startScreen) {
    keyPress("space", () => {
      go("game", { level: 0, score: 0 });
    });

    mouseClick(() => {
      go("game", { level: 0, score: 0 });
    });

    window.vaccine = false;
  }
});

// start("menu");
start("info", {
  infoText: "Corona Virus Superhero Game",
  showInfo: false,
  startScreen: true,
});
