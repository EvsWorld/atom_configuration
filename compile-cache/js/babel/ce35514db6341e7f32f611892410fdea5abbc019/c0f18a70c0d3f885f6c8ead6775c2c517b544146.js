Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// Greets

var _greetV2Welcome = require('./greet-v2-welcome');

var _greetV2Welcome2 = _interopRequireDefault(_greetV2Welcome);

// Note: This package should not be used from "Main" class,
// Instead it should be used from the main package entry point directly

var Greeter = (function () {
  function Greeter() {
    _classCallCheck(this, Greeter);

    this.notifications = new Set();
  }

  _createClass(Greeter, [{
    key: 'showWelcome',
    value: function showWelcome() {
      (0, _greetV2Welcome2['default'])();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.notifications.forEach(function (n) {
        return n.dismiss();
      });
      this.notifications.clear();
    }
  }]);

  return Greeter;
})();

exports['default'] = Greeter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9ncmVldGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFHMkIsb0JBQW9COzs7Ozs7O0lBSzFCLE9BQU87QUFFZixXQUZRLE9BQU8sR0FFWjswQkFGSyxPQUFPOztBQUd4QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDL0I7O2VBSmtCLE9BQU87O1dBS2YsdUJBQVM7QUFDbEIsd0NBQWdCLENBQUE7S0FDakI7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzNCOzs7U0FYa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2dyZWV0ZXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyBHcmVldHNcbmltcG9ydCBncmVldFYyV2VsY29tZSBmcm9tICcuL2dyZWV0LXYyLXdlbGNvbWUnXG5cblxuLy8gTm90ZTogVGhpcyBwYWNrYWdlIHNob3VsZCBub3QgYmUgdXNlZCBmcm9tIFwiTWFpblwiIGNsYXNzLFxuLy8gSW5zdGVhZCBpdCBzaG91bGQgYmUgdXNlZCBmcm9tIHRoZSBtYWluIHBhY2thZ2UgZW50cnkgcG9pbnQgZGlyZWN0bHlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyZWV0ZXIge1xuICBub3RpZmljYXRpb25zOiBTZXQ8T2JqZWN0PjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gbmV3IFNldCgpXG4gIH1cbiAgc2hvd1dlbGNvbWUoKTogdm9pZCB7XG4gICAgZ3JlZXRWMldlbGNvbWUoKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zLmZvckVhY2gobiA9PiBuLmRpc21pc3MoKSlcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuY2xlYXIoKVxuICB9XG59XG4iXX0=