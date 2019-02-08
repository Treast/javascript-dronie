import State from './State';

class Configuration {
  /**
   * POSENET
   */
  public posenetImageScaleFactor: number = 0.6;
  public posenetMultiplier: number = 0.5;
  public posenetOutputStride: number = 16;

  /**
   * STATE
   */
  public applicationStartingState: any = State.WAITING_FOR_USER;

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

  init() {
    console.log('Configuration inited');
  }
}

export default new Configuration();
