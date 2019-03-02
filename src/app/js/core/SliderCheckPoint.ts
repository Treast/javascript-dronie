import SuperAudioManager from "../lib/SuperAudioManager";

export default class SliderCheckPoint {
  sound: string;
  triggered: boolean = false;
  percentage: number;

  constructor(sound: string, percentage: number) {
    this.sound = sound;
    this.percentage = percentage;
  }

  trigger() {
    if (this.triggered) return;
    this.triggered = true;
    SuperAudioManager.trigger(this.sound);
  }

  check(value: number) {
    if (value >= this.percentage) {
      this.trigger();
    }
  }
}
