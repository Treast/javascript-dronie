import App from "./utils/App";
import Canvas from "./core/Canvas";
import Configuration from "./utils/Configuration";

const app = new App();

app.isReady().then(() => {
  Configuration.init();

  Canvas.initPosenet().then(() => {
    console.log("Posenet inited");
    Canvas.render();
  });
});
