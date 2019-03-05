import Canvas from "../core/Canvas";
import Vector2 from "../utils/math/Vector2";
import { Vector2 as Vector } from "../utils/Vector2";
import Rect from "../utils/math/Rect";
import { TweenLite } from "gsap";
import State from "../utils/State";
import VideoLoader from "../utils/VideoLoader";
import Configuration from "../utils/Configuration";
import Animation from "../core/Animation";
import DroneVideo from "../core/DroneVideo";
import SuperAudioManager from "../lib/SuperAudioManager";

enum CircleButtonState {
  PULSING,
  SCALING
}

export default class CircleButton {
  private video: Animation;
  private waitingVideo: DroneVideo;
  private scaleVideo: DroneVideo;
  public position: Vector2 = new Vector2();
  public size: Vector2 = new Vector2({
    x: 1280,
    y: 720
  });
  public scaleVideoSize: Vector2 = new Vector2({
    x: 2048,
    y: 1556
  });
  public scaleVideoScale: Vector2 = new Vector2({
    x: 1.5,
    y: 1.5
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

  private alpha: number = 1;
  private scaleAlpha: number = 0;

  private mouseMove: any;
  private mouseDown: any;
  private beatSound: any;
  private nappeSound: any;

  constructor() {
    this.position.x = window.innerWidth / 2 - this.size.x / 2;
    this.position.y = window.innerHeight / 2 - this.size.y / 2;

    this.nappeSound = SuperAudioManager.trigger("nappe");
    this.beatSound = SuperAudioManager.trigger("beat");
    this.waitingVideo = new DroneVideo("scene1", true, new Vector(450, 450));
    this.waitingVideo.setScale(0.6);
    this.waitingVideo.setPosition(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    this.waitingVideo.setPoster("depart.mov");
    this.scaleVideo = new DroneVideo(
      "scene1Transition",
      false,
      new Vector(450, 450)
    );

    this.scaleVideo.setScale(1.2);
    this.scaleVideo.setPoster("depart_transition");
    this.scaleVideo.loop = false;
    this.scaleVideo.setPosition(window.innerWidth / 2, window.innerHeight / 2);

    this.video = new Animation(this.waitingVideo, this.scaleVideo);
    this.video.video.setPosition(window.innerWidth / 2, window.innerHeight / 2);

    this.video.setCallback(() => {
      Canvas.setScene(State.SCENE_2);
    });

    this.mouseMove = this.onMouseMove.bind(this);
    this.mouseDown = this.onMouseDown.bind(this);

    this.addEvents();
  }

  private addEvents() {
    window.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
  }

  private removeEvents() {
    window.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("mousemove", this.mouseMove);
  }

  private onMouseDown(e: any) {
    if (this.clicked) return;

    const { x, y } = e;
    if (this.video.video.isHandOver()) {
      this.onHoverOut();
      this.clicked = true;
      this.scaleButton();
    }
  }

  private onMouseMove(e: any) {
    const { x, y } = e;

    if (this.video.video.isHandOver()) {
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
    if (this.clicked) {
      return;
    }
    TweenLite.to(this.video.video.scale, 0.6, {
      x: 0.9,
      y: 0.9
    });

    SuperAudioManager.trigger("hover");
  }

  private onHoverOut() {
    if (this.clicked) {
      return;
    }
    TweenLite.to(this.video.video.scale, 0.6, {
      x: 0.6,
      y: 0.6
    });
  }

  private scaleButton() {
    this.video.advance();
    setTimeout(() => {
      this.nappeSound.fadeOutAndStop({ duration: 4 });
    }, 5000);
    this.beatSound.fadeOutAndStop({ duration: 2 });
  }

  public destroy() {
    this.removeEvents();
  }

  public render(hand: any) {
    if (Configuration.useWebcamInteraction || Configuration.useColorTracking) {
      const now = performance.now();

      const delta = now - this.lastTime;

      this.lastTime = now;
      if (this.video.video.isHandOver()) {
        this.interactionTimeElapsed += delta;
        if (!this.clicked && this.interactionTimeElapsed >= 2000) {
          // more than 2 sec is a click
          this.clicked = true;
          console.log("Trigger");
          this.scaleButton();
          this.onHoverOut();
        } else {
          if (!this.hoverInTriggered && !this.clicked) {
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

    this.video.video.render();

    /* if (this.scalingButton) {
      Canvas.ctx.save();
      Canvas.ctx.globalAlpha = this.scaleAlpha;
      Canvas.ctx.drawImage(
        this.scaleVideo,
        window.innerWidth / 2 - (this.scaleVideoSize.x * this.scaleVideoScale.x) / 2,
        window.innerHeight / 2 - (this.scaleVideoSize.y * this.scaleVideoScale.x) / 2,
        this.scaleVideoSize.x * this.scaleVideoScale.x,
        this.scaleVideoSize.y * this.scaleVideoScale.x,
      );

      Canvas.ctx.restore();
    } */
  }
}
