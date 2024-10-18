import { http, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
    document.body.appendChild(img);
  });
};

const run = async () => {
  const worker = setupWorker(...[
    http.all(/.*/, () => passthrough()) // Passthough everything
  ]);

  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });

  // Load image through service worker
  await loadImage('/image.png?bust=1');

  // This needs to be async
  worker.stop();

  // Uncomment this to see that it works since it has time to recieve the post message
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Load image though outside service worker. This is sometimes not loaded at all or still through the service worker
  await loadImage('/image.png?bust=2');
};

run().then(() => console.log('Done'));
