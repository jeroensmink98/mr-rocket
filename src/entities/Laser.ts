import * as PIXI from "pixi.js";
import { WeaponStats } from "../weapons/BaseWeapon";

export class Laser {
  private sprite: PIXI.Sprite;
  private velocity: PIXI.Point;
  private weaponName: string;

  constructor(
    app: PIXI.Application,
    startX: number,
    startY: number,
    rotation: number,
    stats: WeaponStats,
    weaponName: string
  ) {
    const graphics = new PIXI.Graphics();
    graphics.fill(stats.color);
    graphics.rect(0, 0, stats.size.width, stats.size.height);
    graphics.fill();

    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.x = startX;
    this.sprite.y = startY;
    this.sprite.rotation = rotation;

    this.weaponName = weaponName;
    this.velocity = new PIXI.Point(
      Math.cos(rotation - Math.PI / 2) * stats.speed,
      Math.sin(rotation - Math.PI / 2) * stats.speed
    );
  }

  public update(): void {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
  }

  public get displayObject(): PIXI.Sprite {
    return this.sprite;
  }

  public isOutOfBounds(
    width: number,
    height: number,
    margin: number = 50
  ): boolean {
    return (
      this.sprite.x < -margin ||
      this.sprite.x > width + margin ||
      this.sprite.y < -margin ||
      this.sprite.y > height + margin
    );
  }
  public get name(): string {
    return this.weaponName;
  }
}
