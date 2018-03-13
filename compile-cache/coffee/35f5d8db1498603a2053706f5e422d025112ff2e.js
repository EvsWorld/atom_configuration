(function() {
  var CommandContext, Emitter, Runtime, _;

  CommandContext = require('./command-context');

  _ = require('underscore');

  Emitter = require('atom').Emitter;

  module.exports = Runtime = (function() {
    Runtime.prototype.observers = [];

    function Runtime(runner, codeContextBuilder, observers, emitter) {
      this.runner = runner;
      this.codeContextBuilder = codeContextBuilder;
      this.observers = observers != null ? observers : [];
      this.emitter = emitter != null ? emitter : new Emitter;
      this.scriptOptions = this.runner.scriptOptions;
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.observe(_this);
        };
      })(this));
    }

    Runtime.prototype.addObserver = function(observer) {
      this.observers.push(observer);
      return observer.observe(this);
    };

    Runtime.prototype.destroy = function() {
      this.stop();
      this.runner.destroy();
      _.each(this.observers, function(observer) {
        return observer.destroy();
      });
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input, options) {
      var codeContext, commandContext, executionOptions;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      if (options == null) {
        options = null;
      }
      if (atom.config.get('script.stopOnRerun')) {
        this.stop();
      }
      this.emitter.emit('start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if ((codeContext != null ? codeContext.lang : void 0) == null) {
        return;
      }
      executionOptions = options ? options : this.scriptOptions;
      commandContext = CommandContext.build(this, executionOptions, codeContext);
      if (!commandContext) {
        return;
      }
      if (commandContext.workingDirectory != null) {
        executionOptions.workingDirectory = commandContext.workingDirectory;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      this.runner.scriptOptions = executionOptions;
      this.runner.run(commandContext.command, commandContext.args, codeContext, input);
      return this.emitter.emit('started', commandContext);
    };

    Runtime.prototype.stop = function() {
      this.emitter.emit('stop');
      this.runner.stop();
      return this.emitter.emit('stopped');
    };

    Runtime.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    Runtime.prototype.onStarted = function(callback) {
      return this.emitter.on('started', callback);
    };

    Runtime.prototype.onStop = function(callback) {
      return this.emitter.on('stop', callback);
    };

    Runtime.prototype.onStopped = function(callback) {
      return this.emitter.on('stopped', callback);
    };

    Runtime.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportMode = function(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    };

    Runtime.prototype.onDidNotBuildArgs = function(callback) {
      return this.emitter.on('did-not-build-args', callback);
    };

    Runtime.prototype.onDidContextCreate = function(callback) {
      return this.emitter.on('did-context-create', callback);
    };

    Runtime.prototype.onDidWriteToStdout = function(callback) {
      return this.runner.onDidWriteToStdout(callback);
    };

    Runtime.prototype.onDidWriteToStderr = function(callback) {
      return this.runner.onDidWriteToStderr(callback);
    };

    Runtime.prototype.onDidExit = function(callback) {
      return this.runner.onDidExit(callback);
    };

    Runtime.prototype.onDidNotRun = function(callback) {
      return this.runner.onDidNotRun(callback);
    };

    Runtime.prototype.modeNotSupported = function(argType, lang) {
      return this.emitter.emit('did-not-support-mode', {
        argType: argType,
        lang: lang
      });
    };

    Runtime.prototype.didNotBuildArgs = function(error) {
      return this.emitter.emit('did-not-build-args', {
        error: error
      });
    };

    return Runtime;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bnRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUZKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNCQUFBLFNBQUEsR0FBVyxFQUFYLENBQUE7O0FBS2EsSUFBQSxpQkFBRSxNQUFGLEVBQVcsa0JBQVgsRUFBZ0MsU0FBaEMsRUFBaUQsT0FBakQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLHFCQUFBLGtCQUN0QixDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGdDQUFBLFlBQVksRUFDdkQsQ0FBQTtBQUFBLE1BRDJELElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUN0RSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQXpCLENBQUE7QUFBQSxNQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLEVBQWQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQURBLENBRFc7SUFBQSxDQUxiOztBQUFBLHNCQWVBLFdBQUEsR0FBYSxT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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/runtime.coffee
