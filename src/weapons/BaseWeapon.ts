import * as PIXI from "pixi.js";
import { Laser } from "../entities/Laser";

export interface WeaponStats {
  damage: number;
  cooldown: number;
  speed: number;
  color: number;
  size: { width: number; height: number };
}

export abstract class BaseWeapon {
  protected app: PIXI.Application;
  protected stats: WeaponStats;
  protected lastShotTime: number = 0;

  constructor(app: PIXI.Application, stats: WeaponStats) {
    this.app = app;
    this.stats = stats;
  }

  public abstract createProjectile(
    x: number,
    y: number,
    rotation: number
  ): Laser | Laser[];

  public canShoot(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastShotTime >= this.stats.cooldown;
  }

  public shoot(x: number, y: number, rotation: number): Laser | Laser[] | null {
    if (!this.canShoot()) return null;

    this.lastShotTime = Date.now();
    return this.createProjectile(x, y, rotation);
  }

  public get name(): string {
    return this.constructor.name;
  }
}
