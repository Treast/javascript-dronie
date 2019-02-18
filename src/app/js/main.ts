import App from "./utils/App";

import AppController from "./controller/AppController";

async function main() {
  const app = new App();

  await app.isReady();
  const controller = new AppController();
}

main();
