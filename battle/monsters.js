draggleImage = "./images/Battle/monsters/draggleSprite.png";
embyImage = "./images/Battle/monsters/embySprite.png";
mushroomImage = "./images/Battle/monsters/mushroomSprite.png";

const monsters = {
  emby: {
    name: "Emby",
    position: {
      x: 0,
      y: 0,
    },
    image: {
      src: embyImage,
    },
    frames: {
      max: 4,
      hold: 10,
    },
    animate: true,
    attacks: [attacks.tackle, attacks.fireball],
  },

  draggle: {
    name: "Draggle",
    position: {
      x: 0,
      y: 0,
    },
    image: {
      src: draggleImage,
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    attacks: [attacks.tackle, attacks.poisondart],
  },
  mushroom: {
    name: "Mushroom",
    position: {
      x: 0,
      y: 0,
    },
    image: {
      src: mushroomImage,
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    attacks: [attacks.tackle, attacks.poisondart],
  },
};
