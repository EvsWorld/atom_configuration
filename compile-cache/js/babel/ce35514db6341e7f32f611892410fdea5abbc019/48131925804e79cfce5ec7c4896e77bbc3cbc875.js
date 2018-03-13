Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsServer = require('./atom-ternjs-server');

var _atomTernjsServer2 = _interopRequireDefault(_atomTernjsServer);

var _atomTernjsClient = require('./atom-ternjs-client');

var _atomTernjsClient2 = _interopRequireDefault(_atomTernjsClient);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsDocumentation = require('./atom-ternjs-documentation');

var _atomTernjsDocumentation2 = _interopRequireDefault(_atomTernjsDocumentation);

var _atomTernjsReference = require('./atom-ternjs-reference');

var _atomTernjsReference2 = _interopRequireDefault(_atomTernjsReference);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsType = require('./atom-ternjs-type');

var _atomTernjsType2 = _interopRequireDefault(_atomTernjsType);

var _atomTernjsConfig = require('./atom-ternjs-config');

var _atomTernjsConfig2 = _interopRequireDefault(_atomTernjsConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsRename = require('./atom-ternjs-rename');

var _atomTernjsRename2 = _interopRequireDefault(_atomTernjsRename);

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Manager = (function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.disposables = [];
    /**
     * collection of all active clients
     * @type {Array}
     */
    this.clients = [];
    /**
     * reference to the client for the active text-editor
     * @type {Client}
     */
    this.client = null;
    /**
     * collection of all active servers
     * @type {Array}
     */
    this.servers = [];
    /**
     * reference to the server for the active text-editor
     * @type {Server}
     */
    this.server = null;
    this.editors = [];
  }

  _createClass(Manager, [{
    key: 'activate',
    value: function activate() {

      this.registerListeners();
      this.registerCommands();

      _atomTernjsConfig2['default'].init();
      _atomTernjsDocumentation2['default'].init();
      _atomTernjsPackageConfig2['default'].init();
      _atomTernjsProvider2['default'].init();
      _atomTernjsReference2['default'].init();
      _atomTernjsRename2['default'].init();
      _atomTernjsType2['default'].init();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
      this.editors.forEach(function (editor) {
        return (0, _atomTernjsHelper.disposeAll)(editor.disposables);
      });
      this.editors = [];

      for (var server of this.servers) {

        server.destroy();
      }

      this.servers = [];
      this.clients = [];

      this.server = null;
      this.client = null;

      _atomTernjsDocumentation2['default'] && _atomTernjsDocumentation2['default'].destroy();
      _atomTernjsReference2['default'] && _atomTernjsReference2['default'].destroy();
      _atomTernjsType2['default'] && _atomTernjsType2['default'].destroy();
      _atomTernjsPackageConfig2['default'] && _atomTernjsPackageConfig2['default'].destroy();
      _atomTernjsRename2['default'] && _atomTernjsRename2['default'].destroy();
      _atomTernjsConfig2['default'] && _atomTernjsConfig2['default'].destroy();
      _atomTernjsProvider2['default'] && _atomTernjsProvider2['default'].destroy();
      _servicesNavigation2['default'].reset();
    }
  }, {
    key: 'startServer',
    value: function startServer(projectDir) {

      if (!(0, _atomTernjsHelper.isDirectory)(projectDir)) {

        return false;
      }

      if (this.getServerForProject(projectDir)) {

        return true;
      }

      var client = new _atomTernjsClient2['default'](projectDir);
      this.clients.push(client);

      this.servers.push(new _atomTernjsServer2['default'](projectDir, client));

      this.setActiveServerAndClient(projectDir);

      return true;
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(uRI) {

      this.server = this.getServerForProject(uRI);
      this.client = this.getClientForProject(uRI);
    }
  }, {
    key: 'destroyClient',
    value: function destroyClient(projectDir) {
      var _this = this;

      var clients = this.clients.slice();

      clients.forEach(function (client, i) {

        if (client.projectDir === projectDir) {

          _this.clients.splice(i, 1);
        }
      });
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(projectDir) {
      var _this2 = this;

      var servers = this.servers.slice();

      servers.forEach(function (server, i) {

        if (server.projectDir === projectDir) {

          server.destroy();
          _this2.servers.splice(i, 1);
          _this2.destroyClient(projectDir);
        }
      });
    }
  }, {
    key: 'destroyUnusedServers',
    value: function destroyUnusedServers() {
      var _this3 = this;

      var projectDirs = this.editors.map(function (editor) {
        return editor.projectDir;
      });
      var servers = this.servers.slice();

      servers.forEach(function (server) {

        if (!projectDirs.includes(server.projectDir)) {

          _this3.destroyServer(server.projectDir);
        }
      });
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      return this.servers.filter(function (server) {
        return server.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      return this.clients.filter(function (client) {
        return client.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getEditor',
    value: function getEditor(id) {

      return this.editors.filter(function (editor) {
        return editor.id === id;
      }).pop();
    }
  }, {
    key: 'destroyEditor',
    value: function destroyEditor(id) {
      var _this4 = this;

      var editors = this.editors.slice();

      editors.forEach(function (editor, i) {

        if (editor.id === id) {

          (0, _atomTernjsHelper.disposeAll)(editor.disposables);
          _this4.editors.splice(i, 1);
        }
      });
    }
  }, {
    key: 'getProjectDir',
    value: function getProjectDir(uRI) {
      var _atom$project$relativizePath = atom.project.relativizePath(uRI);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var project = _atom$project$relativizePath2[0];
      var file = _atom$project$relativizePath2[1];

      if (project) {

        return project;
      }

      if (file) {

        var absolutePath = _path2['default'].resolve(__dirname, file);

        return _path2['default'].dirname(absolutePath);
      }

      return undefined;
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var _this5 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!(0, _atomTernjsHelper.isValidEditor)(editor)) {

          return;
        }

        var uRI = editor.getURI();
        var projectDir = _this5.getProjectDir(uRI);
        var serverCreatedOrPresent = _this5.startServer(projectDir);

        if (!serverCreatedOrPresent) {

          return;
        }

        var id = editor.id;
        var disposables = [];

        // Register valid editor
        _this5.editors.push({

          id: id,
          projectDir: projectDir,
          disposables: disposables
        });

        disposables.push(editor.onDidDestroy(function () {

          _this5.destroyEditor(id);
          _this5.destroyUnusedServers();
        }));

        disposables.push(editor.onDidChangeCursorPosition(function (e) {

          if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletion) {

            _this5.client && _atomTernjsType2['default'].queryType(editor, e);
          }
        }));

        disposables.push(editor.getBuffer().onDidSave(function (e) {

          _this5.client && _this5.client.update(editor);
        }));
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('rename-hide');

        if (!(0, _atomTernjsHelper.isValidEditor)(item)) {

          _atomTernjsEvents2['default'].emit('reference-hide');
        } else {

          var uRI = item.getURI();
          var projectDir = _this5.getProjectDir(uRI);

          _this5.setActiveServerAndClient(projectDir);
        }
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this6 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('reference-hide');
        _atomTernjsEvents2['default'].emit('rename-hide');
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this6.client) {

          _this6.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        _this6.server && _this6.server.flush();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateBack', function (e) {

        _servicesNavigation2['default'].goTo(-1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateForward', function (e) {

        _servicesNavigation2['default'].goTo(1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        _this6.client && _this6.client.definition();
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this6.server && _this6.server.restart();
      }));
    }
  }]);

  return Manager;
})();

exports['default'] = new Manager();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2dDQUVtQixzQkFBc0I7Ozs7Z0NBQ3RCLHNCQUFzQjs7OztnQ0FDckIsc0JBQXNCOzs7O3VDQUNoQiw2QkFBNkI7Ozs7bUNBQ2pDLHlCQUF5Qjs7Ozt1Q0FDckIsOEJBQThCOzs7OzhCQUN2QyxvQkFBb0I7Ozs7Z0NBQ2xCLHNCQUFzQjs7OztnQ0FLbEMsc0JBQXNCOztrQ0FDUix3QkFBd0I7Ozs7Z0NBQzFCLHNCQUFzQjs7OztrQ0FDbEIsdUJBQXVCOzs7O29CQUM3QixNQUFNOzs7O0FBbEJ2QixXQUFXLENBQUM7O0lBb0JOLE9BQU87QUFFQSxXQUZQLE9BQU8sR0FFRzswQkFGVixPQUFPOztBQUlULFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7OztBQUt0QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Ozs7O0FBS25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7ZUExQkcsT0FBTzs7V0E0Qkgsb0JBQUc7O0FBRVQsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDekIsVUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0FBRXhCLG9DQUFPLElBQUksRUFBRSxDQUFDO0FBQ2QsMkNBQWMsSUFBSSxFQUFFLENBQUM7QUFDckIsMkNBQWMsSUFBSSxFQUFFLENBQUM7QUFDckIsc0NBQVMsSUFBSSxFQUFFLENBQUM7QUFDaEIsdUNBQVUsSUFBSSxFQUFFLENBQUM7QUFDakIsb0NBQU8sSUFBSSxFQUFFLENB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bGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFNlcnZlciBmcm9tICcuL2F0b20tdGVybmpzLXNlcnZlcic7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vYXRvbS10ZXJuanMtY2xpZW50JztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBkb2N1bWVudGF0aW9uIGZyb20gJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbic7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHR5cGUgZnJvbSAnLi9hdG9tLXRlcm5qcy10eXBlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1jb25maWcnO1xuaW1wb3J0IHtcbiAgaXNEaXJlY3RvcnksXG4gIGlzVmFsaWRFZGl0b3IsXG4gIGRpc3Bvc2VBbGxcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IHJlbmFtZSBmcm9tICcuL2F0b20tdGVybmpzLXJlbmFtZSc7XG5pbXBvcnQgbmF2aWdhdGlvbiBmcm9tICcuL3NlcnZpY2VzL25hdmlnYXRpb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNsYXNzIE1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIC8qKlxuICAgICAqIGNvbGxlY3Rpb24gb2YgYWxsIGFjdGl2ZSBjbGllbnRzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIC8qKlxuICAgICAqIHJlZmVyZW5jZSB0byB0aGUgY2xpZW50IGZvciB0aGUgYWN0aXZlIHRleHQtZWRpdG9yXG4gICAgICogQHR5cGUge0NsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogY29sbGVjdGlvbiBvZiBhbGwgYWN0aXZlIHNlcnZlcnNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgLyoqXG4gICAgICogcmVmZXJlbmNlIHRvIHRoZSBzZXJ2ZXIgZm9yIHRoZSBhY3RpdmUgdGV4dC1lZGl0b3JcbiAgICAgKiBAdHlwZSB7U2VydmVyfVxuICAgICAqL1xuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuXG4gICAgY29uZmlnLmluaXQoKTtcbiAgICBkb2N1bWVudGF0aW9uLmluaXQoKTtcbiAgICBwYWNrYWdlQ29uZmlnLmluaXQoKTtcbiAgICBwcm92aWRlci5pbml0KCk7XG4gICAgcmVmZXJlbmNlLmluaXQoKTtcbiAgICByZW5hbWUuaW5pdCgpO1xuICAgIHR5cGUuaW5pdCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMuZWRpdG9ycy5mb3JFYWNoKGVkaXRvciA9PiBkaXNwb3NlQWxsKGVkaXRvci5kaXNwb3NhYmxlcykpO1xuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgdGhpcy5jbGllbnRzID0gW107XG5cbiAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5jbGllbnQgPSBudWxsO1xuXG4gICAgZG9jdW1lbnRhdGlvbiAmJiBkb2N1bWVudGF0aW9uLmRlc3Ryb3koKTtcbiAgICByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRlc3Ryb3koKTtcbiAgICB0eXBlICYmIHR5cGUuZGVzdHJveSgpO1xuICAgIHBhY2thZ2VDb25maWcgJiYgcGFja2FnZUNvbmZpZy5kZXN0cm95KCk7XG4gICAgcmVuYW1lICYmIHJlbmFtZS5kZXN0cm95KCk7XG4gICAgY29uZmlnICYmIGNvbmZpZy5kZXN0cm95KCk7XG4gICAgcHJvdmlkZXIgJiYgcHJvdmlkZXIuZGVzdHJveSgpO1xuICAgIG5hdmlnYXRpb24ucmVzZXQoKTtcbiAgfVxuXG4gIHN0YXJ0U2VydmVyKHByb2plY3REaXIpIHtcblxuICAgIGlmICghaXNEaXJlY3RvcnkocHJvamVjdERpcikpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldFNlcnZlckZvclByb2plY3QocHJvamVjdERpcikpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChwcm9qZWN0RGlyKTtcbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuXG4gICAgdGhpcy5zZXJ2ZXJzLnB1c2gobmV3IFNlcnZlcihwcm9qZWN0RGlyLCBjbGllbnQpKTtcblxuICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KHByb2plY3REaXIpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQodVJJKSB7XG5cbiAgICB0aGlzLnNlcnZlciA9IHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdCh1UkkpO1xuICAgIHRoaXMuY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KHVSSSk7XG4gIH1cblxuICBkZXN0cm95Q2xpZW50KHByb2plY3REaXIpIHtcblxuICAgIGNvbnN0IGNsaWVudHMgPSB0aGlzLmNsaWVudHMuc2xpY2UoKTtcblxuICAgIGNsaWVudHMuZm9yRWFjaCgoY2xpZW50LCBpKSA9PiB7XG5cbiAgICAgIGlmIChjbGllbnQucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95U2VydmVyKHByb2plY3REaXIpIHtcblxuICAgIGNvbnN0IHNlcnZlcnMgPSB0aGlzLnNlcnZlcnMuc2xpY2UoKTtcblxuICAgIHNlcnZlcnMuZm9yRWFjaCgoc2VydmVyLCBpKSA9PiB7XG5cbiAgICAgIGlmIChzZXJ2ZXIucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuc2VydmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHRoaXMuZGVzdHJveUNsaWVudChwcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3lVbnVzZWRTZXJ2ZXJzKCkge1xuXG4gICAgY29uc3QgcHJvamVjdERpcnMgPSB0aGlzLmVkaXRvcnMubWFwKGVkaXRvciA9PiBlZGl0b3IucHJvamVjdERpcik7XG4gICAgY29uc3Qgc2VydmVycyA9IHRoaXMuc2VydmVycy5zbGljZSgpO1xuXG4gICAgc2VydmVycy5mb3JFYWNoKHNlcnZlciA9PiB7XG5cbiAgICAgIGlmICghcHJvamVjdERpcnMuaW5jbHVkZXMoc2VydmVyLnByb2plY3REaXIpKSB7XG5cbiAgICAgICAgdGhpcy5kZXN0cm95U2VydmVyKHNlcnZlci5wcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFNlcnZlckZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgcmV0dXJuIHRoaXMuc2VydmVycy5maWx0ZXIoc2VydmVyID0+IHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKS5wb3AoKTtcbiAgfVxuXG4gIGdldENsaWVudEZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoY2xpZW50ID0+IGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKS5wb3AoKTtcbiAgfVxuXG4gIGdldEVkaXRvcihpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9ycy5maWx0ZXIoZWRpdG9yID0+IGVkaXRvci5pZCA9PT0gaWQpLnBvcCgpO1xuICB9XG5cbiAgZGVzdHJveUVkaXRvcihpZCkge1xuXG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9ycy5zbGljZSgpO1xuXG4gICAgZWRpdG9ycy5mb3JFYWNoKChlZGl0b3IsIGkpID0+IHtcblxuICAgICAgaWYgKGVkaXRvci5pZCA9PT0gaWQpIHtcblxuICAgICAgICBkaXNwb3NlQWxsKGVkaXRvci5kaXNwb3NhYmxlcyk7XG4gICAgICAgIHRoaXMuZWRpdG9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRQcm9qZWN0RGlyKHVSSSkge1xuXG4gICAgY29uc3QgW3Byb2plY3QsIGZpbGVdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHVSSSk7XG5cbiAgICBpZiAocHJvamVjdCkge1xuXG4gICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9XG5cbiAgICBpZiAoZmlsZSkge1xuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBmaWxlKTtcblxuICAgICAgcmV0dXJuIHBhdGguZGlybmFtZShhYnNvbHV0ZVBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZWdpc3Rlckxpc3RlbmVycygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXG4gICAgICBpZiAoIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdVJJID0gZWRpdG9yLmdldFVSSSgpO1xuICAgICAgY29uc3QgcHJvamVjdERpciA9IHRoaXMuZ2V0UHJvamVjdERpcih1UkkpO1xuICAgICAgY29uc3Qgc2VydmVyQ3JlYXRlZE9yUHJlc2VudCA9IHRoaXMuc3RhcnRTZXJ2ZXIocHJvamVjdERpcik7XG5cbiAgICAgIGlmICghc2VydmVyQ3JlYXRlZE9yUHJlc2VudCkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWQgPSBlZGl0b3IuaWQ7XG4gICAgICBjb25zdCBkaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgICAvLyBSZWdpc3RlciB2YWxpZCBlZGl0b3JcbiAgICAgIHRoaXMuZWRpdG9ycy5wdXNoKHtcblxuICAgICAgICBpZCxcbiAgICAgICAgcHJvamVjdERpcixcbiAgICAgICAgZGlzcG9zYWJsZXNcbiAgICAgIH0pO1xuXG4gICAgICBkaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuXG4gICAgICAgIHRoaXMuZGVzdHJveUVkaXRvcihpZCk7XG4gICAgICAgIHRoaXMuZGVzdHJveVVudXNlZFNlcnZlcnMoKTtcbiAgICAgIH0pKTtcblxuICAgICAgZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZSkgPT4ge1xuXG4gICAgICAgIGlmIChwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgICAgICB0aGlzLmNsaWVudCAmJiB0eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIGRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZSkgPT4ge1xuXG4gICAgICAgIHRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LnVwZGF0ZShlZGl0b3IpO1xuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG5cbiAgICAgIGVtaXR0ZXIuZW1pdCgndHlwZS1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZG9jdW1lbnRhdGlvbi1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgncmVuYW1lLWhpZGUnKTtcblxuICAgICAgaWYgKCFpc1ZhbGlkRWRpdG9yKGl0ZW0pKSB7XG5cbiAgICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvbnN0IHVSSSA9IGl0ZW0uZ2V0VVJJKCk7XG4gICAgICAgIGNvbnN0IHByb2plY3REaXIgPSB0aGlzLmdldFByb2plY3REaXIodVJJKTtcblxuICAgICAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudChwcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJywgKGUpID0+IHtcblxuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZW5hbWUtaGlkZScpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpsaXN0RmlsZXMnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6Zmx1c2gnLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5mbHVzaCgpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpuYXZpZ2F0ZUJhY2snLCAoZSkgPT4ge1xuXG4gICAgICBuYXZpZ2F0aW9uLmdvVG8oLTEpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpuYXZpZ2F0ZUZvcndhcmQnLCAoZSkgPT4ge1xuXG4gICAgICBuYXZpZ2F0aW9uLmdvVG8oMSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmRlZmluaXRpb24nLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpyZXN0YXJ0JywgKGUpID0+IHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIucmVzdGFydCgpO1xuICAgIH0pKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFuYWdlcigpO1xuIl19