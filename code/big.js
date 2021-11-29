// custom component that makes stuff grow big
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
			this.scale = vec2(1);
			CURRENT_JUMP_FORCE = JUMP_FORCE;
			timer = 0;
			isBig = false;
		},
		biggify(time) {
			this.scale = vec2(2);
			timer = time;
			isBig = true;
		},
	};
}