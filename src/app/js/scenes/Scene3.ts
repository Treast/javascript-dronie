import { SceneInterface } from "./SceneInterface";
import Canvas from "../core/Canvas";
import { Vector2 } from "../utils/Vector2";
import DroneVideo from "../core/DroneVideo";
import { TweenMax, Elastic, Ease, Power2 } from "gsap";
import Rect from "../utils/math/Rect";
import Animation from "../core/Animation";
import SocketManager, { SocketTypes } from "../utils/SocketManager";
import Perspective from "../utils/Perspective";
import Configuration from "../utils/Configuration";
import Magnet from "../objects/Magnet";
import Button from "../objects/Button";
import ColorButton from "../objects/ColorButton";
import Slider from "../objects/Slider";
import DroneColor from "../objects/DroneColor";
import SuperAudioManager from "../lib/SuperAudioManager";
import Hand from "../core/Hand";
// @ts-ignore
require("../utils/gsap/ease/CustomEase");

interface CustomEase {
  create(id: string, data: string): CustomEase;
  get(id: string): CustomEase;
  getRatio(progress: number): CustomEase;
}

declare var CustomEase: CustomEase;

class Scene3 implements SceneInterface {
  private formeFin: DroneVideo;

  private droneTimide: DroneVideo;
  private droneAimante: DroneVideo;
  private timideToJoueur: DroneVideo;

  private animation: Animation;

  private joueurAttente: DroneVideo;
  private joueurBleu: DroneVideo;
  private joueurOrange: DroneVideo;
  private joueurRose: DroneVideo;
  private joueurRoseFonce: DroneVideo;

  private typo: DroneVideo;

  private magnet = {
    active: false,
    magnet: null as Magnet
  };

  private magnet1: Magnet;
  private magnet2: Magnet;

  private colorButton1: ColorButton;
  private colorButton2: ColorButton;
  private colorButton3: ColorButton;
  private colorButton4: ColorButton;

  private droneColor1: DroneColor;
  private droneColor2: DroneColor;
  private droneColor3: DroneColor;
  private droneColor4: DroneColor;

  private colorButtons: ColorButton[] = [];
  private droneColors: DroneColor[] = [];

  private button = {
    active: false
  };

  private slider = {
    active: false,
    slider: null as Slider
  };

  private final = {
    active: false,
    alpha: 0,
    triggered: false,
    bounds: new Rect({
      x: 0,
      y: 0,
      width: 60,
      height: 60
    })
  };

