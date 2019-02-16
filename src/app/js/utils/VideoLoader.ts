export default class VideoLoader {
  static videos: any = {};

  static async load(
    config: any,
    { onProgress = (i: number) => {}, onComplete = () => {} } = {}
  ) {
    const promises: any[] = [];

    let progress = 0;

    for (let videoName in config) {
      let loadVideo = VideoLoader.loadVideo(config[videoName]);
      promises.push(loadVideo);
      loadVideo.then(src => {
        VideoLoader.videos[videoName] = src;
        progress++;
        onProgress && onProgress(progress);
      });
    }

    return await Promise.all(promises).then(() => {
      onComplete && onComplete();
    });
  }

  private static loadVideo(url: string) {
    return new Promise(resolve => {
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "blob";

      req.onload = function() {
        if (this.status === 200) {
          var videoBlob = this.response;
          var vid = URL.createObjectURL(videoBlob);

          resolve(vid);
        }
      };
      req.send();
    });
  }

  static get(name: string) {
    return VideoLoader.videos[name];
  }
}
