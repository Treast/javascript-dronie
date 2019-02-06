import Posenet from './Posenet';
import Webcam from './Webcam';
import Configuration from '../utils/Configuration';
import { Vector2 } from '../utils/Vector2';
import State from '../utils/State';
import { TweenMax, Power2 } from 'gsap';

export default class Canvas {
  private posenet: Posenet;
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private hand: Vector2 = new Vector2(0, 0);

  private custom: any = {
    button1: 50,
  };

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
      const handX = this.lerp(this.hand.x, hand.x, Configuration.canvasLerpFactor);
      const handY = this.lerp(this.hand.y, hand.y, Configuration.canvasLerpFactor);
      this.hand = new Vector2(handX, handY);

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

      this.manageState();
    });
  }

  manageState() {
    switch (State.state) {
      case State.WAITING_FOR_USER:
        this.stateWaitingForUser();
        break;
    }
    this.drawHand();
  }

  drawHand() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.hand.x - 5, this.hand.y - 5, 10, 10);
  }

  stateWaitingForUser() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.arc(window.innerWidth / 2, window.innerHeight / 2, this.custom.button1, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();

    const distance = this.hand.distance(new Vector2(window.innerWidth / 2, window.innerHeight / 2));

    if (distance < this.custom.button1 * 1.5) {
      if (!this.custom.isTween1Running) {
        this.custom.tween1 = TweenMax.to(this.custom, 10, {
          button1: window.innerWidth,
          ease: Power2.easeInOut,
          onStart: () => {
            this.custom.isTween1Running = true;
          },
        });
      }
    } else {
      if (this.custom.isTween1Running) {
        this.custom.isTween1Running = false;
        this.custom.tween1.kill();
        this.custom.tween1 = TweenMax.to(this.custom, 10, {
          button1: 50,
          ease: Power2.easeInOut,
        });
      }
    }
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }
}
