Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public

  _createClass(Provider, [{
    key: 'add',
    value: function add(title) {
      var priority = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

      this.emitter.emit('did-add', { title: title, priority: priority });
    }

    // Public
  }, {
    key: 'remove',
    value: function remove(title) {
      this.emitter.emit('did-remove', title);
    }

    // Public
  }, {
    key: 'clear',
    value: function clear() {
      this.emitter.emit('did-clear');
    }
  }, {
    key: 'onDidAdd',
    value: function onDidAdd(callback) {
      return this.emitter.on('did-add', callback);
    }
  }, {
    key: 'onDidRemove',
    value: function onDidRemove(callback) {
      return this.emitter.on('did-remove', callback);
    }
  }, {
    key: 'onDidClear',
    value: function onDidClear(callback) {
      return this.emitter.on('did-clear', callback);
    }
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL3Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUU2QyxNQUFNOztJQUc5QixRQUFRO0FBSWhCLFdBSlEsUUFBUSxHQUliOzBCQUpLLFFBQVE7O0FBS3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7Ozs7ZUFUa0IsUUFBUTs7V0FXeEIsYUFBQyxLQUFhLEVBQTBCO1VBQXhCLFFBQWdCLHlEQUFHLEdBQUc7O0FBQ3ZDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7S0FDbEQ7Ozs7O1dBRUssZ0JBQUMsS0FBYSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUN2Qzs7Ozs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQy9COzs7V0FDTyxrQkFBQyxRQUErRCxFQUFjO0FBQ3BGLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDVSxxQkFBQyxRQUFrQyxFQUFjO0FBQzFELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDUyxvQkFBQyxRQUFxQixFQUFjO0FBQzVDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzlDOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXJDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyIHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgLy8gUHVibGljXG4gIGFkZCh0aXRsZTogc3RyaW5nLCBwcmlvcml0eTogbnVtYmVyID0gMTAwKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hZGQnLCB7IHRpdGxlLCBwcmlvcml0eSB9KVxuICB9XG4gIC8vIFB1YmxpY1xuICByZW1vdmUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtcmVtb3ZlJywgdGl0bGUpXG4gIH1cbiAgLy8gUHVibGljXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2xlYXInKVxuICB9XG4gIG9uRGlkQWRkKGNhbGxiYWNrOiAoKHN0YXR1czogeyB0aXRsZTogc3RyaW5nLCBwcmlvcml0eTpudW1iZXIgfSkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1hZGQnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZFJlbW92ZShjYWxsYmFjazogKCh0aXRsZTogc3RyaW5nKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXJlbW92ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkQ2xlYXIoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNsZWFyJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWREaXNwb3NlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kaXNwb3NlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRpc3Bvc2UnKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19