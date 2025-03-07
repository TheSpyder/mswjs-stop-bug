import { http, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      p.replaceChildren(img);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
    const p = document.createElement('p');
    document.body.appendChild(p);
    p.appendChild(document.createTextNode(`Loading image...`));
  });
};

const run = async () => {
  const worker = setupWorker(...[
    http.get(/.*/, async ({request}) => {
      if (request.url.includes('slow=yes')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return passthrough();
    })
  ]);

  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });

  // Load image through service worker, to show it works
  await loadImage('/image.png?bust=1');

  // Load image though service worker, which will not resolve in time
  loadImage('/image.png?slow=yes');

  // make sure the worker receives the image request
  // setting this to 500ms does show the second image but also leaves an unresolved HTTP request?
  await new Promise(resolve => setTimeout(resolve, 0));

  // This will often cause the `passthrough` of the second request to be ignored
  worker.stop();
};

run().then(() => console.log('Done'));
