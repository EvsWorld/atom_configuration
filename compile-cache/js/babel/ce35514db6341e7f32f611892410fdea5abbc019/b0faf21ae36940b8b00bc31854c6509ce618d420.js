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

// Public: GrammarUtils.D - a module which assist the creation of D temporary files
'use babel';exports['default'] = {
  tempFilesDir: _path2['default'].join(_os2['default'].tmpdir(), 'atom_script_tempfiles'),

  // Public: Create a temporary file with the provided D code
  //
  // * `code`    A {String} containing some D code
  //
  // Returns the {String} filepath of the new file
  createTempFileWithCode: function createTempFileWithCode(code) {
    try {
      if (!_fs2['default'].existsSync(this.tempFilesDir)) {
        _fs2['default'].mkdirSync(this.tempFilesDir);
      }

      var tempFilePath = this.tempFilesDir + _path2['default'].sep + 'm' + _uuid2['default'].v1().split('-').join('_') + '.d';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL2QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBR2UsSUFBSTs7OztrQkFDSixJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7Ozs7QUFOdkIsV0FBVyxDQUFDLHFCQVNHO0FBQ2IsY0FBWSxFQUFFLGtCQUFLLElBQUksQ0FBQyxnQkFBRyxNQUFNLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQzs7Ozs7OztBQU83RCx3QkFBc0IsRUFBQSxnQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBSTtBQUNGLFVBQUksQ0FBQyxnQkFBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQUUsd0JBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUFFOztBQUUzRSxVQUFNLFlBQVksR0FBTSxJQUFJLENBQUMsWUFBWSxHQUFHLGtCQUFLLEdBQUcsU0FBSSxrQkFBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFJLENBQUM7O0FBRTNGLFVBQU0sSUFBSSxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUMsc0JBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QixzQkFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5CLGFBQU8sWUFBWSxDQUFDO0tBQ3JCLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxZQUFNLElBQUksS0FBSywyQ0FBeUMsS0FBSyxPQUFJLENBQUM7S0FDbkU7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gUmVxdWlyZSBzb21lIGxpYnMgdXNlZCBmb3IgY3JlYXRpbmcgdGVtcG9yYXJ5IGZpbGVzXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cbi8vIFB1YmxpYzogR3JhbW1hclV0aWxzLkQgLSBhIG1vZHVsZSB3aGljaCBhc3Npc3QgdGhlIGNyZWF0aW9uIG9mIEQgdGVtcG9yYXJ5IGZpbGVzXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRlbXBGaWxlc0RpcjogcGF0aC5qb2luKG9zLnRtcGRpcigpLCAnYXRvbV9zY3JpcHRfdGVtcGZpbGVzJyksXG5cbiAgLy8gUHVibGljOiBDcmVhdGUgYSB0ZW1wb3JhcnkgZmlsZSB3aXRoIHRoZSBwcm92aWRlZCBEIGNvZGVcbiAgLy9cbiAgLy8gKiBgY29kZWAgICAgQSB7U3RyaW5nfSBjb250YWluaW5nIHNvbWUgRCBjb2RlXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIHtTdHJpbmd9IGZpbGVwYXRoIG9mIHRoZSBuZXcgZmlsZVxuICBjcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMudGVtcEZpbGVzRGlyKSkgeyBmcy5ta2RpclN5bmModGhpcy50ZW1wRmlsZXNEaXIpOyB9XG5cbiAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aCA9IGAke3RoaXMudGVtcEZpbGVzRGlyICsgcGF0aC5zZXB9bSR7dXVpZC52MSgpLnNwbGl0KCctJykuam9pbignXycpfS5kYDtcblxuICAgICAgY29uc3QgZmlsZSA9IGZzLm9wZW5TeW5jKHRlbXBGaWxlUGF0aCwgJ3cnKTtcbiAgICAgIGZzLndyaXRlU3luYyhmaWxlLCBjb2RlKTtcbiAgICAgIGZzLmNsb3NlU3luYyhmaWxlKTtcblxuICAgICAgcmV0dXJuIHRlbXBGaWxlUGF0aDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBjcmVhdGluZyB0ZW1wb3JhcnkgZmlsZSAoJHtlcnJvcn0pYCk7XG4gICAgfVxuICB9LFxufTtcbiJdfQ==