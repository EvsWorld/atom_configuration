Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var RenameView = require('./atom-ternjs-rename-view');

var Rename = (function () {
  function Rename() {
    _classCallCheck(this, Rename);

    this.disposables = [];

    this.renameView = null;
    this.renamePanel = null;

    this.hideListener = this.hide.bind(this);
  }

  _createClass(Rename, [{
    key: 'init',
    value: function init() {

      this.renameView = new RenameView();
      this.renameView.initialize(this);

      this.renamePanel = atom.workspace.addModalPanel({

        item: this.renameView,
        priority: 0,
        visible: false
      });

      atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');

      _atomTernjsEvents2['default'].on('rename-hide', this.hideListener);

      this.registerCommands();
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', this.show.bind(this)));
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.renamePanel && this.renamePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      var codeEditor = atom.workspace.getActiveTextEditor();
      var currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({ includeNonWordCharacters: false });
      var currentName = codeEditor.getTextInBufferRange(currentNameRange);

      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();

      this.renamePanel.show();
      this.renameView.nameEditor.focus();
    }
  }, {
    key: 'updateAllAndRename',
    value: function updateAllAndRename(newName) {
      var _this = this;

      if (!_atomTernjsManager2['default'].client) {

        this.hide();

        return;
      }

      var idx = 0;
      var editors = atom.workspace.getTextEditors();

      for (var editor of editors) {

        if (!(0, _atomTernjsHelper.isValidEditor)(editor) || atom.project.relativizePath(editor.getURI())[0] !== _atomTernjsManager2['default'].client.projectDir) {

          idx++;

          continue;
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (++idx === editors.length) {

            var activeEditor = atom.workspace.getActiveTextEditor();
            var cursor = activeEditor.getLastCursor();

            if (!cursor) {

              return;
            }

            var position = cursor.getBufferPosition();

            _atomTernjsManager2['default'].client.rename(atom.project.relativizePath(activeEditor.getURI())[1], { line: position.row, ch: position.column }, newName).then(function (data) {

              if (!data) {

                return;
              }

              _this.rename(data);
            })['catch'](_servicesDebug2['default'].handleCatchWithNotification).then(_this.hideListener);
          }
        })['catch'](_servicesDebug2['default'].handleCatch).then(this.hideListener);
      }
    }
  }, {
    key: 'rename',
    value: function rename(data) {

      var dir = _atomTernjsManager2['default'].server.projectDir;

      if (!dir) {

        return;
      }

      var translateColumnBy = data.changes[0].text.length - data.name.length;

      for (var change of data.changes) {

        change.file = change.file.replace(/^.\//, '');
        change.file = _path2['default'].resolve(atom.project.relativizePath(dir)[0], change.file);
      }

      var changes = (0, _underscorePlus.uniq)(data.changes, function (item) {

        return JSON.stringify(item);
      });

      var currentFile = false;
      var arr = [];
      var idx = 0;

      for (var change of changes) {

        if (currentFile !== change.file) {

          currentFile = change.file;
          idx = arr.push([]) - 1;
        }

        arr[idx].push(change);
      }

      for (var arrObj of arr) {

        this.openFilesAndRename(arrObj, translateColumnBy);
      }

      this.hide();
    }
  }, {
    key: 'openFilesAndRename',
    value: function openFilesAndRename(obj, translateColumnBy) {
      var _this2 = this;

      atom.workspace.open(obj[0].file).then(function (textEditor) {

        var currentColumnOffset = 0;
        var idx = 0;
        var buffer = textEditor.getBuffer();
        var checkpoint = buffer.createCheckpoint();

        for (var change of obj) {

          _this2.setTextInRange(buffer, change, currentColumnOffset, idx === obj.length - 1, textEditor);
          currentColumnOffset += translateColumnBy;

          idx++;
        }

        buffer.groupChangesSinceCheckpoint(checkpoint);
      });
    }
  }, {
    key: 'setTextInRange',
    value: function setTextInRange(buffer, change, offset, moveCursor, textEditor) {

      change.start += offset;
      change.end += offset;
      var position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      var end = position.translate(new _atom.Point(0, length));
      var range = new _atom.Range(position, end);
      buffer.setTextInRange(range, change.text);

      if (!moveCursor) {

        return;
      }

      var cursor = textEditor.getLastCursor();

      cursor && cursor.setBufferPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];

      _atomTernjsEvents2['default'].off('rename-hide', this.hideListener);

      this.renameView && this.renameView.destroy();
      this.renameView = null;

      this.renamePanel && this.renamePanel.destroy();
      this.renamePanel = null;
    }
  }]);

  return Rename;
})();

