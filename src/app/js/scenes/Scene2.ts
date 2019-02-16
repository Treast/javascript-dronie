import { SceneInterface } from "./SceneInterface";
import { Vector2 } from "../utils/Vector2";
import { TweenMax, Power2, Elastic } from "gsap";
import Canvas from "../core/Canvas";
import Tornado from "../objects/Tornado";
import SocketManager, { SocketTypes } from "../utils/SocketManager";
import Rect from "../utils/math/Rect";
import SuperMath from "../utils/math/SuperMath";
import Configuration from "../utils/Configuration";

enum SceneState {
  TORNADO_SHOWING,
  TORNADO_FLOATING,
  WAIT_EXPLOSION
}

function simulate(scene: Scene2) {
  scene.onDroneDetect({ x: 200, y: 30 });
  setTimeout(() => {
    scene.onDroneDetect({ x: 0, y: 330 });
    setTimeout(() => {
      scene.onDroneDetect({ x: 800, y: 10 });
      setTimeout(() => {
        scene.onDroneDetect({ x: 500, y: 500 });
        setTimeout(() => {
          scene.onMouseDown({ x: 501, y: 501 });
          scene.onDroneDetect({ x: 200, y: 700 });
          setTimeout(() => {
            scene.onMouseDown({ x: 201, y: 701 });
            setTimeout(() => {
              scene.onDroneSceneMove3();
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
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
      video: require("../../videos/tornadoInteraction1.webm")
    },
    3: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE3
    }
  };

  constructor() {
    this.tornado = new Tornado();

    this.dronePosition = new Vector2(0, 0);
  }

  onDestroy() {
    console.log("on destroy 2");
  }
  onStart() {
    SocketManager.emit(SocketTypes.DRONE_SCENE1_TAKEOFF);

    this.addSocketEvents();
    this.addEvents();
    //simulate(this);
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

  onDroneSceneMove3() {
    this.tornado.explode();
  }

  private addEvents() {
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
  }

  private removeEvents() {
    window.removeEventListener("mousedown", this.onMouseDown.bind(this));
  }

  onMouseDown(e: any) {
    const { x, y } = e;
    if (
      new Rect({
        x: this.dronePosition.x,
        y: this.dronePosition.y,
        width: this.tornado.size.x,
        height: this.tornado.size.y
      }).contains({ x, y })
    ) {
      this.tornadoInteractionsCount = SuperMath.clamp(
        this.tornadoInteractionsCount + 1,
        0,
        3
      );
      this.onTouchDrone();
    }
  }

  onDroneDetect({ x = 0, y = 0 } = {}) {
    this.dronePosition.x = x * window.innerWidth;
    this.dronePosition.y = y * window.innerHeight;
    console.log(this.dronePosition);
  }
  public onDroneMove(data: any) {
    let { x, y } = data;

    this.dronePosition.x = x;
    this.dronePosition.y = y;
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = "white";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.tornado.position.copy(this.dronePosition);
    //this.tornado.position.lerp(this.dronePosition, 0.2);

    if (Configuration.useWebcamInteraction) {
      if (this.interactionReady && this.checkTornadoIntersect(hand)) {
        this.tornadoInteractionsCount = SuperMath.clamp(
          this.tornadoInteractionsCount + 1,
          0,
          3
        );
        this.onTouchDrone();
      }
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
