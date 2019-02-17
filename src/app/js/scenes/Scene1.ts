import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import Canvas from "../core/Canvas";
import CircleButton from "../objects/CircleButton";
import SocketManager, { SocketTypes } from "../utils/SocketManager";
import Perspective from "../utils/Perspective";

class Scene1 implements SceneInterface {
  private circleButton: CircleButton = new CircleButton();

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "black";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.circleButton.render(hand);
  }

  private addSocketEvents() {
    SocketManager.on(SocketTypes.DRONE_CALIBRATE, this.onCalibrate.bind(this));
  }

  private onCalibrate({ x = 0, y = 0 }) {
    Perspective.addCorners(new Vector2(x, y));
  }

  onDestroy() {
    this.circleButton.destroy();
  }
  onStart() {
    this.addSocketEvents();
  }
}

export default Scene1;
