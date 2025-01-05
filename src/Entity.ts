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
}
