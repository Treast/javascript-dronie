import SuperAudioManager from "../lib/SuperAudioManager";

export default class ButtonEvent {

    private triggered:boolean = false
    private sound:string

    constructor(sound:string) {
        this.sound = sound
    }

    trigger() {
        if(this.triggered) return;

        this.triggered = true

        SuperAudioManager.trigger(this.sound);
    }
}