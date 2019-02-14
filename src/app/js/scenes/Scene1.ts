import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import { TweenMax, Power2 } from "gsap";
import Canvas from "../core/Canvas";
import State from "../utils/State";
import CircleButton from "../objects/CircleButton";

class Scene1 implements SceneInterface {
  private circleButton: CircleButton = new CircleButton();

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "black";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.circleButton.render();
  }

  onDestroy() {
    console.log("on destroy 1");
    this.circleButton.destroy();
  }
  onStart() {
    console.log("on start scene 1");
  }
}

export default Scene1;
