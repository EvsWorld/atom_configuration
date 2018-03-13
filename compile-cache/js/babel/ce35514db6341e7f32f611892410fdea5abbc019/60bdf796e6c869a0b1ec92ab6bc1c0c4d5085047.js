Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _codeContext = require('./code-context');

var _codeContext2 = _interopRequireDefault(_codeContext);

var _grammarsCoffee = require('./grammars.coffee');

var _grammarsCoffee2 = _interopRequireDefault(_grammarsCoffee);

'use babel';

var CodeContextBuilder = (function () {
  function CodeContextBuilder() {
    var emitter = arguments.length <= 0 || arguments[0] === undefined ? new _atom.Emitter() : arguments[0];

    _classCallCheck(this, CodeContextBuilder);

    this.emitter = emitter;
  }

  _createClass(CodeContextBuilder, [{
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }

    // Public: Builds code context for specified argType
    //
    // editor - Atom's {TextEditor} instance
    // argType - {String} with one of the following values:
    //
    // * "Selection Based" (default)
    // * "Line Number Based",
    // * "File Based"
    //
    // returns a {CodeContext} object
  }, {
    key: 'buildCodeContext',
    value: function buildCodeContext(editor) {
      var argType = arguments.length <= 1 || arguments[1] === undefined ? 'Selection Based' : arguments[1];

      if (!editor) return null;

      var codeContext = this.initCodeContext(editor);

      codeContext.argType = argType;

      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && codeContext.filepath) {
        codeContext.argType = 'File Based';
        if (editor && editor.isModified()) editor.save();
      }

      // Selection and Line Number Based runs both benefit from knowing the current line
      // number
      if (argType !== 'File Based') {
        var cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }

      return codeContext;
    }
  }, {
    key: 'initCodeContext',
    value: function initCodeContext(editor) {
      var filename = editor.getTitle();
      var filepath = editor.getPath();
      var selection = editor.getLastSelection();
      var ignoreSelection = atom.config.get('script.ignoreSelection');

      // If the selection was empty or if ignore selection is on, then "select" ALL
      // of the text
      // This allows us to run on new files
      var textSource = undefined;
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }

      var codeContext = new _codeContext2['default'](filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);

      var lang = this.getLang(editor);

      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }

      return codeContext;
    }
  }, {
    key: 'getShebang',
    value: function getShebang(editor) {
      if (process.platform === 'win32') return null;
      var text = editor.getText();
      var lines = text.split('\n');
      var firstLine = lines[0];
      if (!firstLine.match(/^#!/)) return null;

      return firstLine.replace(/^#!\s*/, '');
    }
  }, {
    key: 'getLang',
    value: function getLang(editor) {
      return editor.getGrammar().name;
    }
  }, {
    key: 'validateLang',
    value: function validateLang(lang) {
      var valid = true;

      // Determine if no language is selected.
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;

        // Provide them a dialog to submit an issue on GH, prepopulated with their
        // language of choice.
      } else if (!(lang in _grammarsCoffee2['default'])) {
          this.emitter.emit('did-not-support-language', { lang: lang });
          valid = false;
        }

      return valid;
    }
  }, {
    key: 'onDidNotSpecifyLanguage',
    value: function onDidNotSpecifyLanguage(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    }
  }, {
    key: 'onDidNotSupportLanguage',
    value: function onDidNotSupportLanguage(callback) {
      return this.emitter.on('did-not-support-language', callback);
    }
  }]);

  return CodeContextBuilder;
})();

