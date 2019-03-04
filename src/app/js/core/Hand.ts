import { Vector2 } from '../utils/Vector2';
import Canvas from './Canvas';
import Configuration from '../utils/Configuration';
import DroneVideo from './DroneVideo';
import { TweenMax, Elastic } from 'gsap';
import ColorButton from '../objects/ColorButton';

class Hand {
  public position: Vector2 = new Vector2(window.innerWidth * 0.2, window.innerHeight * 0.8);
  private lastPosition: Vector2 = new Vector2(window.innerWidth * 0.2, window.innerHeight * 0.8);
  private handSize: number = 20;
  private color: HandColor = HandColor.NORMAL;
  private lastPositions: Vector2[] = [];
  private lastPositionsLength: number = 8;

  private butttonIndex: number = 0;
  private buttonBleu: DroneVideo;
  private buttonRoseFonce: DroneVideo;
  private buttonRose: DroneVideo;
  private buttonOrange: DroneVideo;
  private buttons: DroneVideo[] = [];
  private config = {
    radius: [] as number[],
    angles: [] as number[],
  };

  constructor() {}

  init() {
    this.buttonBleu = new DroneVideo('colorBleuAttente', true, new Vector2(0, 0));
    this.buttonBleu.setScale(0);
    this.buttonRoseFonce = new DroneVideo('colorRoseFonceAttente', true, new Vector2(0, 0));
    this.buttonRoseFonce.setScale(0);
    this.buttonRose = new DroneVideo('colorRoseAttente', true, new Vector2(0, 0));
    this.buttonRose.setScale(0);
    this.buttonOrange = new DroneVideo('colorOrangeAttente', true, new Vector2(0, 0));
    this.buttonOrange.setScale(0);
    this.buttonBleu.setPoster('colorBleuAttente');
    this.buttonRoseFonce.setPoster('colorRoseFonceAttente');
    this.buttonRose.setPoster('colorRoseAttente');
    this.buttonOrange.setPoster('colorOrangeAttente');

    this.buttons.push(this.buttonRoseFonce);
    this.buttons.push(this.buttonOrange);
    this.buttons.push(this.buttonBleu);
    this.buttons.push(this.buttonRose);

    let radius = 30;
    this.buttons.map((button) => {
      this.config.radius.push(radius);
      this.config.angles.push(Math.random() * 2 * Math.PI);
      radius += 10;
    });
  }

  nextButton() {
    this.scaleUp();
  }

  scaleUp() {
    TweenMax.to(this.buttons[this.butttonIndex].scale, 1, {
      x: 0.1,
      y: 0.1,
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
    Canvas.ctx.lineWidth = 20;
    const gradient = Canvas.ctx.createLinearGradient(
      this.lastPositions[this.lastPositions.length - 1].x,
      this.lastPositions[this.lastPositions.length - 1].y,
      this.lastPositions[0].x,
      this.lastPositions[0].y,
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'white');
    Canvas.ctx.strokeStyle = gradient;
    Canvas.ctx.beginPath();
    Canvas.ctx.lineTo(this.lastPositions[0].x - this.handSize / 2, this.lastPositions[0].y - this.handSize / 2);
    for (let i = 1; i < this.lastPositions.length; i += 1) {
      Canvas.ctx.lineTo(this.lastPositions[i].x - this.handSize / 2, this.lastPositions[i].y - this.handSize / 2);
    }
    Canvas.ctx.lineTo(this.position.x, this.position.y);
    Canvas.ctx.stroke();

    this.buttons.forEach((button, index) => {
      // button.setPosition(this.position.x, this.position.y);
      const x = this.lerp(button.position.x, this.position.x, 0.2);
      const y = this.lerp(button.position.y, this.position.y, 0.2);
      button.setPosition(x, y);
      this.renderButton(button, index);
    });

    Canvas.ctx.save();
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    Canvas.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    // Canvas.ctx.shadowBlur = 40;
    // Canvas.ctx.shadowColor = `${this.color}`;
    Canvas.ctx.beginPath();
    Canvas.ctx.fillRect(this.position.x - this.handSize / 2, this.position.y - this.handSize / 2, this.handSize, this.handSize);
    Canvas.ctx.stroke();
    Canvas.ctx.restore();
  }

  setColor(color: HandColor) {
    this.color = color;
  }

  renderButton(button: DroneVideo, index: number) {
    this.config.angles[index] += 0.03;
    const angle = this.config.angles[index];
    const radius = this.config.radius[index];
    const dx = button.position.x + radius * Math.cos(angle);
    const dy = button.position.y + radius * Math.sin(angle);
    if (button.video.currentTime) {
      Canvas.ctx.save();
      Canvas.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      Canvas.ctx.rotate(button.rotation);
      Canvas.ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);

      Canvas.ctx.drawImage(
        button.video,
        dx - (button.video.videoWidth * button.scale.x) / 2,
        dy - (button.video.videoHeight * button.scale.y) / 2,
        button.video.videoWidth * button.scale.x,
        button.video.videoHeight * button.scale.x,
      );

      Canvas.ctx.restore();
    } else {
      Canvas.ctx.save();
      Canvas.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
      Canvas.ctx.rotate(button.rotation);
      Canvas.ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);

      if (button.image) {
        Canvas.ctx.drawImage(
          button.image,
          dx - (button.video.videoWidth * button.scale.x) / 2,
          dy - (button.video.videoHeight * button.scale.y) / 2,
          button.image.width * button.scale.x,
          button.image.height * button.scale.x,
        );
      }

      Canvas.ctx.restore();
    }
  }
}

export class HandColor {
  static RED = 'rgba(255, 0, 0, 1)';
  static NORMAL = 'rgba(0, 0, 0, 1)';
}

export default new Hand();
