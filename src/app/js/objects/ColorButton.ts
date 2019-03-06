import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Elastic, Power2 } from 'gsap';
import Perspective from '../utils/Perspective';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import Hand, { HandColor } from '../core/Hand';

export default class ColorButton {
  public animation: Animation;
  public isInteractive: boolean = false;
  private endCallback: any;
  public waitingVideo: DroneVideo;
  public disappearing: DroneVideo;
  private position: Vector2;
  private eventName: SocketTypes;
  public handColor: string;

  constructor(videoName: string, position: Vector2, eventName: SocketTypes, handColor: string) {
    this.position = position;
    this.eventName = eventName;
    this.waitingVideo = new DroneVideo(`button${this.getColor(videoName)}Attente`, true, new Vector2(200, 200));
    this.waitingVideo.setPosition(position.x, position.y);
    this.waitingVideo.setScale(0);
    this.waitingVideo.setPoster(`button${this.getColor(videoName)}Attente`);
    this.disappearing = new DroneVideo(`button${this.getColor(videoName)}Disparition`, false, new Vector2(200, 200));
    this.disappearing.setPosition(position.x, position.y);
    this.disappearing.setScale(0);
    this.waitingVideo.setPoster(`button${this.getColor(videoName)}Disparition`);
    this.handColor = handColor;

    this.animation = new Animation(this.waitingVideo, this.disappearing);
    this.animation.video.pause();
  }

  getColor(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  run() {
    setTimeout(() => {
      this.isInteractive = true;
      this.scaleUp();
    }, 2000);
  }

  scaleUp() {
    TweenMax.to(this.animation.video.scale, 1, {
      x: 0.2,
      y: 0.2,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.animation.video.setBounds(200, 200);
      },
      onStart: () => {
        this.animation.video.video.play();
        this.isInteractive = true;
      },
    });
  }

  moveToButton(droneAnimation: Animation) {
    const droneX = droneAnimation.video.position.x / window.innerWidth;
    const droneY = droneAnimation.video.position.y / window.innerHeight;
    const destinationX = this.position.x / window.innerWidth;
    const destinationY = this.position.y / window.innerHeight;
    const dX = destinationX - droneX;
    const dY = destinationY - droneY;
    const c = Math.sqrt(dX * dX + dY * dY) / Math.sqrt(2);
    this.isInteractive = false;
    Perspective.computeInversePoint(new Vector2(droneX, droneY)).then(pointA => {
      Perspective.computeInversePoint(new Vector2(destinationX, destinationY)).then(pointB => {
        SocketManager.emit(this.eventName, {
          x1: pointA[0] || 0,
          y1: pointA[1] || 0,
          x2: pointB[0] || 0,
          y2: pointB[1] || 0,
          c: c || 0,
        });
      });
    });
  }

  stop() {
    TweenMax.to(this.animation.video.scale, 0.8, {
      x: 0,
      y: 0,
      ease: Power2.easeOut,
    });
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
