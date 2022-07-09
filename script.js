//CONSTANTS//
const WIDTH = 1024;
const HEIGHT = 576;

let collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}
const boundaries = [];

const offset = {
  x: -540,
  y: -370,
};

const battleOffset = {
  playerSide: {
    x: -180,
    y: 50,
  },

  enemySide: {
    x: 0,
    y: 0,
  },
};

collisionsMap.forEach((row, rowIdx) => {
  row.forEach((symbol, symbolIdx) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: symbolIdx * Boundary.width + offset.x,
            y: rowIdx * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

let battleZonesMap = [];
for (let i = 0; i < battleZones.length; i += 70) {
  battleZonesMap.push(battleZones.slice(i, i + 70));
}

const battle = [];
battleZonesMap.forEach((row, rowIdx) => {
  row.forEach((symbol, symbolIdx) => {
    if (symbol !== 0) {
      battle.push(
        new Boundary({
          position: {
            x: symbolIdx * Boundary.width + offset.x,
            y: rowIdx * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

c.fillStyle = "white";
c.fillRect(0, 0, WIDTH, HEIGHT);

const image = new Image();
image.src = "./images/pokemonMap.png";

const playerDownImage = new Image();
playerDownImage.src = "./images/player/playerDown.png";
const playerUpImage = new Image();
playerUpImage.src = "./images/player/playerUp.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./images/player/playerLeft.png";
const playerRightImage = new Image();
playerRightImage.src = "./images/player/playerRight.png";

const foregroundImg = new Image();
foregroundImg.src = "./images/foregroundObjects.png";

// WIDTH / 2 - this.image.width / 4 / 2,
// HEIGHT / 2 - this.image.height / 4,

const player = new Sprite({
  position: {
    x: WIDTH / 2 - 192 / 4 / 2,
    y: HEIGHT / 2 - 68 / 4,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImg,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, foreground, ...boundaries, ...battle];

const rectangularCollision = ({ rect1, rect2 }) => {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + rect1.height >= rect2.position.y &&
    rect1.position.y - rect1.height / 2.5 <=
      rect2.position.y + rect2.height - rect1.height
  );
};

const pokemonBattle = {
  initiated: false,
};

const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battle.forEach((battleSquare) => {
    battleSquare.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;

  if (pokemonBattle.initiated) return;
  //ACTIVATE BATTLE
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battle.length; i++) {
      const battleSquare = battle[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleSquare.position.x + battleSquare.width
        ) -
          Math.max(player.position.x, battleSquare.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleSquare.position.y + battleSquare.height
        ) -
          Math.max(player.position.y, battleSquare.position.y));

      if (
        rectangularCollision({
          rect1: player,
          rect2: battleSquare,
        }) &&
        overlappingArea > (player.width * player.height) / 2
      ) {
        if (Math.random() < 0.05) {
          //Initiate Battle
          pokemonBattle.initiated = true;

          // deactivate current loop
          window.cancelAnimationFrame(animationId);

          //Change screen animation
          gsap.to("#overlap", {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
              gsap.to("#overlap", {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                  //Activate new animation loop

                  gsap.to(".attack-grid", {
                    opacity: 1,
                  });

                  gsap.to(".battle-box__container", {
                    opacity: 1,
                  });
                  animateBattle();
                  gsap.to("#overlap", {
                    opacity: 0,
                    duration: 0.4,
                  });
                },
              });
            },
          });
        }
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving) movables.forEach((movable) => (movable.position.y += 3));
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.y -= 3));
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.x += 3));
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) movables.forEach((movable) => (movable.position.x -= 3));
  }
};

animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "w":
      lastKey = "w";
      keys.w.pressed = true;
      break;
    case "s":
      lastKey = "s";
      keys.s.pressed = true;
      break;
    case "d":
      lastKey = "d";
      keys.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key.toLowerCase()) {
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
