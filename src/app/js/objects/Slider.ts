import { Vector2 } from '../utils/Vector2';
import Canvas from '../core/Canvas';
import { TweenMax, Power0 } from 'gsap';
// @ts-ignore
import * as SimplexNoise from 'simplex-noise';
import SocketManager, { SocketTypes } from '../utils/SocketManager';

export default class Slider {
  public destination: Vector2;
  private origin: Vector2;
  private percent: number;
  private currentPosition: Vector2;

  private isInteractive: false;

  private endCallback: any;

  private numberOfSteps: number = 6;
  private steps: any[] = [];

  private config = {
    radius: 60,
    maxDistorsion: 0.1,
    noiseDelta: 0.005,
    numberPoints: 15,
    noiseFactor: 0,
    noise: 0,
    gradient: null as CanvasGradient,
    colorA: '#2736E3',
    colorB: '#000EB3',
  };

  private points: any[] = [];
  private simplex: any;

  constructor() {
    this.destination = new Vector2(0.9 * window.innerWidth, 0.2 * window.innerHeight);
    this.origin = new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight);
    this.currentPosition = this.origin;
    this.percent = 0;
    this.config.noiseFactor = this.config.maxDistorsion * this.config.radius;
    this.simplex = new SimplexNoise();
    this.computePoints();
    this.computeSteps();
  }

  updatePoints() {
    this.config.gradient = Canvas.ctx.createRadialGradient(
      this.currentPosition.x,
      this.currentPosition.y,
      this.config.radius / 2,
      this.currentPosition.x,
      this.currentPosition.y,
      this.config.radius,
    );
    this.config.gradient.addColorStop(0, this.config.colorA);
    this.config.gradient.addColorStop(1, this.config.colorB);
    this.points.map((point) => {
      const dx = this.simplex.noise2D(point.ox + this.config.noise, point.oy) * this.config.noiseFactor;
      const dy = this.simplex.noise2D(point.ox, point.oy + this.config.noise) * this.config.noiseFactor;
      point.x = point.ox + dx + this.currentPosition.x;
      point.y = point.oy + dy + this.currentPosition.y;
    });
  }

  computePoints() {
    const angleDelta = (Math.PI * 2) / this.config.numberPoints;
    for (let i = 0; i < this.config.numberPoints; i += 1) {
      const x = Math.cos(angleDelta * i) * this.config.radius;
      const y = Math.sin(angleDelta * i) * this.config.radius;
      this.points.push({ x, y, ox: x, oy: y });
    }
  }

  computeSteps() {
    const sliderVector = this.destination.clone().substract(this.origin);
    for (let i = 0; i <= this.numberOfSteps; i += 1) {
      const p = i / this.numberOfSteps;
      const x = sliderVector.x * p + this.origin.x;
      const y = sliderVector.y * p + this.origin.y;
      this.steps.push({ x, y, a: 0.7, active: true });
    }
    TweenMax.staggerFromTo(
      this.steps,
      2,
      {
        alpha: 0.8,
      },
      {
        alpha: 0.4,
        repeat: -1,
        yoyo: true,
        ease: Power0.easeNone,
      },
      1,
    );
  }

  getDistanceFromMouseToSlider(mouse: Vector2) {
    // const mouseStep = new Vector2(mouseX, mouseY);
    const mouseStep = mouse.clone();
    const A = this.origin;
    const B = this.destination;
    const BA = this.destination.clone().substract(A);
    const m = (B.y - A.y) / (B.x - A.x);
    const p = A.y - m * A.x;
    const percent = mouseStep.distance(A) / B.distance(A);
    // TODO: Va foirer
    // const relativeDistance = this.animation.video.position.distance(mouse);
    const position = this.origin.clone().add(BA.multiply(this.percent).multiply(1 / 0.9));
    this.currentPosition = position;
    const relativeDistance = position.distance(mouseStep);

    // Si on se trouve du bon côté du slider
    if (mouseStep.x > this.origin.x && relativeDistance < 0.1 * window.innerWidth && percent > this.percent && percent >= 0) {
      this.percent = Math.min(percent, 1);

      this.steps.map((step) => {
        if (step.x <= mouseStep.x) {
          step.active = false;
        }
      });

      SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, { value: percent });
    }

    if (this.percent >= 0.9) {
      SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, { value: 1 });
      if (this.endCallback) {
        this.endCallback();
      }
    }
  }

  setCallback(callback: any) {
    this.endCallback = callback;
  }

  render() {
    this.steps.map((step) => {
      if (step.active) {
        Canvas.ctx.save();
        Canvas.ctx.filter = 'blur(15px)';
        Canvas.ctx.fillStyle = `rgba(0, 0, 255, ${step.alpha})`;
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(step.x, step.y, 20, 0, Math.PI * 2, true);
        Canvas.ctx.fill();
        Canvas.ctx.restore();
      }
    });

    Canvas.ctx.save();
    Canvas.ctx.filter = 'blur(10px)';
    Canvas.ctx.fillStyle = this.config.gradient;

    if (this.points.length > 2) {
      Canvas.ctx.beginPath();
      this.updatePoints();
      Canvas.ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i += 1) {
        Canvas.ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      Canvas.ctx.closePath();
      Canvas.ctx.fill();
    }
    // ctx.ellipse(canvas.width / 2, canvas.height / 2, circle.x, circle.y, 0, 0, Math.PI * 2, true);
    Canvas.ctx.restore();
    this.config.noise += this.config.noiseDelta;
  }
}
