import { dispatch } from './dispatcher';
import { HISTORY_UPDATE } from './constants';

/**
 * @param {string} type
 */
export function el(type) {
  this.node = document.createElement(type);
  this.events = [];
  return this;
}

/**
 * @param {string} event_type
 * @param {function} callback
 */
el.prototype.on = function(event_type, callback) {
  this.events.push({ name: event_type, listener: callback });
  this.node.addEventListener(event_type, callback, false);
};

el.prototype.remove = function() {
  this.events.map(i => this.node.removeEventListener(i.event_type, i.listener, false));
  if (this.node.parentElement) {
    this.node.parentElement.removeChild(this.node);
  }
};

export function emptyNode(node) {
  while (node.firstChild) {
    if(node.firstChild.remove){
      node.firstChild.remove();
    }else {
      node.removeChild(node.firstChild);  
    }
  }
}

export function streamTopContainer(urlQuery, data) {
  const limit = parseInt(urlQuery.limit, 10);
  const offset = parseInt(urlQuery.offset, 10);
  const total = data._total;
  const lastPage = Math.ceil(total / limit);
  const streamResultsCount = new el('div');
  streamResultsCount.node.setAttribute('class', 'stream-results-count');
  streamResultsCount.node.innerText = `Total results: ${data._total}`;

  const streamPagination = new el('div');
  streamPagination.node.setAttribute('class', 'stream-pagination');

  const streamPaginationLeftArrow = new el('a');
  streamPaginationLeftArrow.node.setAttribute('class', 'stream-pagination-left-arrow');
  streamPaginationLeftArrow.on('click', function(e) {
    dispatch({
      type: HISTORY_UPDATE,
      data: {
        state: urlQuery,
        title: urlQuery.q,
        url: `/?q=${urlQuery.q}&offset=${offset === 0 ? Math.floor(total / limit) * limit : offset - limit}&limit=${urlQuery.limit}`
      }
    });
  });

  const streamPaginationText = new el('div');
  streamPaginationText.node.setAttribute('class', 'stream-pagination-text');
  streamPaginationText.node.innerText = `${Math.ceil(Math.min(total, offset) / limit) + 1} / ${lastPage}`;

  const streamPaginationRightArrow = new el('a');
  streamPaginationRightArrow.node.setAttribute('class', 'stream-pagination-right-arrow');
  streamPaginationRightArrow.on('click', function(e) {
    dispatch({
      type: HISTORY_UPDATE,
      data: {
        state: urlQuery,
        title: urlQuery.q,
        url: `/?q=${urlQuery.q}&offset=${parseInt(total / (offset + limit), 10) > 0 ? offset + limit : 0}&limit=${urlQuery.limit}`
      }
    });
  });

  streamPagination.node.appendChild(streamPaginationLeftArrow.node);
  streamPagination.node.appendChild(streamPaginationText.node);
  streamPagination.node.appendChild(streamPaginationRightArrow.node);

  const streamTopContainer = new el('div');
  streamTopContainer.node.setAttribute('class', 'stream-top-container');

  streamTopContainer.node.appendChild(streamResultsCount.node);
  streamTopContainer.node.appendChild(streamPagination.node);
  return streamTopContainer;
}

export function streamItem(i) {
  const streamItem = new el('div');
  streamItem.node.setAttribute('class', 'stream-item-container');

  const streamItemDetailsContainer = new el('div');
  streamItemDetailsContainer.node.setAttribute('class', 'stream-item-details-container');

  const streamItemGameName = new el('div');
  streamItemGameName.node.innerText = `${i.channel.name} - ${i.viewers} viewers`;

  const streamItemImage = new el('img');
  streamItemImage.node.setAttribute('class', 'stream-item-image-container');
  streamItemImage.node.setAttribute('src', `${i.preview.medium}`);

  const streamItemDisplayName = new el('h2');
  streamItemDisplayName.node.setAttribute('class', 'stream-item-details-heading');
  streamItemDisplayName.node.innerHTML = `<a href="${i.channel.url}" target="_blank">${i.channel.name}</a>`;

  const streamItemDisplayStatus = new el('p');
  streamItemDisplayStatus.node.setAttribute('class', 'stream-item-details-status');
  streamItemDisplayStatus.node.innerText = i.channel.status;

  streamItemDetailsContainer.node.appendChild(streamItemDisplayName.node);
  streamItemDetailsContainer.node.appendChild(streamItemGameName.node);
  streamItemDetailsContainer.node.appendChild(streamItemDisplayStatus.node);

  streamItem.node.appendChild(streamItemImage.node);
  streamItem.node.appendChild(streamItemDetailsContainer.node);
  return streamItem;
}