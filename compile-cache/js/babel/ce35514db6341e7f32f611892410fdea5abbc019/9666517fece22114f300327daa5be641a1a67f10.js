Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _configTernConfig = require('../config/tern-config');

var _underscorePlus = require('underscore-plus');

'use babel';

var maxPendingRequests = 50;

var Server = (function () {
  function Server(projectRoot, client) {
    _classCallCheck(this, Server);

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.pendingRequest = 0;

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = (0, _underscorePlus.clone)(_configTernConfig.defaultServerConfig);

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      this.restart('Child process error: ' + e);
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect() {

      console.warn('child process disconnected.');
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      if (this.pendingRequest >= maxPendingRequests) {

        this.restart('Max number of pending requests reached. Restarting server...');

        return;
      }

      var requestID = _nodeUuid2['default'].v1();

      this.pendingRequest++;

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'restart',
    value: function restart(message) {

      atom.notifications.addError(message || 'Restarting Server...', {

        dismissable: false
      });

      _atomTernjsManager2['default'].destroyServer(this.projectDir);
      _atomTernjsManager2['default'].startServer(this.projectDir);
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        this.restart('UncaughtException: ' + e.error.message + '. Restarting Server...');

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';
      var id = e.id;

      if (!id) {

        console.error('no id given', e);

        return;
      }

      if (isError) {

        this.rejects[id] && this.rejects[id](e.error);
      } else {

        this.resolves[id] && this.resolves[id](e.data);
      }

      delete this.resolves[id];
      delete this.rejects[id];

      this.pendingRequest--;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      for (var key in this.rejects) {

        this.rejects[key]('Server is being destroyed. Rejecting.');
      }

      this.resolves = {};
      this.rejects = {};

      this.pendingRequest = 0;

      try {

        this.child.disconnect();
      } catch (error) {

        console.error(error);
      }
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message + '. Please restart atom after the file is fixed. This issue isn\'t fully covered yet.', { dismissable: true });

        _atomTernjsManager2['default'].destroyServer(this.projectDir);
      }
    }
  }, {
    key: 'mergeObjects',
    value: function mergeObjects(base, value) {

      if (!base) {

        return value;
      }

      if (!value) {

        return base;
      }

      var result = {};

      for (var prop in base) {

        result[prop] = base[prop];
      }

      for (var prop in value) {

        result[prop] = value[prop];
      }

      return result;
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          data[option] = this.mergeObjects(this.defaultConfig[option], data[option]);
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUVvQix1QkFBdUI7Ozs7Z0NBQ2xCLHNCQUFzQjs7a0JBQ2hDLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDTixNQUFNOzs7OzZCQUNSLGVBQWU7Ozs7eUJBQ1IsV0FBVzs7Ozt3QkFDaEIsV0FBVzs7OzsyQkFDSixjQUFjOzs7O3VDQUNaLDhCQUE4Qjs7OztnQ0FDdEIsdUJBQXVCOzs4QkFJbEQsaUJBQWlCOztBQWhCeEIsV0FBVyxDQUFDOztBQWtCWixJQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQzs7SUFFVCxNQUFNO0FBRWQsV0FGUSxNQUFNLENBRWIsV0FBVyxFQUFFLE1BQU0sRUFBRTswQkFGZCxNQUFNOztBQUl2QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxhQUFhLEdBQUcsaUVBQTBCLENBQUM7O0FBRWhELFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDOztBQUU1RCxRQUFJLE9BQU8sSUFBSSxnQkFBRyxVQUFVLENBQUMsa0JBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxj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QkFBWSxVQUFVLFlBQVUsTUFBTSxDQUFHLENBQ3hDOztBQUVILFlBQUksQ0FBQyxLQUFLLEVBQUU7O0FBRVYsY0FBSTs7QUFFRixpQkFBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLFdBQVMsTUFBTSxDQUFHLENBQUM7V0FFM0MsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixtQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNqQjtTQUNGOztBQUVELFlBQUksQ0FBQyxLQUFLLEVBQUU7O0FBRVYsY0FBSTs7QUFFRixpQkFBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLFVBQVUsMkJBQXNCLE1BQU0sQ0FBRyxDQUFDO1dBRTNFLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSw0QkFBMEIsTUFBTSxTQUFNOztBQUUvRCx5QkFBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gscUJBQVM7V0FDVjtTQUNGOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxlQUFPLENBQUMsa0JBQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ3RDOztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0F2WmtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHtmaWxlRXhpc3RzfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBjcCBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCB1dWlkIGZyb20gJ25vZGUtdXVpZCc7XG5pbXBvcnQgcmVzb2x2ZUZyb20gZnJvbSAncmVzb2x2ZS1mcm9tJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtkZWZhdWx0U2VydmVyQ29uZmlnfSBmcm9tICcuLi9jb25maWcvdGVybi1jb25maWcnO1xuXG5pbXBvcnQge1xuICBjbG9uZVxufSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5jb25zdCBtYXhQZW5kaW5nUmVxdWVzdHMgPSA1MDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0Um9vdCwgY2xpZW50KSB7XG5cbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuXG4gICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgIHRoaXMucmVqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdCA9IDA7XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0Um9vdDtcbiAgICB0aGlzLmRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vbm9kZV9tb2R1bGVzL3Rlcm4nKTtcblxuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IGNsb25lKGRlZmF1bHRTZXJ2ZXJDb25maWcpO1xuXG4gICAgY29uc3QgaG9tZURpciA9IHByb2Nlc3MuZW52LkhPTUUgfHwgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEU7XG5cbiAgICBpZiAoaG9tZURpciAmJiBmcy5leGlzdHNTeW5jKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpKSB7XG5cbiAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpO1xuICAgIH1cblxuICAgIHRoaXMucHJvamVjdEZpbGVOYW1lID0gJy50ZXJuLXByb2plY3QnO1xuICAgIHRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgaWYgKCF0aGlzLnByb2plY3REaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgdGhpcy5wcm9qZWN0RmlsZU5hbWUpKTtcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLmRlZmF1bHRDb25maWc7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuYXN5bmMgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMudGVyblNlcnZlckdldEZpbGVBc3luYztcbiAgICB0aGlzLmNvbmZpZy5kZXBlbmRlbmN5QnVkZ2V0ID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0O1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbJ2RvY19jb21tZW50J10gPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCBkZWZzID0gdGhpcy5maW5kRGVmcyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgcGx1Z2lucyA9IHRoaXMubG9hZFBsdWdpbnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IGZpbGVzID0gW107XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkpIHtcblxuICAgICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkuZm9yRWFjaCgocGF0KSA9PiB7XG5cbiAgICAgICAgZ2xvYi5zeW5jKHBhdCwgeyBjd2Q6IHRoaXMucHJvamVjdERpciB9KS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcblxuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZCA9IGNwLmZvcmsocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vYXRvbS10ZXJuanMtc2VydmVyLXdvcmtlci5qcycpKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdtZXNzYWdlJywgdGhpcy5vbldvcmtlck1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jaGlsZC5vbignZXJyb3InLCB0aGlzLm9uRXJyb3IpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLm9uRGlzY29ubmVjdCk7XG4gICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgdHlwZTogJ2luaXQnLFxuICAgICAgZGlyOiB0aGlzLnByb2plY3REaXIsXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgZGVmczogZGVmcyxcbiAgICAgIHBsdWdpbnM6IHBsdWdpbnMsXG4gICAgICBmaWxlczogZmlsZXNcbiAgICB9KTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuXG4gICAgdGhpcy5yZXN0YXJ0KGBDaGlsZCBwcm9jZXNzIGVycm9yOiAke2V9YCk7XG4gIH1cblxuICBvbkRpc2Nvbm5lY3QoKSB7XG5cbiAgICBjb25zb2xlLndhcm4oJ2NoaWxkIHByb2Nlc3MgZGlzY29ubmVjdGVkLicpO1xuICB9XG5cbiAgcmVxdWVzdCh0eXBlLCBkYXRhKSB7XG5cbiAgICBpZiAodGhpcy5wZW5kaW5nUmVxdWVzdCA+PSBtYXhQZW5kaW5nUmVxdWVzdHMpIHtcblxuICAgICAgdGhpcy5yZXN0YXJ0KCdNYXggbnVtYmVyIG9mIHBlbmRpbmcgcmVxdWVzdHMgcmVhY2hlZC4gUmVzdGFydGluZyBzZXJ2ZXIuLi4nKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZXF1ZXN0SUQgPSB1dWlkLnYxKCk7XG5cbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0Kys7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICB0aGlzLnJlc29sdmVzW3JlcXVlc3RJRF0gPSByZXNvbHZlO1xuICAgICAgdGhpcy5yZWplY3RzW3JlcXVlc3RJRF0gPSByZWplY3Q7XG5cbiAgICAgIHRoaXMuY2hpbGQuc2VuZCh7XG5cbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgaWQ6IHJlcXVlc3RJRCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmbHVzaCgpIHtcblxuICAgIHRoaXMucmVxdWVzdCgnZmx1c2gnLCB7fSkudGhlbigoKSA9PiB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdBbGwgZmlsZXMgZmV0Y2hlZCBhbmQgYW5hbHl6ZWQuJyk7XG4gICAgfSk7XG4gIH1cblxuICBkb250TG9hZChmaWxlKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmRvbnRMb2FkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZG9udExvYWQuc29tZSgocGF0KSA9PiB7XG5cbiAgICAgIHJldHVybiBtaW5pbWF0Y2goZmlsZSwgcGF0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc3RhcnQobWVzc2FnZSkge1xuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2UgfHwgJ1Jlc3RhcnRpbmcgU2VydmVyLi4uJywge1xuXG4gICAgICBkaXNtaXNzYWJsZTogZmFsc2VcbiAgICB9KTtcblxuICAgIG1hbmFnZXIuZGVzdHJveVNlcnZlcih0aGlzLnByb2plY3REaXIpO1xuICAgIG1hbmFnZXIuc3RhcnRTZXJ2ZXIodGhpcy5wcm9qZWN0RGlyKTtcbiAgfVxuXG4gIG9uV29ya2VyTWVzc2FnZShlKSB7XG5cbiAgICBpZiAoZS5lcnJvciAmJiBlLmVycm9yLmlzVW5jYXVnaHRFeGNlcHRpb24pIHtcblxuICAgICAgdGhpcy5yZXN0YXJ0KGBVbmNhdWdodEV4Y2VwdGlvbjogJHtlLmVycm9yLm1lc3NhZ2V9LiBSZXN0YXJ0aW5nIFNlcnZlci4uLmApO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNFcnJvciA9IGUuZXJyb3IgIT09ICdudWxsJyAmJiBlLmVycm9yICE9PSAndW5kZWZpbmVkJztcbiAgICBjb25zdCBpZCA9IGUuaWQ7XG5cbiAgICBpZiAoIWlkKSB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGlkIGdpdmVuJywgZSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNFcnJvcikge1xuXG4gICAgICB0aGlzLnJlamVjdHNbaWRdICYmIHRoaXMucmVqZWN0c1tpZF0oZS5lcnJvcik7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLnJlc29sdmVzW2lkXSAmJiB0aGlzLnJlc29sdmVzW2lkXShlLmRhdGEpO1xuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLnJlc29sdmVzW2lkXTtcbiAgICBkZWxldGUgdGhpcy5yZWplY3RzW2lkXTtcblxuICAgIHRoaXMucGVuZGluZ1JlcXVlc3QtLTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBpZiAoIXRoaXMuY2hpbGQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMucmVqZWN0cykge1xuXG4gICAgICB0aGlzLnJlamVjdHNba2V5XSgnU2VydmVyIGlzIGJlaW5nIGRlc3Ryb3llZC4gUmVqZWN0aW5nLicpO1xuICAgIH1cblxuICAgIHRoaXMucmVzb2x2ZXMgPSB7fTtcbiAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSAwO1xuXG4gICAgdHJ5IHtcblxuICAgICAgdGhpcy5jaGlsZC5kaXNjb25uZWN0KCk7XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICByZWFkSlNPTihmaWxlTmFtZSkge1xuXG4gICAgaWYgKGZpbGVFeGlzdHMoZmlsZU5hbWUpICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBmaWxlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVOYW1lLCAndXRmOCcpO1xuXG4gICAgdHJ5IHtcblxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZmlsZSk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgYEJhZCBKU09OIGluICR7ZmlsZU5hbWV9OiAke2UubWVzc2FnZX0uIFBsZWFzZSByZXN0YXJ0IGF0b20gYWZ0ZXIgdGhlIGZpbGUgaXMgZml4ZWQuIFRoaXMgaXNzdWUgaXNuJ3QgZnVsbHkgY292ZXJlZCB5ZXQuYCxcbiAgICAgICAgeyBkaXNtaXNzYWJsZTogdHJ1ZSB9XG4gICAgICApO1xuXG4gICAgICBtYW5hZ2VyLmRlc3Ryb3lTZXJ2ZXIodGhpcy5wcm9qZWN0RGlyKTtcbiAgICB9XG4gIH1cblxuICBtZXJnZU9iamVjdHMoYmFzZSwgdmFsdWUpIHtcblxuICAgIGlmICghYmFzZSkge1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKCF2YWx1ZSkge1xuXG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gYmFzZSkge1xuXG4gICAgICByZXN1bHRbcHJvcF0gPSBiYXNlW3Byb3BdO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcCBpbiB2YWx1ZSkge1xuXG4gICAgICByZXN1bHRbcHJvcF0gPSB2YWx1ZVtwcm9wXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVhZFByb2plY3RGaWxlKGZpbGVOYW1lKSB7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMucmVhZEpTT04oZmlsZU5hbWUpO1xuXG4gICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBvcHRpb24gaW4gdGhpcy5kZWZhdWx0Q29uZmlnKSB7XG5cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSB7XG5cbiAgICAgICAgZGF0YVtvcHRpb25dID0gdGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl07XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSAncGx1Z2lucycpIHtcblxuICAgICAgICBkYXRhW29wdGlvbl0gPSB0aGlzLm1lcmdlT2JqZWN0cyh0aGlzLmRlZmF1bHRDb25maWdbb3B0aW9uXSwgZGF0YVtvcHRpb25dKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIGZhbGxiYWNrRGlyKSB7XG5cbiAgICBsZXQgbG9jYWwgPSBwYXRoLnJlc29sdmUocHJvamVjdERpciwgZmlsZSk7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCAmJiBmcy5leGlzdHNTeW5jKGxvY2FsKSkge1xuXG4gICAgICByZXR1cm4gbG9jYWw7XG4gICAgfVxuXG4gICAgbGV0IHNoYXJlZCA9IHBhdGgucmVzb2x2ZShmYWxsYmFja0RpciwgZmlsZSk7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzaGFyZWQpKSB7XG5cbiAgICAgIHJldHVybiBzaGFyZWQ7XG4gICAgfVxuICB9XG5cbiAgZmluZERlZnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgZGVmcyA9IFtdO1xuICAgIGxldCBzcmMgPSBjb25maWcubGlicy5zbGljZSgpO1xuXG4gICAgaWYgKGNvbmZpZy5lY21hU2NyaXB0ICYmIHNyYy5pbmRleE9mKCdlY21hc2NyaXB0JykgPT09IC0xKSB7XG5cbiAgICAgIHNyYy51bnNoaWZ0KCdlY21hc2NyaXB0Jyk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcmMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgbGV0IGZpbGUgPSBzcmNbaV07XG5cbiAgICAgIGlmICghL1xcLmpzb24kLy50ZXN0KGZpbGUpKSB7XG5cbiAgICAgICAgZmlsZSA9IGAke2ZpbGV9Lmpzb25gO1xuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPVxuICAgICAgICB0aGlzLmZpbmRGaWxlKGZpbGUsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdkZWZzJykpIHx8XG4gICAgICAgIHJlc29sdmVGcm9tKHByb2plY3REaXIsIGB0ZXJuLSR7c3JjW2ldfWApXG4gICAgICAgIDtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3NyY1tpXX1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIGxpYnJhcnkgJHtzcmNbaV19XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuXG4gICAgICAgIGRlZnMucHVzaCh0aGlzLnJlYWRKU09OKGZvdW5kKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZnM7XG4gIH1cblxuICBsb2FkUGx1Z2lucyhwcm9qZWN0RGlyLCBjb25maWcpIHtcblxuICAgIGxldCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnM7XG4gICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZy5wbHVnaW5JbXBvcnRzID0gW107XG5cbiAgICBmb3IgKGxldCBwbHVnaW4gaW4gcGx1Z2lucykge1xuXG4gICAgICBsZXQgdmFsID0gcGx1Z2luc1twbHVnaW5dO1xuXG4gICAgICBpZiAoIXZhbCkge1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPVxuICAgICAgICB0aGlzLmZpbmRGaWxlKGAke3BsdWdpbn0uanNgLCBwcm9qZWN0RGlyLCBwYXRoLnJlc29sdmUodGhpcy5kaXN0RGlyLCAncGx1Z2luJykpIHx8XG4gICAgICAgIHJlc29sdmVGcm9tKHByb2plY3REaXIsIGB0ZXJuLSR7cGx1Z2lufWApXG4gICAgICAgIDtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgJHt0aGlzLnByb2plY3REaXJ9L25vZGVfbW9kdWxlcy90ZXJuLSR7cGx1Z2lufWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIGZpbmQgcGx1Z2luICR7cGx1Z2lufVxcbmAsIHtcblxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5JbXBvcnRzLnB1c2goZm91bmQpO1xuICAgICAgb3B0aW9uc1twYXRoLmJhc2VuYW1lKHBsdWdpbildID0gdmFsO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG59XG4iXX0=