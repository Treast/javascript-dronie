import { SceneInterface } from './SceneInterface';
import Canvas from '../core/Canvas';
import { Vector2 } from '../utils/Vector2';
import DroneVideo from '../core/DroneVideo';
import { TweenMax, Elastic, Ease, Power2 } from 'gsap';
import Rect from '../utils/math/Rect';
import Animation from '../core/Animation';
import SocketManager, { SocketTypes } from '../utils/SocketManager';
import Perspective from '../utils/Perspective';
import Configuration from '../utils/Configuration';
// @ts-ignore
require('../utils/gsap/ease/CustomEase');

interface CustomEase {
  create(id: string, data: string): CustomEase;
  get(id: string): CustomEase;
  getRatio(progress: number): CustomEase;
}

declare var CustomEase: CustomEase;

class Scene3 implements SceneInterface {
  private toudou: DroneVideo;
  private formeFin: DroneVideo;
  private forme1: DroneVideo;
  private forme2: DroneVideo;
  private toudouTo1: DroneVideo;
  private forme1To2: DroneVideo;
  private forme2To1: DroneVideo;
  private alpha: number = 1.0;
  private position: Vector2;
  private animation: Animation;

  private magnetPosition: Vector2;
  private magnet = {
    active: false,
    size: 0,
    bounds: new Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
    isInteractive: false,
    hoverInTriggered: false,
    hoverOutTriggered: false,
    tween: null as any,
    id: 1,
    video: null as Animation,
    normalVideo: null as DroneVideo,
    hoverVideo: null as DroneVideo,
  };

  private slider = {
    active: false,
    destination: new Vector2(0.9 * window.innerWidth, 0.2 * window.innerHeight),
    origin: new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
    percent: 0,
    video: null as DroneVideo,
    currentPosition: new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
  };

  private button = {
    id: 1,
    active: false,
    radius: 0,
    position: new Vector2(0.3 * window.innerWidth, 0.5 * window.innerHeight),
    hoverInTriggered: false,
    videos: [] as DroneVideo[],
  };

  private final = {
    active: false,
    alpha: 0,
    triggered: false,
    bounds: new Rect({
      x: 0,
      y: 0,
      width: 60,
      height: 60,
    }),
  };

