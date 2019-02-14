import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import Canvas from "../core/Canvas";
import CircleButton from "../objects/CircleButton";

class Scene1 implements SceneInterface {
  private circleButton: CircleButton = new CircleButton();

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "black";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.circleButton.render(hand);
  }

  onDestroy() {
    this.circleButton.destroy();
  }
  onStart() {}
}

export default Scene1;
