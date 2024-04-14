export function onClick(btn, cb) {
	mouseClick(() => {
		let position = mousePos();
		if (
			position.x > btn.pos.x - btn.width / 2 &&
			position.x < btn.pos.x + btn.width / 2 &&
			position.y > btn.pos.y - btn.height / 2 &&
			position.y < btn.pos.y + btn.height / 2
		) {
			cb(btn.toString());
		}
	});
}

export function CharacterMovement() {
	// Example
	// createArrow('arrow-up', 'up', width() - 50, height() - 55)

	createArrow("arrow-up", "up", 70 - 50, player.pos.y + 55);
	createArrow("arrow-down", "down", 70 - 50, player.pos.y + 32);
	createArrow("arrow-left", "left", 70 - 75, player.pos.y + 32);
	createArrow("arrow-right", "right", 70 - 25, player.pos.y + 32);

	// Touch
	onClick(up, run)
	onClick(down, run)
	onClick(left, run)
	onClick(right, run)
}

export function run(key) {
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

export function createArrow(spriteName, key, x, y) {
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
