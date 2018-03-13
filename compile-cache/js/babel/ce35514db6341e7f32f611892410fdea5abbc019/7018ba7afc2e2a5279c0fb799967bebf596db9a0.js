Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Runner = (function () {

  // Public: Creates a Runner instance
  //
  // * `scriptOptions` a {ScriptOptions} object instance
  // * `emitter` Atom's {Emitter} instance. You probably don't need to overwrite it

  function Runner(scriptOptions) {
    _classCallCheck(this, Runner);

    this.bufferedProcess = null;
    this.stdoutFunc = this.stdoutFunc.bind(this);
    this.stderrFunc = this.stderrFunc.bind(this);
    this.onExit = this.onExit.bind(this);
    this.createOnErrorFunc = this.createOnErrorFunc.bind(this);
    this.scriptOptions = scriptOptions;
    this.emitter = new _atom.Emitter();
  }

  _createClass(Runner, [{
    key: 'run',
    value: function run(command, extraArgs, codeContext) {
      var inputString = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      this.startTime = new Date();

      var args = this.args(codeContext, extraArgs);
      var options = this.options();
      var stdout = this.stdoutFunc;
      var stderr = this.stderrFunc;
      var exit = this.onExit;

      this.bufferedProcess = new _atom.BufferedProcess({
        command: command, args: args, options: options, stdout: stdout, stderr: stderr, exit: exit
      });

      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }

      this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    }
  }, {
    key: 'stdoutFunc',
    value: function stdoutFunc(output) {
      this.emitter.emit('did-write-to-stdout', { message: output });
    }
  }, {
    key: 'onDidWriteToStdout',
    value: function onDidWriteToStdout(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    }
  }, {
    key: 'stderrFunc',
    value: function stderrFunc(output) {
      this.emitter.emit('did-write-to-stderr', { message: output });
    }
  }, {
    key: 'onDidWriteToStderr',
    value: function onDidWriteToStderr(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }
  }, {
    key: 'getCwd',
    value: function getCwd() {
      var cwd = this.scriptOptions.workingDirectory;

      if (!cwd) {
        switch (atom.config.get('script.cwdBehavior')) {
          case 'First project directory':
            {
              var paths = atom.project.getPaths();
              if (paths && paths.length > 0) {
                try {
                  cwd = _fs2['default'].statSync(paths[0]).isDirectory() ? paths[0] : _path2['default'].join(paths[0], '..');
                } catch (error) {/* Don't throw */}
              }
              break;
            }
          case 'Project directory of the script':
            {
              cwd = this.getProjectPath();
              break;
            }
          case 'Directory of the script':
            {
              var pane = atom.workspace.getActivePaneItem();
              cwd = pane && pane.buffer && pane.buffer.file && pane.buffer.file.getParent && pane.buffer.file.getParent() && pane.buffer.file.getParent().getPath && pane.buffer.file.getParent().getPath() || '';
              break;
            }
        }
      }
      return cwd;
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.bufferedProcess) {
        this.bufferedProcess.kill();
        this.bufferedProcess = null;
      }
    }
  }, {
    key: 'onExit',
    value: function onExit(returnCode) {
      this.bufferedProcess = null;
      var executionTime = undefined;

      if (atom.config.get('script.enableExecTime') === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }

      this.emitter.emit('did-exit', { executionTime: executionTime, returnCode: returnCode });
    }
  }, {
    key: 'onDidExit',
    value: function onDidExit(callback) {
      return this.emitter.on('did-exit', callback);
    }
  }, {
    key: 'createOnErrorFunc',
    value: function createOnErrorFunc(command) {
      var _this = this;

      return function (nodeError) {
        _this.bufferedProcess = null;
        _this.emitter.emit('did-not-run', { command: command });
        nodeError.handle();
      };
    }
  }, {
    key: 'onDidNotRun',
    value: function onDidNotRun(callback) {
      return this.emitter.on('did-not-run', callback);
    }
  }, {
    key: 'options',
    value: function options() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    }
  }, {
    key: 'fillVarsInArg',
    value: function fillVarsInArg(arg, codeContext, projectPath) {
      if (codeContext.filepath) {
        arg = arg.replace(/{FILE_ACTIVE}/g, codeContext.filepath);
        arg = arg.replace(/{FILE_ACTIVE_PATH}/g, _path2['default'].join(codeContext.filepath, '..'));
      }
      if (codeContext.filename) {
        arg = arg.replace(/{FILE_ACTIVE_NAME}/g, codeContext.filename);
        arg = arg.replace(/{FILE_ACTIVE_NAME_BASE}/g, _path2['default'].basename(codeContext.filename, _path2['default'].extname(codeContext.filename)));
      }
      if (projectPath) {
        arg = arg.replace(/{PROJECT_PATH}/g, projectPath);
      }

      return arg;
    }
  }, {
    key: 'args',
    value: function args(codeContext, extraArgs) {
      var _this2 = this;

      var args = this.scriptOptions.cmdArgs.concat(extraArgs).concat(this.scriptOptions.scriptArgs);
      var projectPath = this.getProjectPath || '';
      args = args.map(function (arg) {
        return _this2.fillVarsInArg(arg, codeContext, projectPath);
      });

      if (!this.scriptOptions.cmd) {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      var filePath = atom.workspace.getActiveTextEditor().getPath();
      var projectPaths = atom.project.getPaths();
      for (var projectPath of projectPaths) {
        if (filePath.indexOf(projectPath) > -1) {
          if (_fs2['default'].statSync(projectPath).isDirectory()) {
            return projectPath;
          }
          return _path2['default'].join(projectPath, '..');
        }
      }
      return null;
    }
  }]);

  return Runner;
})();

