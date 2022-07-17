class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 7 },
    sprites,
    animate = false,
    rotation = 0,
  }) {
    this.position = position;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image = new Image();

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src;

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
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
}

class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 7 },
    sprites,
    animate = false,
    rotation = 0,
    name = "",
    isEnemy = false,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    });
    this.name = name;
    this.isEnemy = isEnemy;
    this.health = 100;
    this.attacks = attacks;
  }

  faint() {
    const battleDialogEl = document.querySelector("#battleDialogBox");
    battleDialogEl.innerHTML = `${this.name} fainted!`;
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }

  attack({ attack, recipient, renderedSprites }) {
    const damage =
      Math.random() * (attack.damage.max - attack.damage.min) +
      attack.damage.min;
    const battleDialogEl = document.querySelector("#battleDialogBox");
    battleDialogEl.style.display = "flex";
    battleDialogEl.innerHTML = `<p>${this.isEnemy ? "Enemy's " : ""}${
      this.name
    } used <span style="color: ${attack.color}">${
      attack.name
    }</span> for <span style="color: ${attack.color}">${parseInt(
      damage
    )}</span> damage!`;

    let healthCount = "enemyHealthCount";
    if (this.isEnemy) {
      healthCount = "playerHealthCount";
    }

    switch (attack.name) {
      case "Tackle":
        this.tackle({ damage, recipient, healthCount });
        break;
      case "Fireball":
        this.fireball({ damage, recipient, healthCount, renderedSprites });
        break;
      case "Poison Dart":
        this.poisonDart({ damage, recipient, healthCount, renderedSprites });
        break;
    }
  }
  tackle({ damage, recipient, healthCount }) {
    const tl = gsap.timeline();
    recipient.health -= damage;

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
            width: `${recipient.health}%`,
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

  fireball({ damage, recipient, healthCount, renderedSprites }) {
    let rotation = 1;

    recipient.health -= damage;
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
          width: `${recipient.health}%`,
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

  poisonDart({ damage, recipient, healthCount, renderedSprites }) {
    let rotation = -1;

    recipient.health -= damage;
    if (this.isEnemy) rotation = 2;
    const poisonDartImage = new Image();
    poisonDartImage.src = "./images/Battle/spells/poisondart.png";
    const poisonDart = new Sprite({
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      image: poisonDartImage,
      frames: { max: 4, hold: 5 },
      animate: true,
      rotation,
    });

    renderedSprites.splice(1, 0, poisonDart);

    gsap.to(poisonDart.position, {
      x: recipient.position.x,
      y: recipient.position.y,
      onComplete: () => {
        renderedSprites.splice(1, 1);
        gsap.to(`#${healthCount}`, {
          width: `${recipient.health}%`,
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
