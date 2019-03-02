// @ts-ignore
import * as io from "socket.io-client";
import Configuration from "./Configuration";

class SocketManager {
  private socket = io(Configuration.socketHost);

  public on(eventName: SocketTypes, cb: any) {
    this.socket.on(eventName, cb);
  }

  public emit(eventName: SocketTypes, data: any = null) {
    this.socket.emit(eventName, data);
  }

  public off(eventName: SocketTypes, cb: any) {
    this.socket.off(eventName, cb);
  }
}

export default new SocketManager();

export enum SocketTypes {
  DRONE_SCENE1_TAKEOFF = "DRONE:SCENE1:TAKEOFF",
  DRONE_SCENE1_MOVE1 = "DRONE:SCENE1:MOVE1",
  DRONE_SCENE1_MOVE2 = "DRONE:SCENE1:MOVE2",
  DRONE_SCENE1_MOVE3 = "DRONE:SCENE1:MOVE3",
  DRONE_SCENE2_MOVE1 = "DRONE:SCENE2:MOVE1",
  DRONE_SCENE2_MAGNET1 = "DRONE:SCENE2:MAGNET1",
  DRONE_SCENE2_MAGNET1_HOVER = "DRONE:SCENE2:MAGNET1:HOVER",
  DRONE_SCENE2_MAGNET1_OUT = "DRONE:SCENE2:MAGNET1:OUT",
  DRONE_SCENE2_MAGNET2 = "DRONE:SCENE2:MAGNET2",
  DRONE_SCENE2_MAGNET2_HOVER = "DRONE:SCENE2:MAGNET2:HOVER",
  DRONE_SCENE2_MAGNET2_OUT = "DRONE:SCENE2:MAGNET2:OUT",
  DRONE_SCENE2_SLIDER1 = "DRONE:SCENE2:SLIDER1",
  DRONE_SCENE2_SLIDER1_INIT = "DRONE:SCENE2:SLIDER1:INIT",
  DRONE_SCENE2_SLIDER2 = "DRONE:SCENE2:SLIDER2",
  DRONE_SCENE2_BUTTON1 = "DRONE:SCENE2:BUTTON1",
  DRONE_SCENE2_BUTTON2 = "DRONE:SCENE2:BUTTON2",
  DRONE_SCENE2_BUTTON3 = "DRONE:SCENE2:BUTTON3",
  DRONE_SCENE2_BUTTON4 = "DRONE:SCENE2:BUTTON4",
  DRONE_SCENE3_BUTTON1 = "DRONE:SCENE3:BUTTON1",
  DRONE_SCENE3_LAND = "DRONE:SCENE3:LAND",
  DRONE_DETECT = "DRONE:DETECT",

  CLIENT_SCENE1_TAKEOFF = "CLIENT:SCENE1:TAKEOFF",
  CLIENT_SCENE1_MOVE1 = "CLIENT:SCENE1:MOVE1", // passe la main
  CLIENT_SCENE1_MOVE2 = "CLIENT:SCENE1:MOVE2",
  CLIENT_SCENE1_MOVE3 = "CLIENT:SCENE1:MOVE3",
  CLIENT_SCENE2_MOVE1 = "CLIENT:SCENE2:MOVE1",
  CLIENT_SCENE2_BUTTON1 = "CLIENT:SCENE2:BUTTON1",
  CLIENT_SCENE2_BUTTON2 = "CLIENT:SCENE2:BUTTON2",
  CLIENT_SCENE2_BUTTON3 = "CLIENT:SCENE2:BUTTON3",
  CLIENT_SCENE2_BUTTON4 = "CLIENT:SCENE2:BUTTON4",
  CLIENT_SCENE2_MAGNET1_END = "CLIENT:SCENE2:MAGNET1:END",
  CLIENT_SCENE2_MAGNET2_END = "CLIENT:SCENE2:MAGNET2:END",

  DRONE_CALIBRATION = "DRONE:CALIBRATION"
}
