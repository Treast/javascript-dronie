import Canvas from '../core/Canvas';
import Vector2 from '../utils/math/Vector2';
import VideoLoader from '../utils/VideoLoader';
import SuperMath from '../utils/math/SuperMath';
import { TweenLite } from 'gsap';
import { Vector2 as Vector } from '../utils/Vector2';
import State from '../utils/State';
import DroneVideo from '../core/DroneVideo';
import Animation from '../core/Animation';

export default class Tornado {
  public animation: Animation;
  public video: DroneVideo;
  public colere: DroneVideo;
  public decollage: DroneVideo;
  public colereToTimide: DroneVideo;
  private explosionVideo: HTMLVideoElement;
  private backgroundExplosionVideo: HTMLVideoElement;
  public interactionVideo: any = {
    1: {
      video: document.createElement('video'),
      active: false,
      alpha: 0,
      scale: new Vector2({
        x: 0.6,
        y: 0.6,
      }),
    },
    2: {
      video: document.createElement('video'),
      active: false,
      alpha: 0,
      scale: new Vector2({
        x: 0.65,
        y: 0.65,
      }),
    },
  };
  public position: Vector2;
  public size: Vector2 = new Vector2({
    x: 620,
    y: 460,
  });

  scale: Vector2 = new Vector2({
    x: 0.6,
    y: 0.6,
  });

  private alpha: number = 1;
  private explosionAlpha: number = 0;
  public active: Boolean = true;

  constructor() {
    this.position = new Vector2();

    this.video = new DroneVideo('attente', true, new Vector(400, 400));
    this.video.setScale(0.65);
    this.video.setPosition(window.innerWidth / 2, 2 * window.innerHeight);
    this.video.setPoster('2_Attente_1.mov');

    this.decollage = new DroneVideo('decollage', true, new Vector(400, 400));
    this.decollage.setScale(0.65);
    this.decollage.setPoster('decollage'); 

    this.colere = new DroneVideo('colere2', true, new Vector(400, 400));
    this.colere.setScale(0.65);
    this.colere.setPoster('3_Colère énervé 2.avi');

    this.colereToTimide = new DroneVideo('colereToTimide', false, new Vector(400, 400));
    this.colereToTimide.setPoster('colere_timide');

    this.animation = new Animation(this.decollage, this.video, this.colere, this.video, this.colere, this.video, this.colereToTimide);
  }

  public render() {
    if (this.active) {
      this.animation.video.render();
    }
  }
}
