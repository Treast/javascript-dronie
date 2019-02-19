import VideoLoader from '../utils/VideoLoader';
import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';

export default class DroneVideo {
  private name: string;
  public video: HTMLVideoElement;
  public position: Vector2;
  public scale: Vector2;
  public rotation: number;
  public triggered: boolean;
  private transitionVideo: DroneVideo;
  public loop: boolean;
  public id: number;
  constructor(videoName: string, loop: boolean = true) {
    this.name = videoName;
    this.video = document.createElement('video');
    if (videoName.length > 0) {
      this.video.src = VideoLoader.get(videoName);
    }
    this.loop = loop;
    this.rotation = 0;
    this.video.loop = false;
    this.video.muted = true;
    this.triggered = false;
    this.position = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    this.scale = new Vector2(1, 1);
    this.onEnded = this.onEnded.bind(this);
    this.video.addEventListener('ended', this.onEnded);
  }

  onEnded() {
    if (this.transitionVideo && this.triggered) {
      this.video = this.transitionVideo.clone().video;
      this.reset();
      this.video.play();
    } else if (this.loop) {
      this.video.play();
    }
  }

  clone() {
    const cloneVideo = new DroneVideo(this.name);
    cloneVideo.position = this.position;
    cloneVideo.scale = this.scale;
    cloneVideo.loop = this.loop;
    cloneVideo.transitionVideo = this.transitionVideo ? this.transitionVideo.clone() : null;
    cloneVideo.triggered = this.triggered;
    return cloneVideo;
  }

  reset() {
    this.video.currentTime = 0;
  }

  setTransitionVideo(transitionVideo: DroneVideo) {
    this.transitionVideo = transitionVideo;
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
    Canvas.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    Canvas.ctx.rotate(this.rotation);
    Canvas.ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);

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
