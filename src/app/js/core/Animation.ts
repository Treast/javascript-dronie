import DroneVideo from './DroneVideo';

export default class Animation {
  public video: DroneVideo;
  private videos: DroneVideo[];
  private currentIndex: number;

  constructor(...args: DroneVideo[]) {
    this.videos = [];
    this.currentIndex = 0;

    for (let i = 0; i < args.length; i += 1) {
      const video = args[i];
      const vid = video.clone();
      vid.video.addEventListener('ended', this.onEnded.bind(this, vid, i));
      this.videos.push(vid);
    }
    this.video = this.videos[this.currentIndex];
    this.video.play();
  }

  onEnded(video: DroneVideo, index: number) {
    if (video.video.src === this.video.video.src) {
      if (this.currentIndex !== index && this.currentIndex < this.videos.length - 1) {
        this.video.video.removeEventListener('ended', this.onEnded.bind(this, video, index));
        this.videos[this.currentIndex].position = this.video.position;
        this.videos[this.currentIndex].scale = this.video.scale;
        this.video = this.videos[this.currentIndex];
        this.video.play();
      }
      if (!video.loop) {
        this.currentIndex += 1;
        this.videos[this.currentIndex].position = this.video.position;
        this.videos[this.currentIndex].scale = this.video.scale;
        this.video = this.videos[this.currentIndex];
      }
      this.video.play();
    }
  }

  advance() {
    this.currentIndex++;
    console.log('CurrentIndex', this.currentIndex);
  }
}
