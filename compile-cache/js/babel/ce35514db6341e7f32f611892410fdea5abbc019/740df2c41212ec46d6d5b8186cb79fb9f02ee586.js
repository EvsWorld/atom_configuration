Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atom2 = _interopRequireDefault(_atom);

'use babel';

var Quokka = (function () {
  function Quokka() {
    _classCallCheck(this, Quokka);
  }

  _createClass(Quokka, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      setImmediate(function () {
        _this._plugin = require('quokka-atom');
        _this._plugin.activate({
          atom: _atom2['default'],
          extendedCoreClient: require('quokka-atom' + (!process.env.quokkaDebug ? '/build/extension/dist' : '') + '/wallaby/client'),
          atomViews: require('atom-space-pen-views'),
          statusBar: _this._statusBar,
          packagePath: _path2['default'].join(__dirname, '..')
        });
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this._plugin && this._plugin.deactivate();
    }
  }, {
    key: 'statusBar',
    value: function statusBar(control) {
      this._statusBar = control;
    }
  }]);

  return Quokka;
})();

exports['default'] = new Quokka();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS1xdW9ra2EvbGliL3F1b2trYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNOLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFDOztJQUtOLE1BQU07V0FBTixNQUFNOzBCQUFOLE1BQU07OztlQUFOLE1BQU07O1dBQ0Ysb0JBQUc7OztBQUNULGtCQUFZLENBQUMsWUFBTTtBQUNqQixjQUFLLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsY0FBSyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ3BCLGNBQUksbUJBQU07QUFDViw0QkFBa0IsRUFBRSxPQUFPLGtCQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsdUJBQXVCLEdBQUcsRUFBRSxDQUFBLHFCQUFrQjtBQUNuSCxtQkFBUyxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztBQUMxQyxtQkFBUyxFQUFFLE1BQUssVUFBVTtBQUMxQixxQkFBVyxFQUFFLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO1NBQ3hDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUMzQzs7O1dBRVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO0tBQzNCOzs7U0FwQkcsTUFBTTs7O3FCQXVCRyxJQUFJLE1BQU0sRUFBRSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F0b20tcXVva2thL2xpYi9xdW9ra2EuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgYXRvbSBmcm9tICdhdG9tJztcblxuY2xhc3MgUXVva2thIHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuX3BsdWdpbiA9IHJlcXVpcmUoJ3F1b2trYS1hdG9tJyk7XG4gICAgICB0aGlzLl9wbHVnaW4uYWN0aXZhdGUoe1xuICAgICAgICBhdG9tOiBhdG9tLFxuICAgICAgICBleHRlbmRlZENvcmVDbGllbnQ6IHJlcXVpcmUoYHF1b2trYS1hdG9tJHshcHJvY2Vzcy5lbnYucXVva2thRGVidWcgPyAnL2J1aWxkL2V4dGVuc2lvbi9kaXN0JyA6ICcnfS93YWxsYWJ5L2NsaWVudGApLFxuICAgICAgICBhdG9tVmlld3M6IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJyksXG4gICAgICAgIHN0YXR1c0JhcjogdGhpcy5fc3RhdHVzQmFyLFxuICAgICAgICBwYWNrYWdlUGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJylcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLl9wbHVnaW4gJiYgdGhpcy5fcGx1Z2luLmRlYWN0aXZhdGUoKTtcbiAgfVxuXG4gIHN0YXR1c0Jhcihjb250cm9sKSB7XG4gICAgdGhpcy5fc3RhdHVzQmFyID0gY29udHJvbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUXVva2thKCk7Il19