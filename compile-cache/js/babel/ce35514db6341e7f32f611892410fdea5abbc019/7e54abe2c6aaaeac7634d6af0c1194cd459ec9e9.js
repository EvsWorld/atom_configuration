Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Require some libs used for creating temporary files

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

// Public: GrammarUtils.MATLAB - a module which assist the creation of MATLAB temporary files
'use babel';exports['default'] = {
  tempFilesDir: _path2['default'].join(_os2['default'].tmpdir(), 'atom_script_tempfiles'),

  // Public: Create a temporary file with the provided MATLAB code
  //
  // * `code`    A {String} containing some MATLAB code
  //
  // Returns the {String} filepath of the new file
  createTempFileWithCode: function createTempFileWithCode(code) {
    try {
      if (!_fs2['default'].existsSync(this.tempFilesDir)) {
        _fs2['default'].mkdirSync(this.tempFilesDir);
      }

      var tempFilePath = this.tempFilesDir + _path2['default'].sep + 'm' + _uuid2['default'].v1().split('-').join('_') + '.m';

      var file = _fs2['default'].openSync(tempFilePath, 'w');
      _fs2['default'].writeSync(file, code);
      _fs2['default'].closeSync(file);

      return tempFilePath;
    } catch (error) {
      throw new Error('Error while creating temporary file (' + error + ')');
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL21hdGxhYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQkFHZSxJQUFJOzs7O2tCQUNKLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDTixNQUFNOzs7OztBQU52QixXQUFXLENBQUMscUJBU0c7QUFDYixjQUFZLEVBQUUsa0JBQUssSUFBSSxDQUFDLGdCQUFHLE1BQU0sRUFBRSxFQUFFLHVCQUF1QixDQUFDOzs7Ozs7O0FBTzdELHdCQUFzQixFQUFBLGdDQUFDLElBQUksRUFBRTtBQUMzQixRQUFJO0FBQ0YsVUFBSSxDQUFDLGdCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFBRSx3QkFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQUU7O0FBRTNFLFVBQU0sWUFBWSxHQUFNLElBQUksQ0FBQyxZQUFZLEdBQUcsa0JBQUssR0FBRyxTQUFJLGtCQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQUksQ0FBQzs7QUFFM0YsVUFBTSxJQUFJLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxzQkFBRyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLHNCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbkIsYUFBTyxZQUFZLENBQUM7S0FDckIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFlBQU0sSUFBSSxLQUFLLDJDQUF5QyxLQUFLLE9BQUksQ0FBQztLQUNuRTtHQUNGO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvbWF0bGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIFJlcXVpcmUgc29tZSBsaWJzIHVzZWQgZm9yIGNyZWF0aW5nIHRlbXBvcmFyeSBmaWxlc1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5NQVRMQUIgLSBhIG1vZHVsZSB3aGljaCBhc3Npc3QgdGhlIGNyZWF0aW9uIG9mIE1BVExBQiB0ZW1wb3JhcnkgZmlsZXNcbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVtcEZpbGVzRGlyOiBwYXRoLmpvaW4ob3MudG1wZGlyKCksICdhdG9tX3NjcmlwdF90ZW1wZmlsZXMnKSxcblxuICAvLyBQdWJsaWM6IENyZWF0ZSBhIHRlbXBvcmFyeSBmaWxlIHdpdGggdGhlIHByb3ZpZGVkIE1BVExBQiBjb2RlXG4gIC8vXG4gIC8vICogYGNvZGVgICAgIEEge1N0cmluZ30gY29udGFpbmluZyBzb21lIE1BVExBQiBjb2RlXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIHtTdHJpbmd9IGZpbGVwYXRoIG9mIHRoZSBuZXcgZmlsZVxuICBjcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMudGVtcEZpbGVzRGlyKSkgeyBmcy5ta2RpclN5bmModGhpcy50ZW1wRmlsZXNEaXIpOyB9XG5cbiAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke3RoaXMudGVtcEZpbGVzRGlyICsgcGF0aC5zZXB9bSR7dXVpZC52MSgpLnNwbGl0KCctJykuam9pbignXycpfS5tYDtcblxuICAgICAgY29uc3QgZmlsZSA9IGZzLm9wZW5TeW5jKHRlbXBGaWxlUGF0aCwgJ3cnKTtcbiAgICAgIGZzLndyaXRlU3luYyhmaWxlLCBjb2RlKTtcbiAgICAgIGZzLmNsb3NlU3luYyhmaWxlKTtcblxuICAgICAgcmV0dXJuIHRlbXBGaWxlUGF0aDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBjcmVhdGluZyB0ZW1wb3JhcnkgZmlsZSAoJHtlcnJvcn0pYCk7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==