Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

// Public: GrammarUtils.Lisp - a module which exposes the ability to evaluate
// code
'use babel';

exports['default'] = {
  // Public: Split a string of code into an array of executable statements
  //
  // Returns an {Array} of executable statements.
  splitStatements: function splitStatements(code) {
    var _this = this;

    var iterator = function iterator(statements, currentCharacter) {
      if (!_this.parenDepth) _this.parenDepth = 0;
      if (currentCharacter === '(') {
        _this.parenDepth += 1;
        _this.inStatement = true;
      } else if (currentCharacter === ')') {
        _this.parenDepth -= 1;
      }

      if (!_this.statement) _this.statement = '';
      _this.statement += currentCharacter;

      if (_this.parenDepth === 0 && _this.inStatement) {
        _this.inStatement = false;
        statements.push(_this.statement.trim());
        _this.statement = '';
      }

      return statements;
    };

    var statements = _underscore2['default'].reduce(code.trim(), iterator, [], {});

    return statements;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9ncmFtbWFyLXV0aWxzL2xpc3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzBCQUVjLFlBQVk7Ozs7OztBQUYxQixXQUFXLENBQUM7O3FCQU1HOzs7O0FBSWIsaUJBQWUsRUFBQSx5QkFBQyxJQUFJLEVBQUU7OztBQUNwQixRQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUs7QUFDakQsVUFBSSxDQUFDLE1BQUssVUFBVSxFQUFFLE1BQUssVUFBVSxHQUFHLENBQUMsQ0FBQztBQUMxQyxVQUFJLGdCQUFnQixLQUFLLEdBQUcsRUFBRTtBQUM1QixjQUFLLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDckIsY0FBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO09BQ3pCLE1BQU0sSUFBSSxnQkFBZ0IsS0FBSyxHQUFHLEVBQUU7QUFDbkMsY0FBSyxVQUFVLElBQUksQ0FBQyxDQUFDO09BQ3RCOztBQUVELFVBQUksQ0FBQyxNQUFLLFNBQVMsRUFBRSxNQUFLLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDekMsWUFBSyxTQUFTLElBQUksZ0JBQWdCLENBQUM7O0FBRW5DLFVBQUksTUFBSyxVQUFVLEtBQUssQ0FBQyxJQUFJLE1BQUssV0FBVyxFQUFFO0FBQzdDLGNBQUssV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN6QixrQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLGNBQUssU0FBUyxHQUFHLEVBQUUsQ0FBQztPQUNyQjs7QUFFRCxhQUFPLFVBQVUsQ0FBQztLQUNuQixDQUFDOztBQUVGLFFBQU0sVUFBVSxHQUFHLHdCQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFM0QsV0FBTyxVQUFVLENBQUM7R0FDbkI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hci11dGlscy9saXNwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5MaXNwIC0gYSBtb2R1bGUgd2hpY2ggZXhwb3NlcyB0aGUgYWJpbGl0eSB0byBldmFsdWF0ZVxuLy8gY29kZVxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBQdWJsaWM6IFNwbGl0IGEgc3RyaW5nIG9mIGNvZGUgaW50byBhbiBhcnJheSBvZiBleGVjdXRhYmxlIHN0YXRlbWVudHNcbiAgLy9cbiAgLy8gUmV0dXJucyBhbiB7QXJyYXl9IG9mIGV4ZWN1dGFibGUgc3RhdGVtZW50cy5cbiAgc3BsaXRTdGF0ZW1lbnRzKGNvZGUpIHtcbiAgICBjb25zdCBpdGVyYXRvciA9IChzdGF0ZW1lbnRzLCBjdXJyZW50Q2hhcmFjdGVyKSA9PiB7XG4gICAgICBpZiAoIXRoaXMucGFyZW5EZXB0aCkgdGhpcy5wYXJlbkRlcHRoID0gMDtcbiAgICAgIGlmIChjdXJyZW50Q2hhcmFjdGVyID09PSAnKCcpIHtcbiAgICAgICAgdGhpcy5wYXJlbkRlcHRoICs9IDE7XG4gICAgICAgIHRoaXMuaW5TdGF0ZW1lbnQgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50Q2hhcmFjdGVyID09PSAnKScpIHtcbiAgICAgICAgdGhpcy5wYXJlbkRlcHRoIC09IDE7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zdGF0ZW1lbnQpIHRoaXMuc3RhdGVtZW50ID0gJyc7XG4gICAgICB0aGlzLnN0YXRlbWVudCArPSBjdXJyZW50Q2hhcmFjdGVyO1xuXG4gICAgICBpZiAodGhpcy5wYXJlbkRlcHRoID09PSAwICYmIHRoaXMuaW5TdGF0ZW1lbnQpIHtcbiAgICAgICAgdGhpcy5pblN0YXRlbWVudCA9IGZhbHNlO1xuICAgICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQudHJpbSgpKTtcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnQgPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gICAgfTtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBfLnJlZHVjZShjb2RlLnRyaW0oKSwgaXRlcmF0b3IsIFtdLCB7fSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfSxcbn07XG4iXX0=