Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _servicesDebug = require('./services/debug');

'use babel';

var Client = (function () {
  function Client(projectDir) {
    _classCallCheck(this, Client);

    this.projectDir = projectDir;
    // collection files the server currently holds in its set of analyzed files
    this.analyzedFiles = [];
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: _path2['default'].normalize(file),
          end: end,
          types: true,
          includeKeywords: true,
          sort: _atomTernjsPackageConfig2['default'].options.sort,
          guess: _atomTernjsPackageConfig2['default'].options.guess,
          docs: _atomTernjsPackageConfig2['default'].options.documentation,
          urls: _atomTernjsPackageConfig2['default'].options.urls,
          origins: _atomTernjsPackageConfig2['default'].options.origins,
          lineCharPositions: true,
          caseInsensitive: _atomTernjsPackageConfig2['default'].options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: _path2['default'].normalize(file),
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: _path2['default'].normalize(file),
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor) {

      return this.post('query', { files: [{

          type: 'full',
          name: _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]),
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, start, text) {

      return this.post('query', [{

        type: 'full',
        name: _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]),
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var buffer = editor.getBuffer();

      if (!buffer.isModified()) {

        return Promise.resolve({});
      }

      var uRI = editor.getURI();

      if (!uRI) {

        return Promise.reject({ type: 'info', message: _servicesDebug.messages.noURI });
      }

      var file = _path2['default'].normalize(atom.project.relativizePath(uRI)[1]);

      // check if this file is excluded via dontLoad
      if (_atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // do not request files if we already know it is registered
      if (this.analyzedFiles.includes(file)) {

        return this.updateFull(editor);
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        var files = data.files;

        if (files) {

          files.forEach(function (file) {
            return file = _path2['default'].normalize(file);
          });
          _this.analyzedFiles = files;
        }

        var registered = files && files.includes(file);

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, start, text)
          // else
          return _this.updateFull(editor);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: _path2['default'].normalize(file),
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]);
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      var _atom$project$relativizePath = atom.project.relativizePath(editor.getURI());

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var project = _atom$project$relativizePath2[0];
      var file = _atom$project$relativizePath2[1];

      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: _path2['default'].normalize(file),
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          if (_servicesNavigation2['default'].set(data)) {

            var path_to_go = _path2['default'].isAbsolute(data.file) ? data.file : project + '/' + data.file;
            (0, _atomTernjsHelper.openFileAndGoTo)(data.start, path_to_go);
          }
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'getDefinition',
    value: function getDefinition(file, range) {
      return this.post('query', {
        query: {
          type: 'definition',
          file: _path2['default'].normalize(file),
          start: {
            line: range.start.row,
            ch: range.start.column
          },
          end: {
            line: range.end.row,
            ch: range.end.column
          }
        }
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = _atomTernjsManager2['default'].server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7aUNBQ0gsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7Z0NBR2pELHNCQUFzQjs7a0NBQ04sdUJBQXVCOzs7OzZCQUN2QixrQkFBa0I7O0FBVHpDLFdBQVcsQ0FBQzs7SUFXUyxNQUFNO0FBRWQsV0FGUSxNQUFNLENBRWIsVUFBVSxFQUFFOzBCQUZMLE1BQU07O0FBSXZCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztHQUN6Qjs7ZUFQa0IsTUFBTTs7V0FTZCxxQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOztBQUVyQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUV4QixhQUFLLEVBQUU7O0FBRUwsY0FBSSxFQUFFLGFBQWE7QUFDbkIsY0FBSSxFQUFFLGtCQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDMUIsYUFBRyxFQUFFLEdBQUc7QUFDUixlQUFLLEVBQUUsSUFBSTtBQUNYLHlCQUFlLEVBQUUsSUFBSTtBQUNyQixjQUFJLEVBQUUscUNBQWMsT0FBTyxDQUFDLElBQUk7QUFDaEMsZUFBSyxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxLQUFLO0FBQ2xDLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsYUFBYTtBQUN6QyxjQUFJLEVBQUUscUNBQWMsT0FBTyxDQUFDLElBQUk7QUFDaEMsaUJBQU8sRUFBRSxxQ0FBYyxPQUFPLENBQUMsT0FBTztBQUN0QywyQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLHlCQUFlLEVBQUUscUNBQWMsT0FBTyxDQUFDLGVBQWU7U0FDdkQ7T0FDRixDQUFDLENBQUM7S0FDSjs7O1dBRVksdUJBQUMsSUFBSSxFQUFF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VXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBvcGVuRmlsZUFuZEdvVG9cbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uJztcbmltcG9ydCB7bWVzc2FnZXN9IGZyb20gJy4vc2VydmljZXMvZGVidWcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb2plY3REaXIpIHtcblxuICAgIHRoaXMucHJvamVjdERpciA9IHByb2plY3REaXI7XG4gICAgLy8gY29sbGVjdGlvbiBmaWxlcyB0aGUgc2VydmVyIGN1cnJlbnRseSBob2xkcyBpbiBpdHMgc2V0IG9mIGFuYWx5emVkIGZpbGVzXG4gICAgdGhpcy5hbmFseXplZEZpbGVzID0gW107XG4gIH1cblxuICBjb21wbGV0aW9ucyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdjb21wbGV0aW9ucycsXG4gICAgICAgIGZpbGU6IHBhdGgubm9ybWFsaXplKGZpbGUpLFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgdHlwZXM6IHRydWUsXG4gICAgICAgIGluY2x1ZGVLZXl3b3JkczogdHJ1ZSxcbiAgICAgICAgc29ydDogcGFja2FnZUNvbmZpZy5vcHRpb25zLnNvcnQsXG4gICAgICAgIGd1ZXNzOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuZ3Vlc3MsXG4gICAgICAgIGRvY3M6IHBhY2thZ2VDb25maWcub3B0aW9ucy5kb2N1bWVudGF0aW9uLFxuICAgICAgICB1cmxzOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMudXJscyxcbiAgICAgICAgb3JpZ2luczogcGFja2FnZUNvbmZpZy5vcHRpb25zLm9yaWdpbnMsXG4gICAgICAgIGxpbmVDaGFyUG9zaXRpb25zOiB0cnVlLFxuICAgICAgICBjYXNlSW5zZW5zaXRpdmU6IHBhY2thZ2VDb25maWcub3B0aW9ucy5jYXNlSW5zZW5zaXRpdmVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRvY3VtZW50YXRpb24oZmlsZSwgZW5kKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAnZG9jdW1lbnRhdGlvbicsXG4gICAgICAgIGZpbGU6IHBhdGgubm9ybWFsaXplKGZpbGUpLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVmcyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdyZWZzJyxcbiAgICAgICAgZmlsZTogcGF0aC5ub3JtYWxpemUoZmlsZSksXG4gICAgICAgIGVuZDogZW5kXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVGdWxsKGVkaXRvcikge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7IGZpbGVzOiBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBwYXRoLm5vcm1hbGl6ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSksXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV19KTtcbiAgfVxuXG4gIHVwZGF0ZVBhcnQoZWRpdG9yLCBzdGFydCwgdGV4dCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBwYXRoLm5vcm1hbGl6ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSksXG4gICAgICBvZmZzZXQ6IHtcblxuICAgICAgICBsaW5lOiBzdGFydCxcbiAgICAgICAgY2g6IDBcbiAgICAgIH0sXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV0pO1xuICB9XG5cbiAgdXBkYXRlKGVkaXRvcikge1xuXG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuXG4gICAgaWYgKCFidWZmZXIuaXNNb2RpZmllZCgpKSB7XG4gICAgICBcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH1cblxuICAgIGNvbnN0IHVSSSA9IGVkaXRvci5nZXRVUkkoKTtcblxuICAgIGlmICghdVJJKSB7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7dHlwZTogJ2luZm8nLCBtZXNzYWdlOiBtZXNzYWdlcy5ub1VSSX0pO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSBwYXRoLm5vcm1hbGl6ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgodVJJKVsxXSk7XG5cbiAgICAvLyBjaGVjayBpZiB0aGlzIGZpbGUgaXMgZXhjbHVkZWQgdmlhIGRvbnRMb2FkXG4gICAgaWYgKFxuICAgICAgbWFuYWdlci5zZXJ2ZXIgJiZcbiAgICAgIG1hbmFnZXIuc2VydmVyLmRvbnRMb2FkKGZpbGUpXG4gICAgKSB7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgIH1cblxuICAgIC8vIGRvIG5vdCByZXF1ZXN0IGZpbGVzIGlmIHdlIGFscmVhZHkga25vdyBpdCBpcyByZWdpc3RlcmVkXG4gICAgaWYgKHRoaXMuYW5hbHl6ZWRGaWxlcy5pbmNsdWRlcyhmaWxlKSkge1xuXG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVGdWxsKGVkaXRvcik7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpbGUgaXMgcmVnaXN0ZXJlZCwgZWxzZSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgY29uc3QgZmlsZXMgPSBkYXRhLmZpbGVzO1xuXG4gICAgICBpZiAoZmlsZXMpIHtcblxuICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4gZmlsZSA9IHBhdGgubm9ybWFsaXplKGZpbGUpKTtcbiAgICAgICAgdGhpcy5hbmFseXplZEZpbGVzID0gZmlsZXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZ2lzdGVyZWQgPSBmaWxlcyAmJiBmaWxlcy5pbmNsdWRlcyhmaWxlKTtcblxuICAgICAgaWYgKHJlZ2lzdGVyZWQpIHtcblxuICAgICAgICAvLyBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgICAgIC8vIGlmIGJ1ZmZlci5nZXRNYXhDaGFyYWN0ZXJJbmRleCgpID4gNTAwMFxuICAgICAgICAvLyAgIHN0YXJ0ID0gMFxuICAgICAgICAvLyAgIGVuZCA9IDBcbiAgICAgICAgLy8gICB0ZXh0ID0gJydcbiAgICAgICAgLy8gICBmb3IgZGlmZiBpbiBlZGl0b3JNZXRhLmRpZmZzXG4gICAgICAgIC8vICAgICBzdGFydCA9IE1hdGgubWF4KDAsIGRpZmYub2xkUmFuZ2Uuc3RhcnQucm93IC0gNTApXG4gICAgICAgIC8vICAgICBlbmQgPSBNYXRoLm1pbihidWZmZXIuZ2V0TGluZUNvdW50KCksIGRpZmYub2xkUmFuZ2UuZW5kLnJvdyArIDUpXG4gICAgICAgIC8vICAgICB0ZXh0ID0gYnVmZmVyLmdldFRleHRJblJhbmdlKFtbc3RhcnQsIDBdLCBbZW5kLCBidWZmZXIubGluZUxlbmd0aEZvclJvdyhlbmQpXV0pXG4gICAgICAgIC8vICAgcHJvbWlzZSA9IHRoaXMudXBkYXRlUGFydChlZGl0b3IsIHN0YXJ0LCB0ZXh0KVxuICAgICAgICAvLyBlbHNlXG4gICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUZ1bGwoZWRpdG9yKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmFtZShmaWxlLCBlbmQsIG5ld05hbWUpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdyZW5hbWUnLFxuICAgICAgICBmaWxlOiBwYXRoLm5vcm1hbGl6ZShmaWxlKSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIG5ld05hbWU6IG5ld05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHR5cGUoZWRpdG9yLCBwb3NpdGlvbikge1xuXG4gICAgY29uc3QgZmlsZSA9IHBhdGgubm9ybWFsaXplKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdKTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ3R5cGUnLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgcHJlZmVyRnVuY3Rpb246IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlZmluaXRpb24oKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuICAgIGNvbnN0IFtwcm9qZWN0LCBmaWxlXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpO1xuICAgIGNvbnN0IGVuZCA9IHtcblxuICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgY2g6IHBvc2l0aW9uLmNvbHVtblxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAnZGVmaW5pdGlvbicsXG4gICAgICAgIGZpbGU6IHBhdGgubm9ybWFsaXplKGZpbGUpLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnN0YXJ0KSB7XG5cbiAgICAgICAgaWYgKG5hdmlnYXRpb24uc2V0KGRhdGEpKSB7XG5cbiAgICAgICAgICBjb25zdCBwYXRoX3RvX2dvID0gcGF0aC5pc0Fic29sdXRlKGRhdGEuZmlsZSkgPyBkYXRhLmZpbGUgOiBgJHtwcm9qZWN0fS8ke2RhdGEuZmlsZX1gO1xuICAgICAgICAgIG9wZW5GaWxlQW5kR29UbyhkYXRhLnN0YXJ0LCBwYXRoX3RvX2dvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RGVmaW5pdGlvbihmaWxlLCByYW5nZSkge1xuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuICAgICAgcXVlcnk6IHtcbiAgICAgICAgdHlwZTogJ2RlZmluaXRpb24nLFxuICAgICAgICBmaWxlOiBwYXRoLm5vcm1hbGl6ZShmaWxlKSxcbiAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICBsaW5lOiByYW5nZS5zdGFydC5yb3csXG4gICAgICAgICAgY2g6IHJhbmdlLnN0YXJ0LmNvbHVtblxuICAgICAgICB9LFxuICAgICAgICBlbmQ6IHtcbiAgICAgICAgICBsaW5lOiByYW5nZS5lbmQucm93LFxuICAgICAgICAgIGNoOiByYW5nZS5lbmQuY29sdW1uXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZpbGVzKCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2ZpbGVzJ1xuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3QodHlwZSwgZGF0YSkge1xuXG4gICAgY29uc3QgcHJvbWlzZSA9IG1hbmFnZXIuc2VydmVyLnJlcXVlc3QodHlwZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuIl19