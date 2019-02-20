import State from './State';

class Configuration {
  /**
   * POSENET
   */
  public posenetImageScaleFactor: number = 0.3;
  public posenetMultiplier: number = 0.5;
  public posenetOutputStride: number = 32;

  /**
   * STATE
   */
  public applicationStartingState: any = State.SCENE_3; /* State.WAITING_FOR_USER; */

  /**
   * WEBCAM
   */
  public webcamVideoHeight: number = 360;
  public webcamVideoWidth: number = 640;

  /**
   * CANVAS
   */
  public canvasLerpFactor: number = 0.1;

  /**
   * VIDEO
   */
  public videoReversed: boolean = false;

  /*
   * Socket
   */

  public socketHost: String = 'https://dronie.vincentriva.fr';

  public useWebcamInteraction: Boolean = true;

  init() {
    console.log('Configuration inited');
  }
}

export default new Configuration();
