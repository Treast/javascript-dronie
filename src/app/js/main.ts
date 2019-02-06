import App from './utils/App';

const app = new App();

app.isReady().then(() => {
  console.log('OK');
});
