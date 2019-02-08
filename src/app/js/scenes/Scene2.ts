import { SceneInterface } from './SceneInterface';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Power2, Elastic } from 'gsap';
import Canvas from '../core/Canvas';

class Scene1 implements SceneInterface {
  private custom: any = {
    buttonPosition: new Vector2(window.innerWidth / 2, window.innerHeight / 2),
    button1: 0,
    tween: null,
    tween2: null,
  };

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (!this.custom.tween) {
      this.custom.tween = TweenMax.to(this.custom, 3, {
        button1: 50,
        ease: Power2.easeInOut,
      });
    }

    Canvas.ctx.beginPath();
    Canvas.ctx.fillStyle = 'green';
    Canvas.ctx.arc(
      this.custom.buttonPosition.x,
      this.custom.buttonPosition.y,
      this.custom.button1,
      0,
      Math.PI * 2,
      true,
    );
    Canvas.ctx.fill();
    Canvas.ctx.closePath();

    this.checkButtonIn(hand);
  }

  checkButtonIn(hand: Vector2) {
    if (!this.custom.tween2 && hand.distance(this.custom.buttonPosition) < this.custom.button1 + 30) {
      this.custom.tween2 = TweenMax.to(this.custom, 2, {
        button1: 0,
        ease: Elastic.easeIn,
        onComplete: () => {
          const x = Math.floor(Math.random() * window.innerWidth);
          const y = Math.floor(Math.random() * window.innerHeight);
          this.custom.buttonPosition = new Vector2(x, y);
          this.custom.tween = TweenMax.to(this.custom, 3, {
            button1: 50,
            ease: Power2.easeInOut,
            onComplete: () => {
              this.custom.tween2 = null;
            },
          });
        },
      });
    }
  }
}

export default new Scene1();
