import * as PIXI from "pixi.js";
import { World } from "./World";
import { Player } from "./Player";
import { AssetLoader } from "./AssetLoader";
import { Entity } from "./Entity";
import { Controller } from "./Controller";
import { Asteroid } from "./Asteroid";
import { SoundManager } from "./SoundManager";

export class Game {
  private app: PIXI.Application;
  public world: World;
  private player: Player;
  private soundManager: SoundManager;

  public entities: Entity[] = [];
  private asteroids: Asteroid[] = [];
  private nextAsteroidSpawn: number = 0;
  private readonly minSpawnInterval: number = 200; // Minimum time between spawns
  private readonly maxSpawnInterval: number = 3000; // Maximum time between spawns
  private spawnTimer: number = 0;
  private gameOver: boolean = false;

  constructor(app: PIXI.Application, private assetLoader: AssetLoader) {
    this.app = app;
    this.world = new World(app.screen.width, app.screen.height);
    window.controller = new Controller();

    this.soundManager = new SoundManager();

    this.player = new Player(
      this.app,
      this.assetLoader.getTexture("player"),
      this.assetLoader
    );

    this.app.ticker.add(this.update.bind(this));
    this.resetSpawnTimer();
  }

  public reset(): void {
    // Reset game state
    this.gameOver = false;

    // Clear existing asteroids
    this.asteroids.forEach((asteroid) => asteroid.removeFromStage());
    this.asteroids = [];

    // Reset spawn timer
    this.spawnTimer = 0;
    this.resetSpawnTimer();

    // Reset player
    this.player.reset();
  }

  private handleInput(): void {
    if (this.gameOver) {
      if (this.isKeyPressed(" ")) {
        this.reset();
      }
      return;
    }

    if (this.isKeyPressed("ArrowLeft") || this.isKeyPressed("q")) {
      this.player.rotate(-1);
    } else if (this.isKeyPressed("ArrowRight") || this.isKeyPressed("e")) {
      this.player.rotate(1);
    }

    if (this.isKeyPressed("ArrowUp")) {
      this.player.accelerate();
    }
    if (this.isKeyPressed(" ")) {
      this.player.shoot();
    }
  }

  private isKeyPressed(key: string): boolean {
    return window.controller.isKeyPressed(key);
  }

  private resetSpawnTimer(): void {
    this.nextAsteroidSpawn =
      this.minSpawnInterval +
      Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
  }

  private spawnAsteroid(): void {
    // Add random offset to target position
    const offsetRange = 200; // Pixels of random offset
    const targetOffset = {
      x: (Math.random() - 0.5) * offsetRange,
      y: (Math.random() - 0.5) * offsetRange,
    };

    const asteroid = new Asteroid(
      this.app,
      this.assetLoader.getTexture("asteroid"),
      this.player.sprite.x + targetOffset.x,
      this.player.sprite.y + targetOffset.y
    );
    this.asteroids.push(asteroid);
    this.resetSpawnTimer();
  }

  public update(ticker: PIXI.Ticker): void {
    this.handleInput();

    if (this.gameOver) return;

    this.player.update(ticker.deltaTime);
    this.world.checkBounds(this.player.sprite, this.player.velocity);

    // Update spawn timer
    this.spawnTimer += ticker.deltaTime * 16.67;
    if (this.spawnTimer >= this.nextAsteroidSpawn) {
      this.spawnAsteroid();
      this.spawnTimer = 0;
    }

    // Check laser-asteroid collisions
    this.player.getLasers().forEach((laser, laserIndex) => {
      this.asteroids.forEach((asteroid, asteroidIndex) => {
        if (laser.checkCollision(asteroid)) {
          // Remove both laser and asteroid
          laser.removeFromStage();
          asteroid.removeFromStage();
          this.player.removeLaser(laserIndex);
          this.asteroids.splice(asteroidIndex, 1);
        }
      });
    });

    // Check player-asteroid collisions
    for (const asteroid of this.asteroids) {
      if (this.player.checkCollision(asteroid)) {
        this.handleGameOver();
        break;
      }
    }

    // Update asteroids
    this.asteroids = this.asteroids.filter((asteroid) => {
      asteroid.update(ticker.deltaTime);
      if (
        asteroid.isOutOfBounds(this.app.screen.width, this.app.screen.height)
      ) {
        asteroid.removeFromStage();
        return false;
      }
      return true;
    });
  }

  private handleGameOver(): void {
    this.gameOver = true;
    console.log("Game Over!");
    // Add any game over logic here (e.g., show game over screen)
  }
}
