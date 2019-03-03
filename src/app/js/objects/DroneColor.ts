import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Power4, Power2 } from 'gsap';
import Canvas from '../core/Canvas';

export default class DroneColor {
  public animation: Animation;
  public appearanceVideo: DroneVideo;
  public waitingVideo: DroneVideo;
  public offset: Vector2;
  private currentOffset: Vector2 = new Vector2(0, 0);
  private videoConfig = {
    alpha: 1,
  };

  constructor(videoName: string, offset: Vector2 = new Vector2(0, 0)) {
    this.offset = offset;
    this.appearanceVideo = new DroneVideo(`color${this.getColor(videoName)}Apparition`, false, new Vector2(200, 200));
    this.appearanceVideo.setScale(0.5);
    this.waitingVideo = new DroneVideo(`color${this.getColor(videoName)}Attente`, true, new Vector2(200, 200));
    this.waitingVideo.setScale(0.5);
    this.waitingVideo.setPoster(`color${this.getColor(videoName)}Attente`);
    this.animation = new Animation(this.appearanceVideo, this.waitingVideo);
    this.animation.video.pause();
  }

  render(position: Vector2) {
    this.setPosition(position);
    Canvas.ctx.save();
    Canvas.ctx.globalAlpha = this.videoConfig.alpha;
    this.animation.video.render();
    Canvas.ctx.restore();
  }

  runOffset() {
    TweenMax.to(this.currentOffset, 6, {
      x: this.offset.x,
      y: this.offset.y,
      ease: Power2.easeOut,
      delay: 2,
    });
    TweenMax.to(this.videoConfig, 6, {
      alpha: 0,
      delay: 2,
      ease: Power2.easeOut,
    });
    TweenMax.to(this.waitingVideo.scale, 6, {
      x: 0,
      y: 0,
      delay: 2,
      ease: Power2.easeOut,
    });
  }

  trigger() {
    this.animation.video.play();
  }

  getColor(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  setPosition(position: Vector2) {
    this.animation.video.setPosition(position.x + this.currentOffset.x, position.y + this.currentOffset.y);
  }
}
