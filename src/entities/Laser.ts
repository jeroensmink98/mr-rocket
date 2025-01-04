import * as PIXI from "pixi.js";

export class Laser {
  private sprite: PIXI.Sprite;
  private velocity: PIXI.Point;
  private speed: number = 20;

  constructor(
    app: PIXI.Application,
    startX: number,
    startY: number,
    rotation: number
  ) {
    // make a simple red line
    const graphics = new PIXI.Graphics();
    graphics.fill(0xff0000);
    graphics.rect(0, 0, 2, 20);
    graphics.fill();

    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = startX;
    this.sprite.y = startY;
    this.sprite.rotation = rotation;

    // Calculate velocity based on rotation
    this.velocity = new PIXI.Point(
      Math.cos(rotation - Math.PI / 2) * this.speed,
      Math.sin(rotation - Math.PI / 2) * this.speed
    );
  }

  public update(): void {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  public get displayObject(): PIXI.Sprite {
    return this.sprite;
  }

  public isOutOfBounds(
    width: number,
    height: number,
    margin: number = 50
  ): boolean {
    return (
      this.sprite.x < -margin ||
      this.sprite.x > width + margin ||
      this.sprite.y < -margin ||
      this.sprite.y > height + margin
    );
  }
}
