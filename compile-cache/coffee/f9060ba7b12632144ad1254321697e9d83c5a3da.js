(function() {
  var BufferedProcess, Emitter, Runner, fs, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, BufferedProcess = _ref.BufferedProcess;

  fs = require('fs');

  path = require('path');

  module.exports = Runner = (function() {
    Runner.prototype.bufferedProcess = null;

    function Runner(scriptOptions, emitter) {
      this.scriptOptions = scriptOptions;
      this.emitter = emitter != null ? emitter : new Emitter;
      this.createOnErrorFunc = __bind(this.createOnErrorFunc, this);
      this.onExit = __bind(this.onExit, this);
      this.stderrFunc = __bind(this.stderrFunc, this);
      this.stdoutFunc = __bind(this.stdoutFunc, this);
    }

    Runner.prototype.run = function(command, extraArgs, codeContext, inputString) {
      var args, exit, options, stderr, stdout;
      if (inputString == null) {
        inputString = null;
      }
      this.startTime = new Date();
      args = this.args(codeContext, extraArgs);
      options = this.options();
      stdout = this.stdoutFunc;
      stderr = this.stderrFunc;
      exit = this.onExit;
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }
      return this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    };

    Runner.prototype.stdoutFunc = function(output) {
      return this.emitter.emit('did-write-to-stdout', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStdout = function(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    };

    Runner.prototype.stderrFunc = function(output) {
      return this.emitter.emit('did-write-to-stderr', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStderr = function(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    };

    Runner.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Runner.prototype.getCwd = function() {
      var cwd, paths, workingDirectoryProvided;
      cwd = this.scriptOptions.workingDirectory;
      workingDirectoryProvided = (cwd != null) && cwd !== '';
      paths = atom.project.getPaths();
      if (!workingDirectoryProvided && (paths != null ? paths.length : void 0) > 0) {
        try {
          cwd = fs.statSync(paths[0]).isDirectory() ? paths[0] : path.join(paths[0], '..');
        } catch (_error) {}
      }
      return cwd;
    };

    Runner.prototype.stop = function() {
      if (this.bufferedProcess != null) {
        this.bufferedProcess.kill();
        return this.bufferedProcess = null;
      }
    };

    Runner.prototype.onExit = function(returnCode) {
      var executionTime;
      this.bufferedProcess = null;
      if ((atom.config.get('script.enableExecTime')) === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }
      return this.emitter.emit('did-exit', {
        executionTime: executionTime,
        returnCode: returnCode
      });
    };

    Runner.prototype.onDidExit = function(callback) {
      return this.emitter.on('did-exit', callback);
    };

    Runner.prototype.createOnErrorFunc = function(command) {
      return (function(_this) {
        return function(nodeError) {
          _this.bufferedProcess = null;
          _this.emitter.emit('did-not-run', {
            command: command
          });
          return nodeError.handle();
        };
      })(this);
    };

    Runner.prototype.onDidNotRun = function(callback) {
      return this.emitter.on('did-not-run', callback);
    };

    Runner.prototype.options = function() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    };

    Runner.prototype.fillVarsInArg = function(arg, codeContext, project_path) {
      if (codeContext.filepath != null) {
        arg = arg.replace(/{FILE_ACTIVE}/g, codeContext.filepath);
        arg = arg.replace(/{FILE_ACTIVE_PATH}/g, path.join(codeContext.filepath, '..'));
      }
      if (codeContext.filename != null) {
        arg = arg.replace(/{FILE_ACTIVE_NAME}/g, codeContext.filename);
        arg = arg.replace(/{FILE_ACTIVE_NAME_BASE}/g, path.join(codeContext.filename, '..'));
      }
      if (project_path != null) {
        arg = arg.replace(/{PROJECT_PATH}/g, project_path);
      }
      return arg;
    };

    Runner.prototype.args = function(codeContext, extraArgs) {
      var arg, args, paths, project_path;
      args = (this.scriptOptions.cmdArgs.concat(extraArgs)).concat(this.scriptOptions.scriptArgs);
      project_path = '';
      paths = atom.project.getPaths();
      if (paths.length > 0) {
        fs.stat(paths[0], function(err, stats) {
          if (!err) {
            return project_path = stats.isDirectory() ? paths[0] : path.join(paths[0], '..');
          }
        });
      }
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(this.fillVarsInArg(arg, codeContext, project_path));
        }
        return _results;
      }).call(this);
      if ((this.scriptOptions.cmd == null) || this.scriptOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    };

    return Runner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0RBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQTZCLE9BQUEsQ0FBUSxNQUFSLENBQTdCLEVBQUMsZUFBQSxPQUFELEVBQVUsdUJBQUEsZUFBVixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oscUJBQUEsZUFBQSxHQUFpQixJQUFqQixDQUFBOztBQU1hLElBQUEsZ0JBQUUsYUFBRixFQUFrQixPQUFsQixHQUFBO0FBQTBDLE1BQXpDLElBQUMsQ0FBQSxnQkFBQSxhQUF3QyxDQUFBO0FBQUEsTUFBekIsSUFBQyxDQUFBLDRCQUFBLFVBQVUsR0FBQSxDQUFBLE9BQWMsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQTFDO0lBQUEsQ0FOYjs7QUFBQSxxQkFRQSxHQUFBLEdBQUssU0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixXQUFyQixFQUFrQyxXQUFsQyxHQUFBO0FBQ0gsVUFBQSxtQ0FBQTs7UUFEcUMsY0FBYztPQUNuRDtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxJQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BRUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixFQUFtQixTQUFuQixDQUZQLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBRCxD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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/runner.coffee
