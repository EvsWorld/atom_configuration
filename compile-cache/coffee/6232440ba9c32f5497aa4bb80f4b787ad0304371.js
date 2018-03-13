(function() {
  var CodeContext, CodeContextBuilder, Emitter, grammarMap;

  CodeContext = require('./code-context');

  grammarMap = require('./grammars');

  Emitter = require('atom').Emitter;

  module.exports = CodeContextBuilder = (function() {
    function CodeContextBuilder(emitter) {
      this.emitter = emitter != null ? emitter : new Emitter;
    }

    CodeContextBuilder.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    CodeContextBuilder.prototype.buildCodeContext = function(editor, argType) {
      var codeContext, cursor;
      if (argType == null) {
        argType = 'Selection Based';
      }
      if (editor == null) {
        return;
      }
      codeContext = this.initCodeContext(editor);
      codeContext.argType = argType;
      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && (codeContext.filepath != null)) {
        codeContext.argType = 'File Based';
        if (editor != null ? editor.isModified() : void 0) {
          editor.save();
        }
      }
      if (argType !== 'File Based') {
        cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.initCodeContext = function(editor) {
      var codeContext, filename, filepath, ignoreSelection, lang, selection, textSource;
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getLastSelection();
      ignoreSelection = atom.config.get('script.ignoreSelection');
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }
      codeContext = new CodeContext(filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);
      lang = this.getLang(editor);
      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.getShebang = function(editor) {
      var firstLine, lines, text;
      text = editor.getText();
      lines = text.split("\n");
      firstLine = lines[0];
      if (!firstLine.match(/^#!/)) {
        return;
      }
      return firstLine.replace(/^#!\s*/, '');
    };

    CodeContextBuilder.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    CodeContextBuilder.prototype.validateLang = function(lang) {
      var valid;
      valid = true;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;
      } else if (!(lang in grammarMap)) {
        this.emitter.emit('did-not-support-language', {
          lang: lang
        });
        valid = false;
      }
      return valid;
    };

    CodeContextBuilder.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    };

    CodeContextBuilder.prototype.onDidNotSupportLanguage = function(callback) {
      return this.emitter.on('did-not-support-language', callback);
    };

    return CodeContextBuilder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvZGUtY29udGV4dC1idWlsZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvREFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSw0QkFBRSxPQUFGLEdBQUE7QUFBMEIsTUFBekIsSUFBQyxDQUFBLDRCQUFBLFVBQVUsR0FBQSxDQUFBLE9BQWMsQ0FBMUI7SUFBQSxDQUFiOztBQUFBLGlDQUVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxFQURPO0lBQUEsQ0FGVCxDQUFBOztBQUFBLGlDQWVBLGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxFQUFTLE9BQVQsR0FBQTtBQUNoQixVQUFBLG1CQUFBOztRQUR5QixVQUFRO09BQ2pDO0FBQUEsTUFBQSxJQUFjLGNBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQWpCLENBRmQsQ0FBQTtBQUFBLE1BSUEsV0FBVyxDQUFDLE9BQVosR0FBc0IsT0FKdEIsQ0FBQTtBQU1BLE1BQUEsSUFBRyxPQUFBLEtBQVcsbUJBQWQ7QUFDRSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBQSxDQURGO09BQUEsTUFFSyxJQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBdEIsQ0FBQSxDQUFBLElBQW9D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

//# sourceURL=/Users/evanhendrix1/.atom/packages/script/lib/code-context-builder.coffee
