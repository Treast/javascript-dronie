export default class VideoLoader {
  static videos: any = {};

  static async load(config: any, { onProgress = (i: number) => {}, onComplete = () => {} } = {}) {
    const promises: any[] = [];

    let progress = 0;
    for (const videoName in config) {
      const p = new Promise((resolve) => {
        const element = document.createElement('video')
        element.src = config[videoName]
        element.preload = 'auto'
        element.autoplay = false
        element.pause()
        VideoLoader.videos[videoName] = element
        element.addEventListener('canplaythrough', () => {
          progress++;
          onProgress && onProgress(progress);
          resolve(element)
        }, false)
      })
      promises.push(p);
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
