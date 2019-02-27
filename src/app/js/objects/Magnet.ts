import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Elastic } from 'gsap';

export default class Magnet {
  public animation: Animation;
  public videoWaiting: DroneVideo;
  public videoEnd: DroneVideo;
  public isInteractive: boolean = false;
  private endCallback: any;

  constructor(position: Vector2) {
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
      if (this.endCallback) {
        this.endCallback();
      }
    });
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
    this.animation.advance();
  }

  isHandOver() {
    return this.animation.video.isHandOver();
  }
}
