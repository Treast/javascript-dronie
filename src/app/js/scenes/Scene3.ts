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
  };

  constructor() {
    this.position = new Vector2(window.innerWidth / 2, 0);
    this.toudou = new DroneVideo('tornado');
    this.toudou.setScale(0.2);
    this.toudou.play();
    this.toudou.setPosition(this.position.x, this.position.y);
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
        this.createMagnet();
      },
    });
  }

  createMagnet() {
    this.magnetPosition = new Vector2(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.onMagnetCreated();
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
    /* this.attractDrone(); */
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
      this.attractDrone();
    }
  }

  attractDrone() {
    TweenMax.to(this.position, 5, {
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
    });
  }

  onMouseMove(e: MouseEvent) {
    const { x, y } = e;

    if (this.magnet.bounds.contains({ x, y })) {
      document.body.style.cursor = 'pointer';
      if (this.magnet.hoverInTriggered) {
        return;
      }
      this.magnet.hoverInTriggered = true;
      this.magnet.hoverOutTriggered = false;
      this.onMagnetHoverIn();
      this.magnet.tween.play();
    } else {
      document.body.style.cursor = 'default';
      if (this.magnet.hoverOutTriggered || !this.magnet.hoverInTriggered) {
        return;
      }
      this.magnet.hoverInTriggered = false;
      this.magnet.hoverOutTriggered = true;
      this.onMagnetHoverOut();
      this.magnet.tween.pause();
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

  onMagnetAppeared() {
    this.setListenerOnMagnet();
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (this.magnetPosition) {
      Canvas.ctx.fillStyle = 'green';
      Canvas.ctx.beginPath();
      Canvas.ctx.arc(this.magnetPosition.x, this.magnetPosition.y, this.magnet.size, 0, Math.PI * 2, true);
      Canvas.ctx.closePath();
      Canvas.ctx.fill();
    }

    this.toudou.render();
  }

  onStart() {}

  onDestroy() {}
}
export default Scene3;
