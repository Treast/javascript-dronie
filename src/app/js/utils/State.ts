import Configuration from './Configuration';

export interface StateInterface extends String {}

class State {
  public state: StateInterface;
  public CALIBRATION: StateInterface = 'CALIBRATION';
  public WAITING_FOR_USER: StateInterface = 'WAITING_FOR_USER';
  public SCENE_2: StateInterface = 'SCENE_2';
  public SCENE_3: StateInterface = 'SCENE_3';

  init() {
    this.state = Configuration.applicationStartingState;
    console.log('State inited');
  }

  set(newState: StateInterface) {
    this.state = newState;
  }

  is(isState: StateInterface) {
    return this.state === isState;
  }
}

export default new State();
