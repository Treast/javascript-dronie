import * as io from "socket.io-client";
import Configuration from "./Configuration";

class SocketManager {
  private socket = io(Configuration.socketHost);

  public on(eventName: SocketTypes, cb: any) {
    console.log(`RECEIVED EVENT ${eventName}`);
    this.socket.on(eventName, cb);
  }

  public emit(eventName: SocketTypes, data: any) {
    console.log(`EMIT EVENT ${eventName}`);
    this.socket.emit(eventName, data);
  }
}

export default new SocketManager();

export enum SocketTypes {
  TAKEOFF = "TAKEOFF",
  LANDING = "LANDING",
  MOVE = "MOVE",
  FLOAT = "FLOAT",
  DRONE_SCENE1_MOVE1 = "DRONE:SCENE1:MOVE1",
  DRONE_SCENE1_MOVE2 = "DRONE:SCENE1:MOVE2",
  DRONE_SCENE1_MOVE3 = "DRONE:SCENE1:MOVE3"
}
