import * as PIXI from "pixi.js";

export class AssetLoader {
  private textures: { [key: string]: PIXI.Texture } = {};
  private sounds: Map<string, HTMLAudioElement> = new Map();

  public async loadAll(
    assets: { name: string; url: string }[],
    sounds: { name: string; url: string }[]
  ): Promise<void> {
    console.log("Loading assets:", assets);
    for (const asset of assets) {
      await this.addAsset(asset.name, asset.url);
    }

    console.log("Loading sounds:", sounds);
    for (const sound of sounds) {
      await this.addSound(sound.name, sound.url);
    }
  }

  private async addAsset(name: string, url: string): Promise<void> {
    let texture;
    try {
      texture = await PIXI.Assets.load(url);
    } catch (error) {
      console.error(`Failed to load asset from URL: ${url}`, error);
    }
    this.textures[name] = texture;
  }

  private async addSound(name: string, url: string): Promise<void> {
    try {
      const audio = new Audio(url);
      await audio.load();
      this.sounds.set(name, audio);
    } catch (error) {
      console.error(`Failed to load sound from URL: ${url}`, error);
    }
  }

  public getTexture(name: string): PIXI.Texture {
    return this.textures[name];
  }

  public playSound(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
}
