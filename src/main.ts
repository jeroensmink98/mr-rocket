import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { AssetLoader } from "./AssetLoader";
import { assets, sounds } from "./assets";

const width = 640;
const height = 800;

(async () => {
  const app = new PIXI.Application();
  await app.init({
    width,
    height,
  });

  const assetLoader = new AssetLoader();
  await assetLoader.loadAll(assets, sounds);

  const game = new Game(app, assetLoader);
  document.body.appendChild(app.canvas);
})();
