import * as PIXI from "pixi.js";

export class AssetLoader {
  private assets: { [key: string]: PIXI.Texture } = {};

  public async addAsset(name: string, url: string): Promise<void> {
    let texture;
    try {
      texture = await PIXI.Assets.load(url);
    } catch (error) {
      console.error(`Failed to load asset from URL: ${url}`, error);
    }

    this.assets[name] = texture;
  }

  public async loadAll(assets: { name: string; url: string }[]): Promise<void> {
    console.log(assets);
    for (const asset of assets) {
      await this.addAsset(asset.name, asset.url);
    }
  }

  public getTexture(name: string): PIXI.Texture {
    return this.assets[name];
  }
}
