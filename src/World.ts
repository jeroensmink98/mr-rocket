import * as PIXI from "pixi.js";

export class World {
  private bounds: PIXI.Rectangle;
  private readonly bounceFactor = 0.7; // Adjust this to control bounce strength

  constructor(width: number, height: number) {
    this.bounds = new PIXI.Rectangle(0, 0, width, height);
  }

  public checkBounds(
    sprite: PIXI.Sprite,
    velocity: { x: number; y: number }
  ): void {
    const bounds = sprite.getBounds();
    let collision = false;

    if (bounds.left < this.bounds.left) {
      sprite.x += this.bounds.left - bounds.left;
      velocity.x = Math.abs(velocity.x) * this.bounceFactor;
      collision = true;
    }
    if (bounds.right > this.bounds.right) {
      sprite.x -= bounds.right - this.bounds.right;
      velocity.x = -Math.abs(velocity.x) * this.bounceFactor;
      collision = true;
    }
    if (bounds.top < this.bounds.top) {
      sprite.y += this.bounds.top - bounds.top;
      velocity.y = Math.abs(velocity.y) * this.bounceFactor;
      collision = true;
    }
    if (bounds.bottom > this.bounds.bottom) {
      sprite.y -= bounds.bottom - this.bounds.bottom;
      velocity.y = -Math.abs(velocity.y) * this.bounceFactor;
      collision = true;
    }
  }

  public get width(): number {
    return this.bounds.width;
  }

  public get height(): number {
    return this.bounds.height;
  }

  public isWithinBounds(x: number, y: number): boolean {
    return this.bounds.contains(x, y);
  }
}
