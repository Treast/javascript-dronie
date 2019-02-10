import Posenet from "./Posenet";
import Webcam from "./Webcam";
import Configuration from "../utils/Configuration";
import { Vector2 } from "../utils/Vector2";
import State from "../utils/State";
import Scene1 from "../scenes/Scene1";
import { SceneInterface } from "../scenes/SceneInterface";
import Scene2 from "../scenes/Scene2";

class Canvas {
  private posenet: Posenet;
  private element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private hand: Vector2 = new Vector2(0, 0);

  public currentScene: SceneInterface = null;

  private custom: any = {
    button1: 50
  };

  constructor() {
    this.element = document.querySelector("canvas");
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.ctx = this.element.getContext("2d");

    this.addEvents();
  }

  private addEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize() {
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
  }

  initPosenet() {
    this.posenet = new Posenet();
    return this.posenet.init();
  }

  render() {
    requestAnimationFrame(() => this.render());

    this.posenet.getHand().then((hand: Vector2) => {
      const handX = this.lerp(
        this.hand.x,
        hand.x,
        Configuration.canvasLerpFactor
      );
      const handY = this.lerp(
        this.hand.y,
        hand.y,
        Configuration.canvasLerpFactor
      );
      this.hand = new Vector2(handX, handY);

      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      /* this.ctx.save();
      this.ctx.drawImage(
        Webcam.getVideo(),
        0,
        0,
        window.innerWidth,
        (Configuration.webcamVideoHeight / Configuration.webcamVideoWidth) *
          window.innerWidth
      );
      this.ctx.restore(); */

      this.manageState();
    });
  }

  manageState() {
    switch (State.state) {
      case State.WAITING_FOR_USER:
        Scene1.render(this.hand);
        break;
      case State.SCENE_2:
        Scene2.render(this.hand);
        break;
    }
    this.drawHand();
  }

  drawHand() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.hand.x - 5, this.hand.y - 5, 10, 10);
  }

  stateWaitingForUser() {}

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }
}

export default new Canvas();
