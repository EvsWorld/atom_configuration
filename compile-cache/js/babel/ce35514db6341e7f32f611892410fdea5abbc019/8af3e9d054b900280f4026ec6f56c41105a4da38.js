Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require('mobx');

var _untildify = require('untildify');

var _untildify2 = _interopRequireDefault(_untildify);

var _tildify = require('tildify');

var _tildify2 = _interopRequireDefault(_tildify);

var _atomProjectUtil = require('atom-project-util');

var _atomProjectUtil2 = _interopRequireDefault(_atomProjectUtil);

var _underscorePlus = require('underscore-plus');

var _storesFileStore = require('./stores/FileStore');

var _storesFileStore2 = _interopRequireDefault(_storesFileStore);

var _storesGitStore = require('./stores/GitStore');

var _storesGitStore2 = _interopRequireDefault(_storesGitStore);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

var _modelsProject = require('./models/Project');

var _modelsProject2 = _interopRequireDefault(_modelsProject);

'use babel';

var Manager = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Manager, [{
    key: 'projects',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activePaths',
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: 'activeProject',
    decorators: [_mobx.computed],
    get: function get() {
      var _this = this;

      if (this.activePaths.length === 0) {
        return null;
      }

      return this.projects.find(function (project) {
        return project.rootPath === _this.activePaths[0];
      });
    }
  }], null, _instanceInitializers);

  function Manager() {
    var _this2 = this;

    _classCallCheck(this, Manager);

    _defineDecoratedPropertyDescriptor(this, 'projects', _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, 'activePaths', _instanceInitializers);

    this.gitStore = new _storesGitStore2['default']();
    this.fileStore = new _storesFileStore2['default']();
    this.settings = new _Settings2['default']();

    this.fetchProjects();

    atom.config.observe('project-manager.includeGitRepositories', function (include) {
      if (include) {
        _this2.gitStore.fetch();
      } else {
        _this2.gitStore.empty();
      }
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.fileStore.data, function (fileProp) {
        _this2.addProject(fileProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      (0, _underscorePlus.each)(_this2.gitStore.data, function (gitProp) {
        _this2.addProject(gitProp);
      }, _this2);
    });

    (0, _mobx.autorun)(function () {
      if (_this2.activeProject) {
        _this2.settings.load(_this2.activeProject.settings);
      }
    });

    this.activePaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      _this2.activePaths = atom.project.getPaths();
      var activePaths = atom.project.getPaths();

      if (_this2.activeProject && _this2.activeProject.rootPath === activePaths[0]) {
        if (_this2.activeProject.paths.length !== activePaths.length) {
          _this2.activeProject.updateProps({ paths: activePaths });
          _this2.saveProjects();
        }
      }
    });
  }

  /**
   * Create or Update a project.
   *
   * Props coming from file goes before any other source.
   */

  _createDecoratedClass(Manager, [{
    key: 'addProject',
    decorators: [_mobx.action],
    value: function addProject(props) {
      var foundProject = this.projects.find(function (project) {
        var projectRootPath = project.rootPath.toLowerCase();
        var propsRootPath = (0, _untildify2['default'])(props.paths[0]).toLowerCase();
        return projectRootPath === propsRootPath;
      });

      if (!foundProject) {
        var newProject = new _modelsProject2['default'](props);
        this.projects.push(newProject);
      } else {
        if (foundProject.source === 'file' && props.source === 'file') {
          foundProject.updateProps(props);
        }

        if (props.source === 'file' || typeof props.source === 'undefined') {
          foundProject.updateProps(props);
        }
      }
    }
  }, {
    key: 'fetchProjects',
    value: function fetchProjects() {
      this.fileStore.fetch();

      if (atom.config.get('project-manager.includeGitRepositories')) {
        this.gitStore.fetch();
      }
    }
  }, {
    key: 'saveProject',
    value: function saveProject(props) {
      var propsToSave = props;
      if (Manager.isProject(props)) {
        propsToSave = props.getProps();
      }
      this.addProject(_extends({}, propsToSave, { source: 'file' }));
      this.saveProjects();
    }
  }, {
    key: 'saveProjects',
    value: function saveProjects() {
      var projects = this.projects.filter(function (project) {
        return project.props.source === 'file';
      });

      var arr = (0, _underscorePlus.map)(projects, function (project) {
        var props = project.getChangedProps();
        delete props.source;

        if (atom.config.get('project-manager.savePathsRelativeToHome')) {
          props.paths = props.paths.map(function (path) {
            return (0, _tildify2['default'])(path);
          });
        }

        return props;
      });

      this.fileStore.store(arr);
    }
  }], [{
    key: 'open',
    value: function open(project) {
      var openInSameWindow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (Manager.isProject(project)) {
        var _project$getProps = project.getProps();

        var devMode = _project$getProps.devMode;

        if (openInSameWindow) {
          _atomProjectUtil2['default']['switch'](project.paths);
        } else {
          atom.open({
            devMode: devMode,
            pathsToOpen: project.paths
          });
        }
      }
    }
  }, {
    key: 'isProject',
    value: function isProject(project) {
      if (project instanceof _modelsProject2['default']) {
        return true;
      }

      return false;
    }
  }], _instanceInitializers);

  return Manager;
})();

