Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHyperclickProvider = require('./atom-ternjs-hyperclick-provider');

var _atomTernjsHyperclickProvider2 = _interopRequireDefault(_atomTernjsHyperclickProvider);

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      _atomTernjsManager2['default'].activate();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }, {
    key: 'provideHyperclick',
    value: function provideHyperclick() {

      return _atomTernjsHyperclickProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRXlCLFVBQVU7Ozs7a0NBQ2Qsd0JBQXdCOzs7O2lDQUN6Qix1QkFBdUI7Ozs7NENBQ3BCLG1DQUFtQzs7OztBQUwxRCxXQUFXLENBQUM7O0lBT04sVUFBVTtBQUVILFdBRlAsVUFBVSxHQUVBOzBCQUZWLFVBQVU7O0FBSVosUUFBSSxDQUFDLE1BQU0sc0JBQWUsQ0FBQztHQUM1Qjs7ZUFMRyxVQUFVOztXQU9OLG9CQUFHOztBQUVULHFDQUFRLFFBQVEsRUFBRSxDQUFDO0tBQ3BCOzs7V0FFUyxzQkFBRzs7QUFFWCxxQ0FBUSxPQUFPLEVBQUUsQ0FBQztLQUNuQjs7O1dBRU0sbUJBQUc7O0FBRVIsNkNBQWdCO0tBQ2pCOzs7V0FFZ0IsNkJBQUc7O0FBRWxCLHVEQUFrQjtLQUNuQjs7O1NBekJHLFVBQVU7OztxQkE0QkQsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGRlZmF1bENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgcHJvdmlkZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1wcm92aWRlcic7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IGh5cGVyY2xpY2sgZnJvbSAnLi9hdG9tLXRlcm5qcy1oeXBlcmNsaWNrLXByb3ZpZGVyJztcblxuY2xhc3MgQXRvbVRlcm5qcyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGRlZmF1bENvbmZpZztcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgbWFuYWdlci5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcblxuICAgIG1hbmFnZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgcHJvdmlkZSgpIHtcblxuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfVxuXG4gIHByb3ZpZGVIeXBlcmNsaWNrKCkge1xuICAgIFxuICAgIHJldHVybiBoeXBlcmNsaWNrO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tVGVybmpzKCk7XG4iXX0=