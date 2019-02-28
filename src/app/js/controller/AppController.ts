import Canvas from '../core/Canvas';
import Configuration from '../utils/Configuration';
import VideoLoader from '../utils/VideoLoader';
import AudioManager from '../utils/AudioManager';
import State from '../../js/utils/State';
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
    await Promise.all([
      AudioManager.load({
        hover1: require('../../sounds/hover1.ogg'),
        hover2: require('../../sounds/hover2.ogg'),
        ting: require('../../sounds/ting.ogg'),
        touch1: require('../../sounds/touch1.ogg'),
        touch2: require('../../sounds/touch2.ogg'),
        touch3: require('../../sounds/touch3.ogg'),
        explosion2: require('../../sounds/explosion2.ogg'),
        beat: require('../../sounds/beat.ogg'),
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
        /** Couleurs */
        colorBleuApparition: require('../../videos/final/colors/bleu_aparition.mov.webm'),
        colorBleuAttente: require('../../videos/final/colors/bleu_attend.mov.webm'),
        colorOrangeApparition: require('../../videos/final/colors/orange_aparition.mov.webm'),
        colorOrangeAttente: require('../../videos/final/colors/orange_attend.mov.webm'),
        colorRoseApparition: require('../../videos/final/colors/rose_aparition.mov.webm'),
        colorRoseAttente: require('../../videos/final/colors/rose_attend.mov.webm'),
        colorRoseFonceApparition: require('../../videos/final/colors/rose_fonce_aparition.mov.webm'),
        colorRoseFonceAttente: require('../../videos/final/colors/rose_fonce_attend.mov.webm'),
      }),
    ]);
    Configuration.init();

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
