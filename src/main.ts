import * as PIXI from "pixi.js";
import { GameController } from "./controllers/GameController";
const width = 640;
const height = 840;

(async () => {
  const app = new PIXI.Application();
  await app.init({
    width,
    height,
  });
  console.log("app initialized");

  const gameController = new GameController(app);
  gameController.start();

  document.body.appendChild(app.canvas);
})();
