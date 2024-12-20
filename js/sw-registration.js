/* ===========================================================
 * sw-registration.js
 * ===========================================================
 * Custom Service Worker Registration for blog.rizkylab.com
 * ===========================================================
 */

// SW Version Upgrade Ref: <https://youtu.be/Gb9uI67tqV0>

function handleRegistration(registration) {
  console.log('Service Worker Registered: ', registration);

  /**
   * ServiceWorkerRegistration.onupdatefound
   * The service worker registration's installing worker changes.
   */
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    installingWorker.onstatechange = () => {
      if (installingWorker.state !== 'installed') return;

      if (navigator.serviceWorker.controller) {
        console.log('SW has been updated.');
        createSnackbar({
          message: 'New content available. Please refresh.',
          actionText: 'Refresh',
          action: function () {
            location.reload();
          },
          duration: 5000
        });
      } else {
        console.log('Service Worker installed for the first time.');
        createSnackbar({
          message: 'App is ready for offline use.',
          duration: 3000
        });
      }
    };
  };
}

if (navigator.serviceWorker) {
  // For security reasons, a service worker can only control pages
  // that are in the same directory level or below. sw.js is placed in the ROOT level.
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => handleRegistration(registration))
    .catch((error) => console.error('Service Worker registration failed: ', error));

  // Listen for messages from the Service Worker
  navigator.serviceWorker.onmessage = (e) => {
    console.log('Service Worker Broadcast:', e);
    const data = e.data;

    if (data.command === 'UPDATE_FOUND') {
      console.log('UPDATE_FOUND_BY_SW:', data);
      createSnackbar({
        message: 'Content has been updated.',
        actionText: 'Refresh',
        action: function () {
          location.reload();
        },
        duration: 5000
      });
    }
  };
}
