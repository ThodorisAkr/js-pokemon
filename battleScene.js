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

let renderedSprites = [];


let battleFrameId;

let playerPokemon;
let enemyPokemon;
let queue;

const initBattle = () => {
  
  const draggle = new Monster(monsters.draggle);
  const emby = new Monster(monsters.emby);
  playerPokemon = emby;
  enemyPokemon = draggle;
  renderedSprites = [playerPokemon, enemyPokemon];
  queue = [];

  playerPokemon.attacks.forEach((item) => {
    const button = document.createElement("button");
    button.classList.add("attack");
    button.classList.add("flex-center");
    button.innerHTML = item.name;
    button.id = item.name.toLowerCase();
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
    queue.push(()=> {
      gsap.to("#overlap", {
        opacity: 1,
        onComplete: () => {
          window.cancelAnimationFrame(battleFrameId)
          animate();
          gsap.to("#overlap", {
            opacity: 0,
          })
          document.querySelector("#user-interface").style.display = "none";
          pokemonBattle.initiated = false;
        }
      })
    })
  }

    let randomAttack = 0;
    if(Math.random() > 0.66){
      randomAttack = 1
    }

    queue.push(() => {
      enemyPokemon.attack({
        attack: enemyPokemon.attacks[randomAttack],
        recipient: playerPokemon,
        renderedSprites,
      });

      if (playerPokemon.health <= 0) {
        playerPokemon.faint();
        return
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
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
}
const animateBattle = () => {
  battleFrameId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
};




