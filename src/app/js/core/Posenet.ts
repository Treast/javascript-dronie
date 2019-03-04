// @ts-ignore
import * as posenet from '@tensorflow-models/posenet';
import Configuration from '../utils/Configuration';
import Webcam from './Webcam';
import { Vector2 } from '../utils/Vector2';

export default class Posenet {
  private net: any;

  init() {
    return Webcam.init().then(() => {
      console.log('Model loaded');
      return this.loadModel();
    });
  }

  loadModel() {
    return new Promise((resolve) => {
      posenet.load(Configuration.posenetMultiplier).then((net: any) => {
        this.net = net;
        console.log('Net resolved');
        resolve();
      });
    });
  }

  getModel() {
    return this.net.estimateSinglePose(
      Webcam.getVideo(),
      Configuration.posenetImageScaleFactor,
      Configuration.videoReversed,
      Configuration.posenetOutputStride,
    );
  }

  getHand() {
    return this.getModel().then((pose: any) => {
      console.log(pose.score);
      if (pose.score < Configuration.minimalConfidence) return null;
      const handKeyPoints = pose.keypoints.filter((item: any) => {
        return item.part === 'rightWrist' || item.part === 'leftWrist';
      });

      handKeyPoints.sort((a: any, b: any) => {
        return a.score > b.score ? 1 : -1;
      });

      return this.getPartLocation(handKeyPoints[0]);
    });
  }

  getPart(partName: string, keyPoints: []): any {
    return keyPoints.find((item: any) => {
      return item.part === partName;
    });
  }

  getPartLocation(part: any): Vector2 {
    const x = (window.innerWidth / Configuration.webcamVideoWidth) * part.position.x;
    const y = (window.innerHeight / Configuration.webcamVideoHeight) * part.position.y;
    return new Vector2(x, y);
  }
}
