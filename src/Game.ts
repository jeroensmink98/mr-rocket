import * as PIXI from "pixi.js";
import { World } from "./World";
import { Player } from "./Player";
import { AssetLoader } from "./AssetLoader";

import { Entity } from "./Entity";

export class Game {
  private app: PIXI.Application;
  public world: World;
  private player: Player;

  public entities: Entity[] = [];

  constructor(app: PIXI.Application, private assetLoader: AssetLoader) {
    this.app = app;
    this.world = new World(app.screen.width, app.screen.height);

    // Add the player to the stage using the loaded texture
    this.player = new Player(this.app, this.assetLoader.getTexture("player"));

    this.setupKeyboardControls();
  }

  private setupKeyboardControls(): void {
    window.addEventListener("keydown", (e) => {
      const speed = 10;
      let newX = this.player.sprite.x;
      let newY = this.player.sprite.y;

      switch (e.code) {
        case "ArrowUp":
          newY -= speed;
          break;
        case "ArrowDown":
          newY += speed;
          break;
        case "ArrowLeft":
          newX -= speed;
          break;
        case "ArrowRight":
          newX += speed;
          break;
      }

      // Check if the new position is within bounds
      if (this.world.isWithinBounds(newX, newY)) {
        this.player.move(
          newX - this.player.sprite.x,
          newY - this.player.sprite.y
        );
      }
    });
  }

  public start(): void {
    this.app.ticker.add(this.update.bind(this));
  }

  public update(): void {}
}
