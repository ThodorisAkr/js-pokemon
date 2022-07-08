class Sprite {
  constructor({
    name = "",
    position,
    image,
    frames = { max: 1, hold: 7 },
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0,
  }) {
    this.name = name;
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.rotation = rotation;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,

      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();

    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  attack({ attack, recipient, renderedSprites }) {
    const attackTypeEl = document.querySelector(".attack-grid .type");
    const battleDialogEl = document.querySelector("#battleDialogBox");
    attackTypeEl.innerHTML = attack.type;
    battleDialogEl.innerHTML = `<p>${this.name} used <span style="color: ${
      attack.color
    }">${attack.name}</span> for <span style="color: ${
      attack.color
    }">${parseInt(attack.damage)}</span> damage!`;

    gsap.to(battleDialogEl, {
      display: "flex",
      duration: 0.66,
      yoyo: true,
      repeat: 3,
      onComplete() {
        console.log("complete");
      },
    });

    let healthCount = "enemyHealthCount";
    if (this.isEnemy) {
      healthCount = "playerHealthCount";
    }

    switch (attack.name) {
      case "Tackle":
        attackTypeEl.style.color = "black";
        this.tackle({ attack, recipient, healthCount });
        break;
      case "Fireball":
        attackTypeEl.style.color = "red";
        this.fireball({ attack, recipient, healthCount, renderedSprites });
        break;
    }
  }
  tackle({ attack, recipient, healthCount }) {
    const tl = gsap.timeline();

    let movementDistance = 20;
    if (this.isEnemy) {
      movementDistance = -20;
    }

    tl.to(this.position, {
      x: this.position.x - movementDistance,
    })
      .to(this.position, {
        x: this.position.x + movementDistance * 2,
        duration: 0.1,
        onComplete() {
          //Enemy gets hit

          gsap.to(`#${healthCount}`, {
            width: `${recipient.health - attack.damage}%`,
            onComplete() {
              recipient.health -= attack.damage;
            },
          });
          gsap.to(recipient.position, {
            x: recipient.position.x + 10,
            repeat: 3,
            yoyo: true,
            duration: 0.1,
          });
          gsap.to(recipient, {
            opacity: 0,
            repeat: 3,
            yoyo: true,
            duration: 0.08,
          });
        },
      })
      .to(this.position, {
        x: this.position.x,
      });
  }

  fireball({ attack, recipient, healthCount, renderedSprites }) {
    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;
    const fireballImage = new Image();
    fireballImage.src = "./images/Battle/spells/fireball.png";
    const fireball = new Sprite({
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      image: fireballImage,
      frames: { max: 4, hold: 5 },
      animate: true,
      rotation,
    });

    renderedSprites.splice(1, 0, fireball);
    gsap.to(fireball.position, {
      x: recipient.position.x,
      y: recipient.position.y,
      onComplete: () => {
        renderedSprites.splice(1, 1);
        gsap.to(`#${healthCount}`, {
          width: `${recipient.health - attack.damage}%`,
          onComplete() {
            recipient.health -= attack.damage;
          },
        });
        gsap.to(recipient.position, {
          x: recipient.position.x + 10,
          repeat: 3,
          yoyo: true,
          duration: 0.1,
        });
        gsap.to(recipient, {
          opacity: 0,
          repeat: 3,
          yoyo: true,
          duration: 0.08,
        });
      },
    });
  }
}

class Boundary {
  static width = 42;
  static height = 42;
  constructor({ position }) {
    this.position = position;
    this.width = 42;
    this.height = 42;
  }

  draw() {
    c.fillStyle = "transparent";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
