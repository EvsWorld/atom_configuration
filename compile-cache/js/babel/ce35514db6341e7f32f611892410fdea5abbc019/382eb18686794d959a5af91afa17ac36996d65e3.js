'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CodeContext = (function () {
  // Public: Initializes a new {CodeContext} object for the given file/line
  //
  // @filename   - The {String} filename of the file to execute.
  // @filepath   - The {String} path of the file to execute.
  // @textSource - The {String} text to under "Selection Based". (default: null)
  //
  // Returns a newly created {CodeContext} object.

  function CodeContext(filename, filepath) {
    var textSource = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, CodeContext);

    this.lineNumber = null;
    this.shebang = null;
    this.filename = filename;
    this.filepath = filepath;
    this.textSource = textSource;
  }

  // Public: Creates a {String} representation of the file and line number
  //
  // fullPath - Whether to expand the file path. (default: true)
  //
  // Returns the "file colon line" {String}.

  _createClass(CodeContext, [{
    key: 'fileColonLine',
    value: function fileColonLine() {
      var fullPath = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var fileColonLine = undefined;
      if (fullPath) {
        fileColonLine = this.filepath;
      } else {
        fileColonLine = this.filename;
      }

      if (!this.lineNumber) {
        return fileColonLine;
      }
      return fileColonLine + ':' + this.lineNumber;
    }

    // Public: Retrieves the text from whatever source was given on initialization
    //
    // prependNewlines - Whether to prepend @lineNumber newlines (default: true)
    //
    // Returns the code selection {String}
  }, {
    key: 'getCode',
    value: function getCode() {
      var prependNewlines = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var code = this.textSource ? this.textSource.getText() : null;
      if (!prependNewlines || !this.lineNumber) return code;

      var newlineCount = Number(this.lineNumber);
      var newlines = Array(newlineCount).join('\n');
      return '' + newlines + code;
    }

    // Public: Retrieves the command name from @shebang
    //
    // Returns the {String} name of the command or {undefined} if not applicable.
  }, {
    key: 'shebangCommand',
    value: function shebangCommand() {
      var sections = this.shebangSections();
      if (!sections) return null;

      return sections[0];
    }

    // Public: Retrieves the command arguments (such as flags or arguments to
    // /usr/bin/env) from @shebang
    //
    // Returns the {String} name of the command or {undefined} if not applicable.
  }, {
    key: 'shebangCommandArgs',
    value: function shebangCommandArgs() {
      var sections = this.shebangSections();
      if (!sections) {
        return [];
      }

      return sections.slice(1, sections.length);
    }

    // Public: Splits the shebang string by spaces to extra the command and
    // arguments
    //
    // Returns the {String} name of the command or {undefined} if not applicable.
  }, {
    key: 'shebangSections',
    value: function shebangSections() {
      return this.shebang ? this.shebang.split(' ') : null;
    }
  }]);

  return CodeContext;
})();

exports['default'] = CodeContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb2RlLWNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsV0FBVzs7Ozs7Ozs7O0FBUW5CLFdBUlEsV0FBVyxDQVFsQixRQUFRLEVBQUUsUUFBUSxFQUFxQjtRQUFuQixVQUFVLHlEQUFHLElBQUk7OzBCQVI5QixXQUFXOztBQVM1QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztHQUM5Qjs7Ozs7Ozs7ZUFka0IsV0FBVzs7V0FxQmpCLHlCQUFrQjtVQUFqQixRQUFRLHlEQUFHLElBQUk7O0FBQzNCLFVBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsVUFBSSxRQUFRLEVBQUU7QUFDWixxQkFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7T0FDL0IsTUFBTTtBQUNMLHFCQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUMvQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGVBQU8sYUFBYSxDQUFDO09BQUU7QUFDL0MsYUFBVSxhQUFhLFNBQUksSUFBSSxDQUFDLFVBQVUsQ0FBRztLQUM5Qzs7Ozs7Ozs7O1dBT00sbUJBQXlCO1VBQXhCLGVBQWUseURBQUcsSUFBSTs7QUFDNUIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztBQUNoRSxVQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFdEQsVUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxVQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELGtCQUFVLFFBQVEsR0FBRyxJQUFJLENBQUc7S0FDN0I7Ozs7Ozs7V0FLYSwwQkFBRztBQUNmLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4QyxVQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDOztBQUUzQixhQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjs7Ozs7Ozs7V0FNaUIsOEJBQUc7QUFDbkIsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQUU3QixhQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQzs7Ozs7Ozs7V0FNYywyQkFBRztBQUNoQixhQUFPLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ3REOzs7U0ExRWtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb2RlLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29kZUNvbnRleHQge1xuICAvLyBQdWJsaWM6IEluaXRpYWxpemVzIGEgbmV3IHtDb2RlQ29udGV4dH0gb2JqZWN0IGZvciB0aGUgZ2l2ZW4gZmlsZS9saW5lXG4gIC8vXG4gIC8vIEBmaWxlbmFtZSAgIC0gVGhlIHtTdHJpbmd9IGZpbGVuYW1lIG9mIHRoZSBmaWxlIHRvIGV4ZWN1dGUuXG4gIC8vIEBmaWxlcGF0aCAgIC0gVGhlIHtTdHJpbmd9IHBhdGggb2YgdGhlIGZpbGUgdG8gZXhlY3V0ZS5cbiAgLy8gQHRleHRTb3VyY2UgLSBUaGUge1N0cmluZ30gdGV4dCB0byB1bmRlciBcIlNlbGVjdGlvbiBCYXNlZFwiLiAoZGVmYXVsdDogbnVsbClcbiAgLy9cbiAgLy8gUmV0dXJucyBhIG5ld2x5IGNyZWF0ZWQge0NvZGVDb250ZXh0fSBvYmplY3QuXG4gIGNvbnN0cnVjdG9yKGZpbGVuYW1lLCBmaWxlcGF0aCwgdGV4dFNvdXJjZSA9IG51bGwpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBudWxsO1xuICAgIHRoaXMuc2hlYmFuZyA9IG51bGw7XG4gICAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICAgIHRoaXMuZmlsZXBhdGggPSBmaWxlcGF0aDtcbiAgICB0aGlzLnRleHRTb3VyY2UgPSB0ZXh0U291cmNlO1xuICB9XG5cbiAgLy8gUHVibGljOiBDcmVhdGVzIGEge1N0cmluZ30gcmVwcmVzZW50YXRpb24gb2YgdGhlIGZpbGUgYW5kIGxpbmUgbnVtYmVyXG4gIC8vXG4gIC8vIGZ1bGxQYXRoIC0gV2hldGhlciB0byBleHBhbmQgdGhlIGZpbGUgcGF0aC4gKGRlZmF1bHQ6IHRydWUpXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIFwiZmlsZSBjb2xvbiBsaW5lXCIge1N0cmluZ30uXG4gIGZpbGVDb2xvbkxpbmUoZnVsbFBhdGggPSB0cnVlKSB7XG4gICAgbGV0IGZpbGVDb2xvbkxpbmU7XG4gICAgaWYgKGZ1bGxQYXRoKSB7XG4gICAgICBmaWxlQ29sb25MaW5lID0gdGhpcy5maWxlcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZUNvbG9uTGluZSA9IHRoaXMuZmlsZW5hbWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpbmVOdW1iZXIpIHsgcmV0dXJuIGZpbGVDb2xvbkxpbmU7IH1cbiAgICByZXR1cm4gYCR7ZmlsZUNvbG9uTGluZX06JHt0aGlzLmxpbmVOdW1iZXJ9YDtcbiAgfVxuXG4gIC8vIFB1YmxpYzogUmV0cmlldmVzIHRoZSB0ZXh0IGZyb20gd2hhdGV2ZXIgc291cmNlIHdhcyBnaXZlbiBvbiBpbml0aWFsaXphdGlvblxuICAvL1xuICAvLyBwcmVwZW5kTmV3bGluZXMgLSBXaGV0aGVyIHRvIHByZXBlbmQgQGxpbmVOdW1iZXIgbmV3bGluZXMgKGRlZmF1bHQ6IHRydWUpXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIGNvZGUgc2VsZWN0aW9uIHtTdHJpbmd9XG4gIGdldENvZGUocHJlcGVuZE5ld2xpbmVzID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLnRleHRTb3VyY2UgPyB0aGlzLnRleHRTb3VyY2UuZ2V0VGV4dCgpIDogbnVsbDtcbiAgICBpZiAoIXByZXBlbmROZXdsaW5lcyB8fCAhdGhpcy5saW5lTnVtYmVyKSByZXR1cm4gY29kZTtcblxuICAgIGNvbnN0IG5ld2xpbmVDb3VudCA9IE51bWJlcih0aGlzLmxpbmVOdW1iZXIpO1xuICAgIGNvbnN0IG5ld2xpbmVzID0gQXJyYXkobmV3bGluZUNvdW50KS5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gYCR7bmV3bGluZXN9JHtjb2RlfWA7XG4gIH1cblxuICAvLyBQdWJsaWM6IFJldHJpZXZlcyB0aGUgY29tbWFuZCBuYW1lIGZyb20gQHNoZWJhbmdcbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUge1N0cmluZ30gbmFtZSBvZiB0aGUgY29tbWFuZCBvciB7dW5kZWZpbmVkfSBpZiBub3QgYXBwbGljYWJsZS5cbiAgc2hlYmFuZ0NvbW1hbmQoKSB7XG4gICAgY29uc3Qgc2VjdGlvbnMgPSB0aGlzLnNoZWJhbmdTZWN0aW9ucygpO1xuICAgIGlmICghc2VjdGlvbnMpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIHNlY3Rpb25zWzBdO1xuICB9XG5cbiAgLy8gUHVibGljOiBSZXRyaWV2ZXMgdGhlIGNvbW1hbmQgYXJndW1lbnRzIChzdWNoIGFzIGZsYWdzIG9yIGFyZ3VtZW50cyB0b1xuICAvLyAvdXNyL2Jpbi9lbnYpIGZyb20gQHNoZWJhbmdcbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUge1N0cmluZ30gbmFtZSBvZiB0aGUgY29tbWFuZCBvciB7dW5kZWZpbmVkfSBpZiBub3QgYXBwbGljYWJsZS5cbiAgc2hlYmFuZ0NvbW1hbmRBcmdzKCkge1xuICAgIGNvbnN0IHNlY3Rpb25zID0gdGhpcy5zaGViYW5nU2VjdGlvbnMoKTtcbiAgICBpZiAoIXNlY3Rpb25zKSB7IHJldHVybiBbXTsgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb25zLnNsaWNlKDEsIHNlY3Rpb25zLmxlbmd0aCk7XG4gIH1cblxuICAvLyBQdWJsaWM6IFNwbGl0cyB0aGUgc2hlYmFuZyBzdHJpbmcgYnkgc3BhY2VzIHRvIGV4dHJhIHRoZSBjb21tYW5kIGFuZFxuICAvLyBhcmd1bWVudHNcbiAgLy9cbiAgLy8gUmV0dXJucyB0aGUge1N0cmluZ30gbmFtZSBvZiB0aGUgY29tbWFuZCBvciB7dW5kZWZpbmVkfSBpZiBub3QgYXBwbGljYWJsZS5cbiAgc2hlYmFuZ1NlY3Rpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnNoZWJhbmcgPyB0aGlzLnNoZWJhbmcuc3BsaXQoJyAnKSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==