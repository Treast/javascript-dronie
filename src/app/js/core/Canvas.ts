import Posenet from './Posenet';
import Webcam from './Webcam';
import Configuration from '../utils/Configuration';
import { Vector2 } from '../utils/Vector2';

export default class Canvas {
  private posenet: Posenet;
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.element = document.querySelector('canvas');
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.ctx = this.element.getContext('2d');
  }

  initPosenet() {
    this.posenet = new Posenet();
    return this.posenet.init();
  }

  render() {
    requestAnimationFrame(() => this.render());

    this.posenet.getHand().then((hand: Vector2) => {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      this.ctx.save();
      this.ctx.drawImage(
        Webcam.getVideo(),
        0,
        0,
        window.innerWidth,
        (Configuration.webcamVideoHeight / Configuration.webcamVideoWidth) * window.innerWidth,
      );
      this.ctx.restore();
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(hand.x - 5, hand.y - 5, 10, 10);
    });
  }
}
