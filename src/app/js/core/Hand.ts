import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';
import Configuration from '../utils/Configuration';
import DroneVideo from './DroneVideo';
import { TweenMax, Elastic } from 'gsap';

class Hand {
  public position: Vector2 = new Vector2(window.innerWidth * 0.2, window.innerHeight * 0.8);
  private lastPosition: Vector2 = new Vector2(window.innerWidth * 0.2, window.innerHeight * 0.8);
  private handSize: number = 20;
  private color: HandColor = HandColor.NORMAL;
  private lastPositions: Vector2[] = [];
  private lastPositionsLength: number = 15;

  private butttonIndex: number = 0;
  private buttonBleu: DroneVideo;
  private buttonRoseFonce: DroneVideo;
  private buttons: DroneVideo[] = [];

  constructor() {}

  init() {
    this.buttonBleu = new DroneVideo('colorBleuAttente', true, new Vector2(0, 0));
    this.buttonBleu.setScale(0);
    this.buttonRoseFonce = new DroneVideo('colorRoseFonceAttente', true, new Vector2(0, 0));
    this.buttonRoseFonce.setScale(0);

    this.buttons.push(this.buttonBleu);
    this.buttons.push(this.buttonRoseFonce);
  }

  nextButton() {
    this.scaleUp();
  }

  scaleUp() {
    TweenMax.to(this.buttons[this.butttonIndex].scale, 1, {
      x: 0.05,
      y: 0.05,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.butttonIndex += 1;
      },
      onStart: () => {
        this.buttons[this.butttonIndex].video.play();
      },
    });
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  setHand(hand: Vector2, force: boolean = false) {
    if (!force) {
      const maxOffset = 0.4;
      const outOfBoundsX = hand.x > window.innerWidth || hand.x < 0;
      const outOfBoundsY = hand.y > window.innerHeight || hand.y < 0;
      const tooMuchOffsetX = Math.abs(this.lastPosition.x - hand.x) > maxOffset * window.innerWidth;
      const tooMuchOffsetY = Math.abs(this.lastPosition.y - hand.y) > maxOffset * window.innerHeight;
      if (outOfBoundsX || outOfBoundsY || tooMuchOffsetX || tooMuchOffsetY) {
        hand = this.lastPosition;
      } else {
        this.lastPosition = hand;
      }
      const handX = this.lerp(this.position.x, hand.x, Configuration.canvasLerpFactor);
      const handY = this.lerp(this.position.y, hand.y, Configuration.canvasLerpFactor);
      this.position = new Vector2(handX, handY);
    } else {
      this.position = hand;
    }
  }

  leaveTrail(position: Vector2) {
    this.lastPositions.push(position);

    if (this.lastPositions.length > this.lastPositionsLength) {
      this.lastPositions = this.lastPositions.slice(Math.max(this.lastPositions.length - this.lastPositionsLength, 1));
    }
  }

  render() {
    this.leaveTrail(this.position);
    this.lastPositions.forEach((position, index) => {
      Canvas.ctx.fillStyle = `rgba(0, 0, 0, ${(0.2 * index) / this.lastPositionsLength})`;
      Canvas.ctx.beginPath();
      Canvas.ctx.fillRect(position.x - this.handSize / 2, position.y - this.handSize / 2, this.handSize, this.handSize);
      Canvas.ctx.fill();
    });

    this.buttons.forEach((button) => {
      button.setPosition(this.position.x, this.position.y);
      button.render();
    });

    Canvas.ctx.save();
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    Canvas.ctx.shadowBlur = 40;
    Canvas.ctx.shadowColor = `${this.color}`;
    Canvas.ctx.beginPath();
    Canvas.ctx.fillRect(this.position.x - this.handSize / 2, this.position.y - this.handSize / 2, this.handSize, this.handSize);
    Canvas.ctx.stroke();
    Canvas.ctx.restore();
  }

  setColor(color: HandColor) {
    this.color = color;
  }
}

export class HandColor {
  static RED = 'rgba(255, 0, 0, 1)';
  static NORMAL = 'rgba(0, 0, 0, 1)';
}

export default new Hand();
