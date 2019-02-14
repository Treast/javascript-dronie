import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import { TweenMax, Power2, Elastic } from "gsap";
import Canvas from "../core/Canvas";
import Tornado from "../objects/Tornado";
import SocketManager, { SocketTypes } from "../utils/SocketManager";
import Rect from "../utils/math/Rect";
import SuperMath from "../utils/math/SuperMath";

enum SceneState {
  TORNADO_SHOWING,
  TORNADO_FLOATING,
  WAIT_EXPLOSION
}

class Scene2 implements SceneInterface {
  private dronePosition: Vector2;
  private tornado: Tornado;
  private sceneState: SceneState = SceneState.TORNADO_SHOWING;
  private tornadoInteractionsCount = 0;
  private interactionReady: Boolean = false;

  private interactions: any = {
    1: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE1,
      video: require("../../videos/tornadoInteraction1.webm")
    },
    2: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE2,
      video: require("../../videos/tornadoInteraction2.webm")
    },
    3: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE3
    }
  };

  constructor() {
    this.tornado = new Tornado();

    this.dronePosition = new Vector2(0, 0);

    this.addSocketEvents();
  }

  onDestroy() {
    console.log("on destroy 2");
  }
  onStart() {
    SocketManager.emit(SocketTypes.DRONE_SCENE1_TAKEOFF);
  }

  private addSocketEvents() {
    SocketManager.on(
      SocketTypes.CLIENT_SCENE1_TAKEOFF,
      this.onDroneTakeoff.bind(this)
    );

    SocketManager.on(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));
    SocketManager.on(
      SocketTypes.DRONE_SCENE1_MOVE1,
      this.onDroneSceneMove1.bind(this)
    );
    SocketManager.on(
      SocketTypes.DRONE_SCENE1_MOVE2,
      this.onDroneSceneMove2.bind(this)
    );

    SocketManager.on(
      SocketTypes.DRONE_SCENE1_MOVE3,
      this.onDroneSceneMove3.bind(this)
    );
  }

  public onDroneTakeoff() {
    this.interactionReady = true;
  }

  private onDroneSceneMove1() {
    this.interactionReady = true;
  }

  private onDroneSceneMove2() {
    this.interactionReady = true;
  }

  private onDroneSceneMove3() {
    this.tornado.explode();
  }

  private onDroneDetect({ x = 0, y = 0 } = {}) {
    this.dronePosition.x = x;
    this.dronePosition.y = y;
  }
  public onDroneMove(data: any) {
    let { x, y } = data;

    this.dronePosition.x = x;
    this.dronePosition.y = y;
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "white";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.tornado.position.lerp(this.dronePosition, 0.2);
    if (this.interactionReady && this.checkTornadoIntersect(hand)) {
      this.tornadoInteractionsCount = SuperMath.clamp(
        this.tornadoInteractionsCount + 1,
        0,
        3
      );
      this.onTouchDrone();
    }
    this.tornado.render();
  }

  private onTouchDrone() {
    if (this.interactions[this.tornadoInteractionsCount].triggered) return;
    this.interactions[this.tornadoInteractionsCount].triggered = true;

    this.tornado.makeVideoTransition(
      this.interactions[this.tornadoInteractionsCount].video
    );

    this.interactionReady = false;

    SocketManager.emit(this.interactions[this.tornadoInteractionsCount].event);
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

export default Scene2;
