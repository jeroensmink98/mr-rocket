import * as PIXI from "pixi.js";
import { BaseWeapon, WeaponStats } from "./BaseWeapon";
import { Laser } from "../entities/Laser";

export class DoubleLaser extends BaseWeapon {
  constructor(app: PIXI.Application) {
    const stats: WeaponStats = {
      damage: 5,
      cooldown: 400,
      speed: 15,
      color: 0x00ff00,
      size: { width: 2, height: 15 },
    };
    super(app, stats);
  }

  public createProjectile(x: number, y: number, rotation: number): Laser[] {
    const offset = 10;
    const laser1 = new Laser(
      this.app,
      x + Math.cos(rotation + Math.PI / 2) * offset,
      y + Math.sin(rotation + Math.PI / 2) * offset,
      rotation,
      this.stats,
      this.name
    );
    const laser2 = new Laser(
      this.app,
      x - Math.cos(rotation + Math.PI / 2) * offset,
      y - Math.sin(rotation + Math.PI / 2) * offset,
      rotation,
      this.stats,
      this.name
    );
    return [laser1, laser2];
  }
}
