import Posenet from "./Posenet";
import Webcam from "./Webcam";
import Configuration from "../utils/Configuration";
import { Vector2 } from "../utils/Vector2";
import State from "../utils/State";
import Scene1 from "../scenes/Scene1";
import { SceneInterface } from "../scenes/SceneInterface";
import Scene2 from "../scenes/Scene2";

import { StateInterface } from "../utils/State";
import Scene3 from "../scenes/Scene3";
import Hand from "./Hand";
import SocketManager, { SocketTypes } from "../utils/SocketManager";

class Canvas {
  private posenet: Posenet;
  private element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private hand: Vector2 = new Vector2(0, 0);

  public currentScene: SceneInterface = null;

  private scene: any;

  constructor() {
    this.element = document.querySelector("canvas");
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.ctx = this.element.getContext("2d");
    State.init();

    this.addEvents();
  }

  private addEvents() {
    if (!Configuration.useWebcamInteraction) {
      window.addEventListener("mousemove", e => this.onMouseMove(e));
    }
    window.addEventListener("resize", this.onResize.bind(this));
    SocketManager.on(SocketTypes.HAND_MOVE, this.onHandMove.bind(this));
  }

  private onMouseMove(e: MouseEvent) {
    Hand.setHand(new Vector2(e.clientX, e.clientY), true);
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

    if (Configuration.useWebcamInteraction) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.scene.render(Hand.position);
      Hand.render();
    } else {
      // this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.scene.render(Hand.position);
      Hand.render();
    }
  }

  setScene(sceneState: StateInterface) {
    if (this.scene) {
      this.scene.onDestroy();
    }
    console.log("Setting scene: ", sceneState);
    switch (sceneState) {
      case State.WAITING_FOR_USER:
        this.scene = new Scene1();
        break;
      case State.SCENE_2:
        this.scene = new Scene2();
        break;
      case State.SCENE_3:
        this.scene = new Scene3();
        break;
    }

    State.set(sceneState);

    this.scene.onStart();
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  onHandMove(hand: Vector2) {
    Hand.setHand(hand);
  }
}

export default new Canvas();
