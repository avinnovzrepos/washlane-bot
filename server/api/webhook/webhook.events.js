/**
 * Webhook model events
 */

'use strict';

import {EventEmitter} from 'events';
import Webhook from './webhook.model';
var WebhookEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WebhookEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Webhook.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    WebhookEvents.emit(event + ':' + doc._id, doc);
    WebhookEvents.emit(event, doc);
  }
}

export default WebhookEvents;