exports.Manager = Manager;

var manager = new Manager();
exports['default'] = manager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9NYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVzRCxNQUFNOzt5QkFDdEMsV0FBVzs7Ozt1QkFDYixTQUFTOzs7OytCQUNMLG1CQUFtQjs7Ozs4QkFDakIsaUJBQWlCOzsrQkFDckIsb0JBQW9COzs7OzhCQUNyQixtQkFBbUI7Ozs7d0JBQ25CLFlBQVk7Ozs7NkJBQ2Isa0JBQWtCOzs7O0FBVnRDLFdBQVcsQ0FBQzs7SUFZQyxPQUFPOzs7O3dCQUFQLE9BQU87Ozs7YUFDSyxFQUFFOzs7Ozs7O2FBQ0MsRUFBRTs7Ozs7O1NBRUQsZUFBRzs7O0FBQzVCLFVBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE1BQUssV0FBVyxDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNoRjs7O0FBRVUsV0FaQSxPQUFPLEdBWUo7OzswQkFaSCxPQUFPOzs7Ozs7QUFhaEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxpQ0FBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsa0NBQWUsQ0FBQztBQUNqQyxRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7O0FBRS9CLFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0NBQXdDLEVBQUUsVUFBQyxPQUFPLEVBQUs7QUFDekUsVUFBSSxPQUFPLEVBQUU7QUFDWCxlQUFLLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztPQUN2QixNQUFNO0FBQ0wsZUFBSyxRQUFRLENBQUMsS0FBSyxFQUFFLENB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QyxLQUFLLENBQUMsQ0FBQztTQUNuQyxNQUFNO0FBQ0wsY0FBSSxDQUFDLElBQUksQ0FBQztBQUNSLG1CQUFPLEVBQVAsT0FBTztBQUNQLHVCQUFXLEVBQUUsT0FBTyxDQUFDLEtBQUs7V0FDM0IsQ0FBQyxDQUFDO1NBQ0o7T0FDRjtLQUNGOzs7V0E0QmUsbUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFVBQUksT0FBTyxzQ0FBbUIsRUFBRTtBQUM5QixlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQTVJVSxPQUFPOzs7OztBQStJcEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztxQkFDZixPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG9ic2VydmFibGUsIGF1dG9ydW4sIGNvbXB1dGVkLCBhY3Rpb24gfSBmcm9tICdtb2J4JztcbmltcG9ydCB1bnRpbGRpZnkgZnJvbSAndW50aWxkaWZ5JztcbmltcG9ydCB0aWxkaWZ5IGZyb20gJ3RpbGRpZnknO1xuaW1wb3J0IHByb2plY3RVdGlsIGZyb20gJ2F0b20tcHJvamVjdC11dGlsJztcbmltcG9ydCB7IGVhY2gsIG1hcCB9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgRmlsZVN0b3JlIGZyb20gJy4vc3RvcmVzL0ZpbGVTdG9yZSc7XG5pbXBvcnQgR2l0U3RvcmUgZnJvbSAnLi9zdG9yZXMvR2l0U3RvcmUnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vU2V0dGluZ3MnO1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9tb2RlbHMvUHJvamVjdCc7XG5cbmV4cG9ydCBjbGFzcyBNYW5hZ2VyIHtcbiAgQG9ic2VydmFibGUgcHJvamVjdHMgPSBbXTtcbiAgQG9ic2VydmFibGUgYWN0aXZlUGF0aHMgPSBbXTtcblxuICBAY29tcHV0ZWQgZ2V0IGFjdGl2ZVByb2plY3QoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlUGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9qZWN0cy5maW5kKHByb2plY3QgPT4gcHJvamVjdC5yb290UGF0aCA9PT0gdGhpcy5hY3RpdmVQYXRoc1swXSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmdpdFN0b3JlID0gbmV3IEdpdFN0b3JlKCk7XG4gICAgdGhpcy5maWxlU3RvcmUgPSBuZXcgRmlsZVN0b3JlKCk7XG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5mZXRjaFByb2plY3RzKCk7XG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdwcm9qZWN0LW1hbmFnZXIuaW5jbHVkZUdpdFJlcG9zaXRvcmllcycsIChpbmNsdWRlKSA9PiB7XG4gICAgICBpZiAoaW5jbHVkZSkge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdpdFN0b3JlLmVtcHR5KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdXRvcnVuKCgpID0+IHtcbiAgICAgIGVhY2godGhpcy5maWxlU3RvcmUuZGF0YSwgKGZpbGVQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChmaWxlUHJvcCk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9KTtcblxuICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgZWFjaCh0aGlzLmdpdFN0b3JlLmRhdGEsIChnaXRQcm9wKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkUHJvamVjdChnaXRQcm9wKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgYXV0b3J1bigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0KSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MubG9hZCh0aGlzLmFjdGl2ZVByb2plY3Quc2V0dGluZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5hY3RpdmVQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgIGNvbnN0IGFjdGl2ZVBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVByb2plY3QgJiYgdGhpcy5hY3RpdmVQcm9qZWN0LnJvb3RQYXRoID09PSBhY3RpdmVQYXRoc1swXSkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVQcm9qZWN0LnBhdGhzLmxlbmd0aCAhPT0gYWN0aXZlUGF0aHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVQcm9qZWN0LnVwZGF0ZVByb3BzKHsgcGF0aHM6IGFjdGl2ZVBhdGhzIH0pO1xuICAgICAgICAgIHRoaXMuc2F2ZVByb2plY3RzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgb3IgVXBkYXRlIGEgcHJvamVjdC5cbiAgICpcbiAgICogUHJvcHMgY29taW5nIGZyb20gZmlsZSBnb2VzIGJlZm9yZSBhbnkgb3RoZXIgc291cmNlLlxuICAgKi9cbiAgQGFjdGlvbiBhZGRQcm9qZWN0KHByb3BzKSB7XG4gICAgY29uc3QgZm91bmRQcm9qZWN0ID0gdGhpcy5wcm9qZWN0cy5maW5kKChwcm9qZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9qZWN0Um9vdFBhdGggPSBwcm9qZWN0LnJvb3RQYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBwcm9wc1Jvb3RQYXRoID0gdW50aWxkaWZ5KHByb3BzLnBhdGhzWzBdKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIHByb2plY3RSb290UGF0aCA9PT0gcHJvcHNSb290UGF0aDtcbiAgICB9KTtcblxuICAgIGlmICghZm91bmRQcm9qZWN0KSB7XG4gICAgICBjb25zdCBuZXdQcm9qZWN0ID0gbmV3IFByb2plY3QocHJvcHMpO1xuICAgICAgdGhpcy5wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZm91bmRQcm9qZWN0LnNvdXJjZSA9PT0gJ2ZpbGUnICYmIHByb3BzLnNvdXJjZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgIGZvdW5kUHJvamVjdC51cGRhdGVQcm9wcyhwcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5zb3VyY2UgPT09ICdmaWxlJyB8fCB0eXBlb2YgcHJvcHMuc291cmNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmb3VuZFByb2plY3QudXBkYXRlUHJvcHMocHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZldGNoUHJvamVjdHMoKSB7XG4gICAgdGhpcy5maWxlU3RvcmUuZmV0Y2goKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Byb2plY3QtbWFuYWdlci5pbmNsdWRlR2l0UmVwb3NpdG9yaWVzJykpIHtcbiAgICAgIHRoaXMuZ2l0U3RvcmUuZmV0Y2goKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgb3Blbihwcm9qZWN0LCBvcGVuSW5TYW1lV2luZG93ID0gZmFsc2UpIHtcbiAgICBpZiAoTWFuYWdlci5pc1Byb2plY3QocHJvamVjdCkpIHtcbiAgICAgIGNvbnN0IHsgZGV2TW9kZSB9ID0gcHJvamVjdC5nZXRQcm9wcygpO1xuXG4gICAgICBpZiAob3BlbkluU2FtZVdpbmRvdykge1xuICAgICAgICBwcm9qZWN0VXRpbC5zd2l0Y2gocHJvamVjdC5wYXRocyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm9wZW4oe1xuICAgICAgICAgIGRldk1vZGUsXG4gICAgICAgICAgcGF0aHNUb09wZW46IHByb2plY3QucGF0aHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNhdmVQcm9qZWN0KHByb3BzKSB7XG4gICAgbGV0IHByb3BzVG9TYXZlID0gcHJvcHM7XG4gICAgaWYgKE1hbmFnZXIuaXNQcm9qZWN0KHByb3BzKSkge1xuICAgICAgcHJvcHNUb1NhdmUgPSBwcm9wcy5nZXRQcm9wcygpO1xuICAgIH1cbiAgICB0aGlzLmFkZFByb2plY3QoeyAuLi5wcm9wc1RvU2F2ZSwgc291cmNlOiAnZmlsZScgfSk7XG4gICAgdGhpcy5zYXZlUHJvamVjdHMoKTtcbiAgfVxuXG4gIHNhdmVQcm9qZWN0cygpIHtcbiAgICBjb25zdCBwcm9qZWN0cyA9IHRoaXMucHJvamVjdHMuZmlsdGVyKHByb2plY3QgPT4gcHJvamVjdC5wcm9wcy5zb3VyY2UgPT09ICdmaWxlJyk7XG5cbiAgICBjb25zdCBhcnIgPSBtYXAocHJvamVjdHMsIChwcm9qZWN0KSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IHByb2plY3QuZ2V0Q2hhbmdlZFByb3BzKCk7XG4gICAgICBkZWxldGUgcHJvcHMuc291cmNlO1xuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwcm9qZWN0LW1hbmFnZXIuc2F2ZVBhdGhzUmVsYXRpdmVUb0hvbWUnKSkge1xuICAgICAgICBwcm9wcy5wYXRocyA9IHByb3BzLnBhdGhzLm1hcChwYXRoID0+IHRpbGRpZnkocGF0aCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvcHM7XG4gICAgfSk7XG5cbiAgICB0aGlzLmZpbGVTdG9yZS5zdG9yZShhcnIpO1xuICB9XG5cbiAgc3RhdGljIGlzUHJvamVjdChwcm9qZWN0KSB7XG4gICAgaWYgKHByb2plY3QgaW5zdGFuY2VvZiBQcm9qZWN0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7XG5leHBvcnQgZGVmYXVsdCBtYW5hZ2VyO1xuIl19