import VideoLoader from '../utils/VideoLoader';
import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';
import Rect from '../utils/math/Rect';
import Hand from './Hand';

export default class DroneVideo {
  private name: string;
  public video: HTMLVideoElement;
  public position: Vector2;
  public scale: Vector2;
  public rotation: number;
  public triggered: boolean;
  private transitionVideo: DroneVideo;
  public bounds: Rect;
  public boundsOffset: Vector2;
  public loop: boolean;
  public id: number;
  constructor(videoName: string, loop: boolean = true, bounds: Vector2 = new Vector2(0, 0), boundsOffset: Vector2 = new Vector2(0, 0)) {
    this.name = videoName;
    this.video = VideoLoader.get(videoName).cloneNode();
    this.loop = loop;
    this.rotation = 0;
    this.video.loop = false;
    this.video.muted = true;
    this.triggered = false;
    this.position = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    this.scale = new Vector2(1, 1);
    this.onEnded = this.onEnded.bind(this);
    this.boundsOffset = boundsOffset;
    this.bounds = new Rect({
      x: this.position.x - (this.video.videoWidth * this.scale.x) / 2 + boundsOffset.x,
      y: this.position.y - (this.video.videoWidth * this.scale.x) / 2 + boundsOffset.y,
      width: bounds.x,
      height: bounds.y,
    });

    this.video.addEventListener('ended', this.onEnded);
  }

  isHandOver(): boolean {
    return this.bounds.contains(Hand.position);
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
    cloneVideo.bounds = this.bounds;
    cloneVideo.boundsOffset = this.boundsOffset;
    cloneVideo.setBounds(this.bounds.width, this.bounds.height);
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
    this.bounds.x = this.position.x - (this.video.videoWidth * this.scale.x) / 2 + this.boundsOffset.x;
    this.bounds.y = this.position.y - (this.video.videoWidth * this.scale.x) / 2 + this.boundsOffset.y;
  }

  setBounds(width: number, height: number) {
    this.bounds.width = width;
    this.bounds.height = height;
  }
}
