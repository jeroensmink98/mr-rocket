import * as PIXI from "pixi.js";

export class Entity {
  protected app: PIXI.Application;
  public name: string;
  public sprite: PIXI.Sprite;

  constructor(app: PIXI.Application, name: string, sprite: PIXI.Sprite) {
    this.app = app;
    this.name = name;
    this.sprite = sprite;
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height / 2;
    this.addToStage();
  }

  public addToStage(): void {
    this.app.stage.addChild(this.sprite);
  }

  public removeFromStage(): void {
    this.app.stage.removeChild(this.sprite);
  }

  public checkCollision(other: Entity): boolean {
    const bounds1 = this.sprite.getBounds();
    const bounds2 = other.sprite.getBounds();

    // Scale down the hitbox (adjust these values as needed)
    const scale1 = 0.5; // 50% of original size
    const scale2 = 0.6; // 60% of original size

    // Calculate scaled dimensions and centers
    const w1 = bounds1.width * scale1;
    const h1 = bounds1.height * scale1;
    const w2 = bounds2.width * scale2;
    const h2 = bounds2.height * scale2;

    // Calculate centers
    const center1x = bounds1.x + bounds1.width / 2;
    const center1y = bounds1.y + bounds1.height / 2;
    const center2x = bounds2.x + bounds2.width / 2;
    const center2y = bounds2.y + bounds2.height / 2;

    // Check collision with scaled bounds from center points
    return (
      Math.abs(center1x - center2x) < (w1 + w2) / 2 &&
      Math.abs(center1y - center2y) < (h1 + h2) / 2
    );
  }
}
