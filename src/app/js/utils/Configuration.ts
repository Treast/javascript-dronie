import State from './State';

class Configuration {
  /**
   * POSENET
   */
  public posenetImageScaleFactor: number = 0.6;
  public posenetMultiplier: number = 1.01;
  public posenetOutputStride: number = 16;

  /**
   * STATE
   */
  public applicationStartingState: any = State.SCENE_3; /* State.WAITING_FOR_USER; */

  /**
   * WEBCAM
   */
  public webcamVideoHeight: number = 600;
  public webcamVideoWidth: number = 800;

  /**
   * CANVAS
   */
  public canvasLerpFactor: number = 0.1;

  /**
   * VIDEO
   */
  public videoReversed: boolean = true;

  /*
   * Socket
   */

  public socketHost: String = 'https://dronie.vincentriva.fr';

  public useWebcamInteraction: Boolean = false;

  init() {
    console.log('Configuration inited');
  }
}

export default new Configuration();
