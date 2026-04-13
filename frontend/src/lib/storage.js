const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function readStorage(key, fallback = null) {
  if (!canUseStorage) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (!canUseStorage) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key) {
  if (!canUseStorage) {
    return;
  }

  window.localStorage.removeItem(key);
}
