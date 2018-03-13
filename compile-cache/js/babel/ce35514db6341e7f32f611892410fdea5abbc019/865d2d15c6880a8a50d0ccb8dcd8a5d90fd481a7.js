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

  // Public: Returns cmd or bash, depending on the current OS
  command: _os2['default'].platform() === 'win32' ? 'cmd' : 'bash',

  // Public: Format args for cmd or bash, depending on the current OS
  formatArgs: function formatArgs(command) {
    if (_os2['default'].platform() === 'win32') {
      return ['/c ' + command.replace(/['"]/g, '')];
    }
    return ['-c', command];
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

  // Public: Get the D helper object
  //
  // Returns an {Object} which assists in creating temp files containing D code
  D: require('./grammar-utils/d')
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUdlLElBQUk7Ozs7a0JBQ0osSUFBSTs7OztvQkFDRixNQUFNOzs7O29CQUNOLE1BQU07Ozs7O0FBTnZCLFdBQVcsQ0FBQyxxQkFTRztBQUNiLGNBQVksRUFBRSxrQkFBSyxJQUFJLENBQUMsZ0JBQUcsTUFBTSxFQUFFLEVBQUUsdUJBQXVCLENBQUM7Ozs7Ozs7QUFPN0Qsd0JBQXNCLEVBQUEsZ0NBQUMsSUFBSSxFQUFrQjtRQUFoQixTQUFTLHlEQUFHLEVBQUU7O0FBQ3pDLFFBQUk7QUFDRixVQUFJLENBQUMsZ0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNyQyx3QkFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQ2pDOztBQUVELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsa0JBQUssR0FBRyxHQUFHLGtCQUFLLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQzs7QUFFMUUsVUFBTSxJQUFJLEdBQUcsZ0JBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM1QyxzQkFBRyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3pCLHNCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbkIsYUFBTyxZQUFZLENBQUM7S0FDckIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFlBQU0sSUFBSSxLQUFLLDJDQUF5QyxLQUFLLE9BQUksQ0FBQztLQUNuRTtHQUNGOzs7O0FBSUQsaUJBQWUsRUFBQSwyQkFBRzs7O0FBQ2hCLFFBQUk7QUFDRixVQUFJLGdCQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDcEMsWUFBTSxLQUFLLEdBQUcsZ0JBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRCxZQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7bUJBQUksZ0JBQUcsVUFBVSxDQUFDLE1BQUssWUFBWSxHQUFHLGtCQUFLLEdBQUcsR0FBRyxJQUFJLENBQUM7V0FBQSxDQUFDLENBQUM7U0FDM0U7QUFDRCxlQUFPLGdCQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDeEM7QUFDRCxhQUFPLElBQUksQ0FBQztLQUNiLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxZQUFNLElBQUksS0FBSyw0Q0FBMEMsS0FBSyxPQUFJLENBQUM7S0FDcEU7R0FDRjs7O0FBR0QsU0FBTyxFQUFFLGdCQUFHLFFBQVEsRUFBRSxLQUFLLE9BQU8sR0FBRyxLQUFLLEdBQUcsTUFBTTs7O0FBR25ELFlBQVUsRUFBQSxvQkFBQyxPQUFPLEVBQUU7QUFDbEIsUUFBSSxnQkFBRyxRQUFRLEVBQUUsS0FBSyxPQUFPLEVBQUU7QUFDN0IsYUFBTyxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFHLENBQUM7S0FDL0M7QUFDRCxXQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3hCOzs7Ozs7QUFNRCxNQUFJLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDOzs7OztBQUtyQyxNQUFJLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDOzs7OztBQUtyQyxRQUFNLEVBQUUsT0FBTyxDQUFDLHdCQUF3QixDQUFDOzs7OztBQUt6QyxpQkFBZSxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQzs7Ozs7QUFLNUQsR0FBQyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7Ozs7QUFLL0IsTUFBSSxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQzs7Ozs7QUFLckMsS0FBRyxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7QUFLbkMsS0FBRyxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzs7Ozs7QUFLbkMsR0FBQyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztDQUNoQyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBSZXF1aXJlIHNvbWUgbGlicyB1c2VkIGZvciBjcmVhdGluZyB0ZW1wb3JhcnkgZmlsZXNcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcblxuLy8gUHVibGljOiBHcmFtbWFyVXRpbHMgLSB1dGlsaXRpZXMgZm9yIGRldGVybWluaW5nIGhvdyB0byBydW4gY29kZVxuZXhwb3J0IGRlZmF1bHQge1xuICB0ZW1wRmlsZXNEaXI6IHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2F0b21fc2NyaXB0X3RlbXBmaWxlcycpLFxuXG4gIC8vIFB1YmxpYzogQ3JlYXRlIGEgdGVtcG9yYXJ5IGZpbGUgd2l0aCB0aGUgcHJvdmlkZWQgY29kZVxuICAvL1xuICAvLyAqIGBjb2RlYCAgICBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgc29tZSBjb2RlXG4gIC8vXG4gIC8vIFJldHVybnMgdGhlIHtTdHJpbmd9IGZpbGVwYXRoIG9mIHRoZSBuZXcgZmlsZVxuICBjcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsIGV4dGVuc2lvbiA9ICcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyh0aGlzLnRlbXBGaWxlc0RpcikpIHtcbiAgICAgICAgZnMubWtkaXJTeW5jKHRoaXMudGVtcEZpbGVzRGlyKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGVtcEZpbGVQYXRoID0gdGhpcy50ZW1wRmlsZXNEaXIgKyBwYXRoLnNlcCArIHV1aWQudjEoKSArIGV4dGVuc2lvbjtcblxuICAgICAgY29uc3QgZmlsZSA9IGZzLm9wZW5TeW5jKHRlbXBGaWxlUGF0aCwgJ3cnKTtcbiAgICAgIGZzLndyaXRlU3luYyhmaWxlLCBjb2RlKTtcbiAgICAgIGZzLmNsb3NlU3luYyhmaWxlKTtcblxuICAgICAgcmV0dXJuIHRlbXBGaWxlUGF0aDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBjcmVhdGluZyB0ZW1wb3JhcnkgZmlsZSAoJHtlcnJvcn0pYCk7XG4gICAgfVxuICB9LFxuXG4gIC8vIFB1YmxpYzogRGVsZXRlIGFsbCB0ZW1wb3JhcnkgZmlsZXMgYW5kIHRoZSBkaXJlY3RvcnkgY3JlYXRlZCBieVxuICAvLyB7R3JhbW1hclV0aWxzOjpjcmVhdGVUZW1wRmlsZVdpdGhDb2RlfVxuICBkZWxldGVUZW1wRmlsZXMoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHRoaXMudGVtcEZpbGVzRGlyKSkge1xuICAgICAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHRoaXMudGVtcEZpbGVzRGlyKTtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiBmcy51bmxpbmtTeW5jKHRoaXMudGVtcEZpbGVzRGlyICsgcGF0aC5zZXAgKyBmaWxlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZzLnJtZGlyU3luYyh0aGlzLnRlbXBGaWxlc0Rpcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB3aGlsZSBkZWxldGluZyB0ZW1wb3JhcnkgZmlsZXMgKCR7ZXJyb3J9KWApO1xuICAgIH1cbiAgfSxcblxuICAvLyBQdWJsaWM6IFJldHVybnMgY21kIG9yIGJhc2gsIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBPU1xuICBjb21tYW5kOiBvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInID8gJ2NtZCcgOiAnYmFzaCcsXG5cbiAgLy8gUHVibGljOiBGb3JtYXQgYXJncyBmb3IgY21kIG9yIGJhc2gsIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBPU1xuICBmb3JtYXRBcmdzKGNvbW1hbmQpIHtcbiAgICBpZiAob3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJykge1xuICAgICAgcmV0dXJuIFtgL2MgJHtjb21tYW5kLnJlcGxhY2UoL1snXCJdL2csICcnKX1gXTtcbiAgICB9XG4gICAgcmV0dXJuIFsnLWMnLCBjb21tYW5kXTtcbiAgfSxcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBnbG9iYWwtcmVxdWlyZSAqL1xuICAvLyBQdWJsaWM6IEdldCB0aGUgSmF2YSBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiBwcmVwYXJpbmcgamF2YSArIGphdmFjIHN0YXRlbWVudHNcbiAgSmF2YTogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL2phdmEnKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgTGlzcCBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiBzcGxpdHRpbmcgTGlzcCBzdGF0ZW1lbnRzLlxuICBMaXNwOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvbGlzcCcpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBNQVRMQUIgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gc3BsaXR0aW5nIE1BVExBQiBzdGF0ZW1lbnRzLlxuICBNQVRMQUI6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9tYXRsYWInKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgT3BlcmF0aW5nU3lzdGVtIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIHdyaXRpbmcgT1MgZGVwZW5kZW50IGNvZGUuXG4gIE9wZXJhdGluZ1N5c3RlbTogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL29wZXJhdGluZy1zeXN0ZW0nKSxcblxuICAvLyBQdWJsaWM6IEdldCB0aGUgUiBoZWxwZXIgb2JqZWN0XG4gIC8vXG4gIC8vIFJldHVybnMgYW4ge09iamVjdH0gd2hpY2ggYXNzaXN0cyBpbiBjcmVhdGluZyB0ZW1wIGZpbGVzIGNvbnRhaW5pbmcgUiBjb2RlXG4gIFI6IHJlcXVpcmUoJy4vZ3JhbW1hci11dGlscy9SJyksXG5cbiAgLy8gUHVibGljOiBHZXQgdGhlIFBlcmwgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gY3JlYXRpbmcgdGVtcCBmaWxlcyBjb250YWluaW5nIFBlcmwgY29kZVxuICBQZXJsOiByZXF1aXJlKCcuL2dyYW1tYXItdXRpbHMvcGVybCcpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBQSFAgaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gY3JlYXRpbmcgdGVtcCBmaWxlcyBjb250YWluaW5nIFBIUCBjb2RlXG4gIFBIUDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL3BocCcpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBOaW0gaGVscGVyIG9iamVjdFxuICAvL1xuICAvLyBSZXR1cm5zIGFuIHtPYmplY3R9IHdoaWNoIGFzc2lzdHMgaW4gc2VsZWN0aW5nIHRoZSByaWdodCBwcm9qZWN0IGZpbGUgZm9yIE5pbSBjb2RlXG4gIE5pbTogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL25pbScpLFxuXG4gIC8vIFB1YmxpYzogR2V0IHRoZSBEIGhlbHBlciBvYmplY3RcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7T2JqZWN0fSB3aGljaCBhc3Npc3RzIGluIGNyZWF0aW5nIHRlbXAgZmlsZXMgY29udGFpbmluZyBEIGNvZGVcbiAgRDogcmVxdWlyZSgnLi9ncmFtbWFyLXV0aWxzL2QnKSxcbn07XG4iXX0=