// Speed identifiers
const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
const FALL_DEATH = 700;
const ENEMY_SPEED = 20;
const TIME_LEFT = 20;
const BULLET_SPEED = 200;
const directions = {
  LEFT: "left",
  RIGHT: "right",
};

let current_direction = directions.RIGHT;