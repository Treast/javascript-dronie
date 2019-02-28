import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Elastic } from 'gsap';
import Perspective from '../utils/Perspective';
import SocketManager, { SocketTypes } from '../utils/SocketManager';

export default class ColorButton {
  public animation: Animation;
  public isInteractive: boolean = false;
  private endCallback: any;
  public appearanceVideo: DroneVideo;
  public waitingVideo: DroneVideo;
  private position: Vector2;
  private eventName: SocketTypes;

  constructor(videoName: string, position: Vector2, eventName: SocketTypes) {
    this.position = position;
    this.appearanceVideo = new DroneVideo(`color${this.getColor(videoName)}Apparition`, false, new Vector2(200, 200));
    this.appearanceVideo.pause();
    this.appearanceVideo.setPosition(position.x, position.y);
    this.appearanceVideo.setScale(0.3);
    this.waitingVideo = new DroneVideo(`color${this.getColor(videoName)}Attente`, true, new Vector2(200, 200));
    this.waitingVideo.pause();
    this.waitingVideo.setPosition(position.x, position.y);
    this.waitingVideo.setScale(0.3);

    this.animation = new Animation(this.appearanceVideo, this.waitingVideo);
  }

  getColor(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  run() {
    this.isInteractive = true;
    this.animation.video.play();
  }

  stop() {
    Perspective.computeInversePoint(this.position).then((point) => {
      SocketManager.emit(this.eventName, { x: point[0] || 0, y: point[1] || 0 });
    });
    console.log('Hide color button');
    this.animation.video.setScale(0);
    this.isInteractive = false;
  }

  setCallback(callback: any) {
    this.endCallback = callback;
  }

  render() {
    this.animation.video.render();
  }

  isHandOver() {
    return this.isInteractive && this.animation.video.isHandOver();
  }
}
