Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

var path = _interopRequireWildcard(_path);

// Dependencies
'use babel';var helpers = undefined;

// Internal Variables
var packagePath = undefined;

var loadDeps = function loadDeps() {
  if (!helpers) {
    helpers = require('atom-linter');
  }
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterBootlintDeps = function installLinterBootlintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-bootlint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterBootlintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-bootlint.executablePath', function (executablePath) {
      _this.command = executablePath;
      if (!_this.command) {
        // Default to the bundled version if the user hasn't overridden it.
        if (!packagePath) {
          packagePath = atom.packages.resolvePackagePath('linter-bootlint');
        }
        _this.command = path.join(packagePath, 'node_modules', '.bin', 'bootlint');
      }
    }), atom.config.observe('linter-bootlint.flags', function (flags) {
      _this.flags = flags;
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
      name: 'Bootlint',
      grammarScopes: ['text.html.basic', 'text.html.twig'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        if (!filePath) {
          // Linter gave us a TextEditor with no path
          return null;
        }

        loadDeps();

        var fileDir = path.dirname(filePath);
        var text = textEditor.getText();

        if (!text) {
          return [];
        }

        var args = [];
        if (_this2.flags.length) {
          args.push('-d', _this2.flags.join(','));
        }

        var execOpts = {
          stdin: text,
          cwd: fileDir,
          ignoreExitCode: true,
          timeout: 1000 * 60, // 60 seconds hard limit
          uniqueKey: 'linter-bootlint::' + filePath
        };

        var output = yield helpers.exec(_this2.command, args, execOpts);

        var regex = /<stdin>:(?:(\d+):(\d+))?\s(.+)/g;
        var messages = [];
        var match = regex.exec(output);
        while (match !== null) {
          messages.push({
            severity: 'error',
            excerpt: match[3],
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, match[1] - 1, match[2])
            }
          });
          match = regex.exec(output);
        }
        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWJvb3RsaW50L2xpYi9pbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUNwQixNQUFNOztJQUFoQixJQUFJOzs7QUFKaEIsV0FBVyxDQUFDLEFBT1osSUFBSSxPQUFPLFlBQUEsQ0FBQzs7O0FBR1osSUFBSSxXQUFXLFlBQUEsQ0FBQzs7QUFFaEIsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDbEM7Q0FDRixDQUFDOztxQkFFYTtBQUNiLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFFBQUksY0FBYyxZQUFBLENBQUM7QUFDbkIsUUFBTSx5QkFBeUIsR0FBRyxTQUE1Qix5QkFBeUIsR0FBUztBQUN0QyxZQUFLLGFBQWEsVUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsZUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7T0FDekQ7QUFDRCxjQUFRLEVBQUUsQ0FBQztLQUNaLENBQUM7QUFDRixrQkFBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZFLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV2QyxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQUUsVUFBQyxj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SyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BFO1dBQ0YsQ0FBQyxDQUFDO0FBQ0gsZUFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXItYm9vdGxpbnQvbGliL2luaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIERlcGVuZGVuY2llc1xubGV0IGhlbHBlcnM7XG5cbi8vIEludGVybmFsIFZhcmlhYmxlc1xubGV0IHBhY2thZ2VQYXRoO1xuXG5jb25zdCBsb2FkRGVwcyA9ICgpID0+IHtcbiAgaWYgKCFoZWxwZXJzKSB7XG4gICAgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuICAgIGxldCBkZXBzQ2FsbGJhY2tJRDtcbiAgICBjb25zdCBpbnN0YWxsTGludGVyQm9vdGxpbnREZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWJvb3RsaW50Jyk7XG4gICAgICB9XG4gICAgICBsb2FkRGVwcygpO1xuICAgIH07XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyQm9vdGxpbnREZXBzKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKGRlcHNDYWxsYmFja0lEKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWJvb3RsaW50LmV4ZWN1dGFibGVQYXRoJywgKGV4ZWN1dGFibGVQYXRoKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbWFuZCA9IGV4ZWN1dGFibGVQYXRoO1xuICAgICAgICBpZiAoIXRoaXMuY29tbWFuZCkge1xuICAgICAgICAgIC8vIERlZmF1bHQgdG8gdGhlIGJ1bmRsZWQgdmVyc2lvbiBpZiB0aGUgdXNlciBoYXNuJ3Qgb3ZlcnJpZGRlbiBpdC5cbiAgICAgICAgICBpZiAoIXBhY2thZ2VQYXRoKSB7XG4gICAgICAgICAgICBwYWNrYWdlUGF0aCA9IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdsaW50ZXItYm9vdGxpbnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jb21tYW5kID0gcGF0aC5qb2luKHBhY2thZ2VQYXRoLCAnbm9kZV9tb2R1bGVzJywgJy5iaW4nLCAnYm9vdGxpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItYm9vdGxpbnQuZmxhZ3MnLCAoZmxhZ3MpID0+IHtcbiAgICAgICAgdGhpcy5mbGFncyA9IGZsYWdzO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnQm9vdGxpbnQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWyd0ZXh0Lmh0bWwuYmFzaWMnLCAndGV4dC5odG1sLnR3aWcnXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgICAgIC8vIExpbnRlciBnYXZlIHVzIGEgVGV4dEVkaXRvciB3aXRoIG5vIHBhdGhcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWREZXBzKCk7XG5cbiAgICAgICAgY29uc3QgZmlsZURpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcmdzID0gW107XG4gICAgICAgIGlmICh0aGlzLmZsYWdzLmxlbmd0aCkge1xuICAgICAgICAgIGFyZ3MucHVzaCgnLWQnLCB0aGlzLmZsYWdzLmpvaW4oJywnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBleGVjT3B0cyA9IHtcbiAgICAgICAgICBzdGRpbjogdGV4dCxcbiAgICAgICAgICBjd2Q6IGZpbGVEaXIsXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgICAgdGltZW91dDogMTAwMCAqIDYwLCAvLyA2MCBzZWNvbmRzIGhhcmQgbGltaXRcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItYm9vdGxpbnQ6OiR7ZmlsZVBhdGh9YCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBoZWxwZXJzLmV4ZWModGhpcy5jb21tYW5kLCBhcmdzLCBleGVjT3B0cyk7XG5cbiAgICAgICAgY29uc3QgcmVnZXggPSAvPHN0ZGluPjooPzooXFxkKyk6KFxcZCspKT9cXHMoLispL2c7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgIGV4Y2VycHQ6IG1hdGNoWzNdLFxuICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbWF0Y2hbMV0gLSAxLCBtYXRjaFsyXSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=