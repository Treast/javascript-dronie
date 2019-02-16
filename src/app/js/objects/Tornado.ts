import Canvas from "../core/Canvas";
import Vector2 from "../utils/math/Vector2";

export default class Tornado {
  private video: HTMLVideoElement = document.createElement("video");
  private explosion: HTMLVideoElement = document.createElement("video");
  public position: Vector2;
  public size: Vector2 = new Vector2({
    x: 787,
    y: 576
  });

  constructor({ position = new Vector2() } = {}) {
    this.position = position;
    this.video.src = require("../../videos/tornado.webm");
    this.video.loop = true;
    this.video.muted = true;
    this.video.play();
  }

  public render() {
    Canvas.ctx.drawImage(
      this.video,
      this.position.x - this.size.x / 2,
      this.position.y - this.size.y / 2,
      this.size.x,
      this.size.y
    );
  }

  public makeVideoTransition(src: string) {
    if (src) {
      this.video.src = src;
      this.video.play();
      console.log("video changed");
    }

    //@todo transition
  }

  public explode() {
    console.log("explosion");
    //@todo explosion
    this.video.src = require("../../videos/explosion.mp4");
    this.video.play();
  }
}
