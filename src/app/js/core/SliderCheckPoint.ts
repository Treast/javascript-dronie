import SuperAudioManager from '../lib/SuperAudioManager';
import Perspective from '../utils/Perspective';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import { Vector2 } from '../utils/Vector2';
import Animation from './Animation';

export default class SliderCheckPoint {
  sound: string;
  triggered: boolean = false;
  percentage: number;
  position: Vector2;

  constructor(sound: string, percentage: number, position: Vector2) {
    this.sound = sound;
    this.percentage = percentage;
    this.position = position;
  }

  trigger(droneAnimation: Animation) {
    if (this.triggered) return;
    this.triggered = true;
    SuperAudioManager.trigger(this.sound);

    const droneX = droneAnimation.video.position.x / window.innerWidth;
    const droneY = droneAnimation.video.position.y / window.innerHeight;
    const destinationX = this.position.x / window.innerWidth;
    const destinationY = this.position.y / window.innerHeight;
    const dX = destinationX - droneX;
    const dY = destinationY - droneY;
    const c = Math.sqrt(dX * dX + dY * dY) / Math.sqrt(2);
    Perspective.computeInversePoint(new Vector2(droneX, droneY)).then(pointA => {
      Perspective.computeInversePoint(new Vector2(destinationX, destinationY)).then(pointB => {
        SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, {
          x1: pointA[0] || 0,
          y1: pointA[1] || 0,
          x2: pointB[0] || 0,
          y2: pointB[1] || 0,
          c: c || 0,
        });
      });
    });
  }

  check(value: number, droneAnimation: Animation) {
    if (value >= this.percentage) {
      this.trigger(droneAnimation);
    }
  }
}
