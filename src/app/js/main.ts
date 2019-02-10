import App from "./utils/App";
import Canvas from "./core/Canvas";
import Configuration from "./utils/Configuration";
import State from "./utils/State";

const app = new App();

app.isReady().then(() => {
  Configuration.init();
  State.init();

  Canvas.initPosenet().then(() => {
    console.log("Posenet inited");
    Canvas.render();
  });
});