  constructor() {
    /**
     * Drones
     */
    this.droneTimide = new DroneVideo("timide", true, new Vector2(200, 200));
    this.droneTimide.setPoster("6_timide.mov");
    this.droneAimante = new DroneVideo(
      "timideAimente",
      true,
      new Vector2(200, 200)
    );
    this.droneAimante.setPoster("7_timide aimanté.mov");
    this.timideToJoueur = new DroneVideo(
      "timideToJoueur",
      false,
      new Vector2(200, 200)
    );

    /**
     * Joueurs
     */
    this.joueurAttente = new DroneVideo(
      "joueurAttente",
      true,
      new Vector2(200, 200)
    );
    this.joueurAttente.setPoster("joueur_attend.mov");
    this.joueurBleu = new DroneVideo("joueurBleu", true, new Vector2(200, 200));
    this.joueurBleu.setPoster("joueur_vers_bleu.mov");
    this.joueurOrange = new DroneVideo(
      "joueurOrange",
      true,
      new Vector2(200, 200)
    );
    this.joueurOrange.setPoster("joueur_vers_orange.mov");
    this.joueurRose = new DroneVideo("joueurRose", true, new Vector2(200, 200));
    this.joueurRose.setPoster("joueur_vers_rose.mov");
    this.joueurRoseFonce = new DroneVideo(
      "joueurRoseFonce",
      true,
      new Vector2(200, 200)
    );
    this.joueurRoseFonce.setPoster("joueur_vers_rose_fonce.mov");

    this.joueurBleu.setScale(0.5);
    this.joueurOrange.setScale(0.5);
    this.joueurRose.setScale(0.5);
    this.joueurRoseFonce.setScale(0.5);
    this.joueurBleu.setPoster("joueur_vers_bleu.mov");
    this.joueurOrange.setPoster("joueur_vers_orange.mov");
    this.joueurRose.setPoster("joueur_vers_rose.mov");
    this.joueurRoseFonce.setPoster("joueur_vers_rose_fonce.mov");

    this.animation = new Animation(
      this.droneTimide,
      this.droneAimante,
      this.droneTimide,
      this.droneAimante,
      this.droneTimide,
      this.timideToJoueur,
      this.joueurAttente,
      this.joueurBleu,
      this.joueurAttente,
      this.joueurOrange,
      this.joueurAttente,
      this.joueurRose,
      this.joueurAttente,
      this.joueurRoseFonce
    );

    this.animation.video.play();

    /**
     * Slider
     */
    this.slider.slider = new Slider();
    this.slider.slider.setCallback(() => {
      this.animation.advance();
      this.slider.active = false;
      this.button.active = true;
      this.colorButton1.run();
    });

    SocketManager.on(SocketTypes.DRONE_DETECT, this.onDroneDetect.bind(this));

    /**
     * Magnets
     */

    this.magnet1 = new Magnet(
      new Vector2(0.8 * window.innerWidth, 0.6 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_MAGNET1_HOVER,
      SocketTypes.DRONE_SCENE2_MAGNET1_OUT
    );
    this.magnet2 = new Magnet(
      new Vector2(0.1 * window.innerWidth, 0.8 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_MAGNET2_HOVER,
      SocketTypes.DRONE_SCENE2_MAGNET2_OUT
    );
    this.magnet.magnet = this.magnet1;

    /**
     * Color buttons
     */
    this.colorButton1 = new ColorButton(
      "roseFonce",
      new Vector2(0.3 * window.innerWidth, 0.5 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON1
    );
    this.colorButton2 = new ColorButton(
      "orange",
      new Vector2(0.6 * window.innerWidth, 0.2 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON2
    );
    this.colorButton3 = new ColorButton(
      "bleu",
      new Vector2(0.1 * window.innerWidth, 0.4 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON3
    );
    this.colorButton4 = new ColorButton(
      "rose",
      new Vector2(0.8 * window.innerWidth, 0.7 * window.innerHeight),
      SocketTypes.DRONE_SCENE2_BUTTON4
    );

    this.colorButtons.push(this.colorButton1);
    this.colorButtons.push(this.colorButton2);
    this.colorButtons.push(this.colorButton3);
    this.colorButtons.push(this.colorButton4);

    /**
     * Drone Colors
     */

    this.droneColor1 = new DroneColor("roseFonce");
    this.droneColor2 = new DroneColor("orange");
    this.droneColor3 = new DroneColor("bleu");
    this.droneColor4 = new DroneColor("rose");

    this.droneColors.push(this.droneColor1);
    this.droneColors.push(this.droneColor2);
    this.droneColors.push(this.droneColor3);
    this.droneColors.push(this.droneColor4);

    /**
     * Typo
     */
    this.typo = new DroneVideo("typo2", false);
    this.typo.video.pause();
    this.typo.setScale(0);

    this.setupSocketListeners();
    SocketManager.emit(SocketTypes.DRONE_SCENE2_MOVE1);
    this.setListeners();
  }

  setListeners() {
    window.addEventListener("mousemove", e => {
      this.onMouseMove(e);
    });
  }

  onDroneDetect({ x = 0, y = 0 } = {}) {
    if (Perspective.hasMatrix()) {
      Perspective.computePoint(new Vector2(x, y)).then((point: number[]) => {
        const x = this.lerp(
          this.animation.video.position.x,
          point[0] * window.innerWidth,
          0.1
        );
        const y = this.lerp(
          this.animation.video.position.y,
          point[1] * window.innerHeight,
          0.1
        );
        this.animation.video.setPosition(x, y);
      });
    }
  }

  lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  generateSlider() {
    console.log("Generating slider");
    this.animation.advance();
    this.magnet.active = false;
    this.slider.active = true;
    this.slider.slider.scaleUp();

    Perspective.computeInversePoint(this.slider.slider.destination).then(
      point => {
        SocketManager.emit(SocketTypes.DRONE_SCENE2_SLIDER1_INIT, {
          x: point[0] || 0,
          y: point[1] || 0
        });
      }
    );
  }

  checkIntersections(x: number, y: number) {
    if (this.magnet.active) {
      if (this.magnet1.isHandOver()) {
        document.body.style.cursor = "pointer";
        if (this.magnet1.isInteractive) {
          this.magnet1.isInteractive = false;
          this.magnet1.trigger();
          this.animation.advance();
          SuperAudioManager.trigger("magnetTouch");
        }
      }
      if (this.magnet2.isHandOver()) {
        document.body.style.cursor = "pointer";
        if (this.magnet2.isInteractive) {
          this.magnet2.isInteractive = false;
          this.magnet2.trigger();
          SuperAudioManager.trigger("magnetTouch");
          this.animation.advance();
        }
      }
    } else if (this.slider.active) {
      // @todo play slider sound
      this.slider.slider.getDistanceFromMouseToSlider(new Vector2(x, y));
    } else if (this.button.active) {
      this.colorButtons.forEach((colorButton, index) => {
        if (colorButton.isHandOver()) {
          this.animation.advance();
          colorButton.stop();
          Hand.nextButton();
          SuperAudioManager.trigger(`click_human${index + 1}`);
        }
      });
    } else if (this.final.active) {
      if (this.animation.video.isHandOver()) {
        if (!this.final.triggered) {
          this.final.triggered = true;
          SocketManager.emit(SocketTypes.DRONE_SCENE3_BUTTON1);
          document.body.style.cursor = "pointer";
          SuperAudioManager.trigger("melodie");
          this.onFinalHover();
        }
      } else {
        document.body.style.cursor = "default";
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    const { x, y } = e;
    this.checkIntersections(x, y);
  }

  onFinalHover() {
    TweenMax.to(this.final, 3, {
      alpha: 1
    });
  }

  setupSocketListeners() {
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MOVE1, () => {
      this.magnet.active = true;
      this.magnet1.scaleUp();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET1_END, () => {
      this.animation.advance();
      this.magnet.magnet = this.magnet2;
      this.magnet2.scaleUp();
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_MAGNET2_END, () =>
      this.generateSlider()
    );
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON1, () => {
      this.droneColor1.trigger();
      this.colorButton2.run();
      SuperAudioManager.trigger("click_drone1");
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON2, () => {
      this.droneColor2.trigger();
      this.colorButton3.run();
      SuperAudioManager.trigger("click_drone2");
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON3, () => {
      this.droneColor3.trigger();
      this.colorButton4.run();
      SuperAudioManager.trigger("click_drone3");
    });
    SocketManager.on(SocketTypes.CLIENT_SCENE2_BUTTON4, () => {
      this.droneColor4.trigger();
      SuperAudioManager.trigger("click_drone4");
      this.changeFormeToFinal();
    });
  }

  changeFormeToFinal() {
    this.typo.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    this.typo.setScale(0.8);
    this.typo.play();
    // this.animation.video = this.formeFin.clone();
    // this.animation.video.play();
    // this.animation.video.boundsOffset = new Vector2(30, 30);
    // this.animation.video.setBounds(this.animation.video.bounds.width, this.animation.video.bounds.height);
    this.final.active = true;
    this.button.active = false;
  }

  onMagnetAppeared() {}

  render(hand: Vector2) {
    Canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    Canvas.ctx.fillStyle = "white";
    Canvas.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (Configuration.useWebcamInteraction) {
      this.checkIntersections(hand.x, hand.y);
    }

    if (this.magnet.active) {
      this.magnet.magnet.render();
    }

    if (this.slider.active) {
      this.slider.slider.render(this.animation.video.position);
    }

    if (this.button.active) {
      this.colorButtons.forEach(colorButton => {
        colorButton.render();
      });
    }

    this.droneColors.forEach(droneColor => {
      droneColor.render(this.animation.video.position);
    });

    // this.animation.video.render();
    // this.animation.video.bounds.render();

    if (this.final.active) {
      this.typo.render();
    }
  }

  onStart() {
    SuperAudioManager.trigger("nappeTimide", {
      duration: 2
    });
  }

  onDestroy() {}
}
export default Scene3;
