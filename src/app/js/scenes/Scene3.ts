import { SceneInterface } from './SceneInterface';
import Canvas from '../core/Canvas';
import { Vector2 } from '../utils/Vector2';
import DroneVideo from '../core/DroneVideo';
import { TweenMax, Elastic, Ease, Power2 } from 'gsap';
import Rect from '../utils/math/Rect';
// @ts-ignore
require('../utils/gsap/ease/CustomEase');

interface CustomEase {
  create(id: string, data: string): CustomEase;
  get(id: string): CustomEase;
  getRatio(progress: number): CustomEase;
}

declare var CustomEase: CustomEase;

class Scene3 implements SceneInterface {
  private toudou: DroneVideo;
  private position: Vector2;

  private magnetPosition: Vector2;
  private magnet = {
    active: false,
    size: 0,
    bounds: new Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
    hoverInTriggered: false,
    hoverOutTriggered: false,
    tween: null as any,
    id: 1,
    video: null as DroneVideo,
    hoverVideo: null as DroneVideo,
  };

  private slider = {
    active: false,
    destination: new Vector2(0.9 * window.innerWidth, 0.2 * window.innerHeight),
    origin: new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
    percent: 0,
  };

  private button = {
    id: 1,
    active: false,
    radius: 0,
    position: new Vector2(0.3 * window.innerWidth, 0.5 * window.innerHeight),
    bounds: new Rect({ x: 0, y: 0, width: 0, height: 0 }),
    hoverInTriggered: false,
  };

