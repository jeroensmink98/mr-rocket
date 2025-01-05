import * as PIXI from "pixi.js";
import { Entity } from "./Entity";

export class Laser extends Entity {
  private readonly speed: number = 10;
  private readonly maxDistance: number = 50; // Distance beyond bounds before removal

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    angle: number,
    color: number = 0xff0000
  ) {
    const graphics = new PIXI.Graphics();
    graphics.fill(color);
    graphics.rect(-8, -2, 16, 4);
    graphics.fill();

    // Convert graphics to sprite using generateTexture
    const texture = app.renderer.generateTexture(graphics);
    const sprite = new PIXI.Sprite(texture);

    super(app, "laser", sprite);

    this.sprite.position.set(x, y);
    this.sprite.rotation = angle;
  }

  public update(deltaTime: number): void {
    // Move in the direction of rotation
    this.sprite.x += Math.cos(this.sprite.rotation) * this.speed * deltaTime;
    this.sprite.y += Math.sin(this.sprite.rotation) * this.speed * deltaTime;
  }

  public isOutOfBounds(width: number, height: number): boolean {
    return (
      this.sprite.x < -this.maxDistance ||
      this.sprite.x > width + this.maxDistance ||
      this.sprite.y < -this.maxDistance ||
      this.sprite.y > height + this.maxDistance
    );
  }
}
