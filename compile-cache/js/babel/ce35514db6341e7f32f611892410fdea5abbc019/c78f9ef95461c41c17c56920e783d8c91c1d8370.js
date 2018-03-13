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

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var PackageConfig = (function () {
  function PackageConfig() {
    _classCallCheck(this, PackageConfig);

    this.disposables = [];
    this.defaultConfig = _config2['default'];
    this.options = this.getInitalOptions();
  }

  _createClass(PackageConfig, [{
    key: 'init',
    value: function init() {

      this.options = this.getInitalOptions();
      this.registerListeners();
    }
  }, {
    key: 'getInitalOptions',
    value: function getInitalOptions() {

      return {

        excludeLowerPriority: this.get('excludeLowerPriorityProviders'),
        inlineFnCompletion: this.get('inlineFnCompletion'),
        inlineFnCompletionDocumentation: this.get('inlineFnCompletionDocumentation'),
        useSnippets: this.get('useSnippets'),
        snippetsFirst: this.get('snippetsFirst'),
        useSnippetsAndFunction: this.get('useSnippetsAndFunction'),
        sort: this.get('sort'),
        guess: this.get('guess'),
        urls: this.get('urls'),
        origins: this.get('origins'),
        caseInsensitive: this.get('caseInsensitive'),
        documentation: this.get('documentation'),
        ternServerGetFileAsync: this.get('ternServerGetFileAsync'),
        ternServerDependencyBudget: this.get('ternServerDependencyBudget')
      };
    }
  }, {
    key: 'get',
    value: function get(option) {

      var value = atom.config.get('atom-ternjs.' + option);

      if (value === undefined) {

        return this.defaultConfig[option]['default'];
      }

      return value;
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var _this = this;

      this.disposables.push(atom.config.observe('atom-ternjs.excludeLowerPriorityProviders', function (value) {

        _this.options.excludeLowerPriority = value;

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].excludeLowerPriority = value;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.snippetsFirst', function (value) {

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].suggestionPriority = value ? null : 2;
        }

        _this.options.snippetsFirst = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', function (value) {

        _this.options.inlineFnCompletion = value;
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.ternServerGetFileAsync', function (value) {
        return _this.options.ternServerGetFileAsync = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.ternServerDependencyBudget', function (value) {
        return _this.options.ternServerDependencyBudget = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletionDocumentation', function (value) {
        return _this.options.inlineFnCompletionDocumentation = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', function (value) {
        return _this.options.useSnippets = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', function (value) {
        return _this.options.useSnippetsAndFunction = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.sort', function (value) {
        return _this.options.sort = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.guess', function (value) {
        return _this.options.guess = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.urls', function (value) {
        return _this.options.urls = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.origins', function (value) {
        return _this.options.origins = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', function (value) {
        return _this.options.caseInsensitive = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.documentation', function (value) {
        return _this.options.documentation = value;
      }));
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
    }
  }]);

  return PackageConfig;
})();

