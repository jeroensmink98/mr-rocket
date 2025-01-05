export class Controller {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    this.initializeKeyListeners();
  }

  private initializeKeyListeners(): void {
    window.addEventListener("keydown", (e) => {
      console.log("keydown", e.key);
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key] || false;
  }

  // Helper methods for common movement checks
  public isMovingLeft(): boolean {
    return this.isKeyPressed("ArrowLeft") || this.isKeyPressed("a");
  }

  public isMovingRight(): boolean {
    return this.isKeyPressed("ArrowRight") || this.isKeyPressed("d");
  }

  public isMovingUp(): boolean {
    return this.isKeyPressed("ArrowUp") || this.isKeyPressed("w");
  }

  public isMovingDown(): boolean {
    return this.isKeyPressed("ArrowDown") || this.isKeyPressed("s");
  }
}
