Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

// Dependencies
'use babel';var dirname = undefined;
var HTMLHint = undefined;
var findAsync = undefined;
var fsReadFile = undefined;
var generateRange = undefined;
var tinyPromisify = undefined;
var stripJSONComments = undefined;

var phpEmbeddedScope = 'text.html.php';

var getConfig = _asyncToGenerator(function* (filePath) {
  var readFile = tinyPromisify(fsReadFile);
  var configPath = yield findAsync(dirname(filePath), '.htmlhintrc');
  var conf = null;
  if (configPath !== null) {
    conf = yield readFile(configPath, 'utf8');
  }
  if (conf) {
    return JSON.parse(stripJSONComments(conf));
  }
  return null;
});

var phpScopedEditor = function phpScopedEditor(editor) {
  return editor.getCursors().some(function (cursor) {
    return cursor.getScopeDescriptor().getScopesArray().some(function (scope) {
      return scope === phpEmbeddedScope;
    });
  });
};

var removePHP = function removePHP(str) {
  return str.replace(/<\?(?:php|=)?(?:[\s\S])+?\?>/gi, function (match) {
    var newlines = match.match(/\r?\n|\r/g);
    var newlineCount = newlines ? newlines.length : 0;

    return '\n'.repeat(newlineCount);
  });
};

