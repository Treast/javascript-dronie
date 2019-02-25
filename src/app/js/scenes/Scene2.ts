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
import Hand, { HandColor } from '../core/Hand';
import DroneVideo from '../core/DroneVideo';
import State from '../utils/State';

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
  private videos: DroneVideo[] = [];
  private mouseMove: any;
  private mouseDown: any;

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
    this.mouseMove = this.onMouseMove.bind(this);
    this.mouseDown = this.onMouseDown.bind(this);
    this.switchScene();
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
    // this.tornado.explode();
  }

  switchScene() {
    this.tornado.animation.setCallback(() => {
      this.removeEvents();
      this.tornado.active = false;
      this.tornado.animation.video.setBounds(0, 0);
      Canvas.setScene(State.SCENE_3);
    });
  }

  private addEvents() {
    window.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mousemove', this.mouseMove);
  }

  private removeEvents() {
    SocketManager.off(SocketTypes.CLIENT_SCENE1_TAKEOFF, this.onDroneTakeoff.bind(this));

    SocketManager.off(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));
    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE1, this.onDroneSceneMove1.bind(this));
    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE2, this.onDroneSceneMove2.bind(this));

    SocketManager.off(SocketTypes.CLIENT_SCENE1_MOVE3, this.onDroneSceneMove3.bind(this));
    window.removeEventListener('mousedown', this.mouseDown);
    window.removeEventListener('mousemove', this.mouseMove);
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
    if (this.tornado.animation.video.isHandOver()) {
      this.tornadoInteractionsCount = SuperMath.clamp(this.tornadoInteractionsCount + 1, 0, 3);
      this.onTouchDrone();
    }
  }

  onMouseMove(e: any) {
    if (this.tornado.animation.video.isHandOver()) {
      Hand.setColor(HandColor.RED);
    } else {
      Hand.setColor(HandColor.NORMAL);
    }
  }

  onDroneDetect({ x = 0, y = 0 } = {}) {
    if (Perspective.hasMatrix()) {
      Perspective.computePoint(new Vector2(x, y)).then((point: number[]) => {
        const x = this.lerp(this.tornado.animation.video.position.x, point[0] * window.innerWidth, 0.1);
        const y = this.lerp(this.tornado.animation.video.position.y, point[1] * window.innerHeight, 0.1);
        this.tornado.animation.video.setPosition(x, y);
      });
    }
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  render() {
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (Configuration.useWebcamInteraction) {
      if (this.tornado.animation.video.isHandOver()) {
        Hand.setColor(HandColor.RED);
        if (this.interactionReady) {
          this.tornadoInteractionsCount = SuperMath.clamp(this.tornadoInteractionsCount + 1, 0, 3);
          this.onTouchDrone();
        }
      } else {
        Hand.setColor(HandColor.NORMAL);
      }
    }

    this.tornado.render();
  }

  private onTouchDrone() {
    this.tornado.animation.advance();

    SocketManager.emit(this.interactions[this.tornadoInteractionsCount].event);
    AudioManager.get(`touch${this.tornadoInteractionsCount}`).play();
  }
}

export default Scene2;
