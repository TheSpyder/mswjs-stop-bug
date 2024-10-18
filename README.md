## Steps to reproduce

1. Install the npm dependencies using `npm i`
2. Start the server using `npm start`
3. Open the Chrome or Safari and go to go to `http://localhost:3000`
4. Re-load the page N times might take a few tries
5. Observe that sometimes the second image is not served (network tabs shows it in a pending state)
6. Observe that sometimes the second image is served though the service worker even when it should have been stopped
