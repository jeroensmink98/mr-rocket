import * as PIXI from "pixi.js";

export class Asteroid {
  private sprite: PIXI.Sprite;
  private velocity: PIXI.Point;
  private minSpeed: number = 0.5;
  private maxSpeed: number = 5;
  private isSpecial: boolean;
  private static SPECIAL_CHANCE: number = 0.04; // 1/25 chance (4%)

  constructor(app: PIXI.Application, targetX: number, targetY: number) {
    this.isSpecial = Math.random() < Asteroid.SPECIAL_CHANCE;

    // Create the asteroid sprite
    const graphics = new PIXI.Graphics();
    if (this.isSpecial) {
      // Special asteroid: purple/magenta color
      graphics.fill(0xff00ff);
    } else {
      // Normal asteroid: brown color
      graphics.fill(0x8b4513);
    }
    graphics.circle(0, 0, 20);
    graphics.fill();

    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5, 0.5);

    // Set random starting position along screen boundary
    const spawnPoint = this.getRandomSpawnPoint(
      app.screen.width,
      app.screen.height
    );
    this.sprite.x = spawnPoint.x;
    this.sprite.y = spawnPoint.y;

    // Calculate direction towards player
    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Random speed between min and max
    const speed =
      this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);

    // Set velocity
    this.velocity = new PIXI.Point(
      (dx / distance) * speed,
      (dy / distance) * speed
    );
  }

  private getRandomSpawnPoint(width: number, height: number): PIXI.Point {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    switch (side) {
      case 0: // top
        return new PIXI.Point(Math.random() * width, -20);
      case 1: // right
        return new PIXI.Point(width + 20, Math.random() * height);
      case 2: // bottom
        return new PIXI.Point(Math.random() * width, height + 20);
      default: // left
        return new PIXI.Point(-20, Math.random() * height);
    }
  }

  public update(): void {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  public get displayObject(): PIXI.Sprite {
    return this.sprite;
  }

  public isOutOfBounds(width: number, height: number): boolean {
    const margin = 50;
    return (
      this.sprite.x < -margin ||
      this.sprite.x > width + margin ||
      this.sprite.y < -margin ||
      this.sprite.y > height + margin
    );
  }

  public get special(): boolean {
    return this.isSpecial;
  }
}
