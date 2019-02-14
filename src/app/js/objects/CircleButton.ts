import Canvas from "../core/Canvas";
import Vector2 from "../utils/math/Vector2";
import Rect from "../utils/math/Rect";
import { TweenLite } from "gsap";
import State from "../utils/State";

enum CircleButtonState {
  PULSING,
  SCALING
}

export default class CircleButton {
  private video: HTMLVideoElement = document.createElement("video");
  public position: Vector2 = new Vector2();
  public size: Vector2 = new Vector2({
    x: 1280,
    y: 720
  });
  private scale: Vector2 = new Vector2({
    x: 1,
    y: 1
  });
  public bounds: Rect;
  private hoverInTriggered: Boolean = false;
  private hoverOutTriggered: Boolean = false;
  private clicked: Boolean = false;

  private state: CircleButtonState = CircleButtonState.PULSING;

  constructor() {
    this.position.x = window.innerWidth / 2 - this.size.x / 2;
    this.position.y = window.innerHeight / 2 - this.size.y / 2;
    this.bounds = new Rect({
      width: 450,
      height: 450,
      x: window.innerWidth / 2 - 225,
      y: window.innerHeight / 2 - 225
    });
    this.video.src = require("../../videos/circleButtonPulsing.mp4");
    this.video.loop = true;
    this.video.muted = true;
    this.video.play();

    this.addEvents();
  }

  private addEvents() {
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  private removeEvents() {
    window.removeEventListener("mousedown", this.onMouseDown.bind(this));
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
  }

  private onMouseDown(e: any) {
    if (this.clicked) return;

    const { x, y } = e;
    if (this.bounds.contains({ x, y })) {
      this.clicked = true;
      this.scaleButton();
    }
  }

  private onMouseMove(e: any) {
    const { x, y } = e;

    if (this.bounds.contains({ x, y })) {
      document.body.style.cursor = "pointer";
      if (this.hoverInTriggered) {
        return;
      }
      this.hoverInTriggered = true;
      this.hoverOutTriggered = false;
      this.onHoverIn();
    } else {
      document.body.style.cursor = "default";
      if (this.hoverOutTriggered || !this.hoverInTriggered) {
        return;
      }
      this.hoverInTriggered = false;
      this.hoverOutTriggered = true;
      this.onHoverOut();
    }
  }

  private onHoverIn() {
    TweenLite.to(this.scale, 0.6, {
      x: 1.2
    });
  }

  private onHoverOut() {
    TweenLite.to(this.scale, 0.6, {
      x: 1
    });
  }

  private scaleButton() {
    this.video.src = require("../../videos/circleButtonScaling.mp4");
    this.video.loop = false;
    this.video.play();

    this.video.addEventListener("ended", () => {
      Canvas.setScene(State.SCENE_2);
    });
  }

  public destroy() {
    this.removeEvents();
  }

  public render() {
    Canvas.ctx.save();

    Canvas.ctx.drawImage(
      this.video,
      window.innerWidth / 2 - (this.size.x * this.scale.x) / 2,
      window.innerHeight / 2 - (this.size.y * this.scale.x) / 2,
      this.size.x * this.scale.x,
      this.size.y * this.scale.x
    );

    Canvas.ctx.restore();
  }
}
