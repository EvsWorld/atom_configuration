Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _throw = require('./throw');

var _throw2 = _interopRequireDefault(_throw);

'use babel';

var isValidPoint = function isValidPoint(textBuffer, line, column) {
  // Clip the given point to a valid one
  var validPoint = textBuffer.clipPosition([line, column]);
  // Compare to original
  return validPoint.isEqual([line, column]);
};

exports.isValidPoint = isValidPoint;
var throwIfInvalidPoint = function throwIfInvalidPoint(textBuffer, line, column) {
  return (0, _throw2['default'])(line + ':' + column + ' isn\'t a valid point!', isValidPoint(textBuffer, line, column));
};

exports.throwIfInvalidPoint = throwIfInvalidPoint;
var hasValidScope = function hasValidScope(editor, validScopes) {
  return editor.getCursors().some(function (cursor) {
    return cursor.getScopeDescriptor().getScopesArray().some(function (scope) {
      return validScopes.includes(scope);
    });
  });
};
exports.hasValidScope = hasValidScope;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvdmFsaWRhdGUvZWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztxQkFFd0IsU0FBUzs7OztBQUZqQyxXQUFXLENBQUE7O0FBSUosSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUs7O0FBRXhELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTs7QUFFMUQsU0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7Q0FDMUMsQ0FBQTs7O0FBRU0sSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU07U0FDMUQsd0JBQ0ssSUFBSSxTQUFJLE1BQU0sNkJBQ2pCLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUN2QztDQUFBLENBQUE7OztBQUVJLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxNQUFNLEVBQUUsV0FBVztTQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDdEUsSUFBSSxDQUFDLFVBQUEsTUFBTTtXQUFJLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUN4QyxjQUFjLEVBQUUsQ0FDaEIsSUFBSSxDQUFDLFVBQUEsS0FBSzthQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0tBQUEsQ0FBQztHQUFBLENBQUM7Q0FBQSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvdmFsaWRhdGUvZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHRocm93SWZGYWlsIGZyb20gJy4vdGhyb3cnXG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkUG9pbnQgPSAodGV4dEJ1ZmZlciwgbGluZSwgY29sdW1uKSA9PiB7XG4gIC8vIENsaXAgdGhlIGdpdmVuIHBvaW50IHRvIGEgdmFsaWQgb25lXG4gIGNvbnN0IHZhbGlkUG9pbnQgPSB0ZXh0QnVmZmVyLmNsaXBQb3NpdGlvbihbbGluZSwgY29sdW1uXSlcbiAgLy8gQ29tcGFyZSB0byBvcmlnaW5hbFxuICByZXR1cm4gdmFsaWRQb2ludC5pc0VxdWFsKFtsaW5lLCBjb2x1bW5dKVxufVxuXG5leHBvcnQgY29uc3QgdGhyb3dJZkludmFsaWRQb2ludCA9ICh0ZXh0QnVmZmVyLCBsaW5lLCBjb2x1bW4pID0+XG4gIHRocm93SWZGYWlsKFxuICAgIGAke2xpbmV9OiR7Y29sdW1ufSBpc24ndCBhIHZhbGlkIHBvaW50IWAsXG4gICAgaXNWYWxpZFBvaW50KHRleHRCdWZmZXIsIGxpbmUsIGNvbHVtbilcbiAgKVxuXG5leHBvcnQgY29uc3QgaGFzVmFsaWRTY29wZSA9IChlZGl0b3IsIHZhbGlkU2NvcGVzKSA9PiBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gIC5zb21lKGN1cnNvciA9PiBjdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKClcbiAgICAuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIC5zb21lKHNjb3BlID0+IHZhbGlkU2NvcGVzLmluY2x1ZGVzKHNjb3BlKSkpXG4iXX0=