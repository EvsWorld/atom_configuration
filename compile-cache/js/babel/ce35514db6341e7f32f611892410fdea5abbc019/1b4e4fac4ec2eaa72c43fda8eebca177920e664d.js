Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _pathsCache = require('./paths-cache');

var _pathsCache2 = _interopRequireDefault(_pathsCache);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _configDefaultScopes = require('./config/default-scopes');

var _configDefaultScopes2 = _interopRequireDefault(_configDefaultScopes);

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';
var PathsProvider = (function (_EventEmitter) {
  _inherits(PathsProvider, _EventEmitter);

  function PathsProvider() {
    _classCallCheck(this, PathsProvider);

    _get(Object.getPrototypeOf(PathsProvider.prototype), 'constructor', this).call(this);
    this.reloadScopes();

    this._pathsCache = new _pathsCache2['default']();
    this._isReady = false;

    this._onRebuildCache = this._onRebuildCache.bind(this);
    this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this);

    this._pathsCache.on('rebuild-cache', this._onRebuildCache);
    this._pathsCache.on('rebuild-cache-done', this._onRebuildCacheDone);
  }

  /**
   * Reloads the scopes
   */

  _createClass(PathsProvider, [{
    key: 'reloadScopes',
    value: function reloadScopes() {
      this._scopes = atom.config.get('autocomplete-paths.scopes').slice(0) || [];

      if (!atom.config.get('autocomplete-paths.ignoreBuiltinScopes')) {
        this._scopes = this._scopes.concat(_configDefaultScopes2['default']);
      }

      for (var key in _configOptionScopes2['default']) {
        if (atom.config.get('autocomplete-paths.' + key)) {
          this._scopes = this._scopes.slice(0).concat(_configOptionScopes2['default'][key]);
        }
      }
    }

    /**
     * Gets called when the PathsCache is starting to rebuild the cache
     * @private
     */
  }, {
    key: '_onRebuildCache',
    value: function _onRebuildCache() {
      this.emit('rebuild-cache');
    }

    /**
     * Gets called when the PathsCache is done rebuilding the cache
     * @private
     */
  }, {
    key: '_onRebuildCacheDone',
    value: function _onRebuildCacheDone() {
      this.emit('rebuild-cache-done');
    }

    /**
     * Checks if the given scope config matches the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Array} The match object
     * @private
     */
  }, {
    key: '_scopeMatchesRequest',
    value: function _scopeMatchesRequest(scope, request) {
      var sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [scope.scopes];

      // Check if the scope descriptors match
      var scopeMatches = _underscorePlus2['default'].intersection(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0;
      if (!scopeMatches) return false;

      // Check if the line matches the prefixes
      var line = this._getLineTextForRequest(request);

      var lineMatch = null;
      var scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [scope.prefixes];
      scopePrefixes.forEach(function (prefix) {
        var regex = new RegExp(prefix, 'i');
        lineMatch = lineMatch || line.match(regex);
      });

      return lineMatch;
    }

    /**
     * Returns the whole line text for the given request
     * @param  {Object} request
     * @return {String}
     * @private
     */
  }, {
    key: '_getLineTextForRequest',
    value: function _getLineTextForRequest(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    }

    /**
     * Returns the suggestions for the given scope and the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getSuggestionsForScope',
    value: function _getSuggestionsForScope(scope, request, match) {
      var line = this._getLineTextForRequest(request);
      var pathPrefix = line.substr(match.index + match[0].length);
      var trailingSlashPresent = pathPrefix.match(/[/|\\]$/);
      var directoryGiven = pathPrefix.indexOf('./') === 0 || pathPrefix.indexOf('../') === 0;
      var parsedPathPrefix = _path2['default'].parse(pathPrefix);

      // path.parse ignores trailing slashes, so we handle this manually
      if (trailingSlashPresent) {
        parsedPathPrefix.dir = _path2['default'].join(parsedPathPrefix.dir, parsedPathPrefix.base);
        parsedPathPrefix.base = '';
        parsedPathPrefix.name = '';
      }

      var projectDirectory = this._getProjectDirectory(request.editor);
      if (!projectDirectory) return Promise.resolve([]);
      var currentDirectory = _path2['default'].dirname(request.editor.getPath());

      var requestedDirectoryPath = _path2['default'].resolve(currentDirectory, parsedPathPrefix.dir);

      var files = directoryGiven ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath) : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory);

      var fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix;

      var extensions = scope.extensions;

      if (extensions) {
        (function () {
          var regex = new RegExp('.(' + extensions.join('|') + ')$');
          files = files.filter(function (path) {
            return regex.test(path);
          });
        })();
      }

      if (fuzzyMatcher) {
        files = _fuzzaldrinPlus2['default'].filter(files, fuzzyMatcher, {
          maxResults: 10
        });
      }

      var suggestions = files.map(function (pathName) {
        var normalizeSlashes = atom.config.get('autocomplete-paths.normalizeSlashes');

        var projectRelativePath = atom.project.relativizePath(pathName)[1];
        var displayText = projectRelativePath;
        if (directoryGiven) {
          displayText = _path2['default'].relative(requestedDirectoryPath, pathName);
        }
        if (normalizeSlashes) {
          displayText = (0, _slash2['default'])(displayText);
        }

        // Relativize path to current file if necessary
        var relativePath = _path2['default'].relative(_path2['default'].dirname(request.editor.getPath()), pathName);
        if (normalizeSlashes) relativePath = (0, _slash2['default'])(relativePath);
        if (scope.relative !== false) {
          pathName = relativePath;
          if (scope.includeCurrentDirectory !== false) {
            if (pathName[0] !== '.') {
              pathName = './' + pathName;
            }
          }
        }

        if (scope.projectRelativePath) {
          pathName = projectRelativePath;
        }

        // Replace stuff if necessary
        if (scope.replaceOnInsert) {
          var originalPathName = pathName;
          scope.replaceOnInsert.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var from = _ref2[0];
            var to = _ref2[1];

            var regex = new RegExp(from);
            if (regex.test(pathName)) {
              pathName = pathName.replace(regex, to);
            }
          });
        }

        // Calculate distance to file
        var distanceToFile = relativePath.split(_path2['default'].sep).length;
        return {
          text: pathName,
          replacementPrefix: pathPrefix,
          displayText: displayText,
          type: 'import',
          iconHTML: '<i class="icon-file-code"></i>',
          score: _fuzzaldrinPlus2['default'].score(displayText, request.prefix),
          distanceToFile: distanceToFile
        };
      });

      // Modify score to incorporate distance
      var suggestionsCount = suggestions.length;
      if (suggestions.length) {
        (function () {
          var maxDistance = _underscorePlus2['default'].max(suggestions, function (s) {
            return s.distanceToFile;
          }).distanceToFile;
          suggestions.forEach(function (s, i) {
            s.score = suggestionsCount - i + (maxDistance - s.distanceToFile);
          });

          // Sort again
          suggestions.sort(function (a, b) {
            return b.score - a.score;
          });
        })();
      }

      return Promise.resolve(suggestions);
    }

    /**
     * Returns the suggestions for the given request
     * @param  {Object} request
     * @return {Promise}
     */
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(request) {
      var _this = this;

      var matches = this._scopes.map(function (scope) {
        return [scope, _this._scopeMatchesRequest(scope, request)];
      }).filter(function (result) {
        return result[1];
      }); // Filter scopes that match
      var promises = matches.map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var scope = _ref32[0];
        var match = _ref32[1];
        return _this._getSuggestionsForScope(scope, request, match);
      });

      return Promise.all(promises).then(function (suggestions) {
        suggestions = _underscorePlus2['default'].flatten(suggestions);
        if (!suggestions.length) return false;
        return suggestions;
      });
    }

    /**
     * Rebuilds the cache
     * @return {Promise}
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var _this2 = this;

      return this._pathsCache.rebuildCache().then(function (result) {
        _this2._isReady = true;
        return result;
      });
    }

    /**
     * Returns the project directory that contains the file opened in the given editor
     * @param  {TextEditor} editor
     * @return {Directory}
     * @private
     */
  }, {
    key: '_getProjectDirectory',
    value: function _getProjectDirectory(editor) {
      var filePath = editor.getBuffer().getPath();
      var projectDirectory = null;
      atom.project.getDirectories().forEach(function (directory) {
        if (directory.contains(filePath)) {
          projectDirectory = directory;
        }
      });
      return projectDirectory;
    }
  }, {
    key: 'isReady',
    value: function isReady() {
      return this._isReady;
    }
  }, {
    key: 'dispose',

    /**
     * Disposes this provider
     */
    value: function dispose() {
      this._pathsCache.removeListener('rebuild-cache', this._onRebuildCache);
      this._pathsCache.removeListener('rebuild-cache-done', this._onRebuildCacheDone);
      this._pathsCache.dispose(true);
    }
  }, {
    key: 'suggestionPriority',
    get: function get() {
      return atom.config.get('autocomplete-paths.suggestionPriority');
    }
  }, {
    key: 'fileCount',
    get: function get() {
      var _this3 = this;

      return atom.project.getDirectories().reduce(function (accumulated, directory) {
        var filePaths = _this3._pathsCache.getFilePathsForProjectDirectory(directory);
        return accumulated + filePaths.length;
      }, 0);
    }
  }]);

  return PathsProvider;
})(_events.EventEmitter);

