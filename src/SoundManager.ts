export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();

  public async loadSounds(
    sounds: { name: string; url: string }[]
  ): Promise<void> {
    for (const sound of sounds) {
      const audio = new Audio(sound.url);
      this.sounds.set(sound.name, audio);
    }
  }

  public play(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0; // Reset the sound to start
      sound.play();
    }
  }
}
