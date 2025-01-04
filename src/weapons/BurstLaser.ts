import * as PIXI from "pixi.js";
import { BaseWeapon, WeaponStats } from "./BaseWeapon";
import { Laser } from "../entities/Laser";

export class BurstLaser extends BaseWeapon {
  constructor(app: PIXI.Application) {
    const stats: WeaponStats = {
      damage: 3,
      cooldown: 1200, // Longer cooldown
      speed: 18,
      color: 0xff69b4, // Pink color
      size: { width: 2, height: 5 }, // Smaller lasers
    };
    super(app, stats);
  }

  public createProjectile(x: number, y: number, rotation: number): Laser[] {
    const spread = Math.PI / 24; // 7.5 degrees spread between lasers
    return [
      new Laser(this.app, x, y, rotation - spread, this.stats, this.name),
      new Laser(this.app, x, y, rotation, this.stats, this.name),
      new Laser(this.app, x, y, rotation + spread, this.stats, this.name),
    ];
  }
}
