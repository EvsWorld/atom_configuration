Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

// Dependencies
'use babel';var fs = undefined;
var path = undefined;
var helpers = undefined;

// Internal Variables
var bundledCsslintPath = undefined;

var loadDeps = function loadDeps() {
  if (!fs) {
    fs = require('fs-plus');
  }
  if (!path) {
    path = require('path');
  }
  if (!helpers) {
    helpers = require('atom-linter');
  }
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterCsslintDeps = function installLinterCsslintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-csslint');
      }
      loadDeps();

      // FIXME: Remove this after a few versions
      if (atom.config.get('linter-csslint.disableTimeout')) {
        atom.config.unset('linter-csslint.disableTimeout');
      }
    };
    depsCallbackID = window.requestIdleCallback(installLinterCsslintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-csslint.executablePath', function (value) {
      _this.executablePath = value;
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
      name: 'CSSLint',
      grammarScopes: ['source.css', 'source.html'],
      scope: 'file',
      lintsOnChange: false,
      lint: _asyncToGenerator(function* (textEditor) {
        loadDeps();
        var filePath = textEditor.getPath();
        var text = textEditor.getText();
        if (!filePath || text.length === 0) {
          // Empty or unsaved file
          return [];
        }

        var parameters = ['--format=json', filePath];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var cwd = projectPath;
        if (!cwd) {
          cwd = path.dirname(filePath);
        }

        var execOptions = {
          cwd: cwd,
          uniqueKey: 'linter-csslint::' + filePath,
          timeout: 1000 * 30, // 30 seconds
          ignoreExitCode: true
        };

        var execPath = _this2.determineExecPath(_this2.executablePath, projectPath);

        var output = yield helpers.exec(execPath, parameters, execOptions);

        if (textEditor.getText() !== text) {
          // The editor contents have changed, tell Linter not to update
          return null;
        }

        var toReturn = [];

        if (output.length < 1) {
          // No output, no errors
          return toReturn;
        }

        var lintResult = undefined;
        try {
          lintResult = JSON.parse(output);
        } catch (e) {
          var excerpt = 'Invalid response received from CSSLint, check ' + 'your console for more details.';
          return [{
            severity: 'error',
            excerpt: excerpt,
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, 0)
            }
          }];
        }

        if (lintResult.messages.length < 1) {
          // Output, but no errors found
          return toReturn;
        }

        lintResult.messages.forEach(function (data) {
          var line = undefined;
          var col = undefined;
          if (!(data.line && data.col)) {
            line = 0;

            // Use the file start if a location wasn't defined
            col = 0;
          } else {
            line = data.line - 1;
            col = data.col - 1;
          }

          var severity = data.type === 'error' ? 'error' : 'warning';

          var msg = {
            severity: severity,
            excerpt: data.message,
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, line, col)
            }
          };
          if (data.rule.id && data.rule.desc) {
            msg.details = data.rule.desc + ' (' + data.rule.id + ')';
          }
          if (data.rule.url) {
            msg.url = data.rule.url;
          }

          toReturn.push(msg);
        });

        return toReturn;
      })
    };
  },

  determineExecPath: function determineExecPath(givenPath, projectPath) {
    var execPath = givenPath;
    if (execPath === '') {
      // Use the bundled copy of CSSLint
      var relativeBinPath = path.join('node_modules', '.bin', 'csslint');
      if (process.platform === 'win32') {
        relativeBinPath += '.cmd';
      }
      if (!bundledCsslintPath) {
        var packagePath = atom.packages.resolvePackagePath('linter-csslint');
        bundledCsslintPath = path.join(packagePath, relativeBinPath);
      }
      execPath = bundledCsslintPath;
      if (projectPath) {
        var localCssLintPath = path.join(projectPath, relativeBinPath);
        if (fs.existsSync(localCssLintPath)) {
          execPath = localCssLintPath;
        }
      }
    } else {
      // Normalize any usage of ~
      fs.normalize(execPath);
    }
    return execPath;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWNzc2xpbnQvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBR29DLE1BQU07OztBQUgxQyxXQUFXLENBQUMsQUFNWixJQUFJLEVBQUUsWUFBQSxDQUFDO0FBQ1AsSUFBSSxJQUFJLFlBQUEsQ0FBQztBQUNULElBQUksT0FBTyxZQUFBLENBQUM7OztBQUdaLElBQUksa0JBQWtCLFlBQUEsQ0FBQzs7QUFFdkIsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsTUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNQLE1BQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDekI7QUFDRCxNQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsUUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN4QjtBQUNELE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixXQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ2xDO0NBQ0YsQ0FBQzs7cUJBRWE7QUFDYixVQUFRLEVBQUEsb0JBQUc7OztBQUNULFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMvQixRQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLFFBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLEdBQVM7QUFDckMsWUFBSyxhQUFhLFVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RCLGVBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO09BQ3hEO0FBQ0QsY0FBUSxFQUFFLENBQUM7OztBQUdYLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsRUFBRTtBQUNwRCxZQUFJLENBQUMs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LGdCQUFnQixDQUFDO1NBQzdCO09BQ0Y7S0FDRixNQUFNOztBQUVMLFFBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDeEI7QUFDRCxXQUFPLFFBQVEsQ0FBQztHQUNqQjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWNzc2xpbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuLy8gRGVwZW5kZW5jaWVzXG5sZXQgZnM7XG5sZXQgcGF0aDtcbmxldCBoZWxwZXJzO1xuXG4vLyBJbnRlcm5hbCBWYXJpYWJsZXNcbmxldCBidW5kbGVkQ3NzbGludFBhdGg7XG5cbmNvbnN0IGxvYWREZXBzID0gKCkgPT4ge1xuICBpZiAoIWZzKSB7XG4gICAgZnMgPSByZXF1aXJlKCdmcy1wbHVzJyk7XG4gIH1cbiAgaWYgKCFwYXRoKSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgfVxuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGRlcHNDYWxsYmFja0lEO1xuICAgIGNvbnN0IGluc3RhbGxMaW50ZXJDc3NsaW50RGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUoZGVwc0NhbGxiYWNrSUQpO1xuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1jc3NsaW50Jyk7XG4gICAgICB9XG4gICAgICBsb2FkRGVwcygpO1xuXG4gICAgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgYWZ0ZXIgYSBmZXcgdmVyc2lvbnNcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1jc3NsaW50LmRpc2FibGVUaW1lb3V0JykpIHtcbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2xpbnRlci1jc3NsaW50LmRpc2FibGVUaW1lb3V0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkZXBzQ2FsbGJhY2tJRCA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGluc3RhbGxMaW50ZXJDc3NsaW50RGVwcyk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItY3NzbGludC5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdDU1NMaW50JyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmNzcycsICdzb3VyY2UuaHRtbCddLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IGZhbHNlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgbG9hZERlcHMoKTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBpZiAoIWZpbGVQYXRoIHx8IHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gRW1wdHkgb3IgdW5zYXZlZCBmaWxlXG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFtcbiAgICAgICAgICAnLS1mb3JtYXQ9anNvbicsXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdO1xuICAgICAgICBsZXQgY3dkID0gcHJvamVjdFBhdGg7XG4gICAgICAgIGlmICghY3dkKSB7XG4gICAgICAgICAgY3dkID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4ZWNPcHRpb25zID0ge1xuICAgICAgICAgIGN3ZCxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItY3NzbGludDo6JHtmaWxlUGF0aH1gLFxuICAgICAgICAgIHRpbWVvdXQ6IDEwMDAgKiAzMCwgLy8gMzAgc2Vjb25kc1xuICAgICAgICAgIGlnbm9yZUV4aXRDb2RlOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGV4ZWNQYXRoID0gdGhpcy5kZXRlcm1pbmVFeGVjUGF0aCh0aGlzLmV4ZWN1dGFibGVQYXRoLCBwcm9qZWN0UGF0aCk7XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWNQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSB0ZXh0KSB7XG4gICAgICAgICAgLy8gVGhlIGVkaXRvciBjb250ZW50cyBoYXZlIGNoYW5nZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRvUmV0dXJuID0gW107XG5cbiAgICAgICAgaWYgKG91dHB1dC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgLy8gTm8gb3V0cHV0LCBubyBlcnJvcnNcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGludFJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsaW50UmVzdWx0ID0gSlNPTi5wYXJzZShvdXRwdXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc3QgZXhjZXJwdCA9ICdJbnZhbGlkIHJlc3BvbnNlIHJlY2VpdmVkIGZyb20gQ1NTTGludCwgY2hlY2sgJyArXG4gICAgICAgICAgICAneW91ciBjb25zb2xlIGZvciBtb3JlIGRldGFpbHMuJztcbiAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgICAgZXhjZXJwdCxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogaGVscGVycy5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIDApLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW50UmVzdWx0Lm1lc3NhZ2VzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyBPdXRwdXQsIGJ1dCBubyBlcnJvcnMgZm91bmRcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsaW50UmVzdWx0Lm1lc3NhZ2VzLmZvckVhY2goKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgbGluZTtcbiAgICAgICAgICBsZXQgY29sO1xuICAgICAgICAgIGlmICghKGRhdGEubGluZSAmJiBkYXRhLmNvbCkpIHtcbiAgICAgICAgICAgIC8vIFVzZSB0aGUgZmlsZSBzdGFydCBpZiBhIGxvY2F0aW9uIHdhc24ndCBkZWZpbmVkXG4gICAgICAgICAgICBbbGluZSwgY29sXSA9IFswLCAwXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgW2xpbmUsIGNvbF0gPSBbZGF0YS5saW5lIC0gMSwgZGF0YS5jb2wgLSAxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzZXZlcml0eSA9IGRhdGEudHlwZSA9PT0gJ2Vycm9yJyA/ICdlcnJvcicgOiAnd2FybmluZyc7XG5cbiAgICAgICAgICBjb25zdCBtc2cgPSB7XG4gICAgICAgICAgICBzZXZlcml0eSxcbiAgICAgICAgICAgIGV4Y2VycHQ6IGRhdGEubWVzc2FnZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogaGVscGVycy5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIGxpbmUsIGNvbCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGRhdGEucnVsZS5pZCAmJiBkYXRhLnJ1bGUuZGVzYykge1xuICAgICAgICAgICAgbXNnLmRldGFpbHMgPSBgJHtkYXRhLnJ1bGUuZGVzY30gKCR7ZGF0YS5ydWxlLmlkfSlgO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZGF0YS5ydWxlLnVybCkge1xuICAgICAgICAgICAgbXNnLnVybCA9IGRhdGEucnVsZS51cmw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdG9SZXR1cm4ucHVzaChtc2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG5cbiAgZGV0ZXJtaW5lRXhlY1BhdGgoZ2l2ZW5QYXRoLCBwcm9qZWN0UGF0aCkge1xuICAgIGxldCBleGVjUGF0aCA9IGdpdmVuUGF0aDtcbiAgICBpZiAoZXhlY1BhdGggPT09ICcnKSB7XG4gICAgICAvLyBVc2UgdGhlIGJ1bmRsZWQgY29weSBvZiBDU1NMaW50XG4gICAgICBsZXQgcmVsYXRpdmVCaW5QYXRoID0gcGF0aC5qb2luKCdub2RlX21vZHVsZXMnLCAnLmJpbicsICdjc3NsaW50Jyk7XG4gICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICByZWxhdGl2ZUJpblBhdGggKz0gJy5jbWQnO1xuICAgICAgfVxuICAgICAgaWYgKCFidW5kbGVkQ3NzbGludFBhdGgpIHtcbiAgICAgICAgY29uc3QgcGFja2FnZVBhdGggPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnbGludGVyLWNzc2xpbnQnKTtcbiAgICAgICAgYnVuZGxlZENzc2xpbnRQYXRoID0gcGF0aC5qb2luKHBhY2thZ2VQYXRoLCByZWxhdGl2ZUJpblBhdGgpO1xuICAgICAgfVxuICAgICAgZXhlY1BhdGggPSBidW5kbGVkQ3NzbGludFBhdGg7XG4gICAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgY29uc3QgbG9jYWxDc3NMaW50UGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgcmVsYXRpdmVCaW5QYXRoKTtcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobG9jYWxDc3NMaW50UGF0aCkpIHtcbiAgICAgICAgICBleGVjUGF0aCA9IGxvY2FsQ3NzTGludFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm9ybWFsaXplIGFueSB1c2FnZSBvZiB+XG4gICAgICBmcy5ub3JtYWxpemUoZXhlY1BhdGgpO1xuICAgIH1cbiAgICByZXR1cm4gZXhlY1BhdGg7XG4gIH0sXG59O1xuIl19