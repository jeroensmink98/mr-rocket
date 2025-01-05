import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { AssetLoader } from "./AssetLoader";
import { assets } from "./assets";

const width = 640;
const height = 840;

(async () => {
  const app = new PIXI.Application();
  await app.init({
    width,
    height,
  });

  const assetLoader = new AssetLoader();
  await assetLoader.loadAll(assets);

  const game = new Game(app, assetLoader);
  game.start();

  document.body.appendChild(app.canvas);
})();
