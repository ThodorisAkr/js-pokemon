const generalAttacks = {
  run: {
    name: "Run",
    damage: 0,
    type: "Run",
    color: "black",
  },
};

const attacks = {
  tackle: {
    name: "Tackle",
    damage: Math.random() * (20 - 15) + 15,
    type: "Normal",
    color: "black",
  },

  fireball: {
    name: "Fireball",
    damage: Math.random() * (30 - 20) + 20,
    type: "Fire",
    color: "red",
  },
};
