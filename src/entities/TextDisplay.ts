import * as PIXI from "pixi.js";

export class TextDisplay {
  private textObject: PIXI.Text;

  constructor(
    initialText: string,
    x: number,
    y: number,
    style: Partial<PIXI.TextStyle> = {}
  ) {
    const defaultStyle = {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center" as const,
      ...style,
    };

    this.textObject = new PIXI.Text(initialText, defaultStyle);
    this.textObject.x = x;
    this.textObject.y = y;
    this.textObject.anchor.set(0.5, 0.5);
  }

  public setText(newText: string): void {
    this.textObject.text = newText;
  }

  public get displayObject(): PIXI.Text {
    return this.textObject;
  }
}
