import * as PIXI from "pixi.js";
import { Entity } from "./Entity";

export class Asteroid extends Entity {
  private velocity: { x: number; y: number };
  private readonly speed: number = 2;
  private readonly maxDistance: number = 50;
  private readonly rotationSpeed: number;

  constructor(
    app: PIXI.Application,
    texture: PIXI.Texture,
    targetX: number,
    targetY: number
  ) {
    super(app, "asteroid", new PIXI.Sprite(texture));

    // Set random spawn position on screen edge
    const spawnPoint = this.getRandomSpawnPoint(
      app.screen.width,
      app.screen.height
    );
    this.sprite.position.set(spawnPoint.x, spawnPoint.y);

    // Calculate direction towards target (player)
    const angle = Math.atan2(targetY - spawnPoint.y, targetX - spawnPoint.x);
    this.velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed,
    };

    // Set anchor and random rotation
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = Math.random() * Math.PI * 2;

    // Scale asteroid
    const scale = 2 + Math.random() * 0.5; // Random size between 2x and 2.5x
    this.sprite.scale.set(scale);

    // Random rotation speed between -0.02 and 0.02
    this.rotationSpeed = (Math.random() - 0.5) * 0.04;
  }

  private getRandomSpawnPoint(
    width: number,
    height: number
  ): { x: number; y: number } {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    switch (side) {
      case 0:
        return { x: Math.random() * width, y: -this.maxDistance };
      case 1:
        return { x: width + this.maxDistance, y: Math.random() * height };
      case 2:
        return { x: Math.random() * width, y: height + this.maxDistance };
      default:
        return { x: -this.maxDistance, y: Math.random() * height };
    }
  }

  public update(deltaTime: number): void {
    this.sprite.x += this.velocity.x * deltaTime;
    this.sprite.y += this.velocity.y * deltaTime;
    this.sprite.rotation += this.rotationSpeed; // Each asteroid rotates at its own speed
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