  constructor() {
    this.position = new Vector2(window.innerWidth / 2, 0);
    this.toudou = new DroneVideo('toudou');
    this.toudou.setScale(0.2);
    this.toudou.play();
    this.toudou.setPosition(this.position.x, this.position.y);
    /** Magnet */
    this.magnet.video = new DroneVideo('boutonAimant');
    this.magnet.video.setScale(0.25);
    this.magnet.video.setPosition(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.magnet.video.play();
    /** Magnet Hover */
    this.magnet.hoverVideo = new DroneVideo('boutonAimantClique');
    this.magnet.hoverVideo.setScale(0.25);
    this.magnet.hoverVideo.setPosition(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.magnet.hoverVideo.setLoop(false);
    this.magnet.hoverVideo.pause();
    this.magnet.video.setTransitionVideo(this.magnet.hoverVideo);
    setTimeout(() => {
      this.goToMiddleLeft();
    },         2000);
  }

  goToMiddleLeft() {
    TweenMax.to(this.position, 3, {
      x: 0,
      y: window.innerHeight / 2,
      onUpdate: () => {
        this.toudou.setPosition(this.position.x, this.position.y);
      },
      onComplete: () => {
        this.createMagnet1();
      },
    });
  }

  createMagnet1() {
    this.magnet.active = true;
    this.magnetPosition = new Vector2(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.onMagnetCreated();
  }

  createMagnet2() {
    TweenMax.to(this.magnet, 1, {
      ease: Elastic.easeOut,
      size: 0,
      onComplete: () => {
        this.magnet.id = 2;
        this.magnet.bounds = new Rect({ x: 0, y: 0, width: 0, height: 0 });
        this.magnetPosition = new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight);
        this.magnet.video.setPosition(0.1 * window.innerWidth, 0.8 * window.innerHeight);
        this.magnet.hoverVideo.setPosition(0.1 * window.innerWidth, 0.8 * window.innerHeight);
        this.onMagnetCreated();
      },
    });
  }

  onMagnetCreated() {
    TweenMax.to(this.magnet, 1, {
      size: 40,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.onMagnetAppeared();
      },
      onStart: () => {
        this.magnet.bounds.x = this.magnetPosition.x - 40 * 1.25;
        this.magnet.bounds.y = this.magnetPosition.y - 40 * 1.25;
        this.magnet.bounds.width = 40 * 2.5;
        this.magnet.bounds.height = 40 * 2.5;
      },
    });
  }

  setListenerOnMagnet() {
    this.attractDrone();
    window.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });
    window.addEventListener('mousedown', (e) => {
      this.onMouseDown(e);
    });
  }

  onMouseDown(e: MouseEvent) {
    const { x, y } = e;
    if (this.magnet.bounds.contains({ x, y })) {
    }
  }

  getDistanceFromMouseToSlider(mouse: Vector2) {
    const A = this.slider.origin;
    const B = this.slider.destination;
    const BA = this.slider.destination.clone().substract(A);
    const m = (B.y - A.y) / (B.x - A.x);
    const p = A.y - m * A.x;
    const d1 = m * mouse.x - 1 * mouse.y + p;
    const d2 = Math.sqrt(Math.pow(m, 2) + 1);
    // console.log('Distance', Math.abs(d1 / d2));
    const percent = mouse.distance(A) / B.distance(A);

    if (percent > this.slider.percent && percent >= 0 && percent <= 1) {
      this.slider.percent = percent;
      const position = this.slider.origin.clone().add(BA.multiply(percent));
      this.toudou.setPosition(position.x, position.y);
    }

    if (percent >= 1) {
      this.slider.active = false;
      this.button.active = true;
      this.setButton();
    }
  }

  setButton() {
    TweenMax.to(this.button, 1, {
      radius: 30,
      ease: Elastic.easeOut,
      onStart: () => {
        this.button.bounds.width = 80;
        this.button.bounds.height = 80;
        this.button.bounds.x = this.button.position.x - 40;
        this.button.bounds.y = this.button.position.y - 40;
      },
    });
  }

  attractDrone() {
    this.magnet.tween = TweenMax.to(this.position, 5, {
      x: this.magnetPosition.x,
      y: this.magnetPosition.y,
      // @ts-ignore
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.46,0 0.484,0.168 0.572,0.274 0.652,0.371 0.754,0.804 0.834,1 0.858,1.06 0.918,0.982 0.952,0.982 0.976,0.982 0.997,0.989 1,1',
      ),
      onUpdate: () => {
        this.toudou.setPosition(this.position.x, this.position.y);
      },
      onComplete: () => {
        if (this.magnet.id === 1) {
          this.magnet.hoverInTriggered = false;
          this.magnet.hoverOutTriggered = false;
          this.createMagnet2();
        } else {
          TweenMax.to(this.magnet, 1, {
            size: 0,
            ease: Elastic.easeOut,
            onComplete: () => {
              this.magnet.bounds = new Rect({ x: 0, y: 0, width: 0, height: 0 });
              this.magnet.hoverInTriggered = false;
              this.magnet.hoverOutTriggered = false;
              // On Magnet 2 done
              this.generateSlider();
            },
          });
        }
      },
    }).pause();
  }

  generateSlider() {
    this.magnet.active = false;
    this.slider.active = true;
  }

  onMouseMove(e: MouseEvent) {
    const { x, y } = e;

    if (this.magnet.active) {
      if (this.magnet.bounds.contains({ x, y })) {
        document.body.style.cursor = 'pointer';
        if (this.magnet.hoverInTriggered) {
          return;
        }
        this.magnet.hoverInTriggered = true;
        this.magnet.hoverOutTriggered = false;
        this.magnet.hoverVideo.play();
        this.onMagnetHoverIn();
        this.magnet.tween.play();
      } else {
        document.body.style.cursor = 'default';
        if (this.magnet.hoverOutTriggered || !this.magnet.hoverInTriggered) {
          return;
        }
        this.magnet.hoverInTriggered = false;
        this.magnet.hoverOutTriggered = true;
        this.magnet.video.triggered = true;
        this.onMagnetHoverOut();
        this.magnet.tween.pause();
      }
    } else if (this.slider.active) {
      this.getDistanceFromMouseToSlider(new Vector2(x, y));
    } else if (this.button.active) {
      if (this.button.bounds.contains({ x, y })) {
        document.body.style.cursor = 'pointer';
        if (this.button.hoverInTriggered) {
          return;
        }
        this.button.hoverInTriggered = true;
        this.onButtonHoverIn();
      } else {
        document.body.style.cursor = 'default';
        this.button.hoverInTriggered = false;
      }
    }
  }

  onMagnetHoverIn() {
    TweenMax.to(this.magnet, 0.4, {
      size: 60,
      ease: Power2.easeOut,
    });
  }

  onMagnetHoverOut() {
    TweenMax.to(this.magnet, 0.4, {
      size: 40,
      ease: Power2.easeOut,
    });
  }

  onButtonHoverIn() {
    TweenMax.to(this.button, 2, {
      radius: 0,
      ease: Power2.easeIn,
      delay: 4,
    });
    TweenMax.to(this.toudou.position, 6, {
      x: this.button.position.x,
      y: this.button.position.y,
      ease: Power2.easeOut,
      onComplete: () => {
        if (this.button.id < 3) {
          this.button.id += 1;
          this.button.position.x = Math.random() * window.innerWidth;
          this.button.position.y = Math.random() * window.innerHeight;
          this.setButton();
        } else {
          this.fallButton();
        }
      },
    });
  }

  fallButton() {
    TweenMax.to(this.toudou.position, 3, {
      y: window.innerHeight + this.toudou.height * 2,
      ease: Power2.easeIn,
      onStart: () => {
        this.button.active = false;
        this.button.bounds.width = 0;
        this.button.bounds.height = 0;
      },
    });
    TweenMax.to(this.toudou.position, 5, {
      y: window.innerHeight / 2,
      ease: Power2.easeOut,
      delay: 5,
      onStart: () => {
        this.toudou.position.x = window.innerWidth / 2;
      },
    });
  }

  onMagnetAppeared() {
    this.setListenerOnMagnet();
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (this.magnet.active && this.magnet.size > 0) {
      /* Canvas.ctx.fillStyle = 'green';
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(this.magnetPosition.x, this.magnetPosition.y, this.magnet.size, 0, Math.PI * 2, true);
      Canvas.ctx.closePath();
      Canvas.ctx.fill(); */
      /* if (this.magnet.hoverInTriggered) {
        this.magnet.hoverVideo.render();
      } else {
      } */
      this.magnet.video.render();
    }

    if (this.slider.active) {
      Canvas.ctx.fillStyle = 'blue';
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(this.slider.destination.x, this.slider.destination.y, 20, 0, Math.PI * 2, true);
      Canvas.ctx.closePath();
      Canvas.ctx.fill();
    }

    if (this.button.active) {
      Canvas.ctx.fillStyle = 'red';
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(this.button.position.x, this.button.position.y, this.button.radius, 0, Math.PI * 2, true);
      Canvas.ctx.closePath();
      Canvas.ctx.fill();
    }

    this.toudou.render();
  }

  onStart() {}

  onDestroy() {}
}
export default Scene3;
