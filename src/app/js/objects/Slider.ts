import { Vector2 } from '../utils/Vector2';
import Canvas from '../core/Canvas';
import { TweenMax, Power0, Elastic, Power2, Power4 } from 'gsap';
// @ts-ignore
import * as SimplexNoise from 'simplex-noise';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import DroneVideo from '../core/DroneVideo';
import SliderCheckPoint from '../core/SliderCheckPoint';
import Animation from '../core/Animation';

export default class Slider {
  public destination: Vector2;
  private origin: Vector2;
  private percent: number;
  private percentLerp: number;
  private currentPositionLerp: Vector2;
  private currentPosition: Vector2;
  private video: DroneVideo;

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
    opacity: 0,
    isOver: false,
  };

  private points: any[] = [];
  private simplex: any;
  private checkpoints: SliderCheckPoint[];

  constructor() {
    this.destination = new Vector2(0.2 * window.innerWidth, 0.3 * window.innerHeight);
    this.origin = new Vector2(0.5 * window.innerWidth, 0.6 * window.innerHeight);
    this.currentPositionLerp = this.origin.clone();
    this.currentPosition = this.origin.clone();
    this.percent = 0;
    this.percentLerp = 0;
    // this.video = new DroneVideo('timideToJoueur', false);
    // this.video.setScale(4);
    // this.video.video.pause();
    this.config.noiseFactor = this.config.maxDistorsion * this.config.radius;
    this.simplex = new SimplexNoise();

    this.checkpoints = [
      new SliderCheckPoint('slider1', 0.16, this.getStepPosition(0.16)),
      new SliderCheckPoint('slider2', 0.32, this.getStepPosition(0.32)),
      new SliderCheckPoint('slider3', 0.48, this.getStepPosition(0.48)),
      new SliderCheckPoint('slider4', 0.64, this.getStepPosition(0.64)),
      new SliderCheckPoint('slider5', 0.8, this.getStepPosition(0.8)),
      new SliderCheckPoint('slider6', 0.9, this.getStepPosition(0.9)),
    ];

    this.computePoints();
    this.computeSteps();
  }

  getStepPosition(percent: number) {
    console.log(
      percent,
      this.origin.clone().add(
        this.destination
          .clone()
          .substract(this.origin)
          .multiply(percent)
          .multiply(1 / 0.9),
      ),
    );
    return this.origin.clone().add(
      this.destination
        .clone()
        .substract(this.origin)
        .multiply(percent)
        .multiply(1 / 0.9),
    );
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  updatePoints() {
    this.config.gradient = Canvas.ctx.createRadialGradient(
      this.currentPositionLerp.x,
      this.currentPositionLerp.y,
      this.config.radius / 2,
      this.currentPositionLerp.x,
      this.currentPositionLerp.y,
      this.config.radius,
    );
    this.config.gradient.addColorStop(0, this.config.colorA);
    this.config.gradient.addColorStop(1, this.config.colorB);
    this.points.map(point => {
      const dx = this.simplex.noise2D(point.ox + this.config.noise, point.oy) * this.config.noiseFactor;
      const dy = this.simplex.noise2D(point.ox, point.oy + this.config.noise) * this.config.noiseFactor;
      point.x = point.ox + dx + this.currentPositionLerp.x;
      point.y = point.oy + dy + this.currentPositionLerp.y;
    });
  }

  computePoints() {
    const angleDelta = (Math.PI * 2) / this.config.numberPoints;
    for (let i = 0; i < this.config.numberPoints; i += 1) {
      const x = Math.cos(angleDelta * i) * this.config.radius;
      const y = Math.sin(angleDelta * i) * this.config.radius;
      this.points.push({ x, y, ox: x, oy: y, scale: 0 });
    }
  }

  computeSteps() {
    const sliderVector = this.destination.clone().substract(this.origin);
    for (let i = 0; i < this.numberOfSteps; i += 1) {
      const p = (i + 1) / this.numberOfSteps;
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

  getDistanceFromMouseToSlider(mouse: Vector2, droneAnimation: Animation) {
    // const mouseStep = new Vector2(mouseX, mouseY);
    const mouseStep = mouse.clone();
    const A = this.origin;
    const B = this.destination;
    const BA = this.destination.clone().substract(A);
    const m = (B.y - A.y) / (B.x - A.x);
    const p = A.y - m * A.x;
    const percent = mouseStep.distance(A) / B.distance(A);

    // const frames = this.video.video.duration * 60;
    // const frame = Math.round(frames * percent);
    // this.video.video.currentTime = frame / 60;

    // TODO: Va foirer
    // const relativeDistance = this.animation.video.position.distance(mouse);
    const position = this.origin.clone().add(BA.multiply(this.percent).multiply(1 / 0.9));
    this.currentPosition = position;
    const relativeDistance = position.distance(mouseStep);

    // Si on se trouve du bon côté du slider
    if (
      mouseStep.x < this.origin.x &&
      relativeDistance < 0.1 * window.innerWidth &&
      percent > this.percent &&
      percent >= 0
    ) {
      this.percent = Math.min(percent, 1);
    }

    this.checkpoints.map(checkpoint => {
      checkpoint.check(this.percentLerp, droneAnimation);
    });

    if (!this.config.isOver && this.percentLerp >= 0.9) {
      //SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, { value: 1 });
      if (this.endCallback) {
        TweenMax.to(this.config, 2, {
          opacity: 0,
          ease: Power4.easeOut,
          onComplete: () => {
            this.endCallback();
          },
        });
      }
      this.config.isOver = true;
    }
  }

  scaleUp() {
    TweenMax.staggerFromTo(
      this.steps,
      1,
      {
        scale: 0,
      },
      {
        scale: 1,
        ease: Power2.easeIn,
      },
      0.3,
      () => {
        TweenMax.to(this.config, 1, {
          opacity: 1,
          ease: Power2.easeIn,
        });
      },
    );
  }

  setCallback(callback: any) {
    this.endCallback = callback;
  }

  render(position: Vector2) {
    // this.video.setPosition(position.x, position.y);
    // this.video.render();

    this.steps.map(step => {
      if (step.active) {
        Canvas.ctx.save();
        Canvas.ctx.filter = 'blur(15px)';
        Canvas.ctx.fillStyle = `rgba(0, 0, 255, ${step.alpha})`;
        Canvas.ctx.beginPath();
        Canvas.ctx.arc(step.x, step.y, step.scale * 20, 0, Math.PI * 2, true);
        Canvas.ctx.fill();
        Canvas.ctx.restore();
      }
    });

    this.currentPositionLerp.x = this.lerp(this.currentPositionLerp.x, this.currentPosition.x, 0.1);
    this.currentPositionLerp.y = this.lerp(this.currentPositionLerp.y, this.currentPosition.y, 0.1);
    this.percentLerp = this.lerp(this.percentLerp, this.percent, 0.1);
    const relativePosition = this.origin.clone().add(
      this.destination
        .clone()
        .substract(this.origin)
        .multiply(this.percentLerp)
        .multiply(1 / 0.9),
    );

    this.steps.map(step => {
      if (step.x >= relativePosition.x) {
        step.active = false;
      }
    });

    Canvas.ctx.save();
    Canvas.ctx.filter = 'blur(10px)';
    Canvas.ctx.globalAlpha = this.config.opacity;
    Canvas.ctx.fillStyle = this.config.gradient;
    if (this.points.length > 2) {
      Canvas.ctx.beginPath();
      this.updatePoints();
      Canvas.ctx.moveTo(this.points[0].x + 20, this.points[0].y + 20);
      for (let i = 1; i < this.points.length; i += 1) {
        Canvas.ctx.lineTo(this.points[i].x + 20, this.points[i].y + 20);
      }
      Canvas.ctx.closePath();
      Canvas.ctx.fill();
    }
    // ctx.ellipse(canvas.width / 2, canvas.height / 2, circle.x, circle.y, 0, 0, Math.PI * 2, true);
    Canvas.ctx.restore();
    this.config.noise += this.config.noiseDelta;
  }
}
