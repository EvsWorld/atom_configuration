Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('../atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('../atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

var _configTernConfig = require('../../config/tern-config');

'use babel';

var title = 'atom-ternjs project config';

var ConfigModel = (function () {
  function ConfigModel() {
    _classCallCheck(this, ConfigModel);

    /**
     * project configuration (.tern-project)
     * @type {Object}
     */
    this.projectConfig = {};
    /**
     * temporary project configuration
     * @type {Object}
     */
    this.config = {};
    /**
     * collection of all editors in config view
     * @type {Array}
     */
    this.editors = [];
  }

  _createClass(ConfigModel, [{
    key: 'getURI',
    value: function getURI() {

      return this.uRI;
    }
  }, {
    key: 'getProjectDir',
    value: function getProjectDir() {

      return this.projectDir;
    }
  }, {
    key: 'setProjectDir',
    value: function setProjectDir(dir) {

      this.projectDir = dir;
    }
  }, {
    key: 'setURI',
    value: function setURI(uRI) {

      this.uRI = uRI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {

      return title;
    }
  }, {
    key: 'addLib',
    value: function addLib(lib) {

      if (!this.config.libs.includes(lib)) {

        this.config.libs.push(lib);
      }
    }
  }, {
    key: 'removeLib',
    value: function removeLib(lib) {
      var _this = this;

      var libs = this.config.libs.slice();

      libs.forEach(function (_lib, i) {

        if (_lib === lib) {

          _this.config.libs.splice(i, 1);
        }
      });
    }
  }, {
    key: 'getEcmaVersion',
    value: function getEcmaVersion() {

      return this.config.ecmaVersions;
    }
  }, {
    key: 'setEcmaVersion',
    value: function setEcmaVersion(value) {

      this.config.ecmaVersion = value;
    }
  }, {
    key: 'addPlugin',
    value: function addPlugin(key) {

      if (!this.config.plugins[key]) {

        // if there was a previous config for this pluging
        if (this.projectConfig.plugins && this.projectConfig.plugins[key]) {

          this.config.plugins[key] = this.projectConfig.plugins[key];

          return;
        }

        this.config.plugins[key] = _configTernConfig.availablePlugins[key];
      }
    }
  }, {
    key: 'removePlugin',
    value: function removePlugin(key) {

      this.config.plugins[key] && delete this.config.plugins[key];
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      if (!projectDir) {

        atom.notifications.addError('No Project found.');

        return false;
      }

      var projectConfig = (0, _atomTernjsHelper.readFile)(projectDir + '/.tern-project');

      if (!projectConfig) {

        this.config = (0, _underscorePlus.deepClone)(_configTernConfig.defaultProjectConfig);

        return true;
      }

      try {

        this.projectConfig = JSON.parse(projectConfig);
      } catch (error) {

        atom.notifications.addError(error);

        return false;
      }

      this.config = (0, _underscorePlus.deepClone)(this.projectConfig);

      if (!this.config.libs) {

        this.config.libs = [];
      }

      if (!this.config.plugins) {

        this.config.plugins = {};
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {
      var _this2 = this;

      if (!editor) {

        return;
      }

      var editors = this.editors.slice();

      editors.forEach(function (_editor, i) {

        if (_editor.ref === editor) {

          var buffer = _editor.ref.getModel().getBuffer();
          buffer.destroy();

          _this2.editors.splice(i, 1);
        }
      });
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {
      var _this3 = this;

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      this.editors.forEach(function (editor) {

        var buffer = editor.ref.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text !== '') {

          _this3.config[editor.identifier].push(text);
        }
      });

      var json = JSON.stringify(this.config, null, 2);
      var activePane = atom.workspace.getActivePane();

      (0, _atomTernjsHelper.updateTernFile)(json);

      activePane && activePane.destroy();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.editors.forEach(function (editor) {

        var buffer = editor.ref.getModel().getBuffer();
        buffer.destroy();
      });

      this.editors = [];
    }
  }]);

  return ConfigModel;
})();

exports['default'] = ConfigModel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL21vZGVscy9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FFb0Isd0JBQXdCOzs7O2dDQUtyQyx1QkFBdUI7OzhCQUl2QixpQkFBaUI7O2dDQUtqQiwwQkFBMEI7O0FBaEJqQyxXQUFXLENBQUM7O0FBa0JaLElBQU0sS0FBSyxHQUFHLDRCQUE0QixDQUFDOztJQUV0QixXQUFXO0FBRW5CLFdBRlEsV0FBVyxHQUVoQjswQkFGSyxXQUFXOzs7Ozs7QUFRNUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Ozs7O0FBS3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtqQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7ZUFuQmtCLFdBQVc7O1dBcUJ4QixrQkFBRzs7QUFFUCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVZLHlCQUFHOztBQUVkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7O1dBRVksdUJBQUMsR0FBRyxFQUFFOztBQUVqQixVQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN2Qjs7O1dBRUssZ0JBQUMsR0FBRyxFQUFFOztBQUVWLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ2hCOzs7V0FFTyxvQkFBRzs7QUFFVCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUU7O0FBRVYsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTs7QUFFbkMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQzVCO0tBQ0Y7OztXQUVRLG1CQUFDLEdBQUcsRUFBRTs7O0FBRWIsVUFBTSxJ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OztBQUVSLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLOztBQUUvQixZQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pELGNBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNsQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDbkI7OztTQXRNa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvbW9kZWxzL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcblxuaW1wb3J0IHtcbiAgdXBkYXRlVGVybkZpbGUsXG4gIHJlYWRGaWxlXG59IGZyb20gJy4uL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmltcG9ydCB7XG4gIGRlZXBDbG9uZVxufSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5pbXBvcnQge1xuICBkZWZhdWx0UHJvamVjdENvbmZpZyxcbiAgYXZhaWxhYmxlUGx1Z2luc1xufSBmcm9tICcuLi8uLi9jb25maWcvdGVybi1jb25maWcnO1xuXG5jb25zdCB0aXRsZSA9ICdhdG9tLXRlcm5qcyBwcm9qZWN0IGNvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ01vZGVsIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICAqIHByb2plY3QgY29uZmlndXJhdGlvbiAoLnRlcm4tcHJvamVjdClcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHt9O1xuICAgIC8qKlxuICAgICAqIHRlbXBvcmFyeSBwcm9qZWN0IGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgLyoqXG4gICAgICogY29sbGVjdGlvbiBvZiBhbGwgZWRpdG9ycyBpbiBjb25maWcgdmlld1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxuXG4gIGdldFVSSSgpIHtcblxuICAgIHJldHVybiB0aGlzLnVSSTtcbiAgfVxuXG4gIGdldFByb2plY3REaXIoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wcm9qZWN0RGlyO1xuICB9XG5cbiAgc2V0UHJvamVjdERpcihkaXIpIHtcblxuICAgIHRoaXMucHJvamVjdERpciA9IGRpcjtcbiAgfVxuXG4gIHNldFVSSSh1UkkpIHtcblxuICAgIHRoaXMudVJJID0gdVJJO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG5cbiAgICByZXR1cm4gdGl0bGU7XG4gIH1cblxuICBhZGRMaWIobGliKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmxpYnMuaW5jbHVkZXMobGliKSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5saWJzLnB1c2gobGliKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVMaWIobGliKSB7XG5cbiAgICBjb25zdCBsaWJzID0gdGhpcy5jb25maWcubGlicy5zbGljZSgpO1xuXG4gICAgbGlicy5mb3JFYWNoKChfbGliLCBpKSA9PiB7XG5cbiAgICAgIGlmIChfbGliID09PSBsaWIpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5saWJzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEVjbWFWZXJzaW9uKCkge1xuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucztcbiAgfVxuXG4gIHNldEVjbWFWZXJzaW9uKHZhbHVlKSB7XG5cbiAgICB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbiA9IHZhbHVlO1xuICB9XG5cbiAgYWRkUGx1Z2luKGtleSkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zW2tleV0pIHtcblxuICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgcHJldmlvdXMgY29uZmlnIGZvciB0aGlzIHBsdWdpbmdcbiAgICAgIGlmICh0aGlzLnByb2plY3RDb25maWcucGx1Z2lucyAmJiB0aGlzLnByb2plY3RDb25maWcucGx1Z2luc1trZXldKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcucGx1Z2luc1trZXldID0gdGhpcy5wcm9qZWN0Q29uZmlnLnBsdWdpbnNba2V5XTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XSA9IGF2YWlsYWJsZVBsdWdpbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVQbHVnaW4oa2V5KSB7XG5cbiAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW2tleV0gJiYgZGVsZXRlIHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XTtcbiAgfVxuXG4gIGdhdGhlckRhdGEoKSB7XG5cbiAgICBjb25zdCBwcm9qZWN0RGlyID0gbWFuYWdlci5zZXJ2ZXIgJiYgbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcblxuICAgIGlmICghcHJvamVjdERpcikge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ05vIFByb2plY3QgZm91bmQuJyk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0Q29uZmlnID0gcmVhZEZpbGUoYCR7cHJvamVjdERpcn0vLnRlcm4tcHJvamVjdGApO1xuXG4gICAgaWYgKCFwcm9qZWN0Q29uZmlnKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnID0gZGVlcENsb25lKGRlZmF1bHRQcm9qZWN0Q29uZmlnKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdHJ5IHtcblxuICAgICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gSlNPTi5wYXJzZShwcm9qZWN0Q29uZmlnKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlcnJvcik7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IGRlZXBDbG9uZSh0aGlzLnByb2plY3RDb25maWcpO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5saWJzKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLmxpYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLnBsdWdpbnMpIHtcblxuICAgICAgdGhpcy5jb25maWcucGx1Z2lucyA9IHt9O1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVtb3ZlRWRpdG9yKGVkaXRvcikge1xuXG4gICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmVkaXRvcnMuc2xpY2UoKTtcblxuICAgIGVkaXRvcnMuZm9yRWFjaCgoX2VkaXRvciwgaSkgPT4ge1xuXG4gICAgICBpZiAoX2VkaXRvci5yZWYgPT09IGVkaXRvcikge1xuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IF9lZGl0b3IucmVmLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICAgIGJ1ZmZlci5kZXN0cm95KCk7XG5cbiAgICAgICAgdGhpcy5lZGl0b3JzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNvbmZpZygpIHtcblxuICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5ID0gW107XG4gICAgdGhpcy5jb25maWcuZG9udExvYWQgPSBbXTtcblxuICAgIHRoaXMuZWRpdG9ycy5mb3JFYWNoKChlZGl0b3IpID0+IHtcblxuICAgICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLnJlZi5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpO1xuICAgICAgY29uc3QgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0KCkudHJpbSgpO1xuXG4gICAgICBpZiAodGV4dCAhPT0gJycpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZ1tlZGl0b3IuaWRlbnRpZmllcl0ucHVzaCh0ZXh0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZywgbnVsbCwgMik7XG4gICAgY29uc3QgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKTtcblxuICAgIHVwZGF0ZVRlcm5GaWxlKGpzb24pO1xuXG4gICAgYWN0aXZlUGFuZSAmJiBhY3RpdmVQYW5lLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5yZWYuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKTtcbiAgICAgIGJ1ZmZlci5kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxufVxuIl19