import Canvas from '../core/Canvas';
import Configuration from '../utils/Configuration';
import VideoLoader from '../utils/VideoLoader';
import AudioManager from '../utils/AudioManager';
import State from '../../js/utils/State';
import SuperAudioManager from '../lib/SuperAudioManager';
import Hand from '../core/Hand';
class AppController {
  private $startButton = document.querySelector('button');

  constructor() {
    this.$startButton.addEventListener('click', () => {
      this.main();
    });
  }

  destroy() {
    document.body.removeChild(this.$startButton);
  }

  async main() {
    this.destroy();

    SuperAudioManager.start();

    SuperAudioManager.init({
      master: {
        volume: 1,
        effects: [],
      },
      channels: [
        {
          name: 'calm',
          volume: 1,
          effects: [
            {
              name: 'main_low_pass',
              type: 'LOW_PASS_FILTER',
              frequency: 20000,
              Q: 0,
              gain: 0,
            },
          ],
          audios: {
            calm: {
              loop: false,
              url: require('../../sounds/Colere/calm.ogg'),
              loadGroup: 'audio',
            },
          },
        },
        {
          name: 'colere',
          volume: 1,
          effects: [
            {
              name: 'main_low_pass',
              type: 'LOW_PASS_FILTER',
              frequency: 20000,
              Q: 0,
              gain: 0,
            },
          ],
          audios: {
            colere: {
              loop: false,
              url: require('../../sounds/Colere/angry.ogg'),
              loadGroup: 'audio',
            },
          },
        },
        {
          name: 'vfx',
          volume: 1,
          effects: [],
          audios: {
            touch1: {
              loop: false,
              url: require('../../sounds/Colere/touch1.ogg'),
              loadGroup: 'audio',
            },
            touch2: {
              loop: false,
              url: require('../../sounds/Colere/touch2.ogg'),
              loadGroup: 'audio',
            },
            touch3: {
              loop: false,
              url: require('../../sounds/Colere/touch3.ogg'),
              loadGroup: 'audio',
            },
            beat: {
              loop: true,
              url: require('../../sounds/Intro/beat.ogg'),
              loadGroup: 'audio',
              volume: 1.5,
            },
            hover: {
              loop: false,
              url: require('../../sounds/Intro/hover.ogg'),
              loadGroup: 'audio',
            },
            nappe: {
              loop: true,
              url: require('../../sounds/Intro/nappe.ogg'),
              loadGroup: 'audio',
            },
            click1: {
              loop: false,
              url: require('../../sounds/Jeu/click1.ogg'),
              loadGroup: 'audio',
            },
            click2: {
              loop: false,
              url: require('../../sounds/Jeu/click2.ogg'),
              loadGroup: 'audio',
            },
            click3: {
              loop: false,
              url: require('../../sounds/Jeu/click3.ogg'),
              loadGroup: 'audio',
            },
            click4: {
              loop: false,
              url: require('../../sounds/Jeu/click4.ogg'),
              loadGroup: 'audio',
            },
            sliderSelect: {
              loop: false,
              url: require('../../sounds/Slider/slider_select.ogg'),
              loadGroup: 'audio',
            },
            nappeTimide: {
              loop: true,
              url: require('../../sounds/Timide/nape3.ogg'),
              loadGroup: 'audio',
            },
            magnetTouch: {
              loop: false,
              url: require('../../sounds/Timide/magnetTouch.ogg'),
              loadGroup: 'audio',
            },
            melodie: {
              loop: false,
              url: require('../../sounds/Union/melodie.ogg'),
              loadGroup: 'audio',
            },
          },
        },
      ],
    });

    await Promise.all([
      SuperAudioManager.load({
        groups: ['audio'],
      }),
      VideoLoader.load({
        circleButtonScaling: require('../../videos/circleButtonScaling.webm'),
        circleButtonPulsing: require('../../videos/circleButtonPulsing.webm'),
        tornado: require('../../videos/tornado.webm'),
        tornadoInteraction1: require('../../videos/tornadoInteraction1.webm'),
        explosion: require('../../videos/explosion.webm'),
        fond_explosion: require('../../videos/fond_explosion.webm'),
        toudou: require('../../videos/drone_toudou.webm'),
        /** Placeholder */
        boutonAimantClique: require('../../videos/bouton aimant clique.webm'),
        boutonAimant: require('../../videos/bouton aimant.webm'),
        boutonCouleur1: require('../../videos/bouton couleur1.webm'),
        boutonCouleur2: require('../../videos/bouton couleur2.webm'),
        droneCouleur1: require('../../videos/drone couleur1.webm'),
        droneCouleur2: require('../../videos/drone couleur2.webm'),
        droneAimante: require('../../videos/drone aimante.webm'),
        boutonSlider2: require('../../videos/bouton slider 2.webm'),
        boutonSlider: require('../../videos/bouton slider.webm'),
        slider15: require('../../videos/slider15.webm'),
        formeFin: require('../../videos/forme fin.webm'),
        droneTransition21: require('../../videos/drone transition 1 a 2.webm'),
        droneTransition12: require('../../videos/drone transition 2 a 1.webm'),
        droneToudou: require('../../videos/drone toudou.webm'),
        droneToudouTo1: require('../../videos/toudou_to_1.webm'),
        /** Rework */
        scene1: require('../../videos/scene1.webm'),
        colere: require('../../videos/colere.webm'),
        /** Finaux */
        attente: require('../../videos/final/2_Attente_1.mov.webm'),
        timide: require('../../videos/final/6_timide.mov.webm'),
        colere2: require('../../videos/final/colere.webm'),
        colereToTimide: require('../../videos/final/5_colere to timide.mov.webm'),
        timideAimente: require('../../videos/final/7_timide aimante.mov.webm'),
        boutonAimente: require('../../videos/final/Bouton 2_2.webm'),
        boutonAimenteClique: require('../../videos/final/Bouton 1 clique_3.webm'),
        sliderApparition: require('../../videos/final/Slider apparition.mov.webm'),
        sliderSelection: require('../../videos/final/Slider selection.mov.webm'),
        sliderAttente: require('../../videos/final/Sliderattente.mov.webm'),
        scene1Attente: require('../../videos/final/depart.mov.webm'),
        scene1Transition: require('../../videos/final/depart_transition.mov.webm'),
        timideToJoueur: require('../../videos/final/8_timide_joueur.mov.webm'),
        /** Boutons */
        buttonBleuAttente: require('../../videos/final/colors/bouton_bleu.mov.webm'),
        buttonRoseFonceAttente: require('../../videos/final/colors/bouton_rose_fonce.mov.webm'),
        buttonBleuDisparition: require('../../videos/final/colors/bouton_bleu_disparait.mov.webm'),
        buttonRoseFonceDisparition: require('../../videos/final/colors/bouton_rose_fonce_disparait.mov.webm'),
        buttonOrangeAttente: require('../../videos/final/colors/bouton_orange.mov.webm'),
        buttonRoseAttente: require('../../videos/final/colors/bouton_rose.mov.webm'),
        buttonOrangeDisparition: require('../../videos/final/colors/bouton_orange_disparait.mov.webm'),
        buttonRoseDisparition: require('../../videos/final/colors/bouton_rose_disparait.mov.webm'),
        /** Couleurs */
        colorBleuApparition: require('../../videos/final/colors/bleu_aparition.mov.webm'),
        colorBleuAttente: require('../../videos/final/colors/bleu_attend.mov.webm'),
        colorOrangeApparition: require('../../videos/final/colors/orange_aparition.mov.webm'),
        colorOrangeAttente: require('../../videos/final/colors/orange_attend.mov.webm'),
        colorRoseApparition: require('../../videos/final/colors/rose_aparition.mov.webm'),
        colorRoseAttente: require('../../videos/final/colors/rose_attend.mov.webm'),
        colorRoseFonceApparition: require('../../videos/final/colors/rose_fonce_aparition.mov.webm'),
        colorRoseFonceAttente: require('../../videos/final/colors/rose_fonce_attend.mov.webm'),
        /** Joueurs */
        joueurAttente: require('../../videos/final/players/joueur_attend.mov.webm'),
        joueurBleu: require('../../videos/final/players/joueur_vers_bleu.mov.webm'),
        joueurOrange: require('../../videos/final/players/joueur_vers_orange.mov.webm'),
        joueurRose: require('../../videos/final/players/joueur_vers_rose.mov.webm'),
        joueurRoseFonce: require('../../videos/final/players/joueur_vers_rose_fonce.mov.webm'),
      }),
    ]);
    Configuration.init();

    Hand.init();

    if (Configuration.useWebcamInteraction) {
      Canvas.initPosenet().then(() => {
        Canvas.setScene(State.state);
        Canvas.render();
      });
    } else {
      Canvas.setScene(State.state);
      Canvas.render();
    }
  }
}

export default AppController;
