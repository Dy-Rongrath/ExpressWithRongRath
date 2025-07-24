window.addEventListener('DOMContentLoaded', function () {
  // Intercept Swagger UI responses
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await origFetch.apply(this, args);
    // Check if this is the login endpoint and a token is present
    if (
      args[0].includes('/users/login') &&
      response.headers.get('content-type')?.includes('application/json')
    ) {
      const clone = response.clone();
      clone.json().then(data => {
        if (data.token) {
          // Set the token in Swagger UI's auth system
          const bearer = 'Bearer ' + data.token;
          if (window.ui && window.ui.preauthorizeApiKey) {
            window.ui.preauthorizeApiKey('bearerAuth', bearer);
          }
        }
      });
    }
    return response;
  };
});
