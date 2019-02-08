import { SceneInterface } from './SceneInterface';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Power2 } from 'gsap';
import Canvas from '../core/Canvas';
import State from '../utils/State';

class Scene1 implements SceneInterface {
  private custom: any = {
    button1: 50,
  };

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'black';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    Canvas.ctx.beginPath();
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.arc(window.innerWidth / 2, window.innerHeight / 2, this.custom.button1, 0, Math.PI * 2, true);
    Canvas.ctx.fill();
    Canvas.ctx.closePath();

    const distance = hand.distance(new Vector2(window.innerWidth / 2, window.innerHeight / 2));

    if (distance < this.custom.button1 * 1.5) {
      if (!this.custom.isTween1Running) {
        this.custom.tween1 = TweenMax.to(this.custom, 5, {
          button1: window.innerWidth,
          ease: Power2.easeInOut,
          onStart: () => {
            this.custom.isTween1Running = true;
          },
          onComplete: () => {
            State.set(State.SCENE_2);
          },
        });
      }
    } else {
      if (this.custom.isTween1Running) {
        this.custom.isTween1Running = false;
        this.custom.tween1.kill();
        this.custom.tween1 = TweenMax.to(this.custom, 5, {
          button1: 50,
          ease: Power2.easeInOut,
        });
      }
    }
  }
}

export default new Scene1();