exports['default'] = new Rename();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2dDQUlvQixzQkFBc0I7Ozs7aUNBQ3RCLHVCQUF1Qjs7OztvQkFJcEMsTUFBTTs7OEJBQ00saUJBQWlCOztvQkFDbkIsTUFBTTs7OztnQ0FLaEIsc0JBQXNCOzs2QkFDWCxrQkFBa0I7Ozs7QUFqQnBDLFdBQVcsQ0FBQzs7QUFFWixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7SUFpQmxELE1BQU07QUFFQyxXQUZQLE1BQU0sR0FFSTswQkFGVixNQUFNOztBQUlSLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQzs7ZUFWRyxNQUFNOztXQVlOLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQzs7QUFFOUMsWUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ3JCLGdCQUFRLEVBQUUsQ0FBQztBQUNYLGVBQU8sRUFBRSxLQUFLO09BQ2YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLGNBQWMs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QyxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV2QixVQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDL0MsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7S0FDekI7OztTQW5ORyxNQUFNOzs7cUJBc05HLElBQUksTUFBTSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBSZW5hbWVWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1yZW5hbWUtdmlldycpO1xuXG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHtcbiAgUG9pbnQsXG4gIFJhbmdlXG59IGZyb20gJ2F0b20nO1xuaW1wb3J0IHt1bmlxfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1xuICBkaXNwb3NlQWxsLFxuICBmb2N1c0VkaXRvcixcbiAgaXNWYWxpZEVkaXRvclxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgZGVidWcgZnJvbSAnLi9zZXJ2aWNlcy9kZWJ1Zyc7XG5cbmNsYXNzIFJlbmFtZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLnJlbmFtZVZpZXcgPSBudWxsO1xuICAgIHRoaXMucmVuYW1lUGFuZWwgPSBudWxsO1xuXG4gICAgdGhpcy5oaWRlTGlzdGVuZXIgPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICB0aGlzLnJlbmFtZVZpZXcgPSBuZXcgUmVuYW1lVmlldygpO1xuICAgIHRoaXMucmVuYW1lVmlldy5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5hbWVQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuXG4gICAgICBpdGVtOiB0aGlzLnJlbmFtZVZpZXcsXG4gICAgICBwcmlvcml0eTogMCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5yZW5hbWVQYW5lbCkuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVuYW1lLXBhbmVsJywgJ3BhbmVsLWJvdHRvbScpO1xuXG4gICAgZW1pdHRlci5vbigncmVuYW1lLWhpZGUnLCB0aGlzLmhpZGVMaXN0ZW5lcik7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6cmVuYW1lJywgdGhpcy5zaG93LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsICYmIHRoaXMucmVuYW1lUGFuZWwuaGlkZSgpO1xuXG4gICAgZm9jdXNFZGl0b3IoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICBjb25zdCBjb2RlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IGN1cnJlbnROYW1lUmFuZ2UgPSBjb2RlRWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKHtpbmNsdWRlTm9uV29yZENoYXJhY3RlcnM6IGZhbHNlfSk7XG4gICAgY29uc3QgY3VycmVudE5hbWUgPSBjb2RlRWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKGN1cnJlbnROYW1lUmFuZ2UpO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3Lm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5zZXRUZXh0KGN1cnJlbnROYW1lKTtcbiAgICB0aGlzLnJlbmFtZVZpZXcubmFtZUVkaXRvci5nZXRNb2RlbCgpLnNlbGVjdEFsbCgpO1xuXG4gICAgdGhpcy5yZW5hbWVQYW5lbC5zaG93KCk7XG4gICAgdGhpcy5yZW5hbWVWaWV3Lm5hbWVFZGl0b3IuZm9jdXMoKTtcbiAgfVxuXG4gIHVwZGF0ZUFsbEFuZFJlbmFtZShuZXdOYW1lKSB7XG5cbiAgICBpZiAoIW1hbmFnZXIuY2xpZW50KSB7XG5cbiAgICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgY29uc3QgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCk7XG5cbiAgICBmb3IgKGNvbnN0IGVkaXRvciBvZiBlZGl0b3JzKSB7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSB8fFxuICAgICAgICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVswXSAhPT0gbWFuYWdlci5jbGllbnQucHJvamVjdERpclxuICAgICAgKSB7XG5cbiAgICAgICAgaWR4Kys7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBpZiAoKytpZHggPT09IGVkaXRvcnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IGFjdGl2ZUVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICAgICAgICAgIGlmICghY3Vyc29yKSB7XG5cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICBtYW5hZ2VyLmNsaWVudC5yZW5hbWUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGFjdGl2ZUVkaXRvci5nZXRVUkkoKSlbMV0sIHtsaW5lOiBwb3NpdGlvbi5yb3csIGNoOiBwb3NpdGlvbi5jb2x1bW59LCBuZXdOYW1lKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLnJlbmFtZShkYXRhKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZGVidWcuaGFuZGxlQ2F0Y2hXaXRoTm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgLnRoZW4odGhpcy5oaWRlTGlzdGVuZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGRlYnVnLmhhbmRsZUNhdGNoKVxuICAgICAgICAudGhlbih0aGlzLmhpZGVMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVuYW1lKGRhdGEpIHtcblxuICAgIGNvbnN0IGRpciA9IG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICBpZiAoIWRpcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNsYXRlQ29sdW1uQnkgPSBkYXRhLmNoYW5nZXNbMF0udGV4dC5sZW5ndGggLSBkYXRhLm5hbWUubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgY2hhbmdlIG9mIGRhdGEuY2hhbmdlcykge1xuXG4gICAgICBjaGFuZ2UuZmlsZSA9IGNoYW5nZS5maWxlLnJlcGxhY2UoL14uXFwvLywgJycpO1xuICAgICAgY2hhbmdlLmZpbGUgPSBwYXRoLnJlc29sdmUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGRpcilbMF0sIGNoYW5nZS5maWxlKTtcbiAgICB9XG5cbiAgICBsZXQgY2hhbmdlcyA9IHVuaXEoZGF0YS5jaGFuZ2VzLCAoaXRlbSkgPT4ge1xuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaXRlbSk7XG4gICAgfSk7XG5cbiAgICBsZXQgY3VycmVudEZpbGUgPSBmYWxzZTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgbGV0IGlkeCA9IDA7XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBjaGFuZ2VzKSB7XG5cbiAgICAgIGlmIChjdXJyZW50RmlsZSAhPT0gY2hhbmdlLmZpbGUpIHtcblxuICAgICAgICBjdXJyZW50RmlsZSA9IGNoYW5nZS5maWxlO1xuICAgICAgICBpZHggPSBhcnIucHVzaChbXSkgLSAxO1xuICAgICAgfVxuXG4gICAgICBhcnJbaWR4XS5wdXNoKGNoYW5nZSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhcnJPYmogb2YgYXJyKSB7XG5cbiAgICAgIHRoaXMub3BlbkZpbGVzQW5kUmVuYW1lKGFyck9iaiwgdHJhbnNsYXRlQ29sdW1uQnkpO1xuICAgIH1cblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgb3BlbkZpbGVzQW5kUmVuYW1lKG9iaiwgdHJhbnNsYXRlQ29sdW1uQnkpIHtcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4ob2JqWzBdLmZpbGUpLnRoZW4oKHRleHRFZGl0b3IpID0+IHtcblxuICAgICAgbGV0IGN1cnJlbnRDb2x1bW5PZmZzZXQgPSAwO1xuICAgICAgbGV0IGlkeCA9IDA7XG4gICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgICAgY29uc3QgY2hlY2twb2ludCA9IGJ1ZmZlci5jcmVhdGVDaGVja3BvaW50KCk7XG5cbiAgICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIG9iaikge1xuXG4gICAgICAgIHRoaXMuc2V0VGV4dEluUmFuZ2UoYnVmZmVyLCBjaGFuZ2UsIGN1cnJlbnRDb2x1bW5PZmZzZXQsIGlkeCA9PT0gb2JqLmxlbmd0aCAtIDEsIHRleHRFZGl0b3IpO1xuICAgICAgICBjdXJyZW50Q29sdW1uT2Zmc2V0ICs9IHRyYW5zbGF0ZUNvbHVtbkJ5O1xuXG4gICAgICAgIGlkeCsrO1xuICAgICAgfVxuXG4gICAgICBidWZmZXIuZ3JvdXBDaGFuZ2VzU2luY2VDaGVja3BvaW50KGNoZWNrcG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VGV4dEluUmFuZ2UoYnVmZmVyLCBjaGFuZ2UsIG9mZnNldCwgbW92ZUN1cnNvciwgdGV4dEVkaXRvcikge1xuXG4gICAgY2hhbmdlLnN0YXJ0ICs9IG9mZnNldDtcbiAgICBjaGFuZ2UuZW5kICs9IG9mZnNldDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KGNoYW5nZS5zdGFydCk7XG4gICAgbGVuZ3RoID0gY2hhbmdlLmVuZCAtIGNoYW5nZS5zdGFydDtcbiAgICBjb25zdCBlbmQgPSBwb3NpdGlvbi50cmFuc2xhdGUobmV3IFBvaW50KDAsIGxlbmd0aCkpO1xuICAgIGNvbnN0IHJhbmdlID0gbmV3IFJhbmdlKHBvc2l0aW9uLCBlbmQpO1xuICAgIGJ1ZmZlci5zZXRUZXh0SW5SYW5nZShyYW5nZSwgY2hhbmdlLnRleHQpO1xuXG4gICAgaWYgKCFtb3ZlQ3Vyc29yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSB0ZXh0RWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgIGN1cnNvciAmJiBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocG9zaXRpb24pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgZW1pdHRlci5vZmYoJ3JlbmFtZS1oaWRlJywgdGhpcy5oaWRlTGlzdGVuZXIpO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ICYmIHRoaXMucmVuYW1lVmlldy5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbnVsbDtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwgJiYgdGhpcy5yZW5hbWVQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVQYW5lbCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlbmFtZSgpO1xuIl19