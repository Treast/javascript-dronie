import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Elastic } from 'gsap';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import Perspective from '../utils/Perspective';

export default class Magnet {
  public animation: Animation;
  public videoWaiting: DroneVideo;
  public videoEnd: DroneVideo;
  public isInteractive: boolean = false;
  private endCallback: any;
  private eventHoverName: SocketTypes;
  private eventOutName: SocketTypes;
  private isHover: boolean = false;

  constructor(position: Vector2, eventHoverName: SocketTypes, eventOutName: SocketTypes) {
    this.videoWaiting = new DroneVideo('boutonAimente', true, null);
    this.videoWaiting.setPoster('Bouton1_2');
    this.videoWaiting.setScale(0);
    this.videoWaiting.setPosition(position.x, position.y);

    this.videoEnd = new DroneVideo('boutonAimenteClique', false, null);
    this.videoEnd.setPoster('Bouton1_2');
    this.videoEnd.setScale(0.25);
    this.videoEnd.setPosition(position.x, position.y);
    this.videoEnd.setLoop(false);
    this.videoEnd.pause();

    this.animation = new Animation(this.videoWaiting, this.videoEnd);
    this.animation.setCallback(() => {
      this.animation.video.setScale(0);
      if (this.endCallback) {
        this.endCallback();
      }
    });

    this.eventHoverName = eventHoverName;
    this.eventOutName = eventOutName;
  }

  onEnded(callback: any) {
    this.endCallback = callback;
  }

  render() {
    this.animation.video.render();
  }

  scaleUp() {
    TweenMax.to(this.animation.video.scale, 1, {
      x: 0.25,
      y: 0.25,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.animation.video.setBounds(250, 250);
      },
      onStart: () => {
        this.animation.video.video.play();
        this.isInteractive = true;
      },
    });
  }

  trigger() {
    this.animation.advance(true);
  }

  isHandOver(droneAnimation: Animation) {
    if (this.animation.video.scale.x > 0) {
      if (!this.isHover && this.animation.video.isHandOver()) {
        // Perspective.computeInversePoint(this.videoWaiting.position).then((point) => {
        //   SocketManager.emit(this.eventHoverName, { x: point[0] || 0, y: point[1] || 0 });
        // });
        console.log('Drone', droneAnimation.video.position);
        console.log('Waiting', this.videoWaiting.position);

        const droneX = droneAnimation.video.position.x / window.innerWidth;
        const droneY = droneAnimation.video.position.y / window.innerHeight;
        const destinationX = this.videoWaiting.position.x / window.innerWidth;
        const destinationY = this.videoWaiting.position.y / window.innerHeight;
        const dX = droneX - destinationX;
        const dY = droneY - destinationY;
        const c = Math.sqrt(dX * dX + dY * dY) / Math.sqrt(2);
        Perspective.computeInversePoint(new Vector2(droneX, droneY)).then(pointA => {
          Perspective.computeInversePoint(new Vector2(destinationX, destinationY)).then(pointB => {
            SocketManager.emit(this.eventHoverName, {
              x1: pointA[0] || 0,
              y1: pointA[1] || 0,
              x2: pointB[0] || 0,
              y2: pointB[1] || 0,
              c: c || 0,
            });
          });
        });
        this.isHover = true;
      } else if (this.isHover && !this.animation.video.isHandOver()) {
        SocketManager.emit(this.eventOutName);
        this.isHover = false;
      }
    }
    return this.animation.video.isHandOver();
  }
}
