import VideoLoader from '../utils/VideoLoader';
import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';

export default class DroneVideo {
  private video: HTMLVideoElement;
  public position: Vector2;
  public scale: Vector2;
  public triggered: boolean;
  private transitionVideo: DroneVideo;
  private loop: boolean;
  constructor(videoName: string) {
    this.video = document.createElement('video');
    this.video.src = VideoLoader.get(videoName);
    this.loop = true;
    this.video.loop = false;
    this.video.muted = true;
    this.triggered = false;
    this.position = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    this.scale = new Vector2(1, 1);
  }

  setTransitionVideo(transitionVideo: DroneVideo) {
    this.transitionVideo = transitionVideo;
    this.video.addEventListener('ended', () => {
      console.log(this.triggered);
      if (this.triggered) {
        this.video.src = this.transitionVideo.video.src;
        this.video.play();
      } else if (this.loop) {
        this.video.play();
      }
    });
  }

  setLoop(loop: boolean) {
    this.loop = loop;
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
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
