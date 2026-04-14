import { appConfig } from './config';

function buildUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${appConfig.apiBaseUrl}${normalizedPath}`;
}

async function buildError(response) {
  const text = await response.text();

  try {
    const parsed = JSON.parse(text);
    return parsed.detail || text || `Request failed with status ${response.status}`;
  } catch {
    return text || `Request failed with status ${response.status}`;
  }
}

export async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await buildError(response));
  }

  return response.json();
}

export async function createCheckoutSession(payload) {
  return request('/checkout/session', {
    method: 'POST',
    body: payload,
  });
}
