(function () {
  "use strict";

  angular.module('gslrApp')
    .factory('WebSocketService', function () {

      var socket = {
        ws: null,
        onopen: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = true;
          socket.status.willAttemptAgain = 0;
          socket.hooks.open();
        },
        onclose: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = false;
          socket.hooks.close();
          if (socket.config.autoOpen) setTimeout(socket.open, socket.config.retryInterval * 1000, true);
        },
        onerror: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = false;
          socket.hooks.close();
          if (socket.config.autoOpen) setTimeout(socket.open, socket.config.retryInterval * 1000, true);
        },
        onmessage: function (event) {
          if (socket.config.debug) console.log(event);
          try {
            var eventData = JSON.parse(event.data);
            var channel = socket.channels.filter(function (channel) {
              return channel.eventName == eventData.name;
            })[0];
            if (channel) channel.broadcast(eventData.data);
            else {
              if (socket.config.debug) console.log('Unknown Channel : ' + eventData.name, 'Data : ' + eventData.data);
            }
          } catch (exception) {
            if (socket.config.debug) console.log(exception);
          }
        },
        status: {
          connected: false,
          lastAttempted: 0,
          willAttemptAgain: 0,
          attempt: function () {
            this.lastAttempted = Date.now();
            this.willAttemptAgain = this.lastAttempted + socket.config.retryInterval;
          }
        },
        config: {
          url: window.GSLR_DATA.WEBSOCKET_URL,
          debug: window.GSLR_DATA.WEBSOCKET_DEBUG,
          autoOpen: window.GSLR_DATA.WEBSOCKET_AUTO_OPEN,
          retryInterval: window.GSLR_DATA.WEBSOCKET_RETRY_INTERVAL
        },
        hooks: {
          open: angular.noop,
          close: angular.noop,
          retry: angular.noop
        },
        channels: [],
        open: function () {
          var retry = !!socket.ws;
          if (!socket.ws || socket.ws.readyState == WebSocket.CLOSED) {
            socket.ws = new WebSocket(socket.config.url);
            socket.ws.onopen = socket.onopen;
            socket.ws.onclose = socket.onclose;
            socket.ws.onerror = socket.onerror;
            socket.ws.onmessage = socket.onmessage;
            socket.status.attempt();
            if (retry) socket.hooks.retry();
            return true;
          }
          return false;
        },
        close: function () {
          if (socket.ws && socket.ws.readyState == WebSocket.OPEN) {
            socket.ws.close();
            return true;
          }
          return false
        }
      };

      var Channel = function (name) {
        var found;

        for (var i = 0; i < socket.channels.length; i++)
          if (socket.channels[i].name == name)
            found = socket.channels[i];

        if (found) return found;

        var channel = {
          name: name,
          listeners: [],
          listen: function (listener) {
            this.listeners.push(listener);
            return this.listeners.length - 1;
          },
          ignore: function (listenerID) {
            this.listeners.splice(listenerID, 1);
          },
          emit: function (data) {
            socket.ws.send(JSON.stringify({
              name: this.name,
              data: data
            }));
          },
          broadcast: function (data) {
            this.listeners.forEach(function (listener) {
              listener(data);
            });
          }
        };
        socket.channels.push(channel);
        return channel;
      };

      var service = {
        socket: socket,
        Channel: Channel
      };

      socket.open();
      if (socket.config.debug) window.WSS = service;
      return service;

    });

})();