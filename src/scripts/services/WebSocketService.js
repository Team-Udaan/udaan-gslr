(function () {
  "use strict";

  angular.module('gslrApp')
    .factory('WebSocketService', function () {

      var socket = {
        ws: null,
        onopen: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = true;
          if (!socket.status.bootstrapped) {
            socket.status.bootstrapped = true;
            socket.hooks.bootstrap();
          }
          socket.hooks.open();
        },
        onclose: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = false;
          socket.hooks.close();
          if (socket.config.autoOpen) setTimeout(socket.open, socket.config.retryInterval * 1000);
        },
        onerror: function (event) {
          if (socket.config.debug) console.log(event);
          socket.status.connected = false;
          socket.hooks.close();
          if (socket.config.autoOpen) setTimeout(socket.open, socket.config.retryInterval * 1000);
        },
        onmessage: function (event) {
          if (socket.config.debug) console.log(event);
          try {
            var eventData = JSON.parse(event.data);
            var channel = socket.channels.filter(function (channel) {
              return channel.name == eventData.name;
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
          bootstrapped: false
        },
        config: {
          url: window.GSLR.WEBSOCKETS.URL,
          debug: window.GSLR.WEBSOCKETS.DEBUG,
          autoOpen: window.GSLR.WEBSOCKETS.AUTO_OPEN,
          retryInterval: window.GSLR.WEBSOCKETS.RETRY_INTERVAL
        },
        hooks: {
          open: angular.noop,
          close: angular.noop,
          bootstrap: angular.noop
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
          listenOnce: function (listener) {
            var that = this;
            var id = this.listen(function (data) {
              listener(data);
              that.ignore(id);
            });
            return id;
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