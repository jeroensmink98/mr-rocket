import * as PIXI from "pixi.js";

export class Player {
  private sprite: PIXI.Sprite;
  private speed: number = 5;
  public velocity: PIXI.Point = new PIXI.Point(0, 0);
  public rotationSpeedInDegrees: number = 5;
  private acceleration: number = 0.1;
  private maxSpeed: number = 8;

  constructor(app: PIXI.Application) {
    const graphics = new PIXI.Graphics();
    graphics.fill(0x00ff00);
    graphics.rect(0, 0, 50, 25);
    graphics.fill();
    graphics.fill(0xff0000);
    graphics.rect(0, 25, 50, 25);
    graphics.fill();

    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = app.screen.width / 2;
    this.sprite.y = app.screen.height / 2;
  }

  public get displayObject(): PIXI.Sprite {
    return this.sprite;
  }

  public get rotation(): number {
    return this.sprite.rotation;
  }

  public get center(): PIXI.Point {
    return new PIXI.Point(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height / 2
    );
  }

  public update(keys: Set<string>): void {
    if (keys.has("ArrowLeft"))
      this.sprite.rotation -=
        this.rotationSpeedInDegrees * 0.017453292519943295;
    if (keys.has("ArrowRight"))
      this.sprite.rotation +=
        this.rotationSpeedInDegrees * 0.017453292519943295;

    // Update velocity based on input
    if (keys.has("ArrowUp")) {
      // Add acceleration in the direction we're facing
      this.velocity.x +=
        Math.cos(this.sprite.rotation - Math.PI / 2) * this.acceleration;
      this.velocity.y +=
        Math.sin(this.sprite.rotation - Math.PI / 2) * this.acceleration;
    } else {
      // Apply friction when not accelerating
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
    }

    // Limit maximum speed
    const currentSpeed = Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    if (currentSpeed > this.maxSpeed) {
      const scale = this.maxSpeed / currentSpeed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
    }

    // Update position based on velocity
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }
}
