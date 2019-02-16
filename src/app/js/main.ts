import App from "./utils/App";
import Canvas from "./core/Canvas";
import Configuration from "./utils/Configuration";
import VideoLoader from "./utils/VideoLoader";
import State from "../js/utils/State";

const app = new App();

async function main() {
  await app.isReady();
  await VideoLoader.load({
    circleButtonScaling: require("../videos/circleButtonScaling.webm"),
    circleButtonPulsing: require("../videos/circleButtonPulsing.webm")
  });

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