exports['default'] = CodeContextBuilder;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb2RlLWNvbnRleHQtYnVpbGRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUV3QixNQUFNOzsyQkFFTixnQkFBZ0I7Ozs7OEJBQ2pCLG1CQUFtQjs7OztBQUwxQyxXQUFXLENBQUM7O0lBT1Msa0JBQWtCO0FBQzFCLFdBRFEsa0JBQWtCLEdBQ0E7UUFBekIsT0FBTyx5REFBRyxtQkFBYTs7MEJBRGhCLGtCQUFrQjs7QUFFbkMsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7O2VBSGtCLGtCQUFrQjs7V0FLOUIsbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hCOzs7Ozs7Ozs7Ozs7OztXQVllLDBCQUFDLE1BQU0sRUFBK0I7VUFBN0IsT0FBTyx5REFBRyxpQkFBaUI7O0FBQ2xELFVBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRXpCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWpELGlCQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFOUIsVUFBSSxPQUFPLEtBQUssbUJBQW1CLEVBQUU7QUFDbkMsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2YsTUFBTSxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUNsRSxtQkFBVyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDbkMsWUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNsRDs7OztBQUlELFVBQUksT0FBTyxLQUFLLFlBQVksRUFBRTtBQUM1QixZQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFF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QUM7S0FDOUQ7OztTQTlHa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29kZS1jb250ZXh0LWJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRW1pdHRlciB9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgQ29kZUNvbnRleHQgZnJvbSAnLi9jb2RlLWNvbnRleHQnO1xuaW1wb3J0IGdyYW1tYXJNYXAgZnJvbSAnLi9ncmFtbWFycy5jb2ZmZWUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2RlQ29udGV4dEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKSkge1xuICAgIHRoaXMuZW1pdHRlciA9IGVtaXR0ZXI7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cblxuICAvLyBQdWJsaWM6IEJ1aWxkcyBjb2RlIGNvbnRleHQgZm9yIHNwZWNpZmllZCBhcmdUeXBlXG4gIC8vXG4gIC8vIGVkaXRvciAtIEF0b20ncyB7VGV4dEVkaXRvcn0gaW5zdGFuY2VcbiAgLy8gYXJnVHlwZSAtIHtTdHJpbmd9IHdpdGggb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAvL1xuICAvLyAqIFwiU2VsZWN0aW9uIEJhc2VkXCIgKGRlZmF1bHQpXG4gIC8vICogXCJMaW5lIE51bWJlciBCYXNlZFwiLFxuICAvLyAqIFwiRmlsZSBCYXNlZFwiXG4gIC8vXG4gIC8vIHJldHVybnMgYSB7Q29kZUNvbnRleHR9IG9iamVjdFxuICBidWlsZENvZGVDb250ZXh0KGVkaXRvciwgYXJnVHlwZSA9ICdTZWxlY3Rpb24gQmFzZWQnKSB7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgY29kZUNvbnRleHQgPSB0aGlzLmluaXRDb2RlQ29udGV4dChlZGl0b3IpO1xuXG4gICAgY29kZUNvbnRleHQuYXJnVHlwZSA9IGFyZ1R5cGU7XG5cbiAgICBpZiAoYXJnVHlwZSA9PT0gJ0xpbmUgTnVtYmVyIEJhc2VkJykge1xuICAgICAgZWRpdG9yLnNhdmUoKTtcbiAgICB9IGVsc2UgaWYgKGNvZGVDb250ZXh0LnNlbGVjdGlvbi5pc0VtcHR5KCkgJiYgY29kZUNvbnRleHQuZmlsZXBhdGgpIHtcbiAgICAgIGNvZGVDb250ZXh0LmFyZ1R5cGUgPSAnRmlsZSBCYXNlZCc7XG4gICAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5pc01vZGlmaWVkKCkpIGVkaXRvci5zYXZlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VsZWN0aW9uIGFuZCBMaW5lIE51bWJlciBCYXNlZCBydW5zIGJvdGggYmVuZWZpdCBmcm9tIGtub3dpbmcgdGhlIGN1cnJlbnQgbGluZVxuICAgIC8vIG51bWJlclxuICAgIGlmIChhcmdUeXBlICE9PSAnRmlsZSBCYXNlZCcpIHtcbiAgICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG4gICAgICBjb2RlQ29udGV4dC5saW5lTnVtYmVyID0gY3Vyc29yLmdldFNjcmVlblJvdygpICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29kZUNvbnRleHQ7XG4gIH1cblxuICBpbml0Q29kZUNvbnRleHQoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBlZGl0b3IuZ2V0VGl0bGUoKTtcbiAgICBjb25zdCBmaWxlcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBpZ25vcmVTZWxlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ3NjcmlwdC5pZ25vcmVTZWxlY3Rpb24nKTtcblxuICAgIC8vIElmIHRoZSBzZWxlY3Rpb24gd2FzIGVtcHR5IG9yIGlmIGlnbm9yZSBzZWxlY3Rpb24gaXMgb24sIHRoZW4gXCJzZWxlY3RcIiBBTExcbiAgICAvLyBvZiB0aGUgdGV4dFxuICAgIC8vIFRoaXMgYWxsb3dzIHVzIHRvIHJ1biBvbiBuZXcgZmlsZXNcbiAgICBsZXQgdGV4dFNvdXJjZTtcbiAgICBpZiAoc2VsZWN0aW9uLmlzRW1wdHkoKSB8fCBpZ25vcmVTZWxlY3Rpb24pIHtcbiAgICAgIHRleHRTb3VyY2UgPSBlZGl0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHRTb3VyY2UgPSBzZWxlY3Rpb247XG4gICAgfVxuXG4gICAgY29uc3QgY29kZUNvbnRleHQgPSBuZXcgQ29kZUNvbnRleHQoZmlsZW5hbWUsIGZpbGVwYXRoLCB0ZXh0U291cmNlKTtcbiAgICBjb2RlQ29udGV4dC5zZWxlY3Rpb24gPSBzZWxlY3Rpb247XG4gICAgY29kZUNvbnRleHQuc2hlYmFuZyA9IHRoaXMuZ2V0U2hlYmFuZyhlZGl0b3IpO1xuXG4gICAgY29uc3QgbGFuZyA9IHRoaXMuZ2V0TGFuZyhlZGl0b3IpO1xuXG4gICAgaWYgKHRoaXMudmFsaWRhdGVMYW5nKGxhbmcpKSB7XG4gICAgICBjb2RlQ29udGV4dC5sYW5nID0gbGFuZztcbiAgICB9XG5cbiAgICByZXR1cm4gY29kZUNvbnRleHQ7XG4gIH1cblxuICBnZXRTaGViYW5nKGVkaXRvcikge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGZpcnN0TGluZSA9IGxpbmVzWzBdO1xuICAgIGlmICghZmlyc3RMaW5lLm1hdGNoKC9eIyEvKSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gZmlyc3RMaW5lLnJlcGxhY2UoL14jIVxccyovLCAnJyk7XG4gIH1cblxuICBnZXRMYW5nKGVkaXRvcikge1xuICAgIHJldHVybiBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWU7XG4gIH1cblxuICB2YWxpZGF0ZUxhbmcobGFuZykge1xuICAgIGxldCB2YWxpZCA9IHRydWU7XG5cbiAgICAvLyBEZXRlcm1pbmUgaWYgbm8gbGFuZ3VhZ2UgaXMgc2VsZWN0ZWQuXG4gICAgaWYgKGxhbmcgPT09ICdOdWxsIEdyYW1tYXInIHx8IGxhbmcgPT09ICdQbGFpbiBUZXh0Jykge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1ub3Qtc3BlY2lmeS1sYW5ndWFnZScpO1xuICAgICAgdmFsaWQgPSBmYWxzZTtcblxuICAgIC8vIFByb3ZpZGUgdGhlbSBhIGRpYWxvZyB0byBzdWJtaXQgYW4gaXNzdWUgb24gR0gsIHByZXBvcHVsYXRlZCB3aXRoIHRoZWlyXG4gICAgLy8gbGFuZ3VhZ2Ugb2YgY2hvaWNlLlxuICAgIH0gZWxzZSBpZiAoIShsYW5nIGluIGdyYW1tYXJNYXApKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW5vdC1zdXBwb3J0LWxhbmd1YWdlJywgeyBsYW5nIH0pO1xuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWQ7XG4gIH1cblxuICBvbkRpZE5vdFNwZWNpZnlMYW5ndWFnZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1ub3Qtc3BlY2lmeS1sYW5ndWFnZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkTm90U3VwcG9ydExhbmd1YWdlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW5vdC1zdXBwb3J0LWxhbmd1YWdlJywgY2FsbGJhY2spO1xuICB9XG59XG4iXX0=