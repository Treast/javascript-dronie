export default class VideoLoader {
  static videos: any = {};

  static async load(config: any, { onProgress = (i: number) => {}, onComplete = () => {} } = {}) {
    const promises: any[] = [];

    let progress = 0;

    for (const videoName in config) {
      const loadVideo = VideoLoader.loadVideo(config[videoName]);
      promises.push(loadVideo);
      loadVideo.then((src) => {
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
    return new Promise((resolve) => {
      const req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'blob';

      req.onreadystatechange = function () {
        if (req.readyState === 4 && this.status === 200) {
          const videoBlob = this.response;
          const vid = URL.createObjectURL(videoBlob);

          resolve(vid);
        }
      };
      req.send(null);
    });
  }

  static get(name: string) {
    return VideoLoader.videos[name];
  }
}
