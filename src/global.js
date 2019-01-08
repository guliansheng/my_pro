import { Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';

// import { register } from 'register-service-worker'

// register('/service-worker.js', {
//   ready () {
//     console.log('Service worker is active.')
//   },
//   registered (registration) {
//     console.log('Service worker has been registered.')
//   },
//   cached (registration) {
//     console.log('Content has been cached for offline use.')
//   },
//   updatefound (registration) {
//     console.log('New content is downloading.')
//   },
//   updated (registration) {
//     console.log('New content is available; please refresh.')
//   },
//   offline () {
//     console.log('No internet connection found. App is running in offline mode.')
//   },
//   error (error) {
//     console.error('Error during service worker registration:', error)
//   }
// })

// Notify user if offline now
window.addEventListener('sw.offline', () => {
  message.warning(formatMessage({ id: 'app.pwa.offline' }));
});

// Pop up a prompt on the page asking the user if they want to use the latest version
window.addEventListener('sw.updated', e => {
  Modal.confirm({
    title: formatMessage({ id: 'app.pwa.serviceworker.updated' }),
    content: formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
    okText: formatMessage({ id: 'app.pwa.serviceworker.updated.ok' }),
    onOk: async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return Promise.resolve();
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = event => {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });
      // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
      window.location.reload(true);
      return true;
    },
  });
});
