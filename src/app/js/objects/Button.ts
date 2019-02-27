import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Elastic } from 'gsap';

export default class Button {
  public animation: Animation;
  public video: DroneVideo;
  public isInteractive: boolean = false;
  private endCallback: any;

  constructor(videoName: string, position: Vector2, poster: string = null) {
    this.video = new DroneVideo(videoName, true, new Vector2(0, 0));

    if (poster) {
      this.video.setPoster(poster);
    }

    this.video.setScale(0);
    this.video.setPosition(position.x, position.y);
  }

  setCallback(callback: any) {
    this.endCallback = callback;
  }

  render() {
    this.video.render();
  }

  scaleUp() {
    TweenMax.to(this.video.scale, 1, {
      x: 0.2,
      y: 0.2,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.video.setBounds(80, 80);
      },
      onStart: () => {
        this.video.video.play();
        this.isInteractive = true;
      },
    });
  }

  scaleDown() {
    TweenMax.to(this.video.scale, 1, {
      x: 0,
      y: 0,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.video.setBounds(0, 0);
        if (this.endCallback) {
          this.endCallback();
        }
      },
      onStart: () => {
        this.isInteractive = false;
      },
    });
  }

  isHandOver() {
    return this.video.isHandOver();
  }
}
