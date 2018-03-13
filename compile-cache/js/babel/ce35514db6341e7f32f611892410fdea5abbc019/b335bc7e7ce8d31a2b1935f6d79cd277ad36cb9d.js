Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _commandContext = require('./command-context');

var _commandContext2 = _interopRequireDefault(_commandContext);

'use babel';

var Runtime = (function () {
  // Public: Initializes a new {Runtime} instance
  //
  // This class is responsible for properly configuring {Runner}

  function Runtime(runner, codeContextBuilder) {
    var _this = this;

    var observers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, Runtime);

    this.runner = runner;
    this.codeContextBuilder = codeContextBuilder;
    this.observers = observers;
    this.emitter = new _atom.Emitter();
    this.scriptOptions = this.runner.scriptOptions;
    _underscore2['default'].each(this.observers, function (observer) {
      return observer.observe(_this);
    });
  }

  // Public: Adds a new observer and asks it to listen for {Runner} events
  //
  // An observer should have two methods:
  // * `observe(runtime)` - in which you can subscribe to {Runtime} events
  // (see {ViewRuntimeObserver} for what you are expected to handle)
  // * `destroy` - where you can do your cleanup

  _createClass(Runtime, [{
    key: 'addObserver',
    value: function addObserver(observer) {
      this.observers.push(observer);
      observer.observe(this);
    }

    // Public: disposes dependencies
    //
    // This should be called when you no longer need to use this class
  }, {
    key: 'destroy',
    value: function destroy() {
      this.stop();
      this.runner.destroy();
      _underscore2['default'].each(this.observers, function (observer) {
        return observer.destroy();
      });
      this.emitter.dispose();
      this.codeContextBuilder.destroy();
    }

    // Public: Executes code
    //
    // argType (Optional) - {String} One of the three:
    // * "Selection Based" (default)
    // * "Line Number Based"
    // * "File Based"
    // input (Optional) - {String} that'll be provided to the `stdin` of the new process
  }, {
    key: 'execute',
    value: function execute() {
      var argType = arguments.length <= 0 || arguments[0] === undefined ? 'Selection Based' : arguments[0];
      var input = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      if (atom.config.get('script.stopOnRerun')) this.stop();
      this.emitter.emit('start');

      var codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);

      // In the future we could handle a runner without the language being part
      // of the grammar map, using the options runner
      if (!codeContext || !codeContext.lang) return;

      var executionOptions = !options ? this.scriptOptions : options;
      var commandContext = _commandContext2['default'].build(this, executionOptions, codeContext);

      if (!commandContext) return;

      if (commandContext.workingDirectory) {
        executionOptions.workingDirectory = commandContext.workingDirectory;
      }

      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });

      this.runner.scriptOptions = executionOptions;
      this.runner.run(commandContext.command, commandContext.args, codeContext, input);
      this.emitter.emit('started', commandContext);
    }

    // Public: stops execution of the current fork
  }, {
    key: 'stop',
    value: function stop() {
      this.emitter.emit('stop');
      this.runner.stop();
      this.emitter.emit('stopped');
    }

    // Public: Dispatched when the execution is starting
  }, {
    key: 'onStart',
    value: function onStart(callback) {
      return this.emitter.on('start', callback);
    }

    // Public: Dispatched when the execution is started
  }, {
    key: 'onStarted',
    value: function onStarted(callback) {
      return this.emitter.on('started', callback);
    }

    // Public: Dispatched when the execution is stopping
  }, {
    key: 'onStop',
    value: function onStop(callback) {
      return this.emitter.on('stop', callback);
    }

    // Public: Dispatched when the execution is stopped
  }, {
    key: 'onStopped',
    value: function onStopped(callback) {
      return this.emitter.on('stopped', callback);
    }

    // Public: Dispatched when the language is not specified
  }, {
    key: 'onDidNotSpecifyLanguage',
    value: function onDidNotSpecifyLanguage(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    }

    // Public: Dispatched when the language is not supported
    // lang  - {String} with the language name
  }, {
    key: 'onDidNotSupportLanguage',
    value: function onDidNotSupportLanguage(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    }

    // Public: Dispatched when the mode is not supported
    // lang  - {String} with the language name
    // argType  - {String} with the run mode specified
  }, {
    key: 'onDidNotSupportMode',
    value: function onDidNotSupportMode(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    }

    // Public: Dispatched when building run arguments resulted in an error
    // error - {Error}
  }, {
    key: 'onDidNotBuildArgs',
    value: function onDidNotBuildArgs(callback) {
      return this.emitter.on('did-not-build-args', callback);
    }

    // Public: Dispatched when the {CodeContext} is successfully created
    // lang  - {String} with the language name
    // filename  - {String} with the filename
    // lineNumber  - {Number} with the line number (may be null)
  }, {
    key: 'onDidContextCreate',
    value: function onDidContextCreate(callback) {
      return this.emitter.on('did-context-create', callback);
    }

    // Public: Dispatched when the process you run writes something to stdout
    // message - {String} with the output
  }, {
    key: 'onDidWriteToStdout',
    value: function onDidWriteToStdout(callback) {
      return this.runner.onDidWriteToStdout(callback);
    }

    // Public: Dispatched when the process you run writes something to stderr
    // message - {String} with the output
  }, {
    key: 'onDidWriteToStderr',
    value: function onDidWriteToStderr(callback) {
      return this.runner.onDidWriteToStderr(callback);
    }

    // Public: Dispatched when the process you run exits
    // returnCode  - {Number} with the process' exit code
    // executionTime  - {Number} with the process' exit code
  }, {
    key: 'onDidExit',
    value: function onDidExit(callback) {
      return this.runner.onDidExit(callback);
    }

    // Public: Dispatched when the code you run did not manage to run
    // command - {String} with the run command
  }, {
    key: 'onDidNotRun',
    value: function onDidNotRun(callback) {
      return this.runner.onDidNotRun(callback);
    }
  }, {
    key: 'modeNotSupported',
    value: function modeNotSupported(argType, lang) {
      this.emitter.emit('did-not-support-mode', { argType: argType, lang: lang });
    }
  }, {
    key: 'didNotBuildArgs',
    value: function didNotBuildArgs(error) {
      this.emitter.emit('did-not-build-args', { error: error });
    }
  }]);

  return Runtime;
})();

