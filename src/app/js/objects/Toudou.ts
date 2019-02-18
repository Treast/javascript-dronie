import Vector2 from '../utils/math/Vector2';
import VideoLoader from '../utils/VideoLoader';
import Canvas from '../core/Canvas';

export default class Toudou {
  private video: HTMLVideoElement = document.createElement('video');
  public position: Vector2;
  public size: Vector2 = new Vector2({
    x: 620,
    y: 460,
  });

  public scale: Vector2 = new Vector2({
    x: 0.6,
    y: 0.6,
  });

  constructor() {
    this.position = new Vector2({
      x: window.innerWidth / 2,
      y: (this.video.videoHeight * this.scale.y) / 2,
    });
    this.video.src = VideoLoader.get('tornado');
    this.video.loop = true;
    this.video.muted = true;
    this.video.play();
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
}
