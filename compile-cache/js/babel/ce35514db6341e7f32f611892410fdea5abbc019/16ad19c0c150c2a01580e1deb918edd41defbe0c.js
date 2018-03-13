Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gitIgnoreParser = require('git-ignore-parser');

var _gitIgnoreParser2 = _interopRequireDefault(_gitIgnoreParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _atom = require('atom');

var _utils = require('./utils');

'use babel';
var PathsCache = (function (_EventEmitter) {
  _inherits(PathsCache, _EventEmitter);

  function PathsCache() {
    var _this = this;

    _classCallCheck(this, PathsCache);

    _get(Object.getPrototypeOf(PathsCache.prototype), 'constructor', this).call(this);

    this._projectChangeWatcher = atom.project.onDidChangePaths(function () {
      return _this.rebuildCache();
    });

    this._repositories = [];
    this._filePathsByProjectDirectory = new Map();
    this._filePathsByDirectory = new Map();
    this._fileWatchersByDirectory = new Map();
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */

  _createClass(PathsCache, [{
    key: '_isPathIgnored',
    value: function _isPathIgnored(path) {
      var ignored = false;
      if (atom.config.get('core.excludeVcsIgnoredPaths')) {
        this._repositories.forEach(function (repository) {
          if (ignored) return;
          var ignoreSubmodules = atom.config.get('autocomplete-paths.ignoreSubmodules');
          var isIgnoredSubmodule = ignoreSubmodules && repository.isSubmodule(path);
          if (repository.isPathIgnored(path) || isIgnoredSubmodule) {
            ignored = true;
          }
        });
      }

      if (atom.config.get('autocomplete-paths.ignoredNames')) {
        var ignoredNames = atom.config.get('core.ignoredNames');
        ignoredNames.forEach(function (ignoredName) {
          if (ignored) return;
          ignored = ignored || (0, _minimatch2['default'])(path, ignoredName, { matchBase: true, dot: true });
        });
      }

      var ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns');
      if (ignoredPatterns) {
        ignoredPatterns.forEach(function (ignoredPattern) {
          if (ignored) return;
          ignored = ignored || (0, _minimatch2['default'])(path, ignoredPattern, { dot: true });
        });
      }

      return ignored;
    }

    /**
     * Caches the project paths and repositories
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheProjectPathsAndRepositories',
    value: function _cacheProjectPathsAndRepositories() {
      var _this2 = this;

      this._projectDirectories = atom.project.getDirectories();

      return Promise.all(this._projectDirectories.map(atom.project.repositoryForDirectory.bind(atom.project))).then(function (repositories) {
        _this2._repositories = repositories.filter(function (r) {
          return r;
        });
      });
    }

    /**
     * Invoked when the content of the given `directory` has changed
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_onDirectoryChanged',
    value: function _onDirectoryChanged(projectDirectory, directory) {
      this._removeFilePathsForDirectory(projectDirectory, directory);
      this._cleanWatchersForDirectory(directory);
      this._cacheDirectoryFilePaths(projectDirectory, directory);
    }

    /**
     * Removes all watchers inside the given directory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_cleanWatchersForDirectory',
    value: function _cleanWatchersForDirectory(directory) {
      var _this3 = this;

      this._fileWatchersByDirectory.forEach(function (watcher, otherDirectory) {
        if (directory.contains(otherDirectory.path)) {
          watcher.dispose();
          _this3._fileWatchersByDirectory['delete'](otherDirectory);
        }
      });
    }

    /**
     * Removes all cached file paths in the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_removeFilePathsForDirectory',
    value: function _removeFilePathsForDirectory(projectDirectory, directory) {
      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path);
      if (!filePaths) return;

      filePaths = filePaths.filter(function (path) {
        return !directory.contains(path);
      });
      this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths);

      this._filePathsByDirectory['delete'](directory.path);
    }

    /**
     * Caches file paths for the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheDirectoryFilePaths',
    value: function _cacheDirectoryFilePaths(projectDirectory, directory) {
      var _this4 = this;

      if (this._cancelled) return Promise.resolve([]);

      if (process.platform !== 'win32') {
        var watcher = this._fileWatchersByDirectory.get(directory);
        if (!watcher) {
          watcher = directory.onDidChange(function () {
            return _this4._onDirectoryChanged(projectDirectory, directory);
          });
          this._fileWatchersByDirectory.set(directory, watcher);
        }
      }

      return this._getDirectoryEntries(directory).then(function (entries) {
        if (_this4._cancelled) return Promise.resolve([]);

        // Filter: Files that are not ignored
        var filePaths = entries.filter(function (entry) {
          return entry instanceof _atom.File;
        }).map(function (entry) {
          return entry.path;
        }).filter(function (path) {
          return !_this4._isPathIgnored(path);
        });

        // Merge file paths into existing array (which contains *all* file paths)
        var filePathsArray = _this4._filePathsByProjectDirectory.get(projectDirectory.path) || [];
        var newPathsCount = filePathsArray.length + filePaths.length;

        var maxFileCount = atom.config.get('autocomplete-paths.maxFileCount');
        if (newPathsCount > maxFileCount && !_this4._cancelled) {
          atom.notifications.addError('autocomplete-paths', {
            description: 'Maximum file count of ' + maxFileCount + ' has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>',
            dismissable: true
          });

          _this4._filePathsByProjectDirectory.clear();
          _this4._filePathsByDirectory.clear();
          _this4._cancelled = true;
          _this4.emit('rebuild-cache-done');
          return;
        }

        _this4._filePathsByProjectDirectory.set(projectDirectory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = _this4._filePathsByDirectory.get(directory.path) || [];
        _this4._filePathsByDirectory.set(directory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        var directories = entries.filter(function (entry) {
          return entry instanceof _atom.Directory;
        }).filter(function (entry) {
          return !_this4._isPathIgnored(entry.path);
        });

        return Promise.all(directories.map(function (directory) {
          return _this4._cacheDirectoryFilePaths(projectDirectory, directory);
        }));
      });
    }

    /**
     * Promisified version of Directory#getEntries
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getDirectoryEntries',
    value: function _getDirectoryEntries(directory) {
      return new Promise(function (resolve, reject) {
        directory.getEntries(function (err, entries) {
          if (err) return reject(err);
          resolve(entries);
        });
      });
    }

    /**
     * Rebuilds the paths cache
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var _this5 = this;

      var path = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.dispose();

      this._cancelled = false;
      this.emit('rebuild-cache');

      return (0, _utils.execPromise)('find --version').then(
      // `find` is available
      function () {
        return _this5._buildInitialCacheWithFind();
      },
      // `find` is not available
      function () {
        return _this5._buildInitialCache();
      });
    }

    /**
     * Builds the initial file cache
     * @return {Promise}
     * @private
     */
  }, {
    key: '_buildInitialCache',
    value: function _buildInitialCache() {
      var _this6 = this;

      return this._cacheProjectPathsAndRepositories().then(function () {
        return Promise.all(_this6._projectDirectories.map(function (projectDirectory) {
          return _this6._cacheDirectoryFilePaths(projectDirectory, projectDirectory);
        }));
      }).then(function (result) {
        _this6.emit('rebuild-cache-done');
        return result;
      });
    }

    /**
     * Returns the project path for the given file / directory pathName
     * @param  {String} pathName
     * @return {String}
     * @private
     */
  }, {
    key: '_getProjectPathForPath',
    value: function _getProjectPathForPath(pathName) {
      var projects = this._projectPaths;
      for (var i = 0; i < projects.length; i++) {
        var projectPath = projects[i];
        if (pathName.indexOf(projectPath) === 0) {
          return projectPath;
        }
      }
      return false;
    }

    /**
     * Returns the file paths for the given project directory with the given (optional) relative path
     * @param  {Directory} projectDirectory
     * @param  {String} [relativeToPath=null]
     * @return {String[]}
     */
  }, {
    key: 'getFilePathsForProjectDirectory',
    value: function getFilePathsForProjectDirectory(projectDirectory) {
      var relativeToPath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path) || [];
      if (relativeToPath) {
        return filePaths.filter(function (filePath) {
          return filePath.indexOf(relativeToPath) === 0;
        });
      }
      return filePaths;
    }

    /**
     * Disposes this PathsCache
     */
  }, {
    key: 'dispose',
    value: function dispose(isPackageDispose) {
      this._fileWatchersByDirectory.forEach(function (watcher, directory) {
        watcher.dispose();
      });
      this._fileWatchersByDirectory = new Map();
      this._filePathsByProjectDirectory = new Map();
      this._filePathsByDirectory = new Map();
      this._repositories = [];
      if (this._projectWatcher) {
        this._projectWatcher.dispose();
        this._projectWatcher = null;
      }
      if (isPackageDispose && this._projectChangeWatcher) {
        this._projectChangeWatcher.dispose();
        this._projectChangeWatcher = null;
      }
    }

    //
    // Cache with `find`
    //

    /**
     * Builds the initial file cache with `find`
     * @return {Promise}
     * @private
     */
  }, {
    key: '_buildInitialCacheWithFind',
    value: function _buildInitialCacheWithFind() {
      var _this7 = this;

      return this._cacheProjectPathsAndRepositories().then(function () {
        _this7._projectWatcher = atom.project.onDidChangeFiles(_this7._onDidChangeFiles.bind(_this7));

        return Promise.all(_this7._projectDirectories.map(_this7._populateCacheFor.bind(_this7)));
      }).then(function (result) {
        _this7.emit('rebuild-cache-done');
        return result;
      });
    }
  }, {
    key: '_onDidChangeFiles',
    value: function _onDidChangeFiles(events) {
      var _this8 = this;

      events.filter(function (event) {
        return event.action !== 'modified';
      }).forEach(function (event) {
        if (!_this8._projectDirectories) {
          return;
        }

        var action = event.action;
        var path = event.path;
        var oldPath = event.oldPath;

        var projectDirectory = _this8._projectDirectories.find(function (projectDirectory) {
          return path.indexOf(projectDirectory.path) === 0;
        });

        if (!projectDirectory) {
          return;
        }
        var directoryPath = projectDirectory.path;
        var ignored = _this8._isPathIgnored(path);

        if (ignored) {
          return;
        }

        var files = _this8._filePathsByProjectDirectory.get(directoryPath) || [];

        switch (action) {
          case 'created':
            files.push(path);
            break;

          case 'deleted':
            var i = files.indexOf(path);
            if (i > -1) {
              files.splice(i, 1);
            }
            break;

          case 'renamed':
            var j = files.indexOf(oldPath);
            if (j > -1) {
              files[j] = path;
            }
            break;
        }

        if (!_this8._filePathsByProjectDirectory.has(directoryPath)) {
          _this8._filePathsByProjectDirectory.set(directoryPath, files);
        }
      });
    }

    /**
     * Returns a list of ignore patterns for a directory
     * @param  {String} directoryPath
     * @return {String[]}
     * @private
     */
  }, {
    key: '_getIgnorePatterns',
    value: function _getIgnorePatterns(directoryPath) {
      var patterns = [];

      if (atom.config.get('autocomplete-paths.ignoredNames')) {
        atom.config.get('core.ignoredNames').forEach(function (pattern) {
          return patterns.push(pattern);
        });
      }

      if (atom.config.get('core.excludeVcsIgnoredPaths')) {
        try {
          var gitIgnore = _fs2['default'].readFileSync(directoryPath + '/.gitignore', 'utf-8');
          (0, _gitIgnoreParser2['default'])(gitIgnore).forEach(function (pattern) {
            return patterns.push(pattern);
          });
        } catch (err) {
          // .gitignore does not exist for this directory, ignoring
        }
      }

      var ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns');
      if (ignoredPatterns) {
        ignoredPatterns.forEach(function (pattern) {
          return patterns.push(pattern);
        });
      }

      return patterns;
    }

    /**
     * Populates cache for a project directory
     * @param  {Directory} projectDirectory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_populateCacheFor',
    value: function _populateCacheFor(projectDirectory) {
      var _this9 = this;

      var directoryPath = projectDirectory.path;

      var ignorePatterns = this._getIgnorePatterns(directoryPath);
      var ignorePatternsForFind = ignorePatterns.map(function (pattern) {
        return pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      });
      var ignorePattern = '\'.*\\(' + ignorePatternsForFind.join('\\|') + '\\).*\'';

      var cmd = ['find', '-L', directoryPath + '/', '-type', 'f', '-not', '-regex', ignorePattern].join(' ');

      return (0, _utils.execPromise)(cmd, {
        maxBuffer: 1024 * 1024
      }).then(function (stdout) {
        var files = _underscorePlus2['default'].compact(stdout.split('\n'));

        _this9._filePathsByProjectDirectory.set(directoryPath, files);

        return files;
      });
    }
  }]);

  return PathsCache;
})(_events.EventEmitter);

exports['default'] = PathsCache;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1jYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUc2QixRQUFROztrQkFDdEIsSUFBSTs7OzsrQkFDUyxtQkFBbUI7Ozs7b0JBQzlCLE1BQU07Ozs7OEJBQ1QsaUJBQWlCOzs7O3lCQUNULFdBQVc7Ozs7b0JBQ0QsTUFBTTs7cUJBQ1YsU0FBUzs7QUFWckMsV0FBVyxDQUFBO0lBWVUsVUFBVTtZQUFWLFVBQVU7O0FBQ2pCLFdBRE8sVUFBVSxHQUNkOzs7MEJBREksVUFBVTs7QUFFM0IsK0JBRmlCLFVBQVUsNkNBRXBCOztBQUVQLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO2FBQU0sTUFBSyxZQUFZLEVBQUU7S0FBQSxDQUFDLENBQUE7O0FBRXJGLFFBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzdDLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RDLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0dBQzFDOzs7Ozs7Ozs7ZUFWa0IsVUFBVTs7V0FrQmQsd0JBQUMsSUFBSSxFQUFFO0FBQ3BCLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLEVBQUU7QUFDbEQsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDdkMsY0FBSSxPQUFPLEVBQUUsT0FBTTtBQUNuQixjQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxD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QU0sS0FBSyxHQUFHLDRCQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRTVDLGVBQUssNEJBQTRCLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFNUQsZUFBTyxLQUFLLENBQUM7T0FDZCxDQUFDLENBQUM7S0FDSjs7O1NBcGFrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvcGF0aHMtY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZ2xvYmFsIGF0b20gKi9cblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IGdpdElnbm9yZVBhcnNlciBmcm9tICdnaXQtaWdub3JlLXBhcnNlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZS1wbHVzJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgeyBEaXJlY3RvcnksIEZpbGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZXhlY1Byb21pc2UgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoc0NhY2hlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuX3Byb2plY3RDaGFuZ2VXYXRjaGVyID0gYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4gdGhpcy5yZWJ1aWxkQ2FjaGUoKSlcblxuICAgIHRoaXMuX3JlcG9zaXRvcmllcyA9IFtdXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeSA9IG5ldyBNYXAoKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gcGF0aCBpcyBpZ25vcmVkXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIHBhdGhcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pc1BhdGhJZ25vcmVkIChwYXRoKSB7XG4gICAgbGV0IGlnbm9yZWQgPSBmYWxzZVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycpKSB7XG4gICAgICB0aGlzLl9yZXBvc2l0b3JpZXMuZm9yRWFjaChyZXBvc2l0b3J5ID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZWQpIHJldHVyblxuICAgICAgICBjb25zdCBpZ25vcmVTdWJtb2R1bGVzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlU3VibW9kdWxlcycpXG4gICAgICAgIGNvbnN0IGlzSWdub3JlZFN1Ym1vZHVsZSA9IGlnbm9yZVN1Ym1vZHVsZXMgJiYgcmVwb3NpdG9yeS5pc1N1Ym1vZHVsZShwYXRoKVxuICAgICAgICBpZiAocmVwb3NpdG9yeS5pc1BhdGhJZ25vcmVkKHBhdGgpIHx8IGlzSWdub3JlZFN1Ym1vZHVsZSkge1xuICAgICAgICAgIGlnbm9yZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWROYW1lcycpKSB7XG4gICAgICBjb25zdCBpZ25vcmVkTmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJylcbiAgICAgIGlnbm9yZWROYW1lcy5mb3JFYWNoKGlnbm9yZWROYW1lID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZWQpIHJldHVyblxuICAgICAgICBpZ25vcmVkID0gaWdub3JlZCB8fCBtaW5pbWF0Y2gocGF0aCwgaWdub3JlZE5hbWUsIHsgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgaWdub3JlZFBhdHRlcm5zID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlZFBhdHRlcm5zJylcbiAgICBpZiAoaWdub3JlZFBhdHRlcm5zKSB7XG4gICAgICBpZ25vcmVkUGF0dGVybnMuZm9yRWFjaChpZ25vcmVkUGF0dGVybiA9PiB7XG4gICAgICAgIGlmIChpZ25vcmVkKSByZXR1cm5cbiAgICAgICAgaWdub3JlZCA9IGlnbm9yZWQgfHwgbWluaW1hdGNoKHBhdGgsIGlnbm9yZWRQYXR0ZXJuLCB7IGRvdDogdHJ1ZSB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gaWdub3JlZFxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlcyB0aGUgcHJvamVjdCBwYXRocyBhbmQgcmVwb3NpdG9yaWVzXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2FjaGVQcm9qZWN0UGF0aHNBbmRSZXBvc2l0b3JpZXMgKCkge1xuICAgIHRoaXMuX3Byb2plY3REaXJlY3RvcmllcyA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5fcHJvamVjdERpcmVjdG9yaWVzXG4gICAgICAubWFwKGF0b20ucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5LmJpbmQoYXRvbS5wcm9qZWN0KSlcbiAgICApLnRoZW4ocmVwb3NpdG9yaWVzID0+IHtcbiAgICAgIHRoaXMuX3JlcG9zaXRvcmllcyA9IHJlcG9zaXRvcmllcy5maWx0ZXIociA9PiByKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBnaXZlbiBgZGlyZWN0b3J5YCBoYXMgY2hhbmdlZFxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IHByb2plY3REaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vbkRpcmVjdG9yeUNoYW5nZWQgKHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSkge1xuICAgIHRoaXMuX3JlbW92ZUZpbGVQYXRoc0ZvckRpcmVjdG9yeShwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpXG4gICAgdGhpcy5fY2xlYW5XYXRjaGVyc0ZvckRpcmVjdG9yeShkaXJlY3RvcnkpXG4gICAgdGhpcy5fY2FjaGVEaXJlY3RvcnlGaWxlUGF0aHMocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIHdhdGNoZXJzIGluc2lkZSB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gZGlyZWN0b3J5XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2xlYW5XYXRjaGVyc0ZvckRpcmVjdG9yeSAoZGlyZWN0b3J5KSB7XG4gICAgdGhpcy5fZmlsZVdhdGNoZXJzQnlEaXJlY3RvcnkuZm9yRWFjaCgod2F0Y2hlciwgb3RoZXJEaXJlY3RvcnkpID0+IHtcbiAgICAgIGlmIChkaXJlY3RvcnkuY29udGFpbnMob3RoZXJEaXJlY3RvcnkucGF0aCkpIHtcbiAgICAgICAgd2F0Y2hlci5kaXNwb3NlKClcbiAgICAgICAgdGhpcy5fZmlsZVdhdGNoZXJzQnlEaXJlY3RvcnkuZGVsZXRlKG90aGVyRGlyZWN0b3J5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgY2FjaGVkIGZpbGUgcGF0aHMgaW4gdGhlIGdpdmVuIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IHByb2plY3REaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW1vdmVGaWxlUGF0aHNGb3JEaXJlY3RvcnkgKHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSkge1xuICAgIGxldCBmaWxlUGF0aHMgPSB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuZ2V0KHByb2plY3REaXJlY3RvcnkucGF0aClcbiAgICBpZiAoIWZpbGVQYXRocykgcmV0dXJuXG5cbiAgICBmaWxlUGF0aHMgPSBmaWxlUGF0aHMuZmlsdGVyKHBhdGggPT4gIWRpcmVjdG9yeS5jb250YWlucyhwYXRoKSlcbiAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3Rvcnkuc2V0KHByb2plY3REaXJlY3RvcnkucGF0aCwgZmlsZVBhdGhzKVxuXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkuZGVsZXRlKGRpcmVjdG9yeS5wYXRoKVxuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlcyBmaWxlIHBhdGhzIGZvciB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IGRpcmVjdG9yeVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NhY2hlRGlyZWN0b3J5RmlsZVBhdGhzIChwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpIHtcbiAgICBpZiAodGhpcy5fY2FuY2VsbGVkKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICAgIGxldCB3YXRjaGVyID0gdGhpcy5fZmlsZVdhdGNoZXJzQnlEaXJlY3RvcnkuZ2V0KGRpcmVjdG9yeSlcbiAgICAgIGlmICghd2F0Y2hlcikge1xuICAgICAgICB3YXRjaGVyID0gZGlyZWN0b3J5Lm9uRGlkQ2hhbmdlKCgpID0+XG4gICAgICAgICAgdGhpcy5fb25EaXJlY3RvcnlDaGFuZ2VkKHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSlcbiAgICAgICAgKVxuICAgICAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5zZXQoZGlyZWN0b3J5LCB3YXRjaGVyKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9nZXREaXJlY3RvcnlFbnRyaWVzKGRpcmVjdG9yeSlcbiAgICAgIC50aGVuKGVudHJpZXMgPT4ge1xuICAgICAgICBpZiAodGhpcy5fY2FuY2VsbGVkKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuXG4gICAgICAgIC8vIEZpbHRlcjogRmlsZXMgdGhhdCBhcmUgbm90IGlnbm9yZWRcbiAgICAgICAgY29uc3QgZmlsZVBhdGhzID0gZW50cmllc1xuICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gZW50cnkgaW5zdGFuY2VvZiBGaWxlKVxuICAgICAgICAgIC5tYXAoZW50cnkgPT4gZW50cnkucGF0aClcbiAgICAgICAgICAuZmlsdGVyKHBhdGggPT4gIXRoaXMuX2lzUGF0aElnbm9yZWQocGF0aCkpXG5cbiAgICAgICAgLy8gTWVyZ2UgZmlsZSBwYXRocyBpbnRvIGV4aXN0aW5nIGFycmF5ICh3aGljaCBjb250YWlucyAqYWxsKiBmaWxlIHBhdGhzKVxuICAgICAgICBsZXQgZmlsZVBhdGhzQXJyYXkgPSB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuZ2V0KHByb2plY3REaXJlY3RvcnkucGF0aCkgfHwgW11cbiAgICAgICAgY29uc3QgbmV3UGF0aHNDb3VudCA9IGZpbGVQYXRoc0FycmF5Lmxlbmd0aCArIGZpbGVQYXRocy5sZW5ndGhcblxuICAgICAgICBjb25zdCBtYXhGaWxlQ291bnQgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5tYXhGaWxlQ291bnQnKVxuICAgICAgICBpZiAobmV3UGF0aHNDb3VudCA+IG1heEZpbGVDb3VudCAmJiAhdGhpcy5fY2FuY2VsbGVkKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdhdXRvY29tcGxldGUtcGF0aHMnLCB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYE1heGltdW0gZmlsZSBjb3VudCBvZiAke21heEZpbGVDb3VudH0gaGFzIGJlZW4gZXhjZWVkZWQuIFBhdGggYXV0b2NvbXBsZXRpb24gd2lsbCBub3Qgd29yayBpbiB0aGlzIHByb2plY3QuPGJyIC8+PGJyIC8+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tLWNvbW11bml0eS9hdXRvY29tcGxldGUtcGF0aHMvd2lraS9Ucm91Ymxlc2hvb3RpbmcjbWF4aW11bS1maWxlLWxpbWl0LWV4Y2VlZGVkXCI+Q2xpY2sgaGVyZSB0byBsZWFybiBtb3JlLjwvYT5gLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LmNsZWFyKClcbiAgICAgICAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5jbGVhcigpXG4gICAgICAgICAgdGhpcy5fY2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZS1kb25lJylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5zZXQocHJvamVjdERpcmVjdG9yeS5wYXRoLFxuICAgICAgICAgIF8udW5pb24oZmlsZVBhdGhzQXJyYXksIGZpbGVQYXRocylcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIE1lcmdlIGZpbGUgcGF0aHMgaW50byBleGlzdGluZyBhcnJheSAod2hpY2ggY29udGFpbnMgZmlsZSBwYXRocyBmb3IgYSBzcGVjaWZpYyBkaXJlY3RvcnkpXG4gICAgICAgIGZpbGVQYXRoc0FycmF5ID0gdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkuZ2V0KGRpcmVjdG9yeS5wYXRoKSB8fCBbXVxuICAgICAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5zZXQoZGlyZWN0b3J5LnBhdGgsXG4gICAgICAgICAgXy51bmlvbihmaWxlUGF0aHNBcnJheSwgZmlsZVBhdGhzKVxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgZGlyZWN0b3JpZXMgPSBlbnRyaWVzXG4gICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBlbnRyeSBpbnN0YW5jZW9mIERpcmVjdG9yeSlcbiAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+ICF0aGlzLl9pc1BhdGhJZ25vcmVkKGVudHJ5LnBhdGgpKVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChkaXJlY3Rvcmllcy5tYXAoZGlyZWN0b3J5ID0+XG4gICAgICAgICAgdGhpcy5fY2FjaGVEaXJlY3RvcnlGaWxlUGF0aHMocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KVxuICAgICAgICApKVxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9taXNpZmllZCB2ZXJzaW9uIG9mIERpcmVjdG9yeSNnZXRFbnRyaWVzXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gZGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0RGlyZWN0b3J5RW50cmllcyAoZGlyZWN0b3J5KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGRpcmVjdG9yeS5nZXRFbnRyaWVzKChlcnIsIGVudHJpZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgIHJlc29sdmUoZW50cmllcylcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWJ1aWxkcyB0aGUgcGF0aHMgY2FjaGVcbiAgICovXG4gIHJlYnVpbGRDYWNoZSAocGF0aCA9IG51bGwpIHtcbiAgICB0aGlzLmRpc3Bvc2UoKVxuXG4gICAgdGhpcy5fY2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLmVtaXQoJ3JlYnVpbGQtY2FjaGUnKVxuXG4gICAgcmV0dXJuIGV4ZWNQcm9taXNlKCdmaW5kIC0tdmVyc2lvbicpXG4gICAgICAudGhlbihcbiAgICAgICAgLy8gYGZpbmRgIGlzIGF2YWlsYWJsZVxuICAgICAgICAoKSA9PiB0aGlzLl9idWlsZEluaXRpYWxDYWNoZVdpdGhGaW5kKCksXG4gICAgICAgIC8vIGBmaW5kYCBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICgpID0+IHRoaXMuX2J1aWxkSW5pdGlhbENhY2hlKClcbiAgICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBCdWlsZHMgdGhlIGluaXRpYWwgZmlsZSBjYWNoZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2J1aWxkSW5pdGlhbENhY2hlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVQcm9qZWN0UGF0aHNBbmRSZXBvc2l0b3JpZXMoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgICAgdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzLm1hcChwcm9qZWN0RGlyZWN0b3J5ID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBwcm9qZWN0RGlyZWN0b3J5KVxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3JlYnVpbGQtY2FjaGUtZG9uZScpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcHJvamVjdCBwYXRoIGZvciB0aGUgZ2l2ZW4gZmlsZSAvIGRpcmVjdG9yeSBwYXRoTmFtZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGhOYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRQcm9qZWN0UGF0aEZvclBhdGggKHBhdGhOYW1lKSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSB0aGlzLl9wcm9qZWN0UGF0aHNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHByb2plY3RzW2ldXG4gICAgICBpZiAocGF0aE5hbWUuaW5kZXhPZihwcm9qZWN0UGF0aCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RQYXRoXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpbGUgcGF0aHMgZm9yIHRoZSBnaXZlbiBwcm9qZWN0IGRpcmVjdG9yeSB3aXRoIHRoZSBnaXZlbiAob3B0aW9uYWwpIHJlbGF0aXZlIHBhdGhcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBwcm9qZWN0RGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge1N0cmluZ30gW3JlbGF0aXZlVG9QYXRoPW51bGxdXG4gICAqIEByZXR1cm4ge1N0cmluZ1tdfVxuICAgKi9cbiAgZ2V0RmlsZVBhdGhzRm9yUHJvamVjdERpcmVjdG9yeSAocHJvamVjdERpcmVjdG9yeSwgcmVsYXRpdmVUb1BhdGggPSBudWxsKSB7XG4gICAgbGV0IGZpbGVQYXRocyA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKSB8fCBbXVxuICAgIGlmIChyZWxhdGl2ZVRvUGF0aCkge1xuICAgICAgcmV0dXJuIGZpbGVQYXRocy5maWx0ZXIoZmlsZVBhdGggPT4gZmlsZVBhdGguaW5kZXhPZihyZWxhdGl2ZVRvUGF0aCkgPT09IDApXG4gICAgfVxuICAgIHJldHVybiBmaWxlUGF0aHNcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGlzIFBhdGhzQ2FjaGVcbiAgICovXG4gIGRpc3Bvc2UoaXNQYWNrYWdlRGlzcG9zZSkge1xuICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5LmZvckVhY2goKHdhdGNoZXIsIGRpcmVjdG9yeSkgPT4ge1xuICAgICAgd2F0Y2hlci5kaXNwb3NlKClcbiAgICB9KVxuICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5fZmlsZVBhdGhzQnlEaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9yZXBvc2l0b3JpZXMgPSBbXVxuICAgIGlmICh0aGlzLl9wcm9qZWN0V2F0Y2hlcikge1xuICAgICAgdGhpcy5fcHJvamVjdFdhdGNoZXIuZGlzcG9zZSgpXG4gICAgICB0aGlzLl9wcm9qZWN0V2F0Y2hlciA9IG51bGxcbiAgICB9XG4gICAgaWYgKGlzUGFja2FnZURpc3Bvc2UgJiYgdGhpcy5fcHJvamVjdENoYW5nZVdhdGNoZXIpIHtcbiAgICAgIHRoaXMuX3Byb2plY3RDaGFuZ2VXYXRjaGVyLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5fcHJvamVjdENoYW5nZVdhdGNoZXIgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgLy9cbiAgLy8gQ2FjaGUgd2l0aCBgZmluZGBcbiAgLy9cblxuICAvKipcbiAgICogQnVpbGRzIHRoZSBpbml0aWFsIGZpbGUgY2FjaGUgd2l0aCBgZmluZGBcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9idWlsZEluaXRpYWxDYWNoZVdpdGhGaW5kKCkge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZVByb2plY3RQYXRoc0FuZFJlcG9zaXRvcmllcygpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Byb2plY3RXYXRjaGVyID0gYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlRmlsZXModGhpcy5fb25EaWRDaGFuZ2VGaWxlcy5iaW5kKHRoaXMpKVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgICB0aGlzLl9wcm9qZWN0RGlyZWN0b3JpZXMubWFwKHRoaXMuX3BvcHVsYXRlQ2FjaGVGb3IuYmluZCh0aGlzKSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3JlYnVpbGQtY2FjaGUtZG9uZScpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gIH1cblxuICBfb25EaWRDaGFuZ2VGaWxlcyhldmVudHMpIHtcbiAgICBldmVudHNcbiAgICAgIC5maWx0ZXIoZXZlbnQgPT4gZXZlbnQuYWN0aW9uICE9PSAnbW9kaWZpZWQnKVxuICAgICAgLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3Byb2plY3REaXJlY3Rvcmllcykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgYWN0aW9uLCBwYXRoLCBvbGRQYXRoIH0gPSBldmVudDtcblxuICAgICAgICBjb25zdCBwcm9qZWN0RGlyZWN0b3J5ID0gdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzXG4gICAgICAgICAgLmZpbmQocHJvamVjdERpcmVjdG9yeSA9PiBwYXRoLmluZGV4T2YocHJvamVjdERpcmVjdG9yeS5wYXRoKSA9PT0gMCk7XG5cbiAgICAgICAgaWYgKCFwcm9qZWN0RGlyZWN0b3J5KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpcmVjdG9yeVBhdGggPSBwcm9qZWN0RGlyZWN0b3J5LnBhdGg7XG4gICAgICAgIGNvbnN0IGlnbm9yZWQgPSB0aGlzLl9pc1BhdGhJZ25vcmVkKHBhdGgpO1xuXG4gICAgICAgIGlmIChpZ25vcmVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXMgPSB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuZ2V0KGRpcmVjdG9yeVBhdGgpIHx8IFtdO1xuXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgY2FzZSAnY3JlYXRlZCc6XG4gICAgICAgICAgICBmaWxlcy5wdXNoKHBhdGgpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdkZWxldGVkJzpcbiAgICAgICAgICAgIGNvbnN0IGkgPSBmaWxlcy5pbmRleE9mKHBhdGgpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICBmaWxlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ3JlbmFtZWQnOlxuICAgICAgICAgICAgY29uc3QgaiA9IGZpbGVzLmluZGV4T2Yob2xkUGF0aCk7XG4gICAgICAgICAgICBpZiAoaiA+IC0xKSB7XG4gICAgICAgICAgICAgIGZpbGVzW2pdID0gcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuaGFzKGRpcmVjdG9yeVBhdGgpKSB7XG4gICAgICAgICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LnNldChkaXJlY3RvcnlQYXRoLCBmaWxlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIGlnbm9yZSBwYXR0ZXJucyBmb3IgYSBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7U3RyaW5nfSBkaXJlY3RvcnlQYXRoXG4gICAqIEByZXR1cm4ge1N0cmluZ1tdfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldElnbm9yZVBhdHRlcm5zKGRpcmVjdG9yeVBhdGgpIHtcbiAgICBjb25zdCBwYXR0ZXJucyA9IFtdO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWROYW1lcycpKSB7XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJykuZm9yRWFjaChwYXR0ZXJuID0+IHBhdHRlcm5zLnB1c2gocGF0dGVybikpO1xuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBnaXRJZ25vcmUgPSBmcy5yZWFkRmlsZVN5bmMoZGlyZWN0b3J5UGF0aCArICcvLmdpdGlnbm9yZScsICd1dGYtOCcpO1xuICAgICAgICBnaXRJZ25vcmVQYXJzZXIoZ2l0SWdub3JlKS5mb3JFYWNoKHBhdHRlcm4gPT4gcGF0dGVybnMucHVzaChwYXR0ZXJuKSk7XG4gICAgICB9XG4gICAgICBjYXRjaChlcnIpIHtcbiAgICAgICAgLy8gLmdpdGlnbm9yZSBkb2VzIG5vdCBleGlzdCBmb3IgdGhpcyBkaXJlY3RvcnksIGlnbm9yaW5nXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaWdub3JlZFBhdHRlcm5zID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlZFBhdHRlcm5zJyk7XG4gICAgaWYgKGlnbm9yZWRQYXR0ZXJucykge1xuICAgICAgaWdub3JlZFBhdHRlcm5zLmZvckVhY2gocGF0dGVybiA9PiBwYXR0ZXJucy5wdXNoKHBhdHRlcm4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0dGVybnM7XG4gIH1cblxuICAvKipcbiAgICogUG9wdWxhdGVzIGNhY2hlIGZvciBhIHByb2plY3QgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BvcHVsYXRlQ2FjaGVGb3IocHJvamVjdERpcmVjdG9yeSkge1xuICAgIGNvbnN0IGRpcmVjdG9yeVBhdGggPSBwcm9qZWN0RGlyZWN0b3J5LnBhdGg7XG5cbiAgICBjb25zdCBpZ25vcmVQYXR0ZXJucyA9IHRoaXMuX2dldElnbm9yZVBhdHRlcm5zKGRpcmVjdG9yeVBhdGgpO1xuICAgIGNvbnN0IGlnbm9yZVBhdHRlcm5zRm9yRmluZCA9IGlnbm9yZVBhdHRlcm5zLm1hcChcbiAgICAgIHBhdHRlcm4gPT4gcGF0dGVyblxuICAgICAgICAucmVwbGFjZSgvXFwuL2csICdcXFxcLicpXG4gICAgICAgIC5yZXBsYWNlKC9cXCovZywgJy4qJylcbiAgICApO1xuICAgIGNvbnN0IGlnbm9yZVBhdHRlcm4gPSAnXFwnLipcXFxcKCcgKyBpZ25vcmVQYXR0ZXJuc0ZvckZpbmQuam9pbignXFxcXHwnKSArICdcXFxcKS4qXFwnJztcblxuICAgIGNvbnN0IGNtZCA9IFtcbiAgICAgICdmaW5kJyxcbiAgICAgICctTCcsXG4gICAgICBkaXJlY3RvcnlQYXRoICsgJy8nLFxuICAgICAgJy10eXBlJywgJ2YnLFxuICAgICAgJy1ub3QnLCAnLXJlZ2V4JywgaWdub3JlUGF0dGVybixcbiAgICBdLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBleGVjUHJvbWlzZShjbWQsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQsXG4gICAgfSkudGhlbihzdGRvdXQgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBfLmNvbXBhY3Qoc3Rkb3V0LnNwbGl0KCdcXG4nKSk7XG5cbiAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5zZXQoZGlyZWN0b3J5UGF0aCwgZmlsZXMpO1xuXG4gICAgICByZXR1cm4gZmlsZXM7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==