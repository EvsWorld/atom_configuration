function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/* eslint-disable import/extensions, import/no-extraneous-dependencies */

var _atom = require('atom');

/* eslint-enable import/extensions, import/no-extraneous-dependencies */

// Dependencies
'use babel';

var helpers = undefined;
var atomlinter = undefined;
var Reporter = undefined;

function loadDeps() {
  if (!helpers) {
    helpers = require('./helpers');
  }
  if (!atomlinter) {
    atomlinter = require('atom-linter');
  }
  if (!Reporter) {
    Reporter = require('jshint-json');
  }
}

module.exports = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterJSHintDeps = function installLinterJSHintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-jshint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterJSHintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.scopes = [];

    this.subscriptions = new _atom.CompositeDisposable();
    var scopeEmbedded = 'source.js.embedded.html';

    this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', function (value) {
      if (value === '') {
        _this.executablePath = _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint');
      } else {
        _this.executablePath = value;
      }
    }), atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', function (value) {
      _this.disableWhenNoJshintrcFileInPath = value;
    }), atom.config.observe('linter-jshint.jshintFileName', function (value) {
      _this.jshintFileName = value;
    }), atom.config.observe('linter-jshint.jshintignoreFilename', function (value) {
      _this.jshintignoreFilename = value;
    }), atom.config.observe('linter-jshint.lintInlineJavaScript', function (value) {
      _this.lintInlineJavaScript = value;
      if (value) {
        _this.scopes.push(scopeEmbedded);
      } else if (_this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
      }
    }), atom.config.observe('linter-jshint.scopes', function (value) {
      // NOTE: Subscriptions are created in the order given to add() so this
      // is safe at the end.

      // Remove any old scopes
      _this.scopes.splice(0, _this.scopes.length);
      // Add the current scopes
      Array.prototype.push.apply(_this.scopes, value);
      // Re-check the embedded JS scope
      if (_this.lintInlineJavaScript && _this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.push(scopeEmbedded);
      }
    }), atom.commands.add('atom-text-editor', {
      'linter-jshint:debug': _asyncToGenerator(function* () {
        loadDeps();
        var debugString = yield helpers.generateDebugString();
        var notificationOptions = { detail: debugString, dismissable: true };
        atom.notifications.addInfo('linter-jshint:: Debugging information', notificationOptions);
      })
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'JSHint',
      grammarScopes: this.scopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var results = [];
        var filePath = textEditor.getPath();
        var fileDir = _path2['default'].dirname(filePath);
        var fileContents = textEditor.getText();
        loadDeps();
        var parameters = ['--reporter', Reporter, '--filename', filePath];

        var configFile = yield atomlinter.findCachedAsync(fileDir, _this2.jshintFileName);

        if (configFile) {
          if (_this2.jshintFileName !== '.jshintrc') {
            parameters.push('--config', configFile);
          }
        } else if (_this2.disableWhenNoJshintrcFileInPath && !(yield helpers.hasHomeConfig())) {
          return results;
        }

        // JSHint completely ignores .jshintignore files for STDIN on it's own
        // so we must re-implement the functionality
        var ignoreFile = yield atomlinter.findCachedAsync(fileDir, _this2.jshintignoreFilename);
        if (ignoreFile) {
          var isIgnored = yield helpers.isIgnored(filePath, ignoreFile);
          if (isIgnored) {
            return [];
          }
        }

        if (_this2.lintInlineJavaScript && textEditor.getGrammar().scopeName.indexOf('text.html') !== -1) {
          parameters.push('--extract', 'always');
        }
        parameters.push('-');

        var execOpts = {
          stdin: fileContents,
          ignoreExitCode: true,
          cwd: fileDir
        };
        var result = yield atomlinter.execNode(_this2.executablePath, parameters, execOpts);

        if (textEditor.getText() !== fileContents) {
          // File has changed since the lint was triggered, tell Linter not to update
          return null;
        }

        var parsed = undefined;
        try {
          parsed = JSON.parse(result);
        } catch (_) {
          // eslint-disable-next-line no-console
          console.error('[Linter-JSHint]', _, result);
          atom.notifications.addWarning('[Linter-JSHint]', { detail: 'JSHint return an invalid response, check your console for more info' });
          return results;
        }

        Object.keys(parsed.result).forEach(function (entryID) {
          var message = undefined;
          var entry = parsed.result[entryID];

          var error = entry.error;

          var errorType = error.code.substr(0, 1);
          var severity = 'info';
          if (errorType === 'E') {
            severity = 'error';
          } else if (errorType === 'W') {
            severity = 'warning';
          }
          var line = error.line > 0 ? error.line - 1 : 0;
          var character = error.character > 0 ? error.character - 1 : 0;
          try {
            var position = atomlinter.generateRange(textEditor, line, character);
            message = {
              severity: severity,
              excerpt: error.code + ' - ' + error.reason,
              location: {
                file: filePath,
                position: position
              }
            };
          } catch (e) {
            message = helpers.generateInvalidTrace(line, character, filePath, textEditor, error);
          }

          results.push(message);
        });

        // Make sure any invalid traces have resolved
        return Promise.all(results);
      })
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWpzaGludC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUlpQixNQUFNOzs7Ozs7b0JBRWEsTUFBTTs7Ozs7QUFOMUMsV0FBVyxDQUFDOztBQVdaLElBQUksT0FBTyxZQUFBLENBQUM7QUFDWixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxRQUFRLFlBQUEsQ0FBQzs7QUFFYixTQUFTLFFBQVEsR0FBRztBQUNsQixNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztHQUNoQztBQUNELE1BQUksQ0FBQyxVQUFVLEVBQUU7QUFDZixjQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ3JDO0FBQ0QsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFlBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDbkM7Q0FDRjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDL0IsUUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixRQUFNLHVCQUF1QixHQUFHLFNBQTFCLHVCQUF1QixHQUFTO0FBQ3BDLFlBQUssYUFBYSxVQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixlQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDdkQ7QUFDRCxjQUFRLEVBQUUsQ0FBQztLQUNaLENBQUM7QUFDRixrQkFBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JFLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FB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Q0YsQ0FBQztXQUNILENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixtQkFBTyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7V0FDdEY7O0FBRUQsaUJBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkIsQ0FBQyxDQUFDOzs7QUFHSCxlQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDN0IsQ0FBQTtLQUNGLENBQUM7R0FDSDtDQUNGLENBQUMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIEBmbG93ICovXG5cbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnO1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSc7XG4vKiBlc2xpbnQtZW5hYmxlIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cblxuLy8gRGVwZW5kZW5jaWVzXG5sZXQgaGVscGVycztcbmxldCBhdG9tbGludGVyO1xubGV0IFJlcG9ydGVyO1xuXG5mdW5jdGlvbiBsb2FkRGVwcygpIHtcbiAgaWYgKCFoZWxwZXJzKSB7XG4gICAgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpO1xuICB9XG4gIGlmICghYXRvbWxpbnRlcikge1xuICAgIGF0b21saW50ZXIgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICB9XG4gIGlmICghUmVwb3J0ZXIpIHtcbiAgICBSZXBvcnRlciA9IHJlcXVpcmUoJ2pzaGludC1qc29uJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgZGVwc0NhbGxiYWNrSUQ7XG4gICAgY29uc3QgaW5zdGFsbExpbnRlckpTSGludERlcHMgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKGRlcHNDYWxsYmFja0lEKTtcbiAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItanNoaW50Jyk7XG4gICAgICB9XG4gICAgICBsb2FkRGVwcygpO1xuICAgIH07XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVySlNIaW50RGVwcyk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRCk7XG5cbiAgICB0aGlzLnNjb3BlcyA9IFtdO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBjb25zdCBzY29wZUVtYmVkZGVkID0gJ3NvdXJjZS5qcy5lbWJlZGRlZC5odG1sJztcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmV4ZWN1dGFibGVQYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gUGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdqc2hpbnQnLCAnYmluJywgJ2pzaGludCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmRpc2FibGVXaGVuTm9Kc2hpbnRyY0ZpbGVJblBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuanNoaW50RmlsZU5hbWUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5qc2hpbnRGaWxlTmFtZSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmpzaGludGlnbm9yZUZpbGVuYW1lJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuanNoaW50aWdub3JlRmlsZW5hbWUgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5saW50SW5saW5lSmF2YVNjcmlwdCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmxpbnRJbmxpbmVKYXZhU2NyaXB0ID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGVFbWJlZGRlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUVtYmVkZGVkKSAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNjb3Blcy5zcGxpY2UodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUVtYmVkZGVkKSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5zY29wZXMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgLy8gTk9URTogU3Vic2NyaXB0aW9ucyBhcmUgY3JlYXRlZCBpbiB0aGUgb3JkZXIgZ2l2ZW4gdG8gYWRkKCkgc28gdGhpc1xuICAgICAgICAvLyBpcyBzYWZlIGF0IHRoZSBlbmQuXG5cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBvbGQgc2NvcGVzXG4gICAgICAgIHRoaXMuc2NvcGVzLnNwbGljZSgwLCB0aGlzLnNjb3Blcy5sZW5ndGgpO1xuICAgICAgICAvLyBBZGQgdGhlIGN1cnJlbnQgc2NvcGVzXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuc2NvcGVzLCB2YWx1ZSk7XG4gICAgICAgIC8vIFJlLWNoZWNrIHRoZSBlbWJlZGRlZCBKUyBzY29wZVxuICAgICAgICBpZiAodGhpcy5saW50SW5saW5lSmF2YVNjcmlwdCAmJiB0aGlzLnNjb3Blcy5pbmRleE9mKHNjb3BlRW1iZWRkZWQpICE9PSAtMSkge1xuICAgICAgICAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGVFbWJlZGRlZCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAgICdsaW50ZXItanNoaW50OmRlYnVnJzogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxvYWREZXBzKCk7XG4gICAgICAgICAgY29uc3QgZGVidWdTdHJpbmcgPSBhd2FpdCBoZWxwZXJzLmdlbmVyYXRlRGVidWdTdHJpbmcoKTtcbiAgICAgICAgICBjb25zdCBub3RpZmljYXRpb25PcHRpb25zID0geyBkZXRhaWw6IGRlYnVnU3RyaW5nLCBkaXNtaXNzYWJsZTogdHJ1ZSB9O1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdsaW50ZXItanNoaW50OjogRGVidWdnaW5nIGluZm9ybWF0aW9uJywgbm90aWZpY2F0aW9uT3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdKU0hpbnQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogdGhpcy5zY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZURpciA9IFBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBsb2FkRGVwcygpO1xuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gWyctLXJlcG9ydGVyJywgUmVwb3J0ZXIsICctLWZpbGVuYW1lJywgZmlsZVBhdGhdO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSBhd2FpdCBhdG9tbGludGVyLmZpbmRDYWNoZWRBc3luYyhmaWxlRGlyLCB0aGlzLmpzaGludEZpbGVOYW1lKTtcblxuICAgICAgICBpZiAoY29uZmlnRmlsZSkge1xuICAgICAgICAgIGlmICh0aGlzLmpzaGludEZpbGVOYW1lICE9PSAnLmpzaGludHJjJykge1xuICAgICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWNvbmZpZycsIGNvbmZpZ0ZpbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRpc2FibGVXaGVuTm9Kc2hpbnRyY0ZpbGVJblBhdGggJiYgIShhd2FpdCBoZWxwZXJzLmhhc0hvbWVDb25maWcoKSkpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEpTSGludCBjb21wbGV0ZWx5IGlnbm9yZXMgLmpzaGludGlnbm9yZSBmaWxlcyBmb3IgU1RESU4gb24gaXQncyBvd25cbiAgICAgICAgLy8gc28gd2UgbXVzdCByZS1pbXBsZW1lbnQgdGhlIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgY29uc3QgaWdub3JlRmlsZSA9IGF3YWl0IGF0b21saW50ZXIuZmluZENhY2hlZEFzeW5jKGZpbGVEaXIsIHRoaXMuanNoaW50aWdub3JlRmlsZW5hbWUpO1xuICAgICAgICBpZiAoaWdub3JlRmlsZSkge1xuICAgICAgICAgIGNvbnN0IGlzSWdub3JlZCA9IGF3YWl0IGhlbHBlcnMuaXNJZ25vcmVkKGZpbGVQYXRoLCBpZ25vcmVGaWxlKTtcbiAgICAgICAgICBpZiAoaXNJZ25vcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGludElubGluZUphdmFTY3JpcHQgJiZcbiAgICAgICAgICB0ZXh0RWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUuaW5kZXhPZigndGV4dC5odG1sJykgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1leHRyYWN0JywgJ2Fsd2F5cycpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpO1xuXG4gICAgICAgIGNvbnN0IGV4ZWNPcHRzID0ge1xuICAgICAgICAgIHN0ZGluOiBmaWxlQ29udGVudHMsXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgICAgY3dkOiBmaWxlRGlyLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBhdG9tbGludGVyLmV4ZWNOb2RlKHRoaXMuZXhlY3V0YWJsZVBhdGgsIHBhcmFtZXRlcnMsIGV4ZWNPcHRzKTtcblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVDb250ZW50cykge1xuICAgICAgICAgIC8vIEZpbGUgaGFzIGNoYW5nZWQgc2luY2UgdGhlIGxpbnQgd2FzIHRyaWdnZXJlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXItSlNIaW50XScsIF8sIHJlc3VsdCk7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgICAnW0xpbnRlci1KU0hpbnRdJyxcbiAgICAgICAgICAgIHsgZGV0YWlsOiAnSlNIaW50IHJldHVybiBhbiBpbnZhbGlkIHJlc3BvbnNlLCBjaGVjayB5b3VyIGNvbnNvbGUgZm9yIG1vcmUgaW5mbycgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXMocGFyc2VkLnJlc3VsdCkuZm9yRWFjaCgoZW50cnlJRCkgPT4ge1xuICAgICAgICAgIGxldCBtZXNzYWdlO1xuICAgICAgICAgIGNvbnN0IGVudHJ5ID0gcGFyc2VkLnJlc3VsdFtlbnRyeUlEXTtcblxuICAgICAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGVudHJ5O1xuICAgICAgICAgIGNvbnN0IGVycm9yVHlwZSA9IGVycm9yLmNvZGUuc3Vic3RyKDAsIDEpO1xuICAgICAgICAgIGxldCBzZXZlcml0eSA9ICdpbmZvJztcbiAgICAgICAgICBpZiAoZXJyb3JUeXBlID09PSAnRScpIHtcbiAgICAgICAgICAgIHNldmVyaXR5ID0gJ2Vycm9yJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yVHlwZSA9PT0gJ1cnKSB7XG4gICAgICAgICAgICBzZXZlcml0eSA9ICd3YXJuaW5nJztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbGluZSA9IGVycm9yLmxpbmUgPiAwID8gZXJyb3IubGluZSAtIDEgOiAwO1xuICAgICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IGVycm9yLmNoYXJhY3RlciA+IDAgPyBlcnJvci5jaGFyYWN0ZXIgLSAxIDogMDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBhdG9tbGludGVyLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSwgY2hhcmFjdGVyKTtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgIHNldmVyaXR5LFxuICAgICAgICAgICAgICBleGNlcnB0OiBgJHtlcnJvci5jb2RlfSAtICR7ZXJyb3IucmVhc29ufWAsXG4gICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBoZWxwZXJzLmdlbmVyYXRlSW52YWxpZFRyYWNlKGxpbmUsIGNoYXJhY3RlciwgZmlsZVBhdGgsIHRleHRFZGl0b3IsIGVycm9yKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRzLnB1c2gobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgaW52YWxpZCB0cmFjZXMgaGF2ZSByZXNvbHZlZFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0cyk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19