  constructor() {
    this.position = new Vector2(window.innerWidth / 2, 0);
    this.toudou = new DroneVideo('timide', true, new Vector2(200, 200));
    this.toudou.setPoster('6_timide.mov');
    this.formeFin = new DroneVideo('formeFin', true, new Vector2(200, 200));
    this.forme1 = new DroneVideo('droneCouleur1', true, new Vector2(200, 200));
    this.forme2 = new DroneVideo('droneCouleur2', true, new Vector2(200, 200));
    this.toudouTo1 = new DroneVideo('droneToudouTo1', false, new Vector2(200, 200));
    this.forme1To2 = new DroneVideo('droneTransition12', false, new Vector2(200, 200));
    this.forme2To1 = new DroneVideo('droneTransition21', false, new Vector2(200, 200));
    this.toudouTo1.setScale(0.4);
    this.forme1.setScale(0.4);
    this.forme2.setScale(0.4);

    this.animation = new Animation(this.toudou, this.toudouTo1, this.forme1, this.forme1To2, this.forme2, this.forme2To1, this.forme1);

    this.animation.video.play();
    // this.animation.video.setPosition(this.position.x, this.position.y);
    SocketManager.on(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));
    /** Magnet */
    this.magnet.normalVideo = new DroneVideo('boutonAimente', true, null);
    this.magnet.normalVideo.setPoster('Bouton1_2');
    this.magnet.normalVideo.setScale(0);
    this.magnet.normalVideo.setPosition(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.magnet.normalVideo.play();
    /** Magnet Hover */
    this.magnet.hoverVideo = new DroneVideo('boutonAimenteClique', false, null);
    this.magnet.hoverVideo.setPoster('Bouton1_2');
    this.magnet.hoverVideo.setScale(0.25);
    this.magnet.hoverVideo.setPosition(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.magnet.hoverVideo.setLoop(false);
    this.magnet.hoverVideo.pause();
    this.magnet.video = new Animation(this.magnet.normalVideo, this.magnet.hoverVideo);
    /** Slider */
    this.slider.video = new DroneVideo('slider15');
    this.slider.video.setScale(1.1);
    const sliderPositionX = Math.abs(this.slider.destination.x - this.slider.origin.x) / 2;
    const sliderPositionY = Math.abs(this.slider.destination.y - this.slider.origin.y) / 2 + 165;
    const angle = this.slider.destination.angle(this.slider.origin);
    this.slider.video.rotation = -angle / 2;
    this.slider.video.setPosition(sliderPositionX, sliderPositionY);
    this.slider.video.pause();
    /** Buttons */
    const button1 = new DroneVideo('boutonCouleur1', true, new Vector2(80, 80));
    button1.setScale(0);
    button1.setPosition(0.3 * window.innerWidth, 0.5 * window.innerHeight);
    button1.play();
    const button2 = new DroneVideo('boutonCouleur2', true, new Vector2(80, 80));
    button2.setScale(0);
    button2.setPosition(0.6 * window.innerWidth, 0.2 * window.innerHeight);
    button2.play();
    const button3 = new DroneVideo('boutonCouleur1', true, new Vector2(80, 80));
    button3.setScale(0);
    button3.setPosition(0.1 * window.innerWidth, 0.4 * window.innerHeight);
    button3.play();
    this.button.videos.push(button1);
    this.button.videos.push(button2);
    this.button.videos.push(button3);
    /* window.addEventListener('mousedown', () => {
      this.animation.advance()
    }) */
    this.setupSocketListeners();
    SocketManager.emit(SocketTypes.DRONE_SCENE2_MOVE1);
  }

  goToMiddleLeft() {
    TweenMax.to(this.position, 3, {
      x: 0,
      y: window.innerHeight / 2,
      onUpdate: () => {
        this.animation.video.setPosition(this.position.x, this.position.y);
      },
      onComplete: () => {
        this.createMagnet1();
      },
    });
  }

  createMagnet1() {
    this.magnet.active = true;
    this.magnetPosition = new Vector2(0.8 * window.innerWidth, 0.6 * window.innerHeight);
    this.onMagnetCreated();
  }

  createMagnet2() {
    TweenMax.to(this.magnet.video.video.scale, 1, {
      x: 0,
      y: 0,
      onComplete: () => {
        this.magnet.id = 2;
        this.magnetPosition = new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight);
        this.magnet.video.reset();
        this.magnet.video.video.setPosition(0.1 * window.innerWidth, 0.8 * window.innerHeight);
        this.onMagnetCreated();
      },
    });
  }

  onMagnetCreated() {
    TweenMax.to(this.magnet.video.video.scale, 1, {
      x: 0.25,
      y: 0.25,
      ease: Elastic.easeOut,
      onComplete: () => {
        this.magnet.video.video.setBounds(null, null);
        this.onMagnetAppeared();
      },
      onStart: () => {
        this.magnet.video.video.play();
        this.magnet.isInteractive = true;
      },
    });
  }

