import State from "./State";

class Configuration {
  /**
   * POSENET
   */
  public posenetImageScaleFactor: number = 0.8;
  public posenetMultiplier: number = 0.5;
  public posenetOutputStride: number = 16;
  public minimalConfidence: number = 0.25;
  /**
   * STATE
   */
  public applicationStartingState: any =
    State.SCENE_2; /* State.WAITING_FOR_USER; */

  /**
   * WEBCAM
   */
  public webcamVideoHeight: number = 720;
  public webcamVideoWidth: number = 1280;

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

  public socketHost: String = "https://dronie.vincentriva.fr";

  public useWebcamInteraction: Boolean = false;

  init() {
    console.log("Configuration inited");
  }
}

export default new Configuration();
