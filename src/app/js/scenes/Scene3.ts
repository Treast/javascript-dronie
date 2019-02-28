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
import Magnet from '../objects/Magnet';
import Button from '../objects/Button';
import ColorButton from '../objects/ColorButton';
import Slider from '../objects/Slider';
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
  private animation: Animation;

  private joueurAttente: DroneVideo;
  private joueurBleu: DroneVideo;
  private joueurOrange: DroneVideo;
  private joueurRose: DroneVideo;
  private joueurRoseFonce: DroneVideo;

  private magnet = {
    active: false,
    magnet: null as Magnet,
  };

  private magnet1: Magnet;
  private magnet2: Magnet;

  private colorButton1: ColorButton;
  private colorButton2: ColorButton;
  private colorButton3: ColorButton;
  private colorButton4: ColorButton;

  private colorButtons: ColorButton[] = [];

  private button = {
    active: false,
  };

  private slider = {
    active: false,
    destination: new Vector2(0.9 * window.innerWidth, 0.2 * window.innerHeight),
    origin: new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
    percent: 0,
    video: null as DroneVideo,
    currentPosition: new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
  };

  private sliderO: Slider;

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

    /**
     * Joueurs
     */
    this.joueurAttente = new DroneVideo('joueurAttente', true, new Vector2(200, 200));
    this.joueurBleu = new DroneVideo('joueurBleu', true, new Vector2(200, 200));
    this.joueurOrange = new DroneVideo('joueurOrange', true, new Vector2(200, 200));
    this.joueurRose = new DroneVideo('joueurRose', true, new Vector2(200, 200));
    this.joueurRoseFonce = new DroneVideo('joueurRoseFonce', true, new Vector2(200, 200));

    this.joueurBleu.setScale(0.5);
    this.joueurOrange.setScale(0.5);
    this.joueurRose.setScale(0.5);
    this.joueurRoseFonce.setScale(0.5);

    this.animation = new Animation(
      this.toudou,
      this.toudouTo1,
      this.forme1,
      this.forme1To2,
      this.forme2,
      this.forme2To1,
      this.forme1,
      this.joueurAttente,
      this.joueurBleu,
      this.joueurAttente,
      this.joueurOrange,
      this.joueurAttente,
      this.joueurRose,
      this.joueurAttente,
      this.joueurRoseFonce,
    );

    this.animation.setVideo(7);
    this.animation.video.play();

    /**
     * Slider
     */
    this.sliderO = new Slider();
    this.sliderO.setCallback(() => {
      this.slider.active = false;
      this.button.active = true;
      // this.button1.scaleUp();
      this.colorButton1.run();
    });
    this.slider.active = true;

    SocketManager.on(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));

    this.magnet1 = new Magnet(new Vector2(0.8 * window.innerWidth, 0.6 * window.innerHeight));
    this.magnet2 = new Magnet(new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight));
    this.magnet.magnet = this.magnet1;

    this.colorButton1 = new ColorButton(
      'rose',
      new Vector2(0.3 * window.innerWidth, 0.5 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON1,
    );
    this.colorButton2 = new ColorButton(
      'bleu',
      new Vector2(0.6 * window.innerWidth, 0.2 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON2,
    );
    this.colorButton3 = new ColorButton(
      'orange',
      new Vector2(0.1 * window.innerWidth, 0.4 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON3,
    );
    this.colorButton4 = new ColorButton(
      'roseFonce',
      new Vector2(0.8 * window.innerWidth, 0.7 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON4,
    );

    this.colorButtons.push(this.colorButton1);
    this.colorButtons.push(this.colorButton2);
    this.colorButtons.push(this.colorButton3);
    this.colorButtons.push(this.colorButton4);

    /** Slider */
    // this.slider.video = new DroneVideo('slider15');
    // this.slider.video.setScale(1.1);
    // const sliderPositionX = Math.abs(this.slider.destination.x - this.slider.origin.x) / 2;
    // const sliderPositionY = Math.abs(this.slider.destination.y - this.slider.origin.y) / 2 + 165;
    // const angle = this.slider.destination.angle(this.slider.origin);
    // this.slider.video.rotation = -angle / 2;
    // this.slider.video.setPosition(sliderPositionX, sliderPositionY);
    // this.slider.video.pause();

    this.setupSocketListeners();
    SocketManager.emit(SocketTypes.DRONE_SCENE2_MOVE1);
    this.setListeners();
  }

  setListeners() {
    window.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });
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
      if (this.magnet1.isInteractive && this.magnet1.isHandOver()) {
        document.body.style.cursor = 'pointer';
        this.magnet1.isInteractive = false;
        this.magnet1.trigger();
      }
      if (this.magnet2.isInteractive && this.magnet2.isHandOver()) {
        document.body.style.cursor = 'pointer';
        this.magnet2.isInteractive = false;
        this.magnet2.trigger();
      }
    } else if (this.slider.active) {
      this.sliderO.getDistanceFromMouseToSlider(new Vector2(x, y));
    } else if (this.button.active) {
      this.colorButtons.forEach((colorButton) => {
        if (colorButton.isHandOver()) {
          this.animation.advance();
          colorButton.stop();
        }
      });
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

  setupSocketListeners() {
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MOVE1, () => {
      this.magnet.active = true;
      this.magnet1.scaleUp();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET1_END, () => {
      this.magnet.magnet = this.magnet2;
      this.magnet2.scaleUp();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET2_END, () => this.generateSlider());
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON1, () => {
      this.colorButton2.run();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON2, () => {
      this.colorButton3.run();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON3, () => this.changeFormeToFinal());
  }

  changeFormeToFinal() {
    this.animation.video = this.formeFin.clone();
    this.animation.video.play();
    this.animation.video.boundsOffset = new Vector2(30, 30);
    this.animation.video.setBounds(this.animation.video.bounds.width, this.animation.video.bounds.height);
    this.final.active = true;
    this.button.active = false;
  }

  onMagnetAppeared() {}

  render(hand: Vector2) {
    Canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    Canvas.ctx.fillStyle = 'white';
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (Configuration.useWebcamInteraction) {
      this.checkIntersections(hand.x, hand.y);
    }

    if (this.magnet.active) {
      this.magnet.magnet.render();
    }

    if (this.slider.active) {
      // Canvas.ctx.fillStyle = '#00FF00';
      // Canvas.ctx.beginPath();
      // Canvas.ctx.moveTo(this.slider.currentPosition.x, this.slider.currentPosition.y);
      // Canvas.ctx.lineTo(this.slider.destination.x, this.slider.destination.y);
      // Canvas.ctx.stroke();
    }

    if (this.button.active) {
      this.colorButtons.forEach((colorButton) => {
        colorButton.render();
      });
    }

    if (this.final.active) {
      Canvas.ctx.fillStyle = `rgba(0, 255, 0, ${this.final.alpha})`;
      Canvas.ctx.font = '36px Comic Sans MS';
      Canvas.ctx.fillText('Et maintenant, tends moi la main !', 0.2 * window.innerWidth, 0.2 * window.innerHeight);
    }

    this.sliderO.render();
    // this.animation.video.render();
    // this.animation.video.bounds.render();
  }

  onStart() {}

  onDestroy() {}
}
export default Scene3;