exports['default'] = new PackageConfig();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRXlCLFVBQVU7Ozs7a0NBQ2Qsd0JBQXdCOzs7O2dDQUN6QixzQkFBc0I7Ozs7Z0NBQ2pCLHNCQUFzQjs7QUFML0MsV0FBVyxDQUFDOztJQU9OLGFBQWE7QUFFTixXQUZQLGFBQWEsR0FFSDswQkFGVixhQUFhOztBQUlmLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLHNCQUFlLENBQUM7QUFDbEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN4Qzs7ZUFQRyxhQUFhOztXQVNiLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDdkMsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDMUI7OztXQUVlLDRCQUFHOztBQUVqQixhQUFPOztBQUVMLDRCQUFvQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7QUFDL0QsMEJBQWtCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztBQUNsRCx1Q0FBK0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDO0FBQzVFLG1CQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7QUFDcEMscUJBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUN4Qyw4QkFBc0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0FBQzFELFlBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUN0QixhQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDeEIsWUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3RCLGVBQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztBQUM1Qix1QkFBZSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7QUFDNUMscUJBQWEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUN4Qyw4QkFBc0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0FBQzFELGtDQUEwQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7T0FDbkUsQ0FBQztLQUNIOzs7V0FFRSxhQUFDLE1BQU0sRUFBRTs7QUFFVixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsa0JBQWdCLE1BQU0sQ0FBRyxDQUFDOztBQUV2RCxVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7O0FBRXZCLGVBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBUSxDQUFDO09BQzNDOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVnQiw2QkFBRzs7O0FBRWxCLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJDQUEyQyxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVoRyxjQUFLLE9BQU8sQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7O0FBRTFDLDZDQUFjOztBQUVaLDBDQUFTLG9CQUFvQixHQUFHLEtBQUssQ0FBQztTQUN2QztPQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVoRiw2Q0FBYzs7QUFFWiwwQ0FBUyxrQkFBa0IsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNoRDs7QUFFRCxjQUFLLE9BQU8sQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO09BQ3BDLENBQUMsQ0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUVyRixjQUFLLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDeEMsc0NBQVEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7T0FDdEMsQ0FBQyxDQUFDLENBQUM7O0FBRUosVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0NBQW9DLEVBQUUsVUFBQSxLQUFLO2VBQUksTUFBSyxPQUFPLENBQUMsc0JBQXNCLEdBQUcsS0FBSztPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ3ZJLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxFQUFFLFVBQUEsS0FBSztlQUFJLE1BQUssT0FBTyxDQUFDLDBCQUEwQixHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUMvSSxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsRUFBRSxVQUFBLEtBQUs7ZUFBSSxNQUFLLE9BQU8sQ0FBQywrQkFBK0IsR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDekosVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUUsVUFBQSxLQUFLO2VBQUksTUFBSyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUNqSCxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxVQUFBLEtBQUs7ZUFBSSxNQUFLLE9BQU8sQ0FBQyxzQkFBc0IsR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDdkksVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsVUFBQSxLQUFLO2VBQUksTUFBSyxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUNuRyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLEtBQUs7ZUFBSSxNQUFLLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSztPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ3JHLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFVBQUEsS0FBSztlQUFJLE1BQUssT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDLENBQUM7QUFDbkcsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBQSxLQUFLO2VBQUksTUFBSyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUMsQ0FBQztBQUN6RyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxVQUFBLEtBQUs7ZUFBSSxNQUFLLE9BQU8sQ0FBQyxlQUFlLEdBQUcsS0FBSztPQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ3pILFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLFVBQUEsS0FBSztlQUFJLE1BQUssT0FBTyxDQUFDLGFBQWEsR0FBRyxLQUFLO09BQUEsQ0FBQyxDQUFDLENBQUM7S0FDdEg7OztXQUVNLG1CQUFHOztBQUVSLHdDQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN2Qjs7O1NBN0ZHLGFBQWE7OztxQkFnR0osSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGRlZmF1bENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgcHJvdmlkZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1wcm92aWRlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge2Rpc3Bvc2VBbGx9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuY2xhc3MgUGFja2FnZUNvbmZpZyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgdGhpcy5kZWZhdWx0Q29uZmlnID0gZGVmYXVsQ29uZmlnO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuZ2V0SW5pdGFsT3B0aW9ucygpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuZ2V0SW5pdGFsT3B0aW9ucygpO1xuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGdldEluaXRhbE9wdGlvbnMoKSB7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICBleGNsdWRlTG93ZXJQcmlvcml0eTogdGhpcy5nZXQoJ2V4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzJyksXG4gICAgICBpbmxpbmVGbkNvbXBsZXRpb246IHRoaXMuZ2V0KCdpbmxpbmVGbkNvbXBsZXRpb24nKSxcbiAgICAgIGlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb246IHRoaXMuZ2V0KCdpbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uJyksXG4gICAgICB1c2VTbmlwcGV0czogdGhpcy5nZXQoJ3VzZVNuaXBwZXRzJyksXG4gICAgICBzbmlwcGV0c0ZpcnN0OiB0aGlzLmdldCgnc25pcHBldHNGaXJzdCcpLFxuICAgICAgdXNlU25pcHBldHNBbmRGdW5jdGlvbjogdGhpcy5nZXQoJ3VzZVNuaXBwZXRzQW5kRnVuY3Rpb24nKSxcbiAgICAgIHNvcnQ6IHRoaXMuZ2V0KCdzb3J0JyksXG4gICAgICBndWVzczogdGhpcy5nZXQoJ2d1ZXNzJyksXG4gICAgICB1cmxzOiB0aGlzLmdldCgndXJscycpLFxuICAgICAgb3JpZ2luczogdGhpcy5nZXQoJ29yaWdpbnMnKSxcbiAgICAgIGNhc2VJbnNlbnNpdGl2ZTogdGhpcy5nZXQoJ2Nhc2VJbnNlbnNpdGl2ZScpLFxuICAgICAgZG9jdW1lbnRhdGlvbjogdGhpcy5nZXQoJ2RvY3VtZW50YXRpb24nKSxcbiAgICAgIHRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmM6IHRoaXMuZ2V0KCd0ZXJuU2VydmVyR2V0RmlsZUFzeW5jJyksXG4gICAgICB0ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldDogdGhpcy5nZXQoJ3Rlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0JylcbiAgICB9O1xuICB9XG5cbiAgZ2V0KG9wdGlvbikge1xuXG4gICAgY29uc3QgdmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoYGF0b20tdGVybmpzLiR7b3B0aW9ufWApO1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdENvbmZpZ1tvcHRpb25dLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnMnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdmFsdWU7XG5cbiAgICAgIGlmIChwcm92aWRlcikge1xuXG4gICAgICAgIHByb3ZpZGVyLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnNuaXBwZXRzRmlyc3QnLCAodmFsdWUpID0+IHtcblxuICAgICAgaWYgKHByb3ZpZGVyKSB7XG5cbiAgICAgICAgcHJvdmlkZXIuc3VnZ2VzdGlvblByaW9yaXR5ID0gdmFsdWUgPyBudWxsIDogMjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLnNuaXBwZXRzRmlyc3QgPSB2YWx1ZTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuaW5saW5lRm5Db21wbGV0aW9uJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb24gPSB2YWx1ZTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgndHlwZS1kZXN0cm95LW92ZXJsYXknKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudGVyblNlcnZlckdldEZpbGVBc3luYycsIHZhbHVlID0+IHRoaXMub3B0aW9ucy50ZXJuU2VydmVyR2V0RmlsZUFzeW5jID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMudGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5pbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb24gPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy51c2VTbmlwcGV0cycsIHZhbHVlID0+IHRoaXMub3B0aW9ucy51c2VTbmlwcGV0cyA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24nLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMudXNlU25pcHBldHNBbmRGdW5jdGlvbiA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnNvcnQnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMuc29ydCA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmd1ZXNzJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLmd1ZXNzID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudXJscycsIHZhbHVlID0+IHRoaXMub3B0aW9ucy51cmxzID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMub3JpZ2lucycsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5vcmlnaW5zID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuY2FzZUluc2Vuc2l0aXZlJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLmNhc2VJbnNlbnNpdGl2ZSA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmRvY3VtZW50YXRpb24nLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMuZG9jdW1lbnRhdGlvbiA9IHZhbHVlKSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZGlzcG9zZUFsbCh0aGlzLmRpc3Bvc2FibGVzKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFBhY2thZ2VDb25maWcoKTtcbiJdfQ==