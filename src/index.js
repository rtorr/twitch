import { listener, dispatch } from './dispatcher';
import { el, emptyNode, streamTopContainer, streamItem } from './templates';
import {
  BEFORE_REQUEST,
  INITIAL_REQUEST_ACTION,
  HISTORY_UPDATE
} from './constants';
import ajax from './ajax';

const streamListEl = document.getElementById('stream-list');

// Use document fragment to bundle dom updates
const streamListFragment = document.createDocumentFragment();

function parseUrlSearch(url) {
  if (url.split('?')[1]) {
    return url.split('?')[1].split('&').reduce((result, kvp) => {
      const kv = kvp.split('=');
      result[decodeURIComponent(kv[0]).trim()] = decodeURIComponent(kv[1]).trim();
      return result;
    }, {});
  } else {
    return { q: 'starcraft', offset: 0, limit: 10 };
  }
}

/**
 * I wanted to do something fun, so I came up with a little event implementation. 
 * This is obviously demo code, so I wanted to try something new with it.
 */
listener(function(e) {
  const {type, data} = e.detail;
  switch (type) {
    case BEFORE_REQUEST:
      emptyNode(streamListEl);
      const loading = new el('div');
      loading.node.setAttribute('class', 'stream-loading-container');
      loading.node.innerText = 'Loading...';
      streamListFragment.appendChild(loading.node);
      streamListEl.appendChild(streamListFragment);
      break;
    case INITIAL_REQUEST_ACTION:
      emptyNode(streamListEl);
      streamListFragment.appendChild(streamTopContainer(parseUrlSearch(data._links.self), data).node)
      data.streams.map(i => {
        streamListFragment.appendChild(streamItem(i).node);
      })
      streamListEl.appendChild(streamListFragment);
      break;
    case HISTORY_UPDATE:
      window.history.pushState(data.state, data.title, data.url);
      request();
      break;
  }
});

window.addEventListener('popstate', function(){
  request();
});

const request = function(){
  const { q, offset, limit } = parseUrlSearch(window.location.href);
  return ajax({
    url: `https://api.twitch.tv/kraken/search/streams?q=${q || 'starcraft'}&offset=${offset || 0}&limit=${limit || 10}`,
    type: 'GET',
    before: function() {
      dispatch({
        type: BEFORE_REQUEST
      });
    },
    success: function(response_object) {
      dispatch({
        type: INITIAL_REQUEST_ACTION,
        data: JSON.parse(response_object.responseText)
      });
    }
  });  
};

//init
request();
