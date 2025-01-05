import * as PIXI from "pixi.js";

export class ThrustFlame {
  private flame: PIXI.Graphics;
  private flameWidth: number = 1;
  private flameHeight: number = 1.5;
  private readonly flameColor: number = 0xff3300;
  private readonly offset: number = 0;
  private readonly sideOffset: number = 0;

  constructor(app: PIXI.Application) {
    this.flame = new PIXI.Graphics();
    this.flame.visible = false;
    app.stage.addChild(this.flame);
  }

  public setFlameSize(width: number, height?: number): void {
    this.flameWidth = width;
    this.flameHeight = height ?? width * 1.5;
  }

  public update(
    x: number,
    y: number,
    angle: number,
    isThrusting: boolean
  ): void {
    this.flame.clear();

    if (isThrusting) {
      this.flame.visible = true;

      this.flame.fill(this.flameColor);
      this.flame.rect(
        -this.flameWidth / 2,
        0,
        this.flameWidth,
        this.flameHeight
      );
      this.flame.fill();

      const offsetX =
        Math.cos(angle) * this.offset +
        Math.cos(angle + Math.PI / 2) * this.sideOffset;
      const offsetY =
        Math.sin(angle) * this.offset +
        Math.sin(angle + Math.PI / 2) * this.sideOffset;
      this.flame.position.set(x + offsetX, y + offsetY);
      this.flame.rotation = angle;
    } else {
      this.flame.visible = false;
    }
  }
}
