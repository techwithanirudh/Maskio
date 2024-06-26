// custom component controlling enemy patrol movement
export function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, side) => {
				if (side === "left" || side === "right") {
					dir = -dir;
				}
			});
		},
		update() {
			this.move(speed * dir, 0);
		},
	};
}