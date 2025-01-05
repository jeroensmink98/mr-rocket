import * as PIXI from "pixi.js";
import { Entity } from "./Entity";

export class Player extends Entity {
  public sprite: PIXI.Sprite;

  constructor(app: PIXI.Application, texture: PIXI.Texture) {
    super(app, "player", new PIXI.Sprite(texture));
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5, 0.5);
  }

  public move(dx: number, dy: number): void {
    this.sprite.x += dx;
    this.sprite.y += dy;
  }
}
