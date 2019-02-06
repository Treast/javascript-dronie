import State from './State';

class Configuration {
  /**
   * POSENET
   */
  public posenetImageScaleFactor: number = 0.8;
  public posenetMultiplier: number = 1.0;
  public posenetOutputStride: number = 16;

  /**
   * STATE
   */
  public applicationStartingState: any = State.CALIBRATION;

  /**
   * CANVAS
   */
  public webcamVideoHeight: number = 360;
  public webcamVideoWidth: number = 640;

  /**
   * VIDEO
   */
  public videoReversed: boolean = false;

  init() {
    console.log('Configuration inited');
  }
}

export default new Configuration();
