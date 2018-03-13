Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// Public: GrammarUtils.Nim - a module which selects the right file to run for Nim projects
'use babel';

exports['default'] = {
  // Public: Find the right file to run
  //
  // * `file`    A {String} containing the current editor file
  //
  // Returns the {String} filepath of file to run

  projectDir: function projectDir(editorfile) {
    return _path2['default'].dirname(editorfile);
  },

  findNimProjectFile: function findNimProjectFile(editorfile) {
    if (_path2['default'].extname(editorfile) === '.nims') {
      // if we have an .nims file
      var tfile = editorfile.slice(0, -1);

      if (_fs2['default'].existsSync(tfile)) {
        // it has a corresponding .nim file. so thats a config file.
        // we run the .nim file instead.
        return _path2['default'].basename(tfile);
      }
      // it has no corresponding .nim file, it is a standalone script
      return _path2['default'].basename(editorfile);
    }

    // check if we are running on a file with config
    if (_fs2['default'].existsSync(editorfile + 's') || _fs2['default'].existsSync(editorfile + '.cfg') || _fs2['default'].existsSync(editorfile + 'cfg')) {
      return _path2['default'].basename(editorfile);
    }

    // assume we want to run a project
    // searching for the first file which has
    // a config file with the same name and
    // run this instead of the one in the editor
    // tab
    var filepath = _path2['default'].dirname(editorfile);
    var files = _fs2['default'].readdirSync(filepath);
    files.sort();
    for (var file of files) {
      var _name = filepath + '/' + file;
      if (_fs2['default'].statSync(_name).isFile()) {
        if (_path2['default'].extname(_name) === '.nims' || _path2['default'].extname(_name) === '.nimcgf' || _path2['default'].extname(_name) === '.cfg') {
          var tfile = _name.slice(0, -1);
          if (_fs2['default'].existsSync(tfile)) return _path2['default'].basename(tfile);
        }
      }
    }

    // just run what we got
    return _path2['default'].basename(editorfile);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL25pbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7OztBQUh2QixXQUFXLENBQUM7O3FCQU1HOzs7Ozs7O0FBT2IsWUFBVSxFQUFBLG9CQUFDLFVBQVUsRUFBRTtBQUNyQixXQUFPLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUNqQzs7QUFFRCxvQkFBa0IsRUFBQSw0QkFBQyxVQUFVLEVBQUU7QUFDN0IsUUFBSSxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssT0FBTyxFQUFFOztBQUV4QyxVQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0QyxVQUFJLGdCQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTs7O0FBR3hCLGVBQU8sa0JBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzdCOztBQUVELGFBQU8sa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2xDOzs7QUFHRCxRQUFJLGdCQUFHLFVBQVUsQ0FBSSxVQUFVLE9BQUksSUFDL0IsZ0JBQUcsVUFBVSxDQUFJLFVBQVUsVUFBTyxJQUNsQyxnQkFBRyxVQUFVLENBQUksVUFBVSxTQUFNLEVBQUU7QUFDckMsYUFBTyxrQkFBSyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDbEM7Ozs7Ozs7QUFPRCxRQUFNLFFBQVEsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUMsUUFBTSxLQUFLLEdBQUcsZ0JBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFNBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLFNBQUssSUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3hCLFVBQU0sS0FBSSxHQUFNLFFBQVEsU0FBSSxJQUFJLEFBQUUsQ0FBQztBQUNuQyxVQUFJLGdCQUFHLFFBQVEsQ0FBQyxLQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUM5QixZQUFJLGtCQUFLLE9BQU8sQ0FBQyxLQUFJLENBQUMsS0FBSyxPQUFPLElBQzlCLGtCQUFLLE9BQU8sQ0FBQyxLQUFJLENBQUMsS0FBSyxTQUFTLElBQ2hDLGtCQUFLLE9BQU8sQ0FBQyxLQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7QUFDakMsY0FBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxjQUFJLGdCQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLGtCQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2RDtPQUNGO0tBQ0Y7OztBQUdELFdBQU8sa0JBQUssUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQ2xDO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvbmltLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gUHVibGljOiBHcmFtbWFyVXRpbHMuTmltIC0gYSBtb2R1bGUgd2hpY2ggc2VsZWN0cyB0aGUgcmlnaHQgZmlsZSB0byBydW4gZm9yIE5pbSBwcm9qZWN0c1xuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBQdWJsaWM6IEZpbmQgdGhlIHJpZ2h0IGZpbGUgdG8gcnVuXG4gIC8vXG4gIC8vICogYGZpbGVgICAgIEEge1N0cmluZ30gY29udGFpbmluZyB0aGUgY3VycmVudCBlZGl0b3IgZmlsZVxuICAvL1xuICAvLyBSZXR1cm5zIHRoZSB7U3RyaW5nfSBmaWxlcGF0aCBvZiBmaWxlIHRvIHJ1blxuXG4gIHByb2plY3REaXIoZWRpdG9yZmlsZSkge1xuICAgIHJldHVybiBwYXRoLmRpcm5hbWUoZWRpdG9yZmlsZSk7XG4gIH0sXG5cbiAgZmluZE5pbVByb2plY3RGaWxlKGVkaXRvcmZpbGUpIHtcbiAgICBpZiAocGF0aC5leHRuYW1lKGVkaXRvcmZpbGUpID09PSAnLm5pbXMnKSB7XG4gICAgICAvLyBpZiB3ZSBoYXZlIGFuIC5uaW1zIGZpbGVcbiAgICAgIGNvbnN0IHRmaWxlID0gZWRpdG9yZmlsZS5zbGljZSgwLCAtMSk7XG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKHRmaWxlKSkge1xuICAgICAgICAvLyBpdCBoYXMgYSBjb3JyZXNwb25kaW5nIC5uaW0gZmlsZS4gc28gdGhhdHMgYSBjb25maWcgZmlsZS5cbiAgICAgICAgLy8gd2UgcnVuIHRoZSAubmltIGZpbGUgaW5zdGVhZC5cbiAgICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUodGZpbGUpO1xuICAgICAgfVxuICAgICAgLy8gaXQgaGFzIG5vIGNvcnJlc3BvbmRpbmcgLm5pbSBmaWxlLCBpdCBpcyBhIHN0YW5kYWxvbmUgc2NyaXB0XG4gICAgICByZXR1cm4gcGF0aC5iYXNlbmFtZShlZGl0b3JmaWxlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB3ZSBhcmUgcnVubmluZyBvbiBhIGZpbGUgd2l0aCBjb25maWdcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhgJHtlZGl0b3JmaWxlfXNgKSB8fFxuICAgICAgICBmcy5leGlzdHNTeW5jKGAke2VkaXRvcmZpbGV9LmNmZ2ApIHx8XG4gICAgICAgIGZzLmV4aXN0c1N5bmMoYCR7ZWRpdG9yZmlsZX1jZmdgKSkge1xuICAgICAgcmV0dXJuIHBhdGguYmFzZW5hbWUoZWRpdG9yZmlsZSk7XG4gICAgfVxuXG4gICAgLy8gYXNzdW1lIHdlIHdhbnQgdG8gcnVuIGEgcHJvamVjdFxuICAgIC8vIHNlYXJjaGluZyBmb3IgdGhlIGZpcnN0IGZpbGUgd2hpY2ggaGFzXG4gICAgLy8gYSBjb25maWcgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgYW5kXG4gICAgLy8gcnVuIHRoaXMgaW5zdGVhZCBvZiB0aGUgb25lIGluIHRoZSBlZGl0b3JcbiAgICAvLyB0YWJcbiAgICBjb25zdCBmaWxlcGF0aCA9IHBhdGguZGlybmFtZShlZGl0b3JmaWxlKTtcbiAgICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKGZpbGVwYXRoKTtcbiAgICBmaWxlcy5zb3J0KCk7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCBuYW1lID0gYCR7ZmlsZXBhdGh9LyR7ZmlsZX1gO1xuICAgICAgaWYgKGZzLnN0YXRTeW5jKG5hbWUpLmlzRmlsZSgpKSB7XG4gICAgICAgIGlmIChwYXRoLmV4dG5hbWUobmFtZSkgPT09ICcubmltcycgfHxcbiAgICAgICAgICAgIHBhdGguZXh0bmFtZShuYW1lKSA9PT0gJy5uaW1jZ2YnIHx8XG4gICAgICAgICAgICBwYXRoLmV4dG5hbWUobmFtZSkgPT09ICcuY2ZnJykge1xuICAgICAgICAgIGNvbnN0IHRmaWxlID0gbmFtZS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmModGZpbGUpKSByZXR1cm4gcGF0aC5iYXNlbmFtZSh0ZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBqdXN0IHJ1biB3aGF0IHdlIGdvdFxuICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKGVkaXRvcmZpbGUpO1xuICB9LFxufTtcbiJdfQ==