var loadDeps = function loadDeps() {
  if (loadDeps.loaded) {
    return;
  }
  if (!dirname) {
    var _require = require('path');

    dirname = _require.dirname;
  }
  if (!HTMLHint) {
    var _require2 = require('htmlhint');

    HTMLHint = _require2.HTMLHint;
  }
  if (!findAsync || !generateRange) {
    var _require3 = require('atom-linter');

    findAsync = _require3.findAsync;
    generateRange = _require3.generateRange;
  }
  if (!fsReadFile) {
    var _require4 = require('fs');

    fsReadFile = _require4.readFile;
  }
  if (!tinyPromisify) {
    tinyPromisify = require('tiny-promisify');
  }
  if (!stripJSONComments) {
    stripJSONComments = require('strip-json-comments');
  }
  loadDeps.loaded = true;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterHtmlhintDeps = function installLinterHtmlhintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-htmlhint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterHtmlhintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.grammarScopes = [];

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-htmlhint.enabledScopes', function (scopes) {
      // Remove any old scopes
      _this.grammarScopes.splice(0, _this.grammarScopes.length);
      // Add the current scopes
      Array.prototype.push.apply(_this.grammarScopes, scopes);
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
    return {
      name: 'htmlhint',
      grammarScopes: this.grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (editor) {
        if (!atom.workspace.isTextEditor(editor)) {
          return null;
        }

        var filePath = editor.getPath();
        if (!filePath) {
          // Invalid path
          return null;
        }

        var isPhPEditor = phpScopedEditor(editor);

        var fileText = editor.getText();
        var text = isPhPEditor ? removePHP(fileText) : fileText;
        if (!text) {
          return [];
        }

        // Ensure that all dependencies are loaded
        loadDeps();

        var ruleset = yield getConfig(filePath);

        var messages = HTMLHint.verify(text, ruleset || undefined);

        if (editor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        return messages.map(function (message) {
          return {
            range: generateRange(editor, message.line - 1, message.col - 1),
            type: message.type,
            text: message.message,
            filePath: filePath
          };
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWh0bWxoaW50L2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFHb0MsTUFBTTs7O0FBSDFDLFdBQVcsQ0FBQyxBQU1aLElBQUksT0FBTyxZQUFBLENBQUM7QUFDWixJQUFJLFFBQVEsWUFBQSxDQUFDO0FBQ2IsSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsSUFBSSxpQkFBaUIsWUFBQSxDQUFDOztBQUV0QixJQUFNLGdCQUFnQixHQUFHLGVBQWUsQ0FBQzs7QUFFekMsSUFBTSxTQUFTLHFCQUFHLFdBQU8sUUFBUSxFQUFLO0FBQ3BDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQyxNQUFNLFVBQVUsR0FBRyxNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDckUsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQUksVUFBVSxLQUFLLElBQUksRUFBRTtBQUN2QixRQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQzNDO0FBQ0QsTUFBSSxJQUFJLEVBQUU7QUFDUixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUM1QztBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQSxDQUFDOztBQUVGLElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBRyxNQUFNO1NBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07V0FDL0QsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsY0FB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T0FBTyxFQUFFLEtBQUssUUFBUSxFQUFFOztBQUVqQyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxlQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2lCQUFLO0FBQzlCLGlCQUFLLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUMvRCxnQkFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0FBQ2xCLGdCQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU87QUFDckIsb0JBQVEsRUFBUixRQUFRO1dBQ1Q7U0FBQyxDQUFDLENBQUM7T0FDTCxDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9saW50ZXItaHRtbGhpbnQvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbi8vIERlcGVuZGVuY2llc1xubGV0IGRpcm5hbWU7XG5sZXQgSFRNTEhpbnQ7XG5sZXQgZmluZEFzeW5jO1xubGV0IGZzUmVhZEZpbGU7XG5sZXQgZ2VuZXJhdGVSYW5nZTtcbmxldCB0aW55UHJvbWlzaWZ5O1xubGV0IHN0cmlwSlNPTkNvbW1lbnRzO1xuXG5jb25zdCBwaHBFbWJlZGRlZFNjb3BlID0gJ3RleHQuaHRtbC5waHAnO1xuXG5jb25zdCBnZXRDb25maWcgPSBhc3luYyAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgcmVhZEZpbGUgPSB0aW55UHJvbWlzaWZ5KGZzUmVhZEZpbGUpO1xuICBjb25zdCBjb25maWdQYXRoID0gYXdhaXQgZmluZEFzeW5jKGRpcm5hbWUoZmlsZVBhdGgpLCAnLmh0bWxoaW50cmMnKTtcbiAgbGV0IGNvbmYgPSBudWxsO1xuICBpZiAoY29uZmlnUGF0aCAhPT0gbnVsbCkge1xuICAgIGNvbmYgPSBhd2FpdCByZWFkRmlsZShjb25maWdQYXRoLCAndXRmOCcpO1xuICB9XG4gIGlmIChjb25mKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaXBKU09OQ29tbWVudHMoY29uZikpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgcGhwU2NvcGVkRWRpdG9yID0gZWRpdG9yID0+IGVkaXRvci5nZXRDdXJzb3JzKCkuc29tZShjdXJzb3IgPT5cbiAgY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpLmdldFNjb3Blc0FycmF5KCkuc29tZShzY29wZSA9PlxuICAgIHNjb3BlID09PSBwaHBFbWJlZGRlZFNjb3BlKSk7XG5cbmNvbnN0IHJlbW92ZVBIUCA9IHN0ciA9PiBzdHIucmVwbGFjZSgvPFxcPyg/OnBocHw9KT8oPzpbXFxzXFxTXSkrP1xcPz4vZ2ksIChtYXRjaCkgPT4ge1xuICBjb25zdCBuZXdsaW5lcyA9IG1hdGNoLm1hdGNoKC9cXHI/XFxufFxcci9nKTtcbiAgY29uc3QgbmV3bGluZUNvdW50ID0gbmV3bGluZXMgPyBuZXdsaW5lcy5sZW5ndGggOiAwO1xuXG4gIHJldHVybiAnXFxuJy5yZXBlYXQobmV3bGluZUNvdW50KTtcbn0pO1xuXG5jb25zdCBsb2FkRGVwcyA9ICgpID0+IHtcbiAgaWYgKGxvYWREZXBzLmxvYWRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWRpcm5hbWUpIHtcbiAgICAoeyBkaXJuYW1lIH0gPSByZXF1aXJlKCdwYXRoJykpO1xuICB9XG4gIGlmICghSFRNTEhpbnQpIHtcbiAgICAoeyBIVE1MSGludCB9ID0gcmVxdWlyZSgnaHRtbGhpbnQnKSk7XG4gIH1cbiAgaWYgKCFmaW5kQXN5bmMgfHwgIWdlbmVyYXRlUmFuZ2UpIHtcbiAgICAoeyBmaW5kQXN5bmMsIGdlbmVyYXRlUmFuZ2UgfSA9IHJlcXVpcmUoJ2F0b20tbGludGVyJykpO1xuICB9XG4gIGlmICghZnNSZWFkRmlsZSkge1xuICAgICh7IHJlYWRGaWxlOiBmc1JlYWRGaWxlIH0gPSByZXF1aXJlKCdmcycpKTtcbiAgfVxuICBpZiAoIXRpbnlQcm9taXNpZnkpIHtcbiAgICB0aW55UHJvbWlzaWZ5ID0gcmVxdWlyZSgndGlueS1wcm9taXNpZnknKTtcbiAgfVxuICBpZiAoIXN0cmlwSlNPTkNvbW1lbnRzKSB7XG4gICAgc3RyaXBKU09OQ29tbWVudHMgPSByZXF1aXJlKCdzdHJpcC1qc29uLWNvbW1lbnRzJyk7XG4gIH1cbiAgbG9hZERlcHMubG9hZGVkID0gdHJ1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuICAgIGxldCBkZXBzQ2FsbGJhY2tJRDtcbiAgICBjb25zdCBpbnN0YWxsTGludGVySHRtbGhpbnREZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWh0bWxoaW50Jyk7XG4gICAgICB9XG4gICAgICBsb2FkRGVwcygpO1xuICAgIH07XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVySHRtbGhpbnREZXBzKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKGRlcHNDYWxsYmFja0lEKTtcblxuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFtdO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1odG1saGludC5lbmFibGVkU2NvcGVzJywgKHNjb3BlcykgPT4ge1xuICAgICAgLy8gUmVtb3ZlIGFueSBvbGQgc2NvcGVzXG4gICAgICB0aGlzLmdyYW1tYXJTY29wZXMuc3BsaWNlKDAsIHRoaXMuZ3JhbW1hclNjb3Blcy5sZW5ndGgpO1xuICAgICAgLy8gQWRkIHRoZSBjdXJyZW50IHNjb3Blc1xuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5ncmFtbWFyU2NvcGVzLCBzY29wZXMpO1xuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnaHRtbGhpbnQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogdGhpcy5ncmFtbWFyU2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jIChlZGl0b3IpID0+IHtcbiAgICAgICAgaWYgKCFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICAgICAgLy8gSW52YWxpZCBwYXRoXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1BoUEVkaXRvciA9IHBocFNjb3BlZEVkaXRvcihlZGl0b3IpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgdGV4dCA9IGlzUGhQRWRpdG9yID8gcmVtb3ZlUEhQKGZpbGVUZXh0KSA6IGZpbGVUZXh0O1xuICAgICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnN1cmUgdGhhdCBhbGwgZGVwZW5kZW5jaWVzIGFyZSBsb2FkZWRcbiAgICAgICAgbG9hZERlcHMoKTtcblxuICAgICAgICBjb25zdCBydWxlc2V0ID0gYXdhaXQgZ2V0Q29uZmlnKGZpbGVQYXRoKTtcblxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IEhUTUxIaW50LnZlcmlmeSh0ZXh0LCBydWxlc2V0IHx8IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgaWYgKGVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzLm1hcChtZXNzYWdlID0+ICh7XG4gICAgICAgICAgcmFuZ2U6IGdlbmVyYXRlUmFuZ2UoZWRpdG9yLCBtZXNzYWdlLmxpbmUgLSAxLCBtZXNzYWdlLmNvbCAtIDEpLFxuICAgICAgICAgIHR5cGU6IG1lc3NhZ2UudHlwZSxcbiAgICAgICAgICB0ZXh0OiBtZXNzYWdlLm1lc3NhZ2UsXG4gICAgICAgICAgZmlsZVBhdGhcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=