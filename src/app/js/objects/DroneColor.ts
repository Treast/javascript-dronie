import Animation from '../core/Animation';
import DroneVideo from '../core/DroneVideo';
import { Vector2 } from '../utils/Vector2';

export default class DroneColor {
  public animation: Animation;
  public appearanceVideo: DroneVideo;
  public waitingVideo: DroneVideo;
  public offset: Vector2;

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
    this.animation.video.render();
  }

  trigger() {
    this.animation.video.play();
  }

  getColor(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  setPosition(position: Vector2) {
    this.animation.video.setPosition(position.x + this.offset.x, position.y + this.offset.y);
  }
}