exports['default'] = Runner;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ydW5uZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUMsTUFBTTs7a0JBQ2hDLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQUp2QixXQUFXLENBQUM7O0lBTVMsTUFBTTs7Ozs7OztBQU1kLFdBTlEsTUFBTSxDQU1iLGFBQWEsRUFBRTswQkFOUixNQUFNOztBQU92QixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUNuQyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7R0FDOUI7O2VBZGtCLE1BQU07O1dBZ0J0QixhQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3JELFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7QUFFNUIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDL0MsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9CLFVBQU0sTUFBTSxHQUFHLElBQUks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aUJBQU8sa0JBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyQztPQUNGO0FBQ0QsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBdktrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvcnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IEVtaXR0ZXIsIEJ1ZmZlcmVkUHJvY2VzcyB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5uZXIge1xuXG4gIC8vIFB1YmxpYzogQ3JlYXRlcyBhIFJ1bm5lciBpbnN0YW5jZVxuICAvL1xuICAvLyAqIGBzY3JpcHRPcHRpb25zYCBhIHtTY3JpcHRPcHRpb25zfSBvYmplY3QgaW5zdGFuY2VcbiAgLy8gKiBgZW1pdHRlcmAgQXRvbSdzIHtFbWl0dGVyfSBpbnN0YW5jZS4gWW91IHByb2JhYmx5IGRvbid0IG5lZWQgdG8gb3ZlcndyaXRlIGl0XG4gIGNvbnN0cnVjdG9yKHNjcmlwdE9wdGlvbnMpIHtcbiAgICB0aGlzLmJ1ZmZlcmVkUHJvY2VzcyA9IG51bGw7XG4gICAgdGhpcy5zdGRvdXRGdW5jID0gdGhpcy5zdGRvdXRGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdGRlcnJGdW5jID0gdGhpcy5zdGRlcnJGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbkV4aXQgPSB0aGlzLm9uRXhpdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlT25FcnJvckZ1bmMgPSB0aGlzLmNyZWF0ZU9uRXJyb3JGdW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY3JpcHRPcHRpb25zID0gc2NyaXB0T3B0aW9ucztcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgcnVuKGNvbW1hbmQsIGV4dHJhQXJncywgY29kZUNvbnRleHQsIGlucHV0U3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmFyZ3MoY29kZUNvbnRleHQsIGV4dHJhQXJncyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucygpO1xuICAgIGNvbnN0IHN0ZG91dCA9IHRoaXMuc3Rkb3V0RnVuYztcbiAgICBjb25zdCBzdGRlcnIgPSB0aGlzLnN0ZGVyckZ1bmM7XG4gICAgY29uc3QgZXhpdCA9IHRoaXMub25FeGl0O1xuXG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcbiAgICAgIGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0LFxuICAgIH0pO1xuXG4gICAgaWYgKGlucHV0U3RyaW5nKSB7XG4gICAgICB0aGlzLmJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLndyaXRlKGlucHV0U3RyaW5nKTtcbiAgICAgIHRoaXMuYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3Mub25XaWxsVGhyb3dFcnJvcih0aGlzLmNyZWF0ZU9uRXJyb3JGdW5jKGNvbW1hbmQpKTtcbiAgfVxuXG4gIHN0ZG91dEZ1bmMob3V0cHV0KSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC13cml0ZS10by1zdGRvdXQnLCB7IG1lc3NhZ2U6IG91dHB1dCB9KTtcbiAgfVxuXG4gIG9uRGlkV3JpdGVUb1N0ZG91dChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC13cml0ZS10by1zdGRvdXQnLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGRlcnJGdW5jKG91dHB1dCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtd3JpdGUtdG8tc3RkZXJyJywgeyBtZXNzYWdlOiBvdXRwdXQgfSk7XG4gIH1cblxuICBvbkRpZFdyaXRlVG9TdGRlcnIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtd3JpdGUtdG8tc3RkZXJyJywgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgZ2V0Q3dkKCkge1xuICAgIGxldCBjd2QgPSB0aGlzLnNjcmlwdE9wdGlvbnMud29ya2luZ0RpcmVjdG9yeTtcblxuICAgIGlmICghY3dkKSB7XG4gICAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnc2NyaXB0LmN3ZEJlaGF2aW9yJykpIHtcbiAgICAgICAgY2FzZSAnRmlyc3QgcHJvamVjdCBkaXJlY3RvcnknOiB7XG4gICAgICAgICAgY29uc3QgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICAgICAgICBpZiAocGF0aHMgJiYgcGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY3dkID0gZnMuc3RhdFN5bmMocGF0aHNbMF0pLmlzRGlyZWN0b3J5KCkgPyBwYXRoc1swXSA6IHBhdGguam9pbihwYXRoc1swXSwgJy4uJyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikgeyAvKiBEb24ndCB0aHJvdyAqLyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ1Byb2plY3QgZGlyZWN0b3J5IG9mIHRoZSBzY3JpcHQnOiB7XG4gICAgICAgICAgY3dkID0gdGhpcy5nZXRQcm9qZWN0UGF0aCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0RpcmVjdG9yeSBvZiB0aGUgc2NyaXB0Jzoge1xuICAgICAgICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgICAgICAgIGN3ZCA9IChwYW5lICYmIHBhbmUuYnVmZmVyICYmIHBhbmUuYnVmZmVyLmZpbGUgJiYgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQgJiZcbiAgICAgICAgICAgICAgICAgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQoKSAmJiBwYW5lLmJ1ZmZlci5maWxlLmdldFBhcmVudCgpLmdldFBhdGggJiZcbiAgICAgICAgICAgICAgICAgcGFuZS5idWZmZXIuZmlsZS5nZXRQYXJlbnQoKS5nZXRQYXRoKCkpIHx8ICcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjd2Q7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLmJ1ZmZlcmVkUHJvY2Vzcykge1xuICAgICAgdGhpcy5idWZmZXJlZFByb2Nlc3Mua2lsbCgpO1xuICAgICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG9uRXhpdChyZXR1cm5Db2RlKSB7XG4gICAgdGhpcy5idWZmZXJlZFByb2Nlc3MgPSBudWxsO1xuICAgIGxldCBleGVjdXRpb25UaW1lO1xuXG4gICAgaWYgKChhdG9tLmNvbmZpZy5nZXQoJ3NjcmlwdC5lbmFibGVFeGVjVGltZScpID09PSB0cnVlKSAmJiB0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgZXhlY3V0aW9uVGltZSA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuc3RhcnRUaW1lLmdldFRpbWUoKSkgLyAxMDAwO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZXhpdCcsIHsgZXhlY3V0aW9uVGltZSwgcmV0dXJuQ29kZSB9KTtcbiAgfVxuXG4gIG9uRGlkRXhpdChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1leGl0JywgY2FsbGJhY2spO1xuICB9XG5cbiAgY3JlYXRlT25FcnJvckZ1bmMoY29tbWFuZCkge1xuICAgIHJldHVybiAobm9kZUVycm9yKSA9PiB7XG4gICAgICB0aGlzLmJ1ZmZlcmVkUHJvY2VzcyA9IG51bGw7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW5vdC1ydW4nLCB7IGNvbW1hbmQgfSk7XG4gICAgICBub2RlRXJyb3IuaGFuZGxlKCk7XG4gICAgfTtcbiAgfVxuXG4gIG9uRGlkTm90UnVuKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW5vdC1ydW4nLCBjYWxsYmFjayk7XG4gIH1cblxuICBvcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjd2Q6IHRoaXMuZ2V0Q3dkKCksXG4gICAgICBlbnY6IHRoaXMuc2NyaXB0T3B0aW9ucy5tZXJnZWRFbnYocHJvY2Vzcy5lbnYpLFxuICAgIH07XG4gIH1cblxuICBmaWxsVmFyc0luQXJnKGFyZywgY29kZUNvbnRleHQsIHByb2plY3RQYXRoKSB7XG4gICAgaWYgKGNvZGVDb250ZXh0LmZpbGVwYXRoKSB7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve0ZJTEVfQUNUSVZFfS9nLCBjb2RlQ29udGV4dC5maWxlcGF0aCk7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve0ZJTEVfQUNUSVZFX1BBVEh9L2csIHBhdGguam9pbihjb2RlQ29udGV4dC5maWxlcGF0aCwgJy4uJykpO1xuICAgIH1cbiAgICBpZiAoY29kZUNvbnRleHQuZmlsZW5hbWUpIHtcbiAgICAgIGFyZyA9IGFyZy5yZXBsYWNlKC97RklMRV9BQ1RJVkVfTkFNRX0vZywgY29kZUNvbnRleHQuZmlsZW5hbWUpO1xuICAgICAgYXJnID0gYXJnLnJlcGxhY2UoL3tGSUxFX0FDVElWRV9OQU1FX0JBU0V9L2csIHBhdGguYmFzZW5hbWUoY29kZUNvbnRleHQuZmlsZW5hbWUsIHBhdGguZXh0bmFtZShjb2RlQ29udGV4dC5maWxlbmFtZSkpKTtcbiAgICB9XG4gICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICBhcmcgPSBhcmcucmVwbGFjZSgve1BST0pFQ1RfUEFUSH0vZywgcHJvamVjdFBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmc7XG4gIH1cblxuICBhcmdzKGNvZGVDb250ZXh0LCBleHRyYUFyZ3MpIHtcbiAgICBsZXQgYXJncyA9ICh0aGlzLnNjcmlwdE9wdGlvbnMuY21kQXJncy5jb25jYXQoZXh0cmFBcmdzKSkuY29uY2F0KHRoaXMuc2NyaXB0T3B0aW9ucy5zY3JpcHRBcmdzKTtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHRoaXMuZ2V0UHJvamVjdFBhdGggfHwgJyc7XG4gICAgYXJncyA9IChhcmdzLm1hcChhcmcgPT4gdGhpcy5maWxsVmFyc0luQXJnKGFyZywgY29kZUNvbnRleHQsIHByb2plY3RQYXRoKSkpO1xuXG4gICAgaWYgKCF0aGlzLnNjcmlwdE9wdGlvbnMuY21kKSB7XG4gICAgICBhcmdzID0gY29kZUNvbnRleHQuc2hlYmFuZ0NvbW1hbmRBcmdzKCkuY29uY2F0KGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gYXJncztcbiAgfVxuXG4gIGdldFByb2plY3RQYXRoKCkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKTtcbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3RQYXRoIG9mIHByb2plY3RQYXRocykge1xuICAgICAgaWYgKGZpbGVQYXRoLmluZGV4T2YocHJvamVjdFBhdGgpID4gLTEpIHtcbiAgICAgICAgaWYgKGZzLnN0YXRTeW5jKHByb2plY3RQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3RQYXRoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4ocHJvamVjdFBhdGgsICcuLicpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19