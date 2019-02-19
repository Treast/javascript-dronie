import DroneVideo from "./DroneVideo";

export default class Animation {
  public video: DroneVideo
  private videos: DroneVideo[]
  private currentIndex: number
  
  constructor(...args: DroneVideo[]) {
    this.videos = [...args]
    this.currentIndex = 0
    this.video = this.videos[this.currentIndex].clone()
    
    // @ts-ignore
    for (let i = 0; i < this.videos.length; i += 1) {
      const video = this.videos[i]
      video.video.addEventListener('ended', this.onEnded.bind(this, video, i))
    }
    this.video.play()
  }

  onEnded(video: DroneVideo, index: number) {
    console.log('Video', video)
    console.log('ThisVideo', this.video)
    console.log('CurrentIndex', this.currentIndex)
    console.log('Index', video.id)
    console.log('T1', video.video.src)
    console.log('T2', this.video.video.src)
    if (video.video.src === this.video.video.src) {
      console.log('Test',this.currentIndex !== video.id)
      if (this.currentIndex !== index && this.currentIndex < this.videos.length - 1) {
        console.log('Set video')
        this.video = this.videos[this.currentIndex].clone()
      }
      if (!video.loop) {
        this.currentIndex += 1 
      } else {
        this.video.play()
      }
    }
  }

  advance() {
    this.currentIndex++
    console.log('CurrentIndex', this.currentIndex)
  }
}
