import * as PIXI from "pixi.js";
import { Entity } from "./Entity";
import { ThrustFlame } from "./ThrustFlame";
import { Laser } from "./Laser";
import { AssetLoader } from "./AssetLoader";

export class Player extends Entity {
  public velocity: { x: number; y: number };
  public angle: number;
  private readonly drag: number = 0.999;
  private readonly maxSpeed: number = 15;
  private currentAcceleration: number = 0;
  private readonly maxAcceleration: number = 0.4;
  private readonly accelerationRate: number = 0.04; // How quickly acceleration builds up
  private readonly decelerationRate: number = 0.04; // How quickly acceleration drops
  private thrustFlame: ThrustFlame;
  private lasers: Laser[] = [];
  private readonly shootCooldown: number = 250; // milliseconds
  private lastShootTime: number = 0;
  private currentRotationSpeed: number = 0;
  private readonly maxRotationSpeed: number = 0.15;
  private readonly rotationAcceleration: number = 0.02;
  private readonly rotationDeceleration: number = 0.01;

  constructor(
    app: PIXI.Application,
    texture: PIXI.Texture,
    private assetLoader: AssetLoader
  ) {
    super(app, "player", new PIXI.Sprite(texture));
    this.sprite.anchor.set(0.5, 0.5);
    this.velocity = { x: 0, y: 0 };
    this.angle = 0;
    this.sprite.rotation = this.angle;
    this.sprite.angle = 270;
    this.sprite.x = app.screen.width / 2; // Center horizontally
    this.sprite.y = app.screen.height / 2; // Center vertically

    const desiredWidth = app.screen.width * 0.03;
    const scale = desiredWidth / this.sprite.width;
    this.sprite.scale.set(scale);

    this.thrustFlame = new ThrustFlame(app);
    this.thrustFlame.setFlameSize(8, 12);

    // Add initial random impulse
    const randomAngle = Math.random() * Math.PI * 2;
    const initialForce = 0.5 + Math.random() * 0.5; // Random force between 0.5 and 1
    this.velocity.x = Math.cos(randomAngle) * initialForce;
    this.velocity.y = Math.sin(randomAngle) * initialForce;
  }

  public update(deltaTime: number): void {
    // Apply drag to velocity
    this.velocity.x *= this.drag;
    this.velocity.y *= this.drag;

    // Gradually decrease rotation speed
    if (this.currentRotationSpeed > 0) {
      this.currentRotationSpeed = Math.max(
        0,
        this.currentRotationSpeed - this.rotationDeceleration
      );
    } else if (this.currentRotationSpeed < 0) {
      this.currentRotationSpeed = Math.min(
        0,
        this.currentRotationSpeed + this.rotationDeceleration
      );
    }

    // Apply rotation
    if (this.currentRotationSpeed !== 0) {
      this.angle += this.currentRotationSpeed;
      this.sprite.angle = (this.angle * 180) / Math.PI + 270;
    }

    // Update thrust flame first, before decreasing acceleration
    const isThrusting = this.currentAcceleration > 0.01; // Add small threshold
    const flameAngle = this.angle + Math.PI;
    this.thrustFlame.update(
      this.sprite.x,
      this.sprite.y,
      flameAngle,
      isThrusting
    );

    // Gradually decrease acceleration when not thrusting
    if (this.currentAcceleration > 0) {
      this.currentAcceleration = Math.max(
        0,
        this.currentAcceleration - this.decelerationRate
      );
    }

    // Limit maximum speed
    const speed = Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
    }

    this.sprite.x += this.velocity.x * deltaTime;
    this.sprite.y += this.velocity.y * deltaTime;

    // Update lasers
    this.lasers = this.lasers.filter((laser) => {
      laser.update(deltaTime);
      if (laser.isOutOfBounds(this.app.screen.width, this.app.screen.height)) {
        laser.removeFromStage();
        return false;
      }
      return true;
    });
  }

  public rotate(direction: number): void {
    // direction should be -1 for left, 1 for right
    const targetRotation = direction * this.maxRotationSpeed;
    this.currentRotationSpeed =
      direction > 0
        ? Math.min(
            targetRotation,
            this.currentRotationSpeed + this.rotationAcceleration
          )
        : Math.max(
            targetRotation,
            this.currentRotationSpeed - this.rotationAcceleration
          );
  }

  public accelerate(amount?: number): void {
    // Gradually build up acceleration
    this.currentAcceleration = Math.min(
      this.maxAcceleration,
      this.currentAcceleration + this.accelerationRate
    );

    const thrustAngle = this.angle + Math.PI;
    this.velocity.x += Math.cos(thrustAngle) * this.currentAcceleration;
    this.velocity.y += Math.sin(thrustAngle) * this.currentAcceleration;
  }

  public setScale(scale: number): void {
    this.sprite.scale.set(scale);
  }

  public shoot(): void {
    const now = Date.now();
    if (now - this.lastShootTime < this.shootCooldown) return;

    const shootAngle = this.angle + Math.PI;
    const laser = new Laser(this.app, this.sprite.x, this.sprite.y, shootAngle);
    this.lasers.push(laser);
    this.lastShootTime = now;

    this.assetLoader.playSound("laser");
  }

  public getLasers(): Laser[] {
    return this.lasers;
  }

  public removeLaser(index: number): void {
    this.lasers.splice(index, 1);
  }

  public reset(): void {
    // Reset position to center
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height / 2;

    // Reset velocities and accelerations
    this.velocity = { x: 0, y: 0 };
    this.currentAcceleration = 0;
    this.currentRotationSpeed = 0;

    // Reset angle
    this.angle = 0;
    this.sprite.rotation = this.angle;
    this.sprite.angle = 270;

    // Clear lasers
    this.lasers.forEach((laser) => laser.removeFromStage());
    this.lasers = [];

    // Add initial random impulse
    const randomAngle = Math.random() * Math.PI * 2;
    const initialForce = 0.5 + Math.random() * 0.5;
    this.velocity.x = Math.cos(randomAngle) * initialForce;
    this.velocity.y = Math.sin(randomAngle) * initialForce;
  }
}