exports['default'] = Runtime;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXdCLE1BQU07OzBCQUVoQixZQUFZOzs7OzhCQUVDLG1CQUFtQjs7OztBQU45QyxXQUFXLENBQUM7O0lBUVMsT0FBTzs7Ozs7QUFJZixXQUpRLE9BQU8sQ0FJZCxNQUFNLEVBQUUsa0JBQWtCLEVBQWtCOzs7UUFBaEIsU0FBUyx5REFBRyxFQUFFOzswQkFKbkMsT0FBTzs7QUFLeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO0FBQzdDLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBQy9DLDRCQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQUEsUUFBUTthQUFJLFFBQVEsQ0FBQyxPQUFPLE9BQU07S0FBQSxDQUFDLENBQUM7R0FDNUQ7Ozs7Ozs7OztlQVhrQixPQUFPOztXQW1CZixxQkFBQyxRQUFRLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsY0FBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0Qiw4QkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFBLFFBQVE7ZUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFDO0FBQ3ZE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QUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDcEQ7OztTQW5La0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRW1pdHRlciB9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuaW1wb3J0IENvbW1hbmRDb250ZXh0IGZyb20gJy4vY29tbWFuZC1jb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVudGltZSB7XG4gIC8vIFB1YmxpYzogSW5pdGlhbGl6ZXMgYSBuZXcge1J1bnRpbWV9IGluc3RhbmNlXG4gIC8vXG4gIC8vIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIHByb3Blcmx5IGNvbmZpZ3VyaW5nIHtSdW5uZXJ9XG4gIGNvbnN0cnVjdG9yKHJ1bm5lciwgY29kZUNvbnRleHRCdWlsZGVyLCBvYnNlcnZlcnMgPSBbXSkge1xuICAgIHRoaXMucnVubmVyID0gcnVubmVyO1xuICAgIHRoaXMuY29kZUNvbnRleHRCdWlsZGVyID0gY29kZUNvbnRleHRCdWlsZGVyO1xuICAgIHRoaXMub2JzZXJ2ZXJzID0gb2JzZXJ2ZXJzO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zY3JpcHRPcHRpb25zID0gdGhpcy5ydW5uZXIuc2NyaXB0T3B0aW9ucztcbiAgICBfLmVhY2godGhpcy5vYnNlcnZlcnMsIG9ic2VydmVyID0+IG9ic2VydmVyLm9ic2VydmUodGhpcykpO1xuICB9XG5cbiAgLy8gUHVibGljOiBBZGRzIGEgbmV3IG9ic2VydmVyIGFuZCBhc2tzIGl0IHRvIGxpc3RlbiBmb3Ige1J1bm5lcn0gZXZlbnRzXG4gIC8vXG4gIC8vIEFuIG9ic2VydmVyIHNob3VsZCBoYXZlIHR3byBtZXRob2RzOlxuICAvLyAqIGBvYnNlcnZlKHJ1bnRpbWUpYCAtIGluIHdoaWNoIHlvdSBjYW4gc3Vic2NyaWJlIHRvIHtSdW50aW1lfSBldmVudHNcbiAgLy8gKHNlZSB7Vmlld1J1bnRpbWVPYnNlcnZlcn0gZm9yIHdoYXQgeW91IGFyZSBleHBlY3RlZCB0byBoYW5kbGUpXG4gIC8vICogYGRlc3Ryb3lgIC0gd2hlcmUgeW91IGNhbiBkbyB5b3VyIGNsZWFudXBcbiAgYWRkT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICB0aGlzLm9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMpO1xuICB9XG5cbiAgLy8gUHVibGljOiBkaXNwb3NlcyBkZXBlbmRlbmNpZXNcbiAgLy9cbiAgLy8gVGhpcyBzaG91bGQgYmUgY2FsbGVkIHdoZW4geW91IG5vIGxvbmdlciBuZWVkIHRvIHVzZSB0aGlzIGNsYXNzXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5ydW5uZXIuZGVzdHJveSgpO1xuICAgIF8uZWFjaCh0aGlzLm9ic2VydmVycywgb2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIuZGVzdHJveSgpKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuY29kZUNvbnRleHRCdWlsZGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogRXhlY3V0ZXMgY29kZVxuICAvL1xuICAvLyBhcmdUeXBlIChPcHRpb25hbCkgLSB7U3RyaW5nfSBPbmUgb2YgdGhlIHRocmVlOlxuICAvLyAqIFwiU2VsZWN0aW9uIEJhc2VkXCIgKGRlZmF1bHQpXG4gIC8vICogXCJMaW5lIE51bWJlciBCYXNlZFwiXG4gIC8vICogXCJGaWxlIEJhc2VkXCJcbiAgLy8gaW5wdXQgKE9wdGlvbmFsKSAtIHtTdHJpbmd9IHRoYXQnbGwgYmUgcHJvdmlkZWQgdG8gdGhlIGBzdGRpbmAgb2YgdGhlIG5ldyBwcm9jZXNzXG4gIGV4ZWN1dGUoYXJnVHlwZSA9ICdTZWxlY3Rpb24gQmFzZWQnLCBpbnB1dCA9IG51bGwsIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnc2NyaXB0LnN0b3BPblJlcnVuJykpIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzdGFydCcpO1xuXG4gICAgY29uc3QgY29kZUNvbnRleHQgPSB0aGlzLmNvZGVDb250ZXh0QnVpbGRlci5idWlsZENvZGVDb250ZXh0KFxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLCBhcmdUeXBlKTtcblxuICAgIC8vIEluIHRoZSBmdXR1cmUgd2UgY291bGQgaGFuZGxlIGEgcnVubmVyIHdpdGhvdXQgdGhlIGxhbmd1YWdlIGJlaW5nIHBhcnRcbiAgICAvLyBvZiB0aGUgZ3JhbW1hciBtYXAsIHVzaW5nIHRoZSBvcHRpb25zIHJ1bm5lclxuICAgIGlmICghY29kZUNvbnRleHQgfHwgIWNvZGVDb250ZXh0LmxhbmcpIHJldHVybjtcblxuICAgIGNvbnN0IGV4ZWN1dGlvbk9wdGlvbnMgPSAhb3B0aW9ucyA/IHRoaXMuc2NyaXB0T3B0aW9ucyA6IG9wdGlvbnM7XG4gICAgY29uc3QgY29tbWFuZENvbnRleHQgPSBDb21tYW5kQ29udGV4dC5idWlsZCh0aGlzLCBleGVjdXRpb25PcHRpb25zLCBjb2RlQ29udGV4dCk7XG5cbiAgICBpZiAoIWNvbW1hbmRDb250ZXh0KSByZXR1cm47XG5cbiAgICBpZiAoY29tbWFuZENvbnRleHQud29ya2luZ0RpcmVjdG9yeSkge1xuICAgICAgZXhlY3V0aW9uT3B0aW9ucy53b3JraW5nRGlyZWN0b3J5ID0gY29tbWFuZENvbnRleHQud29ya2luZ0RpcmVjdG9yeTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNvbnRleHQtY3JlYXRlJywge1xuICAgICAgbGFuZzogY29kZUNvbnRleHQubGFuZyxcbiAgICAgIGZpbGVuYW1lOiBjb2RlQ29udGV4dC5maWxlbmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IGNvZGVDb250ZXh0LmxpbmVOdW1iZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bm5lci5zY3JpcHRPcHRpb25zID0gZXhlY3V0aW9uT3B0aW9ucztcbiAgICB0aGlzLnJ1bm5lci5ydW4oY29tbWFuZENvbnRleHQuY29tbWFuZCwgY29tbWFuZENvbnRleHQuYXJncywgY29kZUNvbnRleHQsIGlucHV0KTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc3RhcnRlZCcsIGNvbW1hbmRDb250ZXh0KTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogc3RvcHMgZXhlY3V0aW9uIG9mIHRoZSBjdXJyZW50IGZvcmtcbiAgc3RvcCgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc3RvcCcpO1xuICAgIHRoaXMucnVubmVyLnN0b3AoKTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc3RvcHBlZCcpO1xuICB9XG5cbiAgLy8gUHVibGljOiBEaXNwYXRjaGVkIHdoZW4gdGhlIGV4ZWN1dGlvbiBpcyBzdGFydGluZ1xuICBvblN0YXJ0KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc3RhcnQnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBQdWJsaWM6IERpc3BhdGNoZWQgd2hlbiB0aGUgZXhlY3V0aW9uIGlzIHN0YXJ0ZWRcbiAgb25TdGFydGVkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc3RhcnRlZCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogRGlzcGF0Y2hlZCB3aGVuIHRoZSBleGVjdXRpb24gaXMgc3RvcHBpbmdcbiAgb25TdG9wKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc3RvcCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogRGlzcGF0Y2hlZCB3aGVuIHRoZSBleGVjdXRpb24gaXMgc3RvcHBlZFxuICBvblN0b3BwZWQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzdG9wcGVkJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUHVibGljOiBEaXNwYXRjaGVkIHdoZW4gdGhlIGxhbmd1YWdlIGlzIG5vdCBzcGVjaWZpZWRcbiAgb25EaWROb3RTcGVjaWZ5TGFuZ3VhZ2UoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5jb2RlQ29udGV4dEJ1aWxkZXIub25EaWROb3RTcGVjaWZ5TGFuZ3VhZ2UoY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUHVibGljOiBEaXNwYXRjaGVkIHdoZW4gdGhlIGxhbmd1YWdlIGlzIG5vdCBzdXBwb3J0ZWRcbiAgLy8gbGFuZyAgLSB7U3RyaW5nfSB3aXRoIHRoZSBsYW5ndWFnZSBuYW1lXG4gIG9uRGlkTm90U3VwcG9ydExhbmd1YWdlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZUNvbnRleHRCdWlsZGVyLm9uRGlkTm90U3VwcG9ydExhbmd1YWdlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogRGlzcGF0Y2hlZCB3aGVuIHRoZSBtb2RlIGlzIG5vdCBzdXBwb3J0ZWRcbiAgLy8gbGFuZyAgLSB7U3RyaW5nfSB3aXRoIHRoZSBsYW5ndWFnZSBuYW1lXG4gIC8vIGFyZ1R5cGUgIC0ge1N0cmluZ30gd2l0aCB0aGUgcnVuIG1vZGUgc3BlY2lmaWVkXG4gIG9uRGlkTm90U3VwcG9ydE1vZGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbm90LXN1cHBvcnQtbW9kZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIFB1YmxpYzogRGlzcGF0Y2hlZCB3aGVuIGJ1aWxkaW5nIHJ1biBhcmd1bWVudHMgcmVzdWx0ZWQgaW4gYW4gZXJyb3JcbiAgLy8gZXJyb3IgLSB7RXJyb3J9XG4gIG9uRGlkTm90QnVpbGRBcmdzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW5vdC1idWlsZC1hcmdzJywgY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUHVibGljOiBEaXNwYXRjaGVkIHdoZW4gdGhlIHtDb2RlQ29udGV4dH0gaXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWRcbiAgLy8gbGFuZyAgLSB7U3RyaW5nfSB3aXRoIHRoZSBsYW5ndWFnZSBuYW1lXG4gIC8vIGZpbGVuYW1lICAtIHtTdHJpbmd9IHdpdGggdGhlIGZpbGVuYW1lXG4gIC8vIGxpbmVOdW1iZXIgIC0ge051bWJlcn0gd2l0aCB0aGUgbGluZSBudW1iZXIgKG1heSBiZSBudWxsKVxuICBvbkRpZENvbnRleHRDcmVhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY29udGV4dC1jcmVhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvLyBQdWJsaWM6IERpc3BhdGNoZWQgd2hlbiB0aGUgcHJvY2VzcyB5b3UgcnVuIHdyaXRlcyBzb21ldGhpbmcgdG8gc3Rkb3V0XG4gIC8vIG1lc3NhZ2UgLSB7U3RyaW5nfSB3aXRoIHRoZSBvdXRwdXRcbiAgb25EaWRXcml0ZVRvU3Rkb3V0KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucnVubmVyLm9uRGlkV3JpdGVUb1N0ZG91dChjYWxsYmFjayk7XG4gIH1cblxuICAvLyBQdWJsaWM6IERpc3BhdGNoZWQgd2hlbiB0aGUgcHJvY2VzcyB5b3UgcnVuIHdyaXRlcyBzb21ldGhpbmcgdG8gc3RkZXJyXG4gIC8vIG1lc3NhZ2UgLSB7U3RyaW5nfSB3aXRoIHRoZSBvdXRwdXRcbiAgb25EaWRXcml0ZVRvU3RkZXJyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucnVubmVyLm9uRGlkV3JpdGVUb1N0ZGVycihjYWxsYmFjayk7XG4gIH1cblxuICAvLyBQdWJsaWM6IERpc3BhdGNoZWQgd2hlbiB0aGUgcHJvY2VzcyB5b3UgcnVuIGV4aXRzXG4gIC8vIHJldHVybkNvZGUgIC0ge051bWJlcn0gd2l0aCB0aGUgcHJvY2VzcycgZXhpdCBjb2RlXG4gIC8vIGV4ZWN1dGlvblRpbWUgIC0ge051bWJlcn0gd2l0aCB0aGUgcHJvY2VzcycgZXhpdCBjb2RlXG4gIG9uRGlkRXhpdChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnJ1bm5lci5vbkRpZEV4aXQoY2FsbGJhY2spO1xuICB9XG5cbiAgLy8gUHVibGljOiBEaXNwYXRjaGVkIHdoZW4gdGhlIGNvZGUgeW91IHJ1biBkaWQgbm90IG1hbmFnZSB0byBydW5cbiAgLy8gY29tbWFuZCAtIHtTdHJpbmd9IHdpdGggdGhlIHJ1biBjb21tYW5kXG4gIG9uRGlkTm90UnVuKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucnVubmVyLm9uRGlkTm90UnVuKGNhbGxiYWNrKTtcbiAgfVxuXG4gIG1vZGVOb3RTdXBwb3J0ZWQoYXJnVHlwZSwgbGFuZykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbm90LXN1cHBvcnQtbW9kZScsIHsgYXJnVHlwZSwgbGFuZyB9KTtcbiAgfVxuXG4gIGRpZE5vdEJ1aWxkQXJncyhlcnJvcikge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbm90LWJ1aWxkLWFyZ3MnLCB7IGVycm9yIH0pO1xuICB9XG59XG4iXX0=