(function () {
  "use strict";

  angular.module('gslrApp')
    .factory('WebSocketService', function () {

      var ws = new WebSocket(window.GSLR_DATA.WEBSOCKET_URL);

      var config = {
        debug: window.GSLR_DATA.WEBSOCKET_DEBUG
      };

      var status = {
        connected: false
      };

      var hooks = {
        open: angular.noop,
        close: angular.noop
      };

      var channels = [];

      var Channel = function (eventName) {
        var channelInChannels = channels.reduce(function (result, next) {
          if (result) return result;
          if (next.eventName == eventName) return next;
        }, null);

        if (channelInChannels) {
          return channelInChannels;
        }

        var channel = {
          eventName: eventName,
          listeners: [],
          listen: function (listener) {
            this.listeners.push(listener);
            return this.listeners.length - 1;
          },
          ignore: function (listenerID) {
            this.listeners.splice(listenerID, 1);
          },
          emit: function (data) {
            ws.send(JSON.stringify({
              name: this.eventName,
              data: data
            }));
          },
          broadcast: function (data) {
            this.listeners.forEach(function (listener) {
              listener(data);
            });
          }
        };
        channels.push(channel);
        return channel;
      };

      ws.onopen = function (event) {
        if (config.debug) console.log(event);
        status.connected = true;
        hooks.open();
      };

      ws.onclose = function (code, reason, wasClean) {
        if (config.debug) console.log(code, reason, wasClean);
        status.connected = false;
        hooks.close();
      };

      ws.onerror = function (event) {
        if (config.debug) console.log(event);
        console.log('WS Error Occurred, Ready State is ' + ws.readyState + '.');
        status.connected = false;
        hooks.close();
      };

      ws.onmessage = function (event) {
        if (config.debug) console.log(event);
        try {
          var eventData = JSON.parse(event.data);
          var channel = channels.filter(function (channel) {
            return channel.eventName == eventData.name;
          })[0];
          if (channel) channel.broadcast(eventData.data);
          else {
            if (config.debug) console.log(event);
            else console.log('Unknown Channel ' + eventData.name + '.');
          }
        } catch (e) {
          if (config.debug) console.log(e);
          else console.log('Could Not Parse ' + event.data + '.');
        }
      };

      return {
        Channel: Channel,
        status: status,
        hooks: hooks
      };

    });

})();