(function() {
  var CommandContext, grammarMap;

  grammarMap = require('./grammars');

  module.exports = CommandContext = (function() {
    function CommandContext() {}

    CommandContext.prototype.command = null;

    CommandContext.prototype.workingDirectory = null;

    CommandContext.prototype.args = [];

    CommandContext.prototype.options = {};

    CommandContext.build = function(runtime, runOptions, codeContext) {
      var buildArgsArray, commandContext, error, errorSendByArgs;
      commandContext = new CommandContext;
      commandContext.options = runOptions;
      try {
        if ((runOptions.cmd == null) || runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }
      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (_error) {
        errorSendByArgs = _error;
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }
      if ((runOptions.workingDirectory == null) || runOptions.workingDirectory === '') {
        commandContext.workingDirectory = grammarMap[codeContext.lang][codeContext.argType].workingDirectory || '';
      } else {
        commandContext.workingDirectory = runOptions.workingDirectory;
      }
      return commandContext;
    };

    CommandContext.prototype.quoteArguments = function(args) {
      var arg, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(arg.trim().indexOf(' ') === -1 ? arg.trim() : "'" + arg + "'");
      }
      return _results;
    };

    CommandContext.prototype.getRepresentation = function() {
      var args, commandArgs, scriptArgs;
      if (!this.command || !this.args.length) {
        return '';
      }
      commandArgs = this.options.cmdArgs != null ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';
      args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      scriptArgs = this.options.scriptArgs != null ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';
      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    };

    return CommandContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvbW1hbmQtY29udGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSjs7QUFBQSw2QkFBQSxPQUFBLEdBQVMsSUFBVCxDQUFBOztBQUFBLDZCQUNBLGdCQUFBLEdBQWtCLElBRGxCLENBQUE7O0FBQUEsNkJBRUEsSUFBQSxHQUFNLEVBRk4sQ0FBQTs7QUFBQSw2QkFHQSxPQUFBLEdBQVMsRUFIVCxDQUFBOztBQUFBLElBS0EsY0FBQyxDQUFBLEtBQUQsR0FBUSxTQUFDLE9BQUQsRUFBVSxVQUFWLEVBQXNCLFdBQXRCLEdBQUE7QUFDTixVQUFBLHNEQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxjQUFqQixDQUFBO0FBQUEsTUFDQSxjQUFjLENBQUMsT0FBZixHQUF5QixVQUR6QixDQUFBO0FBR0E7QUFDRSxRQUFBLElBQU8sd0JBQUosSUFBdUIsVUFBVSxDQUFDLEdBQVgsS0FBa0IsRUFBNUM7QUFFRSxVQUFBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBQSxJQUFnQyxVQUFXLENBQUEsV0FBVyxDQUFDLElBQVosQ0FBa0IsQ0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLE9BQTNHLENBRkY7U0FBQSxNQUFBO0FBSUUsVUFBQSxjQUFjLENBQUMsT0FBZixHQUF5QixVQUFVLENBQUMsR0FBcEMsQ0FKRjtTQUFBO0FBQUEsUUFNQSxjQUFBLEdBQWlCLFVBQVcsQ0FBQSxXQUFXLENBQUMsSUFBWixDQUFrQixDQUFBLFdB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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/command-context.coffee
