Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _grammars = require('./grammars');

var _grammars2 = _interopRequireDefault(_grammars);

'use babel';

var CommandContext = (function () {
  function CommandContext() {
    _classCallCheck(this, CommandContext);

    this.command = null;
    this.workingDirectory = null;
    this.args = [];
    this.options = {};
  }

  _createClass(CommandContext, [{
    key: 'quoteArguments',
    value: function quoteArguments(args) {
      return args.map(function (arg) {
        return arg.trim().indexOf(' ') === -1 ? arg.trim() : '\'' + arg + '\'';
      });
    }
  }, {
    key: 'getRepresentation',
    value: function getRepresentation() {
      if (!this.command || !this.args.length) return '';

      // command arguments
      var commandArgs = this.options.cmdArgs ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';

      // script arguments
      var args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      var scriptArgs = this.options.scriptArgs ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';

      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    }
  }], [{
    key: 'build',
    value: function build(runtime, runOptions, codeContext) {
      var commandContext = new CommandContext();
      commandContext.options = runOptions;
      var buildArgsArray = undefined;

      try {
        if (!runOptions.cmd) {
          // Precondition: lang? and lang of grammarMap
          commandContext.command = codeContext.shebangCommand() || _grammars2['default'][codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }

        buildArgsArray = _grammars2['default'][codeContext.lang][codeContext.argType].args;
      } catch (error) {
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }

      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (errorSendByArgs) {
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }

      if (!runOptions.workingDirectory) {
        // Precondition: lang? and lang of grammarMap
        commandContext.workingDirectory = _grammars2['default'][codeContext.lang][codeContext.argType].workingDirectory || '';
      } else {
        commandContext.workingDirectory = runOptions.workingDirectory;
      }

      // Return setup information
      return commandContext;
    }
  }]);

  return CommandContext;
})();

exports['default'] = CommandContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb21tYW5kLWNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt3QkFFdUIsWUFBWTs7OztBQUZuQyxXQUFXLENBQUM7O0lBSVMsY0FBYztBQUN0QixXQURRLGNBQWMsR0FDbkI7MEJBREssY0FBYzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM3QixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COztlQU5rQixjQUFjOztXQThDbkIsd0JBQUMsSUFBSSxFQUFFO0FBQ25CLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7ZUFBSyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsVUFBTyxHQUFHLE9BQUc7T0FBQyxDQUFDLENBQUM7S0FDcEY7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDOzs7QUFHbEQsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7OztBQUdwRyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlFLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUV6RyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQ3ZCLFdBQVcsU0FBTyxXQUFXLEdBQUssRUFBRSxDQUFBLEFBQUMsSUFDckMsSUFBSSxTQUFPLElBQUksR0FBSyxFQUFFLENBQUEsQUFBQyxJQUN2QixVQUFVLFNBQU8sVUFBVSxHQUFLLEVBQUUsQ0FBQSxBQUFDLENBQUM7S0FDeEM7OztXQXhEVyxlQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO0FBQzdDLFVBQU0sY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7QUFDNUMsb0JBQWMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBQ3BDLFVBQUksY0FBYyxZQUFBLENBQUM7O0FBRW5CLFVBQUk7QUFDRixZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTs7QUFFbkIsd0JBQWMsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLGNBQWMsRUFBRSxJQUNuRCxzQkFBVyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUM3RCxNQUFNO0FBQ0wsd0JBQWMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztTQUN6Qzs7QUFFRCxzQkFBYyxHQUFHLHNCQUFXLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO09BQ3pFLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxlQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFJO0FBQ0Ysc0JBQWMsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ25ELENBQUMsT0FBTyxlQUFlLEVBQUU7QUFDeEIsZUFBTyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QyxlQUFPLEtBQUssQ0FBQztPQUNkOztBQUVELFVBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7O0FBRWhDLHNCQUFjLENBQUMsZ0JBQWdCLEdBQUcsc0JBQVcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7T0FDNUcsTUFBTTtBQUNMLHNCQUFjLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO09BQy9EOzs7QUFHRCxhQUFPLGNBQWMsQ0FBQztLQUN2Qjs7O1NBNUNrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29tbWFuZC1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBncmFtbWFyTWFwIGZyb20gJy4vZ3JhbW1hcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29tbWFuZCA9IG51bGw7XG4gICAgdGhpcy53b3JraW5nRGlyZWN0b3J5ID0gbnVsbDtcbiAgICB0aGlzLmFyZ3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBidWlsZChydW50aW1lLCBydW5PcHRpb25zLCBjb2RlQ29udGV4dCkge1xuICAgIGNvbnN0IGNvbW1hbmRDb250ZXh0ID0gbmV3IENvbW1hbmRDb250ZXh0KCk7XG4gICAgY29tbWFuZENvbnRleHQub3B0aW9ucyA9IHJ1bk9wdGlvbnM7XG4gICAgbGV0IGJ1aWxkQXJnc0FycmF5O1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghcnVuT3B0aW9ucy5jbWQpIHtcbiAgICAgICAgLy8gUHJlY29uZGl0aW9uOiBsYW5nPyBhbmQgbGFuZyBvZiBncmFtbWFyTWFwXG4gICAgICAgIGNvbW1hbmRDb250ZXh0LmNvbW1hbmQgPSBjb2RlQ29udGV4dC5zaGViYW5nQ29tbWFuZCgpIHx8XG4gICAgICAgICAgZ3JhbW1hck1hcFtjb2RlQ29udGV4dC5sYW5nXVtjb2RlQ29udGV4dC5hcmdUeXBlXS5jb21tYW5kO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tbWFuZENvbnRleHQuY29tbWFuZCA9IHJ1bk9wdGlvbnMuY21kO1xuICAgICAgfVxuXG4gICAgICBidWlsZEFyZ3NBcnJheSA9IGdyYW1tYXJNYXBbY29kZUNvbnRleHQubGFuZ11bY29kZUNvbnRleHQuYXJnVHlwZV0uYXJncztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcnVudGltZS5tb2RlTm90U3VwcG9ydGVkKGNvZGVDb250ZXh0LmFyZ1R5cGUsIGNvZGVDb250ZXh0LmxhbmcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb21tYW5kQ29udGV4dC5hcmdzID0gYnVpbGRBcmdzQXJyYXkoY29kZUNvbnRleHQpO1xuICAgIH0gY2F0Y2ggKGVycm9yU2VuZEJ5QXJncykge1xuICAgICAgcnVudGltZS5kaWROb3RCdWlsZEFyZ3MoZXJyb3JTZW5kQnlBcmdzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXJ1bk9wdGlvbnMud29ya2luZ0RpcmVjdG9yeSkge1xuICAgICAgLy8gUHJlY29uZGl0aW9uOiBsYW5nPyBhbmQgbGFuZyBvZiBncmFtbWFyTWFwXG4gICAgICBjb21tYW5kQ29udGV4dC53b3JraW5nRGlyZWN0b3J5ID0gZ3JhbW1hck1hcFtjb2RlQ29udGV4dC5sYW5nXVtjb2RlQ29udGV4dC5hcmdUeXBlXS53b3JraW5nRGlyZWN0b3J5IHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21tYW5kQ29udGV4dC53b3JraW5nRGlyZWN0b3J5ID0gcnVuT3B0aW9ucy53b3JraW5nRGlyZWN0b3J5O1xuICAgIH1cblxuICAgIC8vIFJldHVybiBzZXR1cCBpbmZvcm1hdGlvblxuICAgIHJldHVybiBjb21tYW5kQ29udGV4dDtcbiAgfVxuXG4gIHF1b3RlQXJndW1lbnRzKGFyZ3MpIHtcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IChhcmcudHJpbSgpLmluZGV4T2YoJyAnKSA9PT0gLTEgPyBhcmcudHJpbSgpIDogYCcke2FyZ30nYCkpO1xuICB9XG5cbiAgZ2V0UmVwcmVzZW50YXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLmNvbW1hbmQgfHwgIXRoaXMuYXJncy5sZW5ndGgpIHJldHVybiAnJztcblxuICAgIC8vIGNvbW1hbmQgYXJndW1lbnRzXG4gICAgY29uc3QgY29tbWFuZEFyZ3MgPSB0aGlzLm9wdGlvbnMuY21kQXJncyA/IHRoaXMucXVvdGVBcmd1bWVudHModGhpcy5vcHRpb25zLmNtZEFyZ3MpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgLy8gc2NyaXB0IGFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmFyZ3MubGVuZ3RoID8gdGhpcy5xdW90ZUFyZ3VtZW50cyh0aGlzLmFyZ3MpLmpvaW4oJyAnKSA6ICcnO1xuICAgIGNvbnN0IHNjcmlwdEFyZ3MgPSB0aGlzLm9wdGlvbnMuc2NyaXB0QXJncyA/IHRoaXMucXVvdGVBcmd1bWVudHModGhpcy5vcHRpb25zLnNjcmlwdEFyZ3MpLmpvaW4oJyAnKSA6ICcnO1xuXG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZC50cmltKCkgK1xuICAgICAgKGNvbW1hbmRBcmdzID8gYCAke2NvbW1hbmRBcmdzfWAgOiAnJykgK1xuICAgICAgKGFyZ3MgPyBgICR7YXJnc31gIDogJycpICtcbiAgICAgIChzY3JpcHRBcmdzID8gYCAke3NjcmlwdEFyZ3N9YCA6ICcnKTtcbiAgfVxufVxuIl19