import Canvas from "../core/Canvas";
import Vector2 from "../utils/math/Vector2";
import Rect from "../utils/math/Rect";
import { TweenLite } from "gsap";
import State from "../utils/State";
import VideoLoader from "../utils/VideoLoader";
import Configuration from "../utils/Configuration";

enum CircleButtonState {
  PULSING,
  SCALING
}

export default class CircleButton {
  private video: HTMLVideoElement = document.createElement("video");
  private scaleVideo: HTMLVideoElement = document.createElement("video");
  public position: Vector2 = new Vector2();
  public size: Vector2 = new Vector2({
    x: 1280,
    y: 720
  });
  public scaleVideoSize: Vector2 = new Vector2({
    x: 4096,
    y: 3112
  });
  public scaleVideoScale: Vector2 = new Vector2({
    x: 0.72,
    y: 0.72
  });
  private scale: Vector2 = new Vector2({
    x: 1,
    y: 1
  });
  public bounds: Rect;
  private hoverInTriggered: Boolean = false;
  private hoverOutTriggered: Boolean = false;
  private clicked: Boolean = false;
  private interactionTimeElapsed: number = 0;
  private lastTime: number = 0;
  private scalingButton: Boolean = false;

  private state: CircleButtonState = CircleButtonState.PULSING;
  private alpha: number = 1;
  private scaleAlpha: number = 0;

  constructor() {
    this.position.x = window.innerWidth / 2 - this.size.x / 2;
    this.position.y = window.innerHeight / 2 - this.size.y / 2;
    this.bounds = new Rect({
      width: 450,
      height: 450,
      x: window.innerWidth / 2 - 225,
      y: window.innerHeight / 2 - 225
    });
    this.video.src = VideoLoader.get("circleButtonPulsing");
    this.video.loop = true;
    this.video.muted = true;

    this.scaleVideo.src = VideoLoader.get("circleButtonScaling");
    this.scaleVideo.muted = true;

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

  private fadeOutFirstVideo() {
    let obj = { opacity: this.alpha };
    TweenLite.to(obj, 0.6, {
      opacity: 0,
      onUpdate: () => {
        this.alpha = obj.opacity;
      }
    });
  }

  private fadeInScaleVideo() {
    let obj = { opacity: this.scaleAlpha };
    TweenLite.to(obj, 0.6, {
      opacity: 1,
      onUpdate: () => {
        this.scaleAlpha = obj.opacity;
      }
    });
  }

  private scaleButton() {
    this.fadeOutFirstVideo();
    this.scalingButton = true;
    this.scaleVideo.play();
    this.fadeInScaleVideo();

    this.scaleVideo.addEventListener("ended", () => {
      Canvas.setScene(State.SCENE_2);
    });
  }

  public destroy() {
    this.removeEvents();
  }

  public render(hand: any) {
    if (Configuration.useWebcamInteraction) {
      let now = performance.now();

      let delta = now - this.lastTime;

      this.lastTime = now;
      if (this.checkButtonIntersect(hand)) {
        this.interactionTimeElapsed += delta;
        if (!this.clicked && this.interactionTimeElapsed >= 2000) {
          //more than 2 sec is a click
          this.clicked = true;
          this.scaleButton();
        } else {
          if (!this.hoverInTriggered) {
            this.hoverInTriggered = true;
            this.hoverOutTriggered = false;
            this.onHoverIn();
          }
        }
      } else {
        this.interactionTimeElapsed = 0;
        if (!this.hoverOutTriggered && this.hoverInTriggered) {
          this.hoverInTriggered = false;
          this.hoverOutTriggered = true;
          this.onHoverOut();
        }
      }
    }

    Canvas.ctx.save();

    Canvas.ctx.globalAlpha = this.alpha;

    Canvas.ctx.drawImage(
      this.video,
      window.innerWidth / 2 - (this.size.x * this.scale.x) / 2,
      window.innerHeight / 2 - (this.size.y * this.scale.x) / 2,
      this.size.x * this.scale.x,
      this.size.y * this.scale.x
    );

    Canvas.ctx.restore();

    if (this.scalingButton) {
      Canvas.ctx.save();
      Canvas.ctx.globalAlpha = this.scaleAlpha;
      Canvas.ctx.drawImage(
        this.scaleVideo,
        window.innerWidth / 2 -
          (this.scaleVideoSize.x * this.scaleVideoScale.x) / 2,
        window.innerHeight / 2 -
          (this.scaleVideoSize.y * this.scaleVideoScale.x) / 2,
        this.scaleVideoSize.x * this.scaleVideoScale.x,
        this.scaleVideoSize.y * this.scaleVideoScale.x
      );

      Canvas.ctx.restore();
    }
  }

  private checkButtonIntersect(hand: any): Boolean {
    return this.bounds.contains(hand);
  }
}
