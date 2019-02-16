import { Howl } from "howler";

export default class AudioManager {
  static audios: any = {};

  static async load(
    config: any,
    { onProgress = (i: number) => {}, onComplete = () => {} } = {}
  ) {
    const promises: any[] = [];

    let progress = 0;

    for (let audioName in config) {
      let loadVideo = AudioManager.loadAudio(config[audioName]);
      promises.push(loadVideo);
      loadVideo.then(sound => {
        AudioManager.audios[audioName] = sound;
        progress++;
        onProgress && onProgress(progress);
      });
    }

    return await Promise.all(promises).then(() => {
      onComplete && onComplete();
    });
  }

  private static loadAudio(src: string) {
    return new Promise(resolve => {
      let sound = new Howl({
        src: [src],
        preload: true
      });
      sound.once(
        "load",
        () => {
          resolve(sound);
        },
        null
      );
    });
  }

  static get(name: string) {
    return AudioManager.audios[name];
  }
}
