import * as PIXI from "pixi.js";

export class World {
  private bounds: PIXI.Rectangle;

  constructor(width: number, height: number) {
    this.bounds = new PIXI.Rectangle(0, 0, width, height);
  }

  public checkBounds(sprite: PIXI.Sprite): boolean {
    const bounds = sprite.getBounds();
    let collision = false;

    if (bounds.left < this.bounds.left) {
      sprite.x += this.bounds.left - bounds.left;
      collision = true;
    }
    if (bounds.right > this.bounds.right) {
      sprite.x -= bounds.right - this.bounds.right;
      collision = true;
    }
    if (bounds.top < this.bounds.top) {
      sprite.y += this.bounds.top - bounds.top;
      collision = true;
    }
    if (bounds.bottom > this.bounds.bottom) {
      sprite.y -= bounds.bottom - this.bounds.bottom;
      collision = true;
    }

    if (collision) {
      console.log("Sprite hit world boundary!");
    }
    return collision;
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
