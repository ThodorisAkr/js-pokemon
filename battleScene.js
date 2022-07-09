const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./images/Battle/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const playerPosition = {
  x: 320,
  y: 320,
};

const enemyPosition = {
  x: 790,
  y: 100,
};

const draggle = new Monster(monsters.draggle);
const emby = new Monster(monsters.emby);

const playerPokemon = emby;
const enemyPokemon = draggle;

playerPokemon.position = {
  x: playerPosition.x,
  y: playerPosition.y,
};
enemyPokemon.isEnemy = true;

enemyPokemon.position = {
  x: enemyPosition.x,
  y: enemyPosition.y,
};

const renderedSprites = [playerPokemon, enemyPokemon];

playerPokemon.attacks.forEach((item) => {
  const button = document.createElement("button");
  button.classList.add("attack");
  button.classList.add("flex-center");
  button.innerHTML = item.name;
  button.id = item.name.toLowerCase();
  document.querySelector("#attacks-box").append(button);
});

//   <button id="tackle" class="attack flex-center">TACKLE</button>
//   <button id="fireball" class="attack flex-center">FIREBALL</button>

const animateBattle = () => {
  const battleFrameId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });

  if (enemyPokemon.health <= 0) {
    console.log("enemy dead");
    window.cancelAnimationFrame(battleFrameId);
    gsap.to(enemyPokemon, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to(".attack-grid", {
          opacity: 0,
        });

        gsap.to(".battle-box__container", {
          opacity: 0,
        });

        pokemonBattle.initiated = false;
        animate();
      },
    });
  }

  if (playerPokemon.health <= 0) {
    console.log("Player dead");
    playerPokemon.opacity = 0;
  }
};

// animateBattle();

const queue = [];

const attack = document.querySelectorAll(".attack");
attack.forEach((item) => {
  item.addEventListener("click", (e) => {
    playerPokemon.attack({
      attack: attacks[e.target.id],
      recipient: enemyPokemon,
      renderedSprites,
    });

    const randomAttack =
      enemyPokemon.attacks[
        Math.floor(Math.random() * enemyPokemon.attacks.length)
      ];

    queue.push(() => {
      enemyPokemon.attack({
        attack: randomAttack,
        recipient: playerPokemon,
        renderedSprites,
      });
    });
  });

  item.addEventListener("mouseenter", (e) => {
    const enteredAttack = e.currentTarget.id;
    const attackTypeEl = document.querySelector(".attack-grid .type");
    attackTypeEl.innerHTML = `<span style="color: ${attacks[enteredAttack].color}">
        ${attacks[enteredAttack].type}
    </span>
    `;
  });
});

document.querySelector("#battleDialogBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
