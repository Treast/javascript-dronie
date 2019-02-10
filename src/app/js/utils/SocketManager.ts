import * as io from "socket.io-client";
import Configuration from "./Configuration";

class SocketManager {
  private socket = io(Configuration.socketHost);

  public on(eventName: SocketTypes, cb: any) {
    this.socket.on(eventName, cb);
  }

  public emit(eventName: SocketTypes, data: any) {
    this.socket.emit(eventName, data);
  }
}

export default new SocketManager();

export enum SocketTypes {
  TAKEOFF,
  LANDING,
  MOVE,
  FLOAT
}
