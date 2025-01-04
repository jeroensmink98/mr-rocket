import * as PIXI from "pixi.js";
import { BaseWeapon } from "./BaseWeapon";
import { StandardLaser } from "./StandardLaser";
import { DoubleLaser } from "./DoubleLaser";
import { BurstLaser } from "./BurstLaser";

export class WeaponManager {
  private weapons: BaseWeapon[];
  private currentWeaponIndex: number = 0;

  constructor(app: PIXI.Application) {
    this.weapons = [
      new StandardLaser(app),
      new DoubleLaser(app),
      new BurstLaser(app),
      // Add more weapons here as needed
    ];
  }

  public getCurrentWeapon(): BaseWeapon {
    return this.weapons[this.currentWeaponIndex];
  }

  public nextWeapon(): void {
    this.currentWeaponIndex =
      (this.currentWeaponIndex + 1) % this.weapons.length;
  }

  public previousWeapon(): void {
    this.currentWeaponIndex =
      (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
  }

  public getCurrentWeaponName(): string {
    return this.getCurrentWeapon().name;
  }
}