exports['default'] = PathsProvider;

PathsProvider.prototype.selector = '*';
PathsProvider.prototype.inclusionPriority = 1;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRzZCLFFBQVE7O29CQUNwQixNQUFNOzs7OzhCQUNULGlCQUFpQjs7OztxQkFDYixPQUFPOzs7OzBCQUNGLGVBQWU7Ozs7OEJBQ2YsaUJBQWlCOzs7O21DQUNkLHlCQUF5Qjs7OztrQ0FDMUIsd0JBQXdCOzs7O0FBVmpELFdBQVcsQ0FBQTtJQVlVLGFBQWE7WUFBYixhQUFhOztBQUNwQixXQURPLGFBQWEsR0FDakI7MEJBREksYUFBYTs7QUFFOUIsK0JBRmlCLGFBQWEsNkNBRXZCO0FBQ1AsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBOztBQUVuQixRQUFJLENBQUMsV0FBVyxHQUFHLDZCQUFnQixDQUFBO0FBQ25DLFFBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBOztBQUVyQixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3RELFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUU5RCxRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzFELFFBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0dBQ3BFOzs7Ozs7ZUFia0IsYUFBYTs7V0FrQm5CLHdCQUFHO0FBQ2QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENB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Q2QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUs7QUFDdEUsWUFBTSxTQUFTLEdBQUcsT0FBSyxXQUFXLENBQUMsK0JBQStCLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0UsZUFBTyxXQUFXLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztPQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ047OztTQTVRa0IsYUFBYTs7O3FCQUFiLGFBQWE7O0FBd1JsQyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUE7QUFDdEMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL3BhdGhzLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGdsb2JhbCBhdG9tICovXG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgc2xhc2ggZnJvbSAnc2xhc2gnXG5pbXBvcnQgUGF0aHNDYWNoZSBmcm9tICcuL3BhdGhzLWNhY2hlJ1xuaW1wb3J0IGZ1enphbGRyaW4gZnJvbSAnZnV6emFsZHJpbi1wbHVzJ1xuaW1wb3J0IERlZmF1bHRTY29wZXMgZnJvbSAnLi9jb25maWcvZGVmYXVsdC1zY29wZXMnXG5pbXBvcnQgT3B0aW9uU2NvcGVzIGZyb20gJy4vY29uZmlnL29wdGlvbi1zY29wZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGhzUHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMucmVsb2FkU2NvcGVzKClcblxuICAgIHRoaXMuX3BhdGhzQ2FjaGUgPSBuZXcgUGF0aHNDYWNoZSgpXG4gICAgdGhpcy5faXNSZWFkeSA9IGZhbHNlXG5cbiAgICB0aGlzLl9vblJlYnVpbGRDYWNoZSA9IHRoaXMuX29uUmVidWlsZENhY2hlLmJpbmQodGhpcylcbiAgICB0aGlzLl9vblJlYnVpbGRDYWNoZURvbmUgPSB0aGlzLl9vblJlYnVpbGRDYWNoZURvbmUuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5fcGF0aHNDYWNoZS5vbigncmVidWlsZC1jYWNoZScsIHRoaXMuX29uUmVidWlsZENhY2hlKVxuICAgIHRoaXMuX3BhdGhzQ2FjaGUub24oJ3JlYnVpbGQtY2FjaGUtZG9uZScsIHRoaXMuX29uUmVidWlsZENhY2hlRG9uZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxvYWRzIHRoZSBzY29wZXNcbiAgICovXG4gIHJlbG9hZFNjb3BlcyAoKSB7XG4gICAgdGhpcy5fc2NvcGVzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuc2NvcGVzJykuc2xpY2UoMCkgfHwgW11cblxuICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlQnVpbHRpblNjb3BlcycpKSB7XG4gICAgICB0aGlzLl9zY29wZXMgPSB0aGlzLl9zY29wZXMuY29uY2F0KERlZmF1bHRTY29wZXMpXG4gICAgfVxuXG4gICAgZm9yICh2YXIga2V5IGluIE9wdGlvblNjb3Blcykge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldChgYXV0b2NvbXBsZXRlLXBhdGhzLiR7a2V5fWApKSB7XG4gICAgICAgIHRoaXMuX3Njb3BlcyA9IHRoaXMuX3Njb3Blcy5zbGljZSgwKS5jb25jYXQoT3B0aW9uU2NvcGVzW2tleV0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgY2FsbGVkIHdoZW4gdGhlIFBhdGhzQ2FjaGUgaXMgc3RhcnRpbmcgdG8gcmVidWlsZCB0aGUgY2FjaGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vblJlYnVpbGRDYWNoZSAoKSB7XG4gICAgdGhpcy5lbWl0KCdyZWJ1aWxkLWNhY2hlJylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGNhbGxlZCB3aGVuIHRoZSBQYXRoc0NhY2hlIGlzIGRvbmUgcmVidWlsZGluZyB0aGUgY2FjaGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vblJlYnVpbGRDYWNoZURvbmUgKCkge1xuICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZS1kb25lJylcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIHNjb3BlIGNvbmZpZyBtYXRjaGVzIHRoZSBnaXZlbiByZXF1ZXN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gc2NvcGVcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZXF1ZXN0XG4gICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbWF0Y2ggb2JqZWN0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2NvcGVNYXRjaGVzUmVxdWVzdCAoc2NvcGUsIHJlcXVlc3QpIHtcbiAgICBjb25zdCBzb3VyY2VTY29wZXMgPSBBcnJheS5pc0FycmF5KHNjb3BlLnNjb3BlcylcbiAgICAgID8gc2NvcGUuc2NvcGVzXG4gICAgICA6IFtzY29wZS5zY29wZXNdXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgc2NvcGUgZGVzY3JpcHRvcnMgbWF0Y2hcbiAgICBjb25zdCBzY29wZU1hdGNoZXMgPSBfLmludGVyc2VjdGlvbihcbiAgICAgIHJlcXVlc3Quc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCksXG4gICAgICBzb3VyY2VTY29wZXNcbiAgICApLmxlbmd0aCA+IDBcbiAgICBpZiAoIXNjb3BlTWF0Y2hlcykgcmV0dXJuIGZhbHNlXG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbGluZSBtYXRjaGVzIHRoZSBwcmVmaXhlc1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLl9nZXRMaW5lVGV4dEZvclJlcXVlc3QocmVxdWVzdClcblxuICAgIGxldCBsaW5lTWF0Y2ggPSBudWxsXG4gICAgY29uc3Qgc2NvcGVQcmVmaXhlcyA9IEFycmF5LmlzQXJyYXkoc2NvcGUucHJlZml4ZXMpXG4gICAgICA/IHNjb3BlLnByZWZpeGVzXG4gICAgICA6IFtzY29wZS5wcmVmaXhlc11cbiAgICBzY29wZVByZWZpeGVzLmZvckVhY2gocHJlZml4ID0+IHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChwcmVmaXgsICdpJylcbiAgICAgIGxpbmVNYXRjaCA9IGxpbmVNYXRjaCB8fCBsaW5lLm1hdGNoKHJlZ2V4KVxuICAgIH0pXG5cbiAgICByZXR1cm4gbGluZU1hdGNoXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2hvbGUgbGluZSB0ZXh0IGZvciB0aGUgZ2l2ZW4gcmVxdWVzdFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldExpbmVUZXh0Rm9yUmVxdWVzdCAocmVxdWVzdCkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiB9ID0gcmVxdWVzdFxuICAgIHJldHVybiBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3VnZ2VzdGlvbnMgZm9yIHRoZSBnaXZlbiBzY29wZSBhbmQgdGhlIGdpdmVuIHJlcXVlc3RcbiAgICogQHBhcmFtICB7T2JqZWN0fSBzY29wZVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRTdWdnZXN0aW9uc0ZvclNjb3BlIChzY29wZSwgcmVxdWVzdCwgbWF0Y2gpIHtcbiAgICBjb25zdCBsaW5lID0gdGhpcy5fZ2V0TGluZVRleHRGb3JSZXF1ZXN0KHJlcXVlc3QpXG4gICAgY29uc3QgcGF0aFByZWZpeCA9IGxpbmUuc3Vic3RyKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKVxuICAgIGNvbnN0IHRyYWlsaW5nU2xhc2hQcmVzZW50ID0gcGF0aFByZWZpeC5tYXRjaCgvWy98XFxcXF0kLylcbiAgICBjb25zdCBkaXJlY3RvcnlHaXZlbiA9IHBhdGhQcmVmaXguaW5kZXhPZignLi8nKSA9PT0gMCB8fCBwYXRoUHJlZml4LmluZGV4T2YoJy4uLycpID09PSAwXG4gICAgY29uc3QgcGFyc2VkUGF0aFByZWZpeCA9IHBhdGgucGFyc2UocGF0aFByZWZpeClcblxuICAgIC8vIHBhdGgucGFyc2UgaWdub3JlcyB0cmFpbGluZyBzbGFzaGVzLCBzbyB3ZSBoYW5kbGUgdGhpcyBtYW51YWxseVxuICAgIGlmICh0cmFpbGluZ1NsYXNoUHJlc2VudCkge1xuICAgICAgcGFyc2VkUGF0aFByZWZpeC5kaXIgPSBwYXRoLmpvaW4ocGFyc2VkUGF0aFByZWZpeC5kaXIsIHBhcnNlZFBhdGhQcmVmaXguYmFzZSlcbiAgICAgIHBhcnNlZFBhdGhQcmVmaXguYmFzZSA9ICcnXG4gICAgICBwYXJzZWRQYXRoUHJlZml4Lm5hbWUgPSAnJ1xuICAgIH1cblxuICAgIGNvbnN0IHByb2plY3REaXJlY3RvcnkgPSB0aGlzLl9nZXRQcm9qZWN0RGlyZWN0b3J5KHJlcXVlc3QuZWRpdG9yKVxuICAgIGlmICghcHJvamVjdERpcmVjdG9yeSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgICBjb25zdCBjdXJyZW50RGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKHJlcXVlc3QuZWRpdG9yLmdldFBhdGgoKSlcblxuICAgIGNvbnN0IHJlcXVlc3RlZERpcmVjdG9yeVBhdGggPSBwYXRoLnJlc29sdmUoY3VycmVudERpcmVjdG9yeSwgcGFyc2VkUGF0aFByZWZpeC5kaXIpXG5cbiAgICBsZXQgZmlsZXMgPSBkaXJlY3RvcnlHaXZlblxuICAgICAgPyB0aGlzLl9wYXRoc0NhY2hlLmdldEZpbGVQYXRoc0ZvclByb2plY3REaXJlY3RvcnkocHJvamVjdERpcmVjdG9yeSwgcmVxdWVzdGVkRGlyZWN0b3J5UGF0aClcbiAgICAgIDogdGhpcy5fcGF0aHNDYWNoZS5nZXRGaWxlUGF0aHNGb3JQcm9qZWN0RGlyZWN0b3J5KHByb2plY3REaXJlY3RvcnkpXG5cbiAgICBjb25zdCBmdXp6eU1hdGNoZXIgPSBkaXJlY3RvcnlHaXZlblxuICAgICAgPyBwYXJzZWRQYXRoUHJlZml4LmJhc2VcbiAgICAgIDogcGF0aFByZWZpeFxuXG4gICAgY29uc3QgeyBleHRlbnNpb25zIH0gPSBzY29wZVxuICAgIGlmIChleHRlbnNpb25zKSB7XG4gICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYC4oJHtleHRlbnNpb25zLmpvaW4oJ3wnKX0pJGApXG4gICAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihwYXRoID0+IHJlZ2V4LnRlc3QocGF0aCkpXG4gICAgfVxuXG4gICAgaWYgKGZ1enp5TWF0Y2hlcikge1xuICAgICAgZmlsZXMgPSBmdXp6YWxkcmluLmZpbHRlcihmaWxlcywgZnV6enlNYXRjaGVyLCB7XG4gICAgICAgIG1heFJlc3VsdHM6IDEwXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxldCBzdWdnZXN0aW9ucyA9IGZpbGVzLm1hcChwYXRoTmFtZSA9PiB7XG4gICAgICBjb25zdCBub3JtYWxpemVTbGFzaGVzID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMubm9ybWFsaXplU2xhc2hlcycpXG5cbiAgICAgIGNvbnN0IHByb2plY3RSZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aE5hbWUpWzFdXG4gICAgICBsZXQgZGlzcGxheVRleHQgPSBwcm9qZWN0UmVsYXRpdmVQYXRoXG4gICAgICBpZiAoZGlyZWN0b3J5R2l2ZW4pIHtcbiAgICAgICAgZGlzcGxheVRleHQgPSBwYXRoLnJlbGF0aXZlKHJlcXVlc3RlZERpcmVjdG9yeVBhdGgsIHBhdGhOYW1lKVxuICAgICAgfVxuICAgICAgaWYgKG5vcm1hbGl6ZVNsYXNoZXMpIHtcbiAgICAgICAgZGlzcGxheVRleHQgPSBzbGFzaChkaXNwbGF5VGV4dClcbiAgICAgIH1cblxuICAgICAgLy8gUmVsYXRpdml6ZSBwYXRoIHRvIGN1cnJlbnQgZmlsZSBpZiBuZWNlc3NhcnlcbiAgICAgIGxldCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShyZXF1ZXN0LmVkaXRvci5nZXRQYXRoKCkpLCBwYXRoTmFtZSlcbiAgICAgIGlmIChub3JtYWxpemVTbGFzaGVzKSByZWxhdGl2ZVBhdGggPSBzbGFzaChyZWxhdGl2ZVBhdGgpXG4gICAgICBpZiAoc2NvcGUucmVsYXRpdmUgIT09IGZhbHNlKSB7XG4gICAgICAgIHBhdGhOYW1lID0gcmVsYXRpdmVQYXRoXG4gICAgICAgIGlmIChzY29wZS5pbmNsdWRlQ3VycmVudERpcmVjdG9yeSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAocGF0aE5hbWVbMF0gIT09ICcuJykge1xuICAgICAgICAgICAgcGF0aE5hbWUgPSBgLi8ke3BhdGhOYW1lfWBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjb3BlLnByb2plY3RSZWxhdGl2ZVBhdGgpIHtcbiAgICAgICAgcGF0aE5hbWUgPSBwcm9qZWN0UmVsYXRpdmVQYXRoXG4gICAgICB9XG5cbiAgICAgIC8vIFJlcGxhY2Ugc3R1ZmYgaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAoc2NvcGUucmVwbGFjZU9uSW5zZXJ0KSB7XG4gICAgICAgIGxldCBvcmlnaW5hbFBhdGhOYW1lID0gcGF0aE5hbWVcbiAgICAgICAgc2NvcGUucmVwbGFjZU9uSW5zZXJ0LmZvckVhY2goKFtmcm9tLCB0b10pID0+IHtcbiAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoZnJvbSlcbiAgICAgICAgICBpZiAocmVnZXgudGVzdChwYXRoTmFtZSkpIHtcbiAgICAgICAgICAgIHBhdGhOYW1lID0gcGF0aE5hbWUucmVwbGFjZShyZWdleCwgdG8pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBDYWxjdWxhdGUgZGlzdGFuY2UgdG8gZmlsZVxuICAgICAgY29uc3QgZGlzdGFuY2VUb0ZpbGUgPSByZWxhdGl2ZVBhdGguc3BsaXQocGF0aC5zZXApLmxlbmd0aFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogcGF0aE5hbWUsXG4gICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwYXRoUHJlZml4LFxuICAgICAgICBkaXNwbGF5VGV4dCxcbiAgICAgICAgdHlwZTogJ2ltcG9ydCcsXG4gICAgICAgIGljb25IVE1MOiAnPGkgY2xhc3M9XCJpY29uLWZpbGUtY29kZVwiPjwvaT4nLFxuICAgICAgICBzY29yZTogZnV6emFsZHJpbi5zY29yZShkaXNwbGF5VGV4dCwgcmVxdWVzdC5wcmVmaXgpLFxuICAgICAgICBkaXN0YW5jZVRvRmlsZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBNb2RpZnkgc2NvcmUgdG8gaW5jb3Jwb3JhdGUgZGlzdGFuY2VcbiAgICBjb25zdCBzdWdnZXN0aW9uc0NvdW50ID0gc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgaWYgKHN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgY29uc3QgbWF4RGlzdGFuY2UgPSBfLm1heChzdWdnZXN0aW9ucywgcyA9PiBzLmRpc3RhbmNlVG9GaWxlKS5kaXN0YW5jZVRvRmlsZVxuICAgICAgc3VnZ2VzdGlvbnMuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgICBzLnNjb3JlID0gKHN1Z2dlc3Rpb25zQ291bnQgLSBpKSArIChtYXhEaXN0YW5jZSAtIHMuZGlzdGFuY2VUb0ZpbGUpXG4gICAgICB9KVxuXG4gICAgICAvLyBTb3J0IGFnYWluXG4gICAgICBzdWdnZXN0aW9ucy5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSlcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN1Z2dlc3Rpb25zKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN1Z2dlc3Rpb25zIGZvciB0aGUgZ2l2ZW4gcmVxdWVzdFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIGdldFN1Z2dlc3Rpb25zIChyZXF1ZXN0KSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMuX3Njb3Blc1xuICAgICAgLm1hcChzY29wZSA9PiBbc2NvcGUsIHRoaXMuX3Njb3BlTWF0Y2hlc1JlcXVlc3Qoc2NvcGUsIHJlcXVlc3QpXSlcbiAgICAgIC5maWx0ZXIocmVzdWx0ID0+IHJlc3VsdFsxXSkgLy8gRmlsdGVyIHNjb3BlcyB0aGF0IG1hdGNoXG4gICAgY29uc3QgcHJvbWlzZXMgPSBtYXRjaGVzLm1hcCgoW3Njb3BlLCBtYXRjaF0pID0+XG4gICAgICB0aGlzLl9nZXRTdWdnZXN0aW9uc0ZvclNjb3BlKHNjb3BlLCByZXF1ZXN0LCBtYXRjaClcbiAgICApXG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAudGhlbihzdWdnZXN0aW9ucyA9PiB7XG4gICAgICAgIHN1Z2dlc3Rpb25zID0gXy5mbGF0dGVuKHN1Z2dlc3Rpb25zKVxuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zLmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWJ1aWxkcyB0aGUgY2FjaGVcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJlYnVpbGRDYWNoZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhdGhzQ2FjaGUucmVidWlsZENhY2hlKClcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMuX2lzUmVhZHkgPSB0cnVlXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcHJvamVjdCBkaXJlY3RvcnkgdGhhdCBjb250YWlucyB0aGUgZmlsZSBvcGVuZWQgaW4gdGhlIGdpdmVuIGVkaXRvclxuICAgKiBAcGFyYW0gIHtUZXh0RWRpdG9yfSBlZGl0b3JcbiAgICogQHJldHVybiB7RGlyZWN0b3J5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldFByb2plY3REaXJlY3RvcnkgKGVkaXRvcikge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldFBhdGgoKVxuICAgIGxldCBwcm9qZWN0RGlyZWN0b3J5ID0gbnVsbFxuICAgIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZvckVhY2goZGlyZWN0b3J5ID0+IHtcbiAgICAgIGlmIChkaXJlY3RvcnkuY29udGFpbnMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHByb2plY3REaXJlY3RvcnkgPSBkaXJlY3RvcnlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBwcm9qZWN0RGlyZWN0b3J5XG4gIH1cblxuICBpc1JlYWR5ICgpIHsgcmV0dXJuIHRoaXMuX2lzUmVhZHkgfVxuXG4gIGdldCBzdWdnZXN0aW9uUHJpb3JpdHkgKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5zdWdnZXN0aW9uUHJpb3JpdHknKVxuICB9XG5cbiAgZ2V0IGZpbGVDb3VudCgpIHtcbiAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkucmVkdWNlKChhY2N1bXVsYXRlZCwgZGlyZWN0b3J5KSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aHMgPSB0aGlzLl9wYXRoc0NhY2hlLmdldEZpbGVQYXRoc0ZvclByb2plY3REaXJlY3RvcnkoZGlyZWN0b3J5KVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkICsgZmlsZVBhdGhzLmxlbmd0aDtcbiAgICB9LCAwKVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoaXMgcHJvdmlkZXJcbiAgICovXG4gIGRpc3Bvc2UgKCkge1xuICAgIHRoaXMuX3BhdGhzQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ3JlYnVpbGQtY2FjaGUnLCB0aGlzLl9vblJlYnVpbGRDYWNoZSlcbiAgICB0aGlzLl9wYXRoc0NhY2hlLnJlbW92ZUxpc3RlbmVyKCdyZWJ1aWxkLWNhY2hlLWRvbmUnLCB0aGlzLl9vblJlYnVpbGRDYWNoZURvbmUpXG4gICAgdGhpcy5fcGF0aHNDYWNoZS5kaXNwb3NlKHRydWUpXG4gIH1cbn1cblxuUGF0aHNQcm92aWRlci5wcm90b3R5cGUuc2VsZWN0b3IgPSAnKidcblBhdGhzUHJvdmlkZXIucHJvdG90eXBlLmluY2x1c2lvblByaW9yaXR5ID0gMVxuIl19