import { SceneInterface } from './SceneInterface';
import { Vector2 } from '../utils/Vector2';
import { TweenMax, Power2, Elastic, TweenLite, Circ, Power4 } from 'gsap';
import Canvas from '../core/Canvas';
import Tornado from '../objects/Tornado';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import Rect from '../utils/math/Rect';
import SuperMath from '../utils/math/SuperMath';
import Configuration from '../utils/Configuration';
import VideoLoader from '../utils/VideoLoader';
import AudioManager from '../utils/AudioManager';
import Perspective from '../utils/Perspective';

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
            },         1000);
          },         1000);
        },         1000);
      },         1000);
    },         1000);
  },         1000);
}

class Scene2 implements SceneInterface {
  private dronePosition: Vector2;
  private tornado: Tornado;
  private tornadoInteractionsCount = 0;
  private interactionReady: Boolean = false;
  private tornadoReady: Boolean = false;

  private interactions: any = {
    1: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE1,
    },
    2: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE2,
    },
    3: {
      triggered: false,
      event: SocketTypes.DRONE_SCENE1_MOVE3,
    },
  };

  constructor() {
    this.tornado = new Tornado();

    this.dronePosition = new Vector2(0, 0);
    this.tornado.position.x = window.innerWidth / 2;
    this.tornado.position.y = window.innerHeight / 2 + 1080 / 2;

    this.dronePosition.x = this.tornado.position.x;
    this.dronePosition.y = window.innerHeight / 2 + 100;
  }

  onDestroy() {
    this.removeEvents();
  }
  onStart() {
    SocketManager.emit(SocketTypes.DRONE_SCENE1_TAKEOFF);

    this.addSocketEvents();
    this.addEvents();
    this.animateInTornado();
    // simulate(this);
  }

  private addSocketEvents() {
    SocketManager.on(SocketTypes.CLIENT_SCENE1_TAKEOFF, this.onDroneTakeoff.bind(this));

    SocketManager.on(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));
    SocketManager.on(SocketTypes.CLIENT_SCENE1_MOVE1, this.onDroneSceneMove1.bind(this));
    SocketManager.on(SocketTypes.CLIENT_SCENE1_MOVE2, this.onDroneSceneMove2.bind(this));

    SocketManager.on(SocketTypes.CLIENT_SCENE1_MOVE3, this.onDroneSceneMove3.bind(this));
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
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private removeEvents() {
    SocketManager.off(SocketTypes.CLIENT_SCENE1_TAKEOFF, this.onDroneTakeoff.bind(this));

    SocketManager.off(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));
    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE1, this.onDroneSceneMove1.bind(this));
    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE2, this.onDroneSceneMove2.bind(this));

    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE3, this.onDroneSceneMove3.bind(this));
    window.removeEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private animateInTornado() {
    TweenLite.to(this.tornado.position, 1, {
      y: window.innerHeight / 2 + 100,
      ease: Power4.easeOut,
      onComplete: () => {
        this.tornadoReady = true;
      },
    });
  }

  onMouseDown(e: any) {
    const { x, y } = e;
    if (
      new Rect({
        x: this.dronePosition.x - this.tornado.size.x / 2,
        y: this.dronePosition.y - this.tornado.size.y / 2,
        width: this.tornado.size.x,
        height: this.tornado.size.y,
      }).contains({ x, y })
    ) {
      this.tornadoInteractionsCount = SuperMath.clamp(this.tornadoInteractionsCount + 1, 0, 3);
      this.onTouchDrone();
    }
  }

  onDroneDetect({ x = 0, y = 0 } = {}) {
    if (Perspective.hasMatrix()) {
      Perspective.computePoint(new Vector2(x, y)).then((point: number[]) => {
        this.dronePosition.x = this.lerp(this.dronePosition.x, point[0] * window.innerWidth, 0.1);
        this.dronePosition.y = this.lerp(this.dronePosition.y, point[1] * window.innerHeight, 0.1);
      });
    }
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  render(hand: Vector2) {
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    /* Canvas.ctx.strokeStyle = "red";

    Canvas.ctx.strokeRect(
      this.dronePosition.x - this.tornado.size.x / 2,
      this.dronePosition.y - this.tornado.size.y / 2,
      this.tornado.size.x,
      this.tornado.size.y
    ); */

    if (this.tornadoReady) {
      this.tornado.position.lerp(this.dronePosition, 0.2);
    }

    if (Configuration.useWebcamInteraction) {
      if (this.interactionReady && this.checkTornadoIntersect(hand)) {
        this.tornadoInteractionsCount = SuperMath.clamp(this.tornadoInteractionsCount + 1, 0, 3);
        this.onTouchDrone();
      }
    }

    this.tornado.render();
  }

  private onTouchDrone() {
    if (this.interactions[this.tornadoInteractionsCount].triggered) return;
    this.interactions[this.tornadoInteractionsCount].triggered = true;

    this.tornado.makeVideoTransition(this.tornadoInteractionsCount);

    this.interactionReady = false;

    SocketManager.emit(this.interactions[this.tornadoInteractionsCount].event);
    AudioManager.get(`touch${this.tornadoInteractionsCount}`).play();
  }

  private checkTornadoIntersect(hand: Vector2): Boolean {
    return new Rect({
      x: this.dronePosition.x - this.tornado.size.x / 2,
      y: this.dronePosition.y - this.tornado.size.y / 2,
      width: this.tornado.size.x,
      height: this.tornado.size.y,
    }).contains(hand);
  }
}

export default Scene2;
