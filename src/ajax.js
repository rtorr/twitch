/**
 * @mothod ajax
 * @param {object} options
 * @param {string} options.url
 * @param {string} options.type
 * @param {function|undefined} options.before
 * @param {function|undefined} options.success
 * @param {function|undefined} options.error
 */
export default function(options) {
  const request = new XMLHttpRequest();
  
  request.open(options.type, options.url, true)
  request.setRequestHeader('json', 'application/json; charset=UTF-8');
  
  if (options.before) {
    options.before();
  }
  
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      if (options.success) {
        options.success(request);
      }
    }
  };

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status >= 400) {
        if (options.error) {
          options.error(request);
        }
      }
    }
  };

  request.onerror = function() {
    throw new Error('There was a problem with the request');
  };

  request.send(options.data);
}