export class Controller {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    this.initializeKeyListeners();
  }

  private initializeKeyListeners(): void {
    window.addEventListener("keydown", (e) => {
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

  public isRotatingLeft(): boolean {
    return this.isKeyPressed("q") || this.isKeyPressed("Q");
  }

  public isRotatingRight(): boolean {
    return this.isKeyPressed("e") || this.isKeyPressed("E");
  }

  public isShootPressed(): boolean {
    return this.isKeyPressed(" ");
  }
}
