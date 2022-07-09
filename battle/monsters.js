const draggleImage = new Image();
draggleImage.src = "./images/Battle/monsters/draggleSprite.png";

const embyImage = new Image();
embyImage.src = "./images/Battle/monsters/embySprite.png";

const monsters = {
  emby: {
    name: "Emby",
    position: {
      x: 0,
      y: 0,
    },
    image: embyImage,
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
    image: draggleImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    attacks: [attacks.tackle, attacks.fireball],
  },
};
