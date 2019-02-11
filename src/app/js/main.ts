import App from "./utils/App";
import Canvas from "./core/Canvas";
import Configuration from "./utils/Configuration";
import State from "./utils/State";
import SuperAudioManager from "../audio/SuperAudioManager";

SuperAudioManager.start();
SuperAudioManager.init({
  master: {
    volume: 1
  },
  channels: [
    {
      name: "mychannel",
      volume: 1,
      audios: {
        phase1: {
          loop: true,
          url: require("../sounds/phase1.ogg"),
          loadGroup: "music"
        }
      }
    }
  ]
});

const app = new App();

app.isReady().then(() => {
  SuperAudioManager.load({
    groups: ["music"]
  }).then(() => {
    Configuration.init();
    State.init();

    Canvas.initPosenet().then(() => {
      console.log("Posenet inited");
      Canvas.render();
    });
  });
});
