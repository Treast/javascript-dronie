import App from "./utils/App";

import AppController from "./controller/AppController";
import Perspective from "./utils/Perspective";
import { Vector2 } from "./utils/Vector2";

async function main() {
  const app = new App();

  await app.isReady();
  const controller = new AppController();

  // const src = [[374.4, 5.1], [984.3, 8.2], [1005.54, 540.9], [247.2, 870.484]]
  // const dst = [[0, 0], [1, 0], [1, 1], [0, 1]]
  // src.forEach(item => {
  //   Perspective.addCorners(new Vector2(item[0], item[1]))
  // })
  // Perspective.computePoint(new Vector2(20, 50)).then(point => {
  //   console.log('Original', point)
  //   // @ts-ignore
  //   Perspective.computeInversePoint(new Vector2(point[0], point[1]))
  //     .then(inversePoint => {
  //     console.log(inversePoint)
  //   })
  // })
}

main();
