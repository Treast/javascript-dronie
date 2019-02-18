import { SceneInterface } from './SceneInterface';
import Canvas from '../core/Canvas';
import { Vector2 } from '../utils/Vector2';
import Toudou from '../objects/Toudou';

class Scene3 implements SceneInterface {
  private toudou: Toudou;

  constructor() {
    this.toudou = new Toudou();
  }
  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'green';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.toudou.render();
  }

  onStart() {}

  onDestroy() {}
}
export default Scene3;
