export class AudioPlayer {
  private audio: HTMLAudioElement;
  private _volume: number;

  constructor(path: string, volume: number = 1) {
    this.audio = new window.Audio(path);
    this._volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this._volume;
  }

  public play(): void {
    // Reset audio to start if it's already playing
    this.audio.currentTime = 0;
    this.audio.play().catch((error) => {
      console.warn("Audio playback failed:", error);
    });
  }

  public stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public pause(): void {
    this.audio.pause();
  }

  public loop(shouldLoop: boolean): void {
    this.audio.loop = shouldLoop;
  }

  public get volume(): number {
    return this._volume;
  }

  public set volume(value: number) {
    this._volume = Math.max(0, Math.min(1, value)); // Clamp between 0 and 1
    this.audio.volume = this._volume;
  }

  public get duration(): number {
    return this.audio.duration;
  }

  public get currentTime(): number {
    return this.audio.currentTime;
  }

  public set currentTime(value: number) {
    this.audio.currentTime = value;
  }

  public get isPlaying(): boolean {
    return !this.audio.paused;
  }
}
