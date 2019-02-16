import App from "./utils/App";
import Canvas from "./core/Canvas";
import Configuration from "./utils/Configuration";
import VideoLoader from "./utils/VideoLoader";
import AudioManager from "./utils/AudioManager";
import State from "../js/utils/State";

const app = new App();

async function main() {
  await app.isReady();

  await Promise.all([
    AudioManager.load({
      hover1: require("../sounds/hover1.ogg"),
      hover2: require("../sounds/hover2.ogg"),
      ting: require("../sounds/ting.ogg"),
      touch1: require("../sounds/touch1.ogg"),
      touch2: require("../sounds/touch2.ogg"),
      touch3: require("../sounds/touch3.ogg"),
      explosion2: require("../sounds/explosion2.ogg")
    }),
    VideoLoader.load({
      circleButtonScaling: require("../videos/circleButtonScaling.webm"),
      circleButtonPulsing: require("../videos/circleButtonPulsing.webm"),
      tornado: require("../videos/tornado.webm"),
      tornadoInteraction1: require("../videos/tornadoInteraction1.webm"),
      explosion: require("../videos/explosion.webm"),
      fond_explosion: require("../videos/fond_explosion.webm")
    })
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

main();
