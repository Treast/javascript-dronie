import Canvas from '../core/Canvas';
import Vector2 from '../utils/math/Vector2';
import VideoLoader from '../utils/VideoLoader';
import SuperMath from '../utils/math/SuperMath';
import { TweenLite } from 'gsap';
import { Vector2 as Vector } from '../utils/Vector2';
import AudioManager from '../utils/AudioManager';
import State from '../utils/State';
import DroneVideo from '../core/DroneVideo';

export default class Tornado {
  public video: DroneVideo;
  private explosionVideo: HTMLVideoElement;
  private backgroundExplosionVideo: HTMLVideoElement;
  public interactionVideo: any = {
    1: {
      video: document.createElement('video'),
      active: false,
      alpha: 0,
      scale: new Vector2({
        x: 0.6,
        y: 0.6,
      }),
    },
    2: {
      video: document.createElement('video'),
      active: false,
      alpha: 0,
      scale: new Vector2({
        x: 0.65,
        y: 0.65,
      }),
    },
  };
  public position: Vector2;
  public size: Vector2 = new Vector2({
    x: 620,
    y: 460,
  });

  scale: Vector2 = new Vector2({
    x: 0.6,
    y: 0.6,
  });

  private alpha: number = 1;
  private explosionAlpha: number = 0;
  private active: Boolean = true;
  private explosionActive: Boolean = false;

  constructor() {
    this.position = new Vector2();
    this.video = new DroneVideo('attente', true, new Vector(400, 400));
    this.video.setPoster('2_Attente_1.mov');
    document.body.appendChild(this.video.video);
    this.video.play();

    this.interactionVideo[1].video = VideoLoader.get('attente');
    this.interactionVideo[1].video.loop = true;
    this.interactionVideo[1].video.muted = true;

    this.interactionVideo[2].video = VideoLoader.get('attente');
    this.interactionVideo[2].video.loop = true;
    this.interactionVideo[2].video.muted = true;

    this.explosionVideo = VideoLoader.get('explosion');
    this.explosionVideo.muted = true;

    this.backgroundExplosionVideo = VideoLoader.get('fond_explosion');
    this.backgroundExplosionVideo.muted = true;
  }

  public render() {
    if (this.active) {
      this.video.render();
    }

    for (const interactionIndex in this.interactionVideo) {
      const interaction = this.interactionVideo[interactionIndex];

      Canvas.ctx.save();

      Canvas.ctx.globalAlpha = interaction.alpha;

      if (interaction.active) {
        Canvas.ctx.drawImage(
          interaction.video,
          this.position.x - (interaction.video.videoWidth * interaction.scale.x) / 2,
          this.position.y - (interaction.video.videoHeight * interaction.scale.y) / 2,
          interaction.video.videoWidth * interaction.scale.x,
          interaction.video.videoHeight * interaction.scale.x,
        );
      }

      Canvas.ctx.restore();
    }

    if (this.explosionActive) {
      Canvas.ctx.save();

      Canvas.ctx.globalAlpha = this.explosionAlpha;

      /* Canvas.ctx.drawImage(
        this.backgroundExplosionVideo,
        window.innerWidth / 2 - this.backgroundExplosionVideo.videoWidth / 2,
        window.innerHeight / 2 - this.backgroundExplosionVideo.videoHeight / 2,
        this.backgroundExplosionVideo.videoWidth,
        this.backgroundExplosionVideo.videoHeight
      ); */

      Canvas.ctx.drawImage(
        this.explosionVideo,
        this.position.x - (this.explosionVideo.videoWidth * this.scale.x) / 2,
        this.position.y - (this.explosionVideo.videoHeight * this.scale.y) / 2,
        this.explosionVideo.videoWidth * this.scale.x,
        this.explosionVideo.videoHeight * this.scale.x,
      );

      Canvas.ctx.restore();
    }
  }

  private fadeInVideo(index: number) {
    const obj = {
      opacity: this.interactionVideo[index].alpha,
    };
    TweenLite.to(obj, 0.3, {
      opacity: 1,
      onUpdate: () => {
        this.interactionVideo[index].alpha = obj.opacity;
      },
    });
  }
  private fadeInExplosion() {
    const obj = {
      opacity: this.explosionAlpha,
    };
    TweenLite.to(obj, 0.3, {
      opacity: 1,
      onUpdate: () => {
        this.explosionAlpha = obj.opacity;
      },
    });
  }
  private fadeOutVideo(index: number) {
    const obj = {
      opacity: this.interactionVideo[index].alpha,
    };
    TweenLite.to(obj, 0.3, {
      opacity: 0,
      onUpdate: () => {
        this.interactionVideo[index].alpha = obj.opacity;
      },
      onComplete: () => {
        this.interactionVideo[index].active = false;
      },
    });
  }
  private fadeOutTornadoVideo() {
    const obj = {
      opacity: this.alpha,
    };
    TweenLite.to(obj, 0.3, {
      opacity: 0,
      onUpdate: () => {
        this.alpha = obj.opacity;
      },
      onComplete: () => {
        this.active = false;
      },
    });
  }

  public makeVideoTransition(index: number) {
    if (this.interactionVideo[index]) {
      if (index - 1 > 0) {
        this.fadeOutVideo(index - 1);
      } else {
        // fade out the tornado video

        this.fadeOutTornadoVideo();
      }

      this.interactionVideo[index].active = true;

      this.interactionVideo[index].video.play();
      this.fadeInVideo(index);
    } else {
      this.explode();
    }
  }

  public explode() {
    this.fadeOutVideo(2);
    this.explosionVideo.play();
    this.backgroundExplosionVideo.play();
    if (!this.explosionActive) {
      setTimeout(() => {
        Canvas.setScene(State.SCENE_3);
      },         2000);
    }
    this.explosionActive = true;
    this.fadeInExplosion();
    AudioManager.get('explosion2').play();
  }
}
