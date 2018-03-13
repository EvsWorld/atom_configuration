Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _modelsConfig = require('./models/config');

var _modelsConfig2 = _interopRequireDefault(_modelsConfig);

var _viewsConfig = require('./views/config');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];
  }

  _createClass(Config, [{
    key: 'init',
    value: function init() {

      this.disposables.push(atom.views.addViewProvider(_modelsConfig2['default'], _viewsConfig.createView), atom.workspace.addOpener(this.opener.bind(this)), atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.requestPane.bind(this)));
    }
  }, {
    key: 'opener',
    value: function opener(uri) {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      var _url$parse = _url2['default'].parse(uri);

      var protocol = _url$parse.protocol;
      var host = _url$parse.host;

      if (protocol !== 'atom-ternjs:' || host !== 'config') {

        return undefined;
      }

      var model = new _modelsConfig2['default']();

      model.setProjectDir(projectDir);
      model.setURI(uri);

      return model;
    }
  }, {
    key: 'requestPane',
    value: function requestPane() {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      if (!projectDir) {

        atom.notifications.addError('There is no active server');

        return;
      }

      var uri = 'atom-ternjs:' + '//config/' + projectDir;
      var previousPane = atom.workspace.paneForURI(uri);

      if (previousPane) {

        previousPane.activate();

        return;
      }

      atom.workspace.open('atom-ternjs:' + '//config/' + projectDir, {

        searchAllPanes: true,
        split: 'right'

      }).then(function (model) {

        // console.log(model);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O21CQUVnQixLQUFLOzs7OzRCQUVHLGlCQUFpQjs7OzsyQkFDaEIsZ0JBQWdCOztnQ0FJbEMsc0JBQXNCOztpQ0FFVCx1QkFBdUI7Ozs7QUFYM0MsV0FBVyxDQUFDOztJQWFOLE1BQU07QUFFQyxXQUZQLE1BQU0sR0FFSTswQkFGVixNQUFNOztBQUlSLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0dBQ3ZCOztlQUxHLE1BQU07O1dBT04sZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxvREFBeUIsRUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDM0YsQ0FBQztLQUNIOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUU7O0FBRVYsVUFBTSxVQUFVLEdBQUcsK0JBQVEsTUFBTSxJQUFJLCtCQUFRLE1BQU0sQ0FBQyxVQUFVLENBQUM7O3VCQUN0QyxpQkFBSSxLQUFLLENBQUMsR0FBRyxDQUFDOztVQUFoQyxRQUFRLGNBQVIsUUFBUTtVQUFFLElBQUksY0FBSixJQUFJOztBQUVyQixVQUNFLFFBQVEsS0FBSyxjQUFjLElBQzNCLElBQUksS0FBSyxRQUFRLEVBQ2pCOztBQUVBLGVBQU8sU0FBUyxDQUFDO09BQ2xCOztBQUVELFVBQU0sS0FBSyxHQUFHLCtCQUFpQixDQUFDOztBQUVoQyxXQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hDLFdBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWxCLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVVLHVCQUFHOztBQUVaLFVBQU0sVUFBVSxHQUFHLCtCQUFRLE1BQU0sSUFBSSwrQkFBUSxNQUFNLENBQUMsVUFBVSxDQUFDOztBQUUvRCxVQUFJLENBQUMsVUFBVSxFQUFFOztBQUVmLFlBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRXpELGVBQU87T0FDUjs7QUFFRCxVQUFNLEdBQUcsR0FBRyxjQUFjLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUN0RCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxZQUFZLEVBQUU7O0FBRWhCLG9CQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXhCLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxHQUFHLFVBQVUsRUFBRTs7QUFFN0Qsc0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGFBQUssRUFBRSxPQUFPOztPQUVmLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUs7OztPQUdsQixDQUFDLENBQUM7S0FDSjs7O1dBRU0sbUJBQUc7O0FBRVIsd0NBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCOzs7U0ExRUcsTUFBTTs7O3FCQTZFRyxJQUFJLE1BQU0sRUFBRSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG5pbXBvcnQgQ29uZmlnTW9kZWwgZnJvbSAnLi9tb2RlbHMvY29uZmlnJztcbmltcG9ydCB7Y3JlYXRlVmlld30gZnJvbSAnLi92aWV3cy9jb25maWcnO1xuXG5pbXBvcnQge1xuICBkaXNwb3NlQWxsXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcblxuY2xhc3MgQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goXG5cbiAgICAgIGF0b20udmlld3MuYWRkVmlld1Byb3ZpZGVyKENvbmZpZ01vZGVsLCBjcmVhdGVWaWV3KSxcbiAgICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcih0aGlzLm9wZW5lci5iaW5kKHRoaXMpKSxcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpvcGVuQ29uZmlnJywgdGhpcy5yZXF1ZXN0UGFuZS5iaW5kKHRoaXMpKVxuICAgICk7XG4gIH1cblxuICBvcGVuZXIodXJpKSB7XG5cbiAgICBjb25zdCBwcm9qZWN0RGlyID0gbWFuYWdlci5zZXJ2ZXIgJiYgbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcbiAgICBjb25zdCB7cHJvdG9jb2wsIGhvc3R9ID0gdXJsLnBhcnNlKHVyaSk7XG5cbiAgICBpZiAoXG4gICAgICBwcm90b2NvbCAhPT0gJ2F0b20tdGVybmpzOicgfHxcbiAgICAgIGhvc3QgIT09ICdjb25maWcnXG4gICAgKSB7XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWwgPSBuZXcgQ29uZmlnTW9kZWwoKTtcblxuICAgIG1vZGVsLnNldFByb2plY3REaXIocHJvamVjdERpcik7XG4gICAgbW9kZWwuc2V0VVJJKHVyaSk7XG5cbiAgICByZXR1cm4gbW9kZWw7XG4gIH1cblxuICByZXF1ZXN0UGFuZSgpIHtcblxuICAgIGNvbnN0IHByb2plY3REaXIgPSBtYW5hZ2VyLnNlcnZlciAmJiBtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyO1xuXG4gICAgaWYgKCFwcm9qZWN0RGlyKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignVGhlcmUgaXMgbm8gYWN0aXZlIHNlcnZlcicpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJpID0gJ2F0b20tdGVybmpzOicgKyAnLy9jb25maWcvJyArIHByb2plY3REaXI7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmkpO1xuXG4gICAgaWYgKHByZXZpb3VzUGFuZSkge1xuXG4gICAgICBwcmV2aW91c1BhbmUuYWN0aXZhdGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b20tdGVybmpzOicgKyAnLy9jb25maWcvJyArIHByb2plY3REaXIsIHtcblxuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICBzcGxpdDogJ3JpZ2h0J1xuXG4gICAgfSkudGhlbigobW9kZWwpID0+IHtcblxuICAgICAgLy8gY29uc29sZS5sb2cobW9kZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb25maWcoKTtcbiJdfQ==