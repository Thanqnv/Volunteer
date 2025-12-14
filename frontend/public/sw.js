// Minimal service worker that unregisters itself immediately.
self.addEventListener("install", () => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Unregister and reload controlled clients to drop SW control
  event.waitUntil(
    (async () => {
      try {
        const registration = self.registration;
        await registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((client) => client.navigate(client.url));
      } catch (_) {}
    })()
  );
});

// Do not hijack any requests
self.addEventListener("fetch", (event) => {
  // Let all requests pass through to the network
});
