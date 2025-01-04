import * as PIXI from "pixi.js";
import { Player } from "../entities/Player";
import { World } from "../entities/World";
import { Laser } from "../entities/Laser";
import { Asteroid } from "../entities/Asteroid";
import { AudioPlayer } from "../service/Audio";
import { TextDisplay } from "../entities/TextDisplay";
import { WeaponManager } from "../weapons/WeaponManager";

export class GameController {
  private app: PIXI.Application;
  private player: Player;
  private world: World;
  private keys: Set<string> = new Set();
  private lasers: Laser[] = [];
  private asteroids: Asteroid[] = [];
  private lastShotTime: number = 0;
  private shootCooldown: number = 250; // milliseconds between shots
  private asteroidSpawnInterval: number = 2000; // Spawn asteroid every 2 seconds
  private lastAsteroidSpawn: number = 0;
  private laserSound: AudioPlayer;
  //private explosionSound: AudioPlayer;
  private scoreDisplay: TextDisplay;
  private statusDisplay: TextDisplay;
  private score: number = 0;
  private weaponManager: WeaponManager;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.world = new World(app.screen.width, app.screen.height);
    this.player = new Player(app);
    this.laserSound = new AudioPlayer("./public/assets/laser-shoot.wav", 0.5); // 50% volume
    //this.explosionSound = new AudioPlayer("./sounds/explosion.wav", 0.7); // 70% volume
    this.setupInput();
    this.scoreDisplay = new TextDisplay("Score: 0", 100, 30, {
      fontSize: 24,
      fill: 0xffffff,
    });

    this.statusDisplay = new TextDisplay(
      "Press SPACE to shoot!",
      this.app.screen.width / 2,
      30,
      { fontSize: 20, fill: 0xffff00 }
    );

    // Add text displays to stage
    this.app.stage.addChild(this.scoreDisplay.displayObject);
    this.app.stage.addChild(this.statusDisplay.displayObject);

    this.weaponManager = new WeaponManager(app);

    // Update status display to show current weapon
    this.statusDisplay.setText(
      `Current Weapon: ${this.weaponManager.getCurrentWeapon().name}`
    );
  }

  private setupInput(): void {
    window.addEventListener("keydown", (e) => {
      const keysToHandle = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "q",
        "e",
        " ",
      ];
      if (keysToHandle.includes(e.key)) {
        this.keys.add(e.key);
      }
    });

    window.addEventListener("keyup", (e) => {
      const keysToHandle = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "q",
        "e",
        " ",
      ];
      if (keysToHandle.includes(e.key)) {
        this.keys.delete(e.key);
      }
    });
  }

  public start(): void {
    this.app.stage.addChild(this.player.displayObject);

    this.app.ticker.add(() => {
      this.update();
    });
  }

  private update(): void {
    const currentTime = Date.now();

    // Spawn new asteroid
    if (currentTime - this.lastAsteroidSpawn >= this.asteroidSpawnInterval) {
      this.spawnAsteroid();
      this.lastAsteroidSpawn = currentTime;
    }

    this.player.update(this.keys);
    this.world.checkBounds(this.player.displayObject);

    // Update and clean up asteroids
    this.asteroids = this.asteroids.filter((asteroid) => {
      asteroid.update();
      const isActive = !asteroid.isOutOfBounds(
        this.world.width,
        this.world.height
      );
      if (!isActive) {
        this.app.stage.removeChild(asteroid.displayObject);
      }
      return isActive;
    });

    // Handle weapon switching
    if (this.keys.has("q")) {
      this.weaponManager.previousWeapon();
      this.statusDisplay.setText(
        `Current Weapon: ${this.weaponManager.getCurrentWeaponName()}`
      );
      this.keys.delete("q"); // Prevent multiple switches
    }
    if (this.keys.has("e")) {
      this.weaponManager.nextWeapon();
      this.statusDisplay.setText(
        `Current Weapon: ${this.weaponManager.getCurrentWeaponName()}`
      );
      this.keys.delete("e"); // Prevent multiple switches
    }

    // Handle shooting with current weapon
    if (this.keys.has(" ")) {
      const weapon = this.weaponManager.getCurrentWeapon();
      const projectiles = weapon.shoot(
        this.player.displayObject.x,
        this.player.displayObject.y,
        this.player.rotation
      );

      if (projectiles) {
        if (Array.isArray(projectiles)) {
          projectiles.forEach((laser) => {
            this.lasers.push(laser);
            this.app.stage.addChild(laser.displayObject);
          });
        } else {
          this.lasers.push(projectiles);
          this.app.stage.addChild(projectiles.displayObject);
        }
        this.laserSound.play();
      }
    }

    // Update and clean up lasers, check for collisions
    this.lasers = this.lasers.filter((laser) => {
      laser.update();

      // Check for collisions with asteroids
      this.asteroids = this.asteroids.filter((asteroid) => {
        if (this.checkCollision(laser.displayObject, asteroid.displayObject)) {
          if (asteroid.special) {
            this.score += 100;
            console.log("Hit special asteroid!");
            //this.explosionSound.play();
          } else {
            this.score += 10;
            console.log("Hit normal asteroid");
            //this.explosionSound.play();
          }
          this.scoreDisplay.setText(`Score: ${this.score}`);
          // Remove both laser and asteroid
          this.app.stage.removeChild(laser.displayObject);
          this.app.stage.removeChild(asteroid.displayObject);
          return false; // Remove asteroid
        }
        return true; // Keep asteroid
      });

      const isActive = !laser.isOutOfBounds(
        this.world.width,
        this.world.height
      );
      if (!isActive) {
        this.app.stage.removeChild(laser.displayObject);
      }
      return isActive && laser.displayObject.parent === this.app.stage; // Only keep if still active and not destroyed by collision
    });
  }

  private spawnAsteroid(): void {
    const asteroid = new Asteroid(
      this.app,
      this.player.center.x,
      this.player.center.y
    );
    this.asteroids.push(asteroid);
    this.app.stage.addChild(asteroid.displayObject);
  }

  private checkCollision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.y + bounds1.height > bounds2.y &&
      bounds1.y < bounds2.y + bounds2.height
    );
  }
}
