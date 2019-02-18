import VideoLoader from '../utils/VideoLoader';
import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';

export default class DroneVideo {
  private video: HTMLVideoElement;
  public position: Vector2;
  public scale: Vector2;
  constructor(videoName: string) {
    this.video = document.createElement('video');
    this.video.src = VideoLoader.get(videoName);
    this.video.loop = true;
    this.video.muted = true;
    this.position = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    this.scale = new Vector2(1, 1);
  }

  play() {
    this.video.play();
  }

  get height() {
    return this.video.videoHeight;
  }

  get width() {
    return this.video.videoWidth;
  }

  render() {
    Canvas.ctx.save();

    Canvas.ctx.drawImage(
      this.video,
      this.position.x - (this.video.videoWidth * this.scale.x) / 2,
      this.position.y - (this.video.videoHeight * this.scale.y) / 2,
      this.video.videoWidth * this.scale.x,
      this.video.videoHeight * this.scale.x,
    );

    Canvas.ctx.restore();
  }

  setScale(x: number, y: number = null) {
    if (!y) y = x;
    this.scale = new Vector2(x, y);
  }

  setPosition(x: number, y: number) {
    this.position = new Vector2(x, y);
  }
}
