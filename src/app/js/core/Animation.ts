import DroneVideo from './DroneVideo';

export default class Animation {
  public video: DroneVideo;
  public videos: DroneVideo[];
  public currentIndex: number;
  private callback: any;

  constructor(...args: DroneVideo[]) {
    this.videos = [];
    this.currentIndex = 0;

    for (let i = 0; i < args.length; i += 1) {
      const video = args[i];
      const vid = video.clone();
      vid.pause();
      vid.video.addEventListener('ended', this.onEnded.bind(this, vid, i));
      this.videos.push(vid);
    }
    this.video = this.videos[this.currentIndex];
    this.video.play();
  }

  setCallback(callback: any) {
    this.callback = callback;
  }

  setScale(x: number, y: number = null) {
    if (!y) y = x;
    this.videos.map((video) => {
      video.setScale(x, y);
    });
  }

  onEnded(video: DroneVideo, index: number) {
    if (video.video.src === this.video.video.src) {
      if (this.currentIndex !== index && this.currentIndex <= this.videos.length - 1) {
        this.video.video.removeEventListener('ended', this.onEnded.bind(this, video, index));
        this.videos[this.currentIndex].position = this.video.position;
        // this.videos[this.currentIndex].scale = this.video.scale;
        this.video = this.videos[this.currentIndex];
        console.log(`Switching to ${this.video.name}`);
        this.video.play();
      }
      if (!video.loop) {
        this.currentIndex += 1;
        if (this.currentIndex <= this.videos.length - 1) {
          this.videos[this.currentIndex].position = this.video.position;
          // this.videos[this.currentIndex].scale = this.video.scale;
          this.video = this.videos[this.currentIndex];
          this.video.play();
        } else {
          if (this.callback) {
            this.callback();
          }
        }
      } else {
        this.video.play();
      }
    }
  }

  setVideo(index: number) {
    this.currentIndex = index;
    this.video = this.videos[index];
  }

  reset() {
    this.currentIndex = 0;
    this.video = this.videos[0];
  }

  advance() {
    if (this.currentIndex < this.videos.length - 1) {
      this.currentIndex++;
    }
    console.log('CurrentIndex', this.currentIndex);
  }
}
