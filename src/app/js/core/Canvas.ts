import Posenet from './Posenet';
import Webcam from './Webcam';
import Configuration from '../utils/Configuration';
import { Vector2 } from '../utils/Vector2';
import State from '../utils/State';
import Scene1 from '../scenes/Scene1';
import { SceneInterface } from '../scenes/SceneInterface';
import Scene2 from '../scenes/Scene2';

import { StateInterface } from '../utils/State';
import Scene3 from '../scenes/Scene3';

class Canvas {
  private posenet: Posenet;
  private element: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private hand: Vector2 = new Vector2(0, 0);

  public currentScene: SceneInterface = null;

  private scene: any;

  constructor() {
    this.element = document.querySelector('canvas');
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.ctx = this.element.getContext('2d');
    State.init();

    this.addEvents();
  }

  private addEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
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
      this.posenet.getHand().then((hand: Vector2) => {
        const handX = this.lerp(this.hand.x, hand.x, Configuration.canvasLerpFactor);
        const handY = this.lerp(this.hand.y, hand.y, Configuration.canvasLerpFactor);
        this.hand = new Vector2(handX, handY);

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.scene.render(this.hand);
        this.drawHand();
      });
    } else {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.scene.render(this.hand);
    }
  }

  setScene(sceneState: StateInterface) {
    if (this.scene) {
      this.scene.onDestroy();
    }
    console.log('Setting scene: ', sceneState)
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

  drawHand() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.hand.x - 5, this.hand.y - 5, 10, 10);
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }
}

export default new Canvas();
