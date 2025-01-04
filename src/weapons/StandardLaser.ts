import * as PIXI from "pixi.js";
import { BaseWeapon, WeaponStats } from "./BaseWeapon";
import { Laser } from "../entities/Laser";

export class StandardLaser extends BaseWeapon {
  constructor(app: PIXI.Application) {
    const stats: WeaponStats = {
      damage: 10,
      cooldown: 250,
      speed: 20,
      color: 0xff0000,
      size: { width: 2, height: 20 },
    };
    super(app, stats);
  }

  public createProjectile(x: number, y: number, rotation: number): Laser {
    return new Laser(this.app, x, y, rotation, this.stats, this.name);
  }
}
