import Configuration from "../utils/Configuration";

class Webcam {
  private video: HTMLVideoElement;

  init() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia =
        // @ts-ignore
        navigator.getUserMedia;
      if (!navigator) {
        throw "Cannot get video stream.";
      }
      this.video = document.createElement("video");
      this.video.width = Configuration.webcamVideoWidth;
      this.video.height = Configuration.webcamVideoHeight;
      this.video.setAttribute("autoplay", "true");

      navigator.getUserMedia(
        {
          video: {
            width: Configuration.webcamVideoWidth,
            height: Configuration.webcamVideoHeight
          },
          audio: false
        },
        stream => {
          console.log("Getting stream");
          this.video.srcObject = stream;
          resolve();
        },
        error => {
          console.log(error);
          reject();
        }
      );
    });
  }

  getVideo() {
    return this.video;
  }
}

export default new Webcam();