  setListenerOnMagnet() {
    // this.attractDrone();
    window.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });
    window.addEventListener('mousedown', (e) => {
      this.onMouseDown(e);
    });
  }

  onMouseDown(e: MouseEvent) {}

  getDistanceFromMouseToSlider(mouse: Vector2) {
    // const mouseStep = new Vector2(mouseX, mouseY);
    const mouseStep = mouse.clone();
    const A = this.slider.origin;
    const B = this.slider.destination;
    const BA = this.slider.destination.clone().substract(A);
    const m = (B.y - A.y) / (B.x - A.x);
    const p = A.y - m * A.x;
    const d1 = m * mouseStep.x - 1 * mouseStep.y + p;
    const d2 = Math.sqrt(Math.pow(m, 2) + 1);
    // console.log('Distance', Math.abs(d1 / d2));
    const distance = Math.abs(d1 / d2);
    const percent = mouseStep.distance(A) / B.distance(A);
    // TODO: Va foirer
    // const relativeDistance = this.animation.video.position.distance(mouse);
    const position = this.slider.origin.clone().add(BA.multiply(this.slider.percent).multiply(1 / 0.9));
    this.slider.currentPosition = position;
    const relativeDistance = position.distance(mouseStep);
    // if (relativeDistance < 50 && percent > this.slider.percent && percent >= 0 && percent <= 1)

    // Si on se trouve du bon côté du slider
    if (
      mouseStep.x > this.slider.origin.x &&
      relativeDistance < 0.15 * window.innerWidth &&
      percent > this.slider.percent &&
      percent >= 0
    ) {
      this.slider.percent = Math.min(percent, 1);
      const numberOfFrames = this.slider.video.video.duration;
      const currentFrame = percent * numberOfFrames;
      this.slider.video.video.currentTime = currentFrame;
      const position = this.slider.origin.clone().add(BA.multiply(percent));
      // this.animation.video.setPosition(position.x, position.y);
      SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, { value: percent });
    }

    if (this.slider.active && this.slider.percent >= 0.9) {
      SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1, { value: 1 });
      this.slider.active = false;
      this.button.active = true;
      this.setButton();
    }
  }

  onDroneDetect({ x = 0, y = 0 } = {}) {
    if (Perspective.hasMatrix()) {
      Perspective.computePoint(new Vector2(x, y)).then((point: number[]) => {
        const x = this.lerp(this.animation.video.position.x, point[0] * window.innerWidth, 0.1);
        const y = this.lerp(this.animation.video.position.y, point[1] * window.innerHeight, 0.1);
        this.animation.video.setPosition(x, y);
      });
    }
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  setButton() {
    TweenMax.to(this.button.videos[this.button.id - 1].scale, 1, {
      x: 0.2,
      y: 0.2,
      ease: Elastic.easeOut,
      onStart: () => {
        this.button.videos[this.button.id - 1].setBounds(80, 80);
      },
    });
  }

  attractDrone() {
    this.magnet.tween = TweenMax.to(this.position, 3, {
      x: this.magnetPosition.x,
      y: this.magnetPosition.y,
      // @ts-ignore
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.46,0 0.484,0.168 0.572,0.274 0.652,0.371 0.754,0.804 0.834,1 0.858,1.06 0.918,0.982 0.952,0.982 0.976,0.982 0.997,0.989 1,1',
      ),
      onUpdate: () => {
        this.animation.video.setPosition(this.position.x, this.position.y);
      },
      onComplete: () => {
        if (this.magnet.id === 1) {
          this.magnet.video.video.setBounds(0, 0);
          this.createMagnet2();
        } else {
          this.magnet.video.video.setBounds(0, 0);
        }
      },
    }).pause();
  }

  generateSlider() {
    console.log('Generating slider');
    this.slider.origin = this.animation.video.position;
    this.slider.currentPosition = this.animation.video.position;
    this.magnet.active = false;
    this.slider.active = true;

    Perspective.computeInversePoint(this.slider.destination).then((point) => {
      SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1_INIT, { x: point[0] || 0, y: point[1] || 0 });
    });
  }

  checkIntersections(x: number, y: number) {
    if (this.magnet.active) {
      if (this.magnet.video.video.isHandOver()) {
        if (!this.magnet.hoverInTriggered) {
          document.body.style.cursor = 'pointer';
          this.magnet.isInteractive = false;
          this.magnet.hoverInTriggered = true;
          this.magnet.hoverOutTriggered = false;
          this.magnet.video.advance();
          // this.magnet.tween.play();
          switch (this.magnet.id) {
            case 1:
              Perspective.computeInversePoint(this.magnet.video.video.position).then((point) => {
                SocketManager.emit(SocketTypes.DRONE_SCENE2_MAGNET1_HOVER, { x: point[0] || 0, y: point[1] || 0 });
              });
              break;
            case 2:
              Perspective.computeInversePoint(this.magnet.video.video.position).then((point) => {
                SocketManager.emit(SocketTypes.DRONE_SCENE2_MAGNET2_HOVER, { x: point[0] || 0, y: point[1] || 0 });
              });
              break;
          }
        }
      } else {
        document.body.style.cursor = 'default';
        if (!this.magnet.hoverOutTriggered) {
          this.magnet.hoverInTriggered = false;
          this.magnet.hoverOutTriggered = true;
          console.log('Magnet out');
          switch (this.magnet.id) {
            case 1:
              SocketManager.emit(SocketTypes.DRONE_SCENE2_MAGNET1_OUT);
              break;
            case 2:
              SocketManager.emit(SocketTypes.DRONE_SCENE2_MAGNET2_OUT);
              break;
          }
        }
        // this.magnet.tween.pause();
      }
    } else if (this.slider.active) {
      this.getDistanceFromMouseToSlider(new Vector2(x, y));
    } else if (this.button.active) {
      if (this.button.videos[this.button.id - 1].isHandOver()) {
        document.body.style.cursor = 'pointer';
        if (this.button.hoverInTriggered) {
          return;
        }
        this.onButtonHoverIn();
      } else {
        document.body.style.cursor = 'default';
      }
    } else if (this.final.active) {
      if (this.animation.video.isHandOver()) {
        if (!this.final.triggered) {
          this.final.triggered = true;
          SocketManager.emit(SocketTypes.DRONE_SCENE3_BUTTON1);
          document.body.style.cursor = 'pointer';
          this.onFinalHover();
        }
      } else {
        document.body.style.cursor = 'default';
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    const { x, y } = e;
    this.checkIntersections(x, y);
  }

  onFinalHover() {
    TweenMax.to(this.final, 3, {
      alpha: 1,
    });
  }

  onButtonHoverIn() {
    if (!this.button.hoverInTriggered) {
      this.button.hoverInTriggered = true;
      this.animation.advance();

      switch (this.button.id) {
        case 1:
          Perspective.computeInversePoint(this.button.videos[this.button.id - 1].position).then((point) => {
            SocketManager.emit(SocketTypes.DRONE_SCENE2_BUTTON1, { x: point[0] || 0, y: point[1] || 0 });
          });
          break;
        case 2:
          Perspective.computeInversePoint(this.button.videos[this.button.id - 1].position).then((point) => {
            SocketManager.emit(SocketTypes.DRONE_SCENE2_BUTTON2, { x: point[0] || 0, y: point[1] || 0 });
          });
          break;
        case 3:
          Perspective.computeInversePoint(this.button.videos[this.button.id - 1].position).then((point) => {
            SocketManager.emit(SocketTypes.DRONE_SCENE2_BUTTON3, { x: point[0] || 0, y: point[1] || 0 });
          });
          break;
      }
    }
  }

  setupSocketListeners() {
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MOVE1, () => this.createMagnet1());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET1_END, () => this.createMagnet2());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET2_END, () => this.generateSlider());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON1, () => this.popButton());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON2, () => this.popButton());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON3, () => this.changeFormeToFinal());
  }

  popButton() {
    TweenMax.to(this.button.videos[this.button.id - 1].scale, 0.5, {
      x: 0,
      y: 0,
      ease: Power2.easeOut,
      delay: 1.5,
      onComplete: () => {
        this.button.hoverInTriggered = false;
        if (this.button.id < 3) {
          this.button.id += 1;
          this.button.position.x = Math.random() * window.innerWidth;
          this.button.position.y = Math.random() * window.innerHeight;
          this.setButton();
        } else {
          this.fallButton();
        }
      },
    });
  }

  changeFormeToFinal() {
    this.animation.video = this.formeFin.clone();
    this.animation.video.play();
    this.animation.video.boundsOffset = new Vector2(30, 30);
    this.animation.video.setBounds(this.animation.video.bounds.width, this.animation.video.bounds.height);
    this.final.active = true;
    this.button.active = false;
  }

  fallButton() {
    this.button.active = false;
    this.button.videos[this.button.id - 1].setBounds(0, 0);
  }

  onMagnetAppeared() {
    this.setListenerOnMagnet();
  }

  render(hand: Vector2) {
    Canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (Configuration.useWebcamInteraction) {
      this.checkIntersections(hand.x, hand.y);
    }

    if (this.magnet.active) {
      this.magnet.video.video.bounds.render();
      this.magnet.video.video.render();
    }

    if (this.slider.active) {
      console.log('Slider');
      Canvas.ctx.fillStyle = '#00FF00';
      Canvas.ctx.beginPath();
      Canvas.ctx.moveTo(this.slider.currentPosition.x, this.slider.currentPosition.y);
      Canvas.ctx.lineTo(this.slider.destination.x, this.slider.destination.y);
      Canvas.ctx.stroke();
      // this.slider.video.render();
    }

    if (this.button.active) {
      this.button.videos[this.button.id - 1].render();
      this.button.videos[this.button.id - 1].bounds.render();
    }

    if (this.final.active) {
      Canvas.ctx.fillStyle = `rgba(0, 255, 0, ${this.final.alpha})`;
      Canvas.ctx.font = '36px Comic Sans MS';
      Canvas.ctx.fillText('Et maintenant, tends moi la main !', 0.2 * window.innerWidth, 0.2 * window.innerHeight);
    }

    this.animation.video.render();
    this.animation.video.bounds.render();
  }

  onStart() {}

  onDestroy() {}
}
export default Scene3;
