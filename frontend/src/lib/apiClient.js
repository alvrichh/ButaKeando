import { appConfig } from './config';

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${appConfig.apiBaseUrl}${normalizedPath}`;
}

export async function request(path, options = {}) {
  if (!appConfig.apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL missing. Configure frontend environment for live API calls.');
  }

  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function createCheckoutSession(payload) {
  if (!appConfig.apiBaseUrl) {
    await new Promise((resolve) => window.setTimeout(resolve, 450));

    return {
      reference: `BTK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      provider: 'mock',
      payment_status: 'pending_redirect',
      checkout_url: null,
      email_notification_ready: true,
      message: 'Sesion mock creada. Podras conectar este flujo a backend o pasarela real mas adelante.',
      draft: payload,
    };
  }

  return request('/checkout/sessions', {
    method: 'POST',
    body: payload,
  });
}
