import Configuration from './Configuration';

interface StateInterface extends String {}

class State {
  public state: StateInterface;
  public CALIBRATION: StateInterface = 'CALIBRATION';
  public WAITING_FOR_USER: StateInterface = 'WAITING_FOR_USER';

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
