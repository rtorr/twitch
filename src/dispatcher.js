

/**
 * @param {object} data
 * @param {string} data.type
 */
export function dispatch(data) {
  return window.dispatchEvent(new CustomEvent('twitch-app:update', {'detail': data}));
}

/**
 * @param {function} fn
 */
export function listener(fn) {
  return window.addEventListener('twitch-app:update', fn, false);
}