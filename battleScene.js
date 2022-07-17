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

let battleFrameId;
let renderedSprites = [];
let playerPokemon;
let enemyPokemon;
let queue;

const getRandomPokemon = (pokemonsObj) => {
  const keysArray = Object.keys(pokemonsObj);
  const rng = Math.floor(Math.random() * keysArray.length);

  return pokemonsObj[keysArray[rng]];
};

const getRandomAttack = (attacksList) => {
  let randomAttack = 0;
  if (attacksList.length <= 1) return attacksList[0];

  const rng = Math.floor(Math.random() * attacksList.length);
  return attacksList[rng];
};

const initBattle = () => {
  document.querySelector("#user-interface").style.display = "block";
  document.querySelector("#battleDialogBox").style.display = "none";
  document.querySelector("#enemyHealthCount").style.width = "100%";
  document.querySelector("#playerHealthCount").style.width = "100%";
  document.querySelector("#attacks-box").replaceChildren();

  const playerPokemons = {
    emby: new Monster(monsters.emby),
  };

  const enemyPokemons = {
    draggle: new Monster(monsters.draggle),
    emby: new Monster(monsters.emby),
    mushroom: new Monster(monsters.mushroom),
  };

  const emby = new Monster(monsters.emby);

  playerPokemon = emby;
  enemyPokemon = getRandomPokemon(enemyPokemons);

  document.querySelector("#playerPokemonName").innerHTML = playerPokemon.name;
  document.querySelector("#enemyPokemonName").innerHTML = enemyPokemon.name;

  playerPokemon.position = {
    x: playerPosition.x,
    y: playerPosition.y,
  };

  enemyPokemon.position = {
    x: enemyPosition.x,
    y: enemyPosition.y,
  };

  enemyPokemon.isEnemy = true;

  renderedSprites = [playerPokemon, enemyPokemon];
  queue = [];

  playerPokemon.attacks.forEach((item) => {
    const button = document.createElement("button");
    button.classList.add("attack");
    button.classList.add("flex-center");
    button.innerHTML = item.name;
    button.id = item.name.toLowerCase().replace(/ /g, "");
    document.querySelector("#attacks-box").append(button);
  });

  const attack = document.querySelectorAll(".attack");
  attack.forEach((item) => {
    item.addEventListener("click", (e) => {
      playerPokemon.attack({
        attack: attacks[e.target.id],
        recipient: enemyPokemon,
        renderedSprites,
      });

      if (enemyPokemon.health <= 0) {
        queue.push(() => enemyPokemon.faint());
        queue.push(() => {
          gsap.to("#overlap", {
            opacity: 1,
            onComplete: () => {
              window.cancelAnimationFrame(battleFrameId);
              animate();
              gsap.to("#overlap", {
                opacity: 0,
              });
              document.querySelector("#user-interface").style.display = "none";
              pokemonBattle.initiated = false;
            },
          });
        });

        return;
      }

      queue.push(() => {
        enemyPokemon.attack({
          attack: getRandomAttack(enemyPokemon.attacks),
          recipient: playerPokemon,
          renderedSprites,
        });

        if (playerPokemon.health <= 0) {
          playerPokemon.faint();
          queue.push(() => {
            gsap.to("#overlap", {
              opacity: 1,
              onComplete: () => {
                window.cancelAnimationFrame(battleFrameId);
                animate();
                gsap.to("#overlap", {
                  opacity: 0,
                });
                document.querySelector("#user-interface").style.display =
                  "none";
                pokemonBattle.initiated = false;
              },
            });
          });

          return;
        }
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
    e.stopImmediatePropagation();
    if (queue.length > 0) {
      queue[0]();
      queue.shift();
    } else e.currentTarget.style.display = "none";
  });
};
const animateBattle = () => {
  battleFrameId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
};
