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

// Public: GrammarUtils - utilities for determining how to run code
'use babel';exports['default'] = {
  tempFilesDir: _path2['default'].join(_os2['default'].tmpdir(), 'atom_script_tempfiles'),

  // Public: Create a temporary file with the provided code
  //
  // * `code`    A {String} containing some code
  //
  // Returns the {String} filepath of the new file
  createTempFileWithCode: function createTempFileWithCode(code) {
    var extension = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    try {
      if (!_fs2['default'].existsSync(this.tempFilesDir)) {
        _fs2['default'].mkdirSync(this.tempFilesDir);
      }

      var tempFilePath = this.tempFilesDir + _path2['default'].sep + _uuid2['default'].v1() + extension;

      var file = _fs2['default'].openSync(tempFilePath, 'w');
      _fs2['default'].writeSync(file, code);
      _fs2['default'].closeSync(file);

      return tempFilePath;
    } catch (error) {
      throw new Error('Error while creating temporary file (' + error + ')');
    }
  },

  // Public: Delete all temporary files and the directory created by
  // {GrammarUtils::createTempFileWithCode}
  deleteTempFiles: function deleteTempFiles() {
    var _this = this;

    try {
      if (_fs2['default'].existsSync(this.tempFilesDir)) {
        var files = _fs2['default'].readdirSync(this.tempFilesDir);
        if (files.length) {
          files.forEach(function (file) {
            return _fs2['default'].unlinkSync(_this.tempFilesDir + _path2['default'].sep + file);
          });
        }
        return _fs2['default'].rmdirSync(this.tempFilesDir);
      }
      return null;
    } catch (error) {
      throw new Error('Error while deleting temporary files (' + error + ')');
    }
  },

  /* eslint-disable global-require */
  // Public: Get the Java helper object
  //
  // Returns an {Object} which assists in preparing java + javac statements
  Java: require('./grammar-utils/java'),

  // Public: Get the Lisp helper object
  //
  // Returns an {Object} which assists in splitting Lisp statements.
  Lisp: require('./grammar-utils/lisp'),

  // Public: Get the MATLAB helper object
  //
  // Returns an {Object} which assists in splitting MATLAB statements.
  MATLAB: require('./grammar-utils/matlab'),

  // Public: Get the OperatingSystem helper object
  //
  // Returns an {Object} which assists in writing OS dependent code.
  OperatingSystem: require('./grammar-utils/operating-system'),

  // Public: Get the R helper object
  //
  // Returns an {Object} which assists in creating temp files containing R code
  R: require('./grammar-utils/R'),

  // Public: Get the Perl helper object
  //
  // Returns an {Object} which assists in creating temp files containing Perl code
  Perl: require('./grammar-utils/perl'),

  // Public: Get the PHP helper object
  //
  // Returns an {Object} which assists in creating temp files containing PHP code
  PHP: require('./grammar-utils/php'),

  // Public: Get the Nim helper object
  //
  // Returns an {Object} which assists in selecting the right project file for Nim code
  Nim: require('./grammar-utils/nim'),

  // Public: Predetermine CoffeeScript compiler
  //
  // Returns an [array] of appropriate command line flags for the active CS compiler.
  CScompiler: require('./grammar-utils/coffee-script-compiler'),

  // Public: Get the D helper object
  //
  // Returns an {Object} which assists in creating temp files containing D code
  D: require('./grammar-utils/d')
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUdlLElBQUk7Ozs7a0JBQ0osSUFBSTs7OztvQkFDRixNQUFNOzs7O29CQUNOLE1BQU07Ozs7O0FBTnZCLFdBQVcsQ0FBQyxxQkFTRztBQUNiLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsZ0JBQUcsTUFBTSxFQUFFLEVBQUUsdUJBQXVCLENBQUM7Ozs7Ozs7QUFPN0Qsd0JBQXNCLEVBQUEsZ0NBQUMsSUFBSSxFQUFrQjtRQUFoQixTQUFTLHlEQUFHLEVBQUU7O0FBQ3pDLFFBQUk7QUFDRixVQUFJLENBQUMsZ0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNyQyx3QkFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQ2pDOztBQUVELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsa0JBQUssR0FBRyxHQUFHLGtCQUFLLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQzs7QUFFMUUsVUFBTSxJQUFJLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxzQkFBRyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLHNCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbkIsYUFBTyxZQUFZLENBQUM7S0FDckIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFlBQU0sSUFBSSxLQUFLLDJDQUF5QyxLQUFLLE9BQUksQ0FBQztLQUNuRTtHQUNGOzs7O0FBSUQsaUJBQWUsRUFBQSwyQkFBRzs7O0FBQ2hCLFFBQUk7QUFDRixVQUFJLGdCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDcEMsWUFBTSxLQUFLLEdBQUcsZ0JBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRCxZQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7bUJBQUksZ0JBQUcsVUFBVSxDQUFDLE1BQUssWUFBWSxHQUFHLGtCQUFLLEdBQUcsR0FBRyxJQUFJLENBQUM7V0FBQSxDQUFDLENBQUM7U0FDM0U7QUFDRCxlQUFPLGdCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDeEM7QUFDRCxhQUFPLElBQUksQ0FBQztLQUNiLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxZQUFNLElBQUksS0FBSyw0Q0FBMEMsS0FBSyxPQUFJLENBQUM7S0FDcEU7R0FDRjs7Ozs7O0FBTUQsTUFBSSxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7Ozs7QUFLckMsTUFBSSxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7Ozs7QUFLckMsUUFBTSxFQUFFLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQzs7Ozs7QUFLekMsaUJBQWUsRUFBRSxPQUFPLENBQUMsa0NBQWtDLENBQUM7Ozs7O0FBSzVELEdBQUMsRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUM7Ozs7O0FBSy9CLE1BQUksRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUM7Ozs7O0FBS3JDLEtBQUcsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7Ozs7O0FBS25DLEtBQUcsRUFBRSxPQUFPLENBQUMscUJBQXFCLENBQUM7Ozs7O0FBS25DLFlBQVUsRUFBRSxPQUFPLENBQUMsd0NBQXdDLENBQUM7Ozs7O0FBSzdELEdBQUMsRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUM7Q0FDaEMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gUmVxdWlyZSBzb21lIGxpYnMgdXNlZCBmb3IgY3JlYXRpbmcgdGVtcG9yYXJ5IGZpbGVzXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cbi8vIFB1YmxpYzogR3JhbW1hclV0aWxzIC0gdXRpbGl0aWVzIGZvciBkZXRlcm1pbmluZyBob3cgdG8gcnVuIGNvZGVcbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVtcEZpbGVzRGlyOiBwYXRoLmpvaW4ob3MudG1wZGlyKCksICdhdG9tX3NjcmlwdF90ZW1wZmlsZXMnKSxcblxuICAvLyBQdWJsaWM6IENyZWF0ZSBhIHRlbXBvcmFyeSBmaWxlIHdpdGggdGhlIHByb3ZpZGVkIGNvZGVcbiAgLy9cbiAgLy8gKiBgY29kZWAgICAgQSB7U3RyaW5nfSBjb250YWluaW5nIHNvbWUgY29kZVxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSB7U3RyaW5nfSBmaWxlcGF0aCBvZiB0aGUgbmV3IGZpbGVcbiAgY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlLCBleHRlbnNpb24gPSAnJykge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmModGhpcy50ZW1wRmlsZXNEaXIpKSB7XG4gICAgICAgIGZzLm1rZGlyU3luYyh0aGlzLnRlbXBGaWxlc0Rpcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRlbXBGaWxlUGF0aCA9IHRoaXMudGVtcEZpbGVzRGlyICsgcGF0aC5zZXAgKyB1dWlkLnYxKCkgKyBleHRlbnNpb247XG5cbiAgICAgIGNvbnN0IGZpbGUgPSBmcy5vcGVuU3luYyh0ZW1wRmlsZVBhdGgsICd3Jyk7XG4gICAgICBmcy53cml0ZVN5bmMoZmlsZSwgY29kZSk7XG4gICAgICBmcy5jbG9zZVN5bmMoZmlsZSk7XG5cbiAgICAgIHJldHVybiB0ZW1wRmlsZVBhdGg7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgY3JlYXRpbmcgdGVtcG9yYXJ5IGZpbGUgKCR7ZXJyb3J9KWApO1xuICAgIH1cbiAgfSxcblxuICAvLyBQdWJsaWM6IERlbGV0ZSBhbGwgdGVtcG9yYXJ5IGZpbGVzIGFuZCB0aGUgZGlyZWN0b3J5IGNyZWF0ZWQgYnlcbiAgLy8ge0dyYW1tYXJVdGlsczo6Y3JlYXRlVGVtcEZpbGVXaXRoQ29kZX1cbiAgZGVsZXRlVGVtcEZpbGVzKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLnRlbXBGaWxlc0RpcikpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyh0aGlzLnRlbXBGaWxlc0Rpcik7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4gZnMudW5saW5rU3luYyh0aGlzLnRlbXBGaWxlc0RpciArIHBhdGguc2VwICsgZmlsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmcy5ybWRpclN5bmModGhpcy50ZW1wRmlsZXNEaXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igd2hpbGUgZGVsZXRpbmcgdGVtcG9yYXJ5IGZpbGVzICgke2Vycm9yfSlgKTtcbiAgICB9XG4gIH0sXG5cbiAgLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cbiAgLy8gUHVibGljOiBHZXQgdGhlIEphdmEgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gcHJlcGFyaW5nIGphdmEgKyBqYXZhYyBzdGF0ZW1lbnRzXG4gIEphdmE6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9qYXZhJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIExpc3AgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gc3BsaXR0aW5nIExpc3Agc3RhdGVtZW50cy5cbiAgTGlzcDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL2xpc3AnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgTUFUTEFCIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIHNwbGl0dGluZyBNQVRMQUIgc3RhdGVtZW50cy5cbiAgTUFUTEFCOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvbWF0bGFiJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIE9wZXJhdGluZ1N5c3RlbSBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiB3cml0aW5nIE9TIGRlcGVuZGVudCBjb2RlLlxuICBPcGVyYXRpbmdTeXN0ZW06IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9vcGVyYXRpbmctc3lzdGVtJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIFIgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gY3JlYXRpbmcgdGVtcCBmaWxlcyBjb250YWluaW5nIFIgY29kZVxuICBSOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvUicpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBQZXJsIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIGNyZWF0aW5nIHRlbXAgZmlsZXMgY29udGFpbmluZyBQZXJsIGNvZGVcbiAgUGVybDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL3BlcmwnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgUEhQIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIGNyZWF0aW5nIHRlbXAgZmlsZXMgY29udGFpbmluZyBQSFAgY29kZVxuICBQSFA6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9waHAnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgTmltIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIHNlbGVjdGluZyB0aGUgcmlnaHQgcHJvamVjdCBmaWxlIGZvciBOaW0gY29kZVxuICBOaW06IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9uaW0nKSxcblxuICAvLyBQdWJsaWM6IFByZWRldGVybWluZSBDb2ZmZWVTY3JpcHQgY29tcGlsZXJcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiBbYXJyYXldIG9mIGFwcHJvcHJpYXRlIGNvbW1hbmQgbGluZSBmbGFncyBmb3IgdGhlIGFjdGl2ZSBDUyBjb21waWxlci5cbiAgQ1Njb21waWxlcjogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL2NvZmZlZS1zY3JpcHQtY29tcGlsZXInKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgRCBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiBjcmVhdGluZyB0ZW1wIGZpbGVzIGNvbnRhaW5pbmcgRCBjb2RlXG4gIEQ6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9kJyksXG59O1xuIl19