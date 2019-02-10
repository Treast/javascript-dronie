import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import { TweenMax, Power2, Elastic } from "gsap";
import Canvas from "../core/Canvas";
import Tornado from "../objects/Tornado";
import SocketManager, { SocketTypes } from "../utils/SocketManager";
import Rect from "../utils/math/Rect";

class DroneMoveSimulation {
  static simulate(scene: any) {
    scene.onDroneMove({ x: 100, y: 300 });
    setTimeout(() => {
      scene.onDroneMove({ x: 600, y: 100 });
      setTimeout(() => {
        scene.onDroneMove({ x: 0, y: 600 });
        setTimeout(() => {
          scene.onDroneFloat();
        }, 1000);
      }, 1000);
    }, 1000);
  }
}

enum SceneState {
  TORNADO_SHOWING,
  TORNADO_FLOATING,
  WAIT_EXPLOSION
}

class Scene1 implements SceneInterface {
  private dronePosition: Vector2;
  private tornado: Tornado;
  private sceneState: SceneState = SceneState.TORNADO_SHOWING;
  private tornadoInteractionsCount = 0;

  constructor() {
    this.tornado = new Tornado();

    this.dronePosition = new Vector2(0, 0);

    this.addSocketEvents();

    DroneMoveSimulation.simulate(this);
  }

  private addSocketEvents() {
    SocketManager.on(SocketTypes.MOVE, this.onDroneMove.bind(this));
    SocketManager.on(SocketTypes.FLOAT, this.onDroneFloat.bind(this));
  }

  public onDroneFloat() {
    //@todo play float video
    this.sceneState = SceneState.TORNADO_FLOATING;
  }

  public onDroneMove(data: any) {
    let { x, y } = data;

    this.dronePosition.x = x;
    this.dronePosition.y = y;
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "white";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    switch (this.sceneState) {
      case SceneState.TORNADO_SHOWING:
        this.tornado.position.lerp(this.dronePosition, 0.2);
        this.tornado.render();
        break;
      case SceneState.TORNADO_FLOATING:
        if (this.checkTornadoIntersect(hand)) {
          this.tornadoInteractionsCount++;

          //@todo change video

          if (this.tornadoInteractionsCount === 3) {
            this.sceneState = SceneState.WAIT_EXPLOSION;
            //@todo emit socket to tell the drone to move
          }
        }
        this.tornado.render();
        break;
    }
  }

  private checkTornadoIntersect(hand: Vector2): Boolean {
    return new Rect({
      x: this.dronePosition.x,
      y: this.dronePosition.y,
      width: this.tornado.size.x,
      height: this.tornado.size.y
    }).contains(hand);
  }
}

export default new Scene1();
