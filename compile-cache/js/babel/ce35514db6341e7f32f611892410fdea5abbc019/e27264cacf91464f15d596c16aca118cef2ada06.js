'use babel';

/* eslint-disable no-multi-str, prefer-const, func-names */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var linkPaths = undefined;
var regex = new RegExp('((?:\\w:)?/?(?:[-\\w.]+/)*[-\\w.]+):(\\d+)(?::(\\d+))?', 'g');
// ((?:\w:)?/?            # Prefix of the path either '/' or 'C:/' (optional)
// (?:[-\w.]+/)*[-\w.]+)  # The path of the file some/file/path.ext
// :(\d+)                 # Line number prefixed with a colon
// (?::(\d+))?            # Column number prefixed with a colon (optional)

var template = '<a class="-linked-path" data-path="$1" data-line="$2" data-column="$3">$&</a>';

exports['default'] = linkPaths = function (lines) {
  return lines.replace(regex, template);
};

linkPaths.listen = function (parentView) {
  return parentView.on('click', '.-linked-path', function () {
    var el = this;
    var _el$dataset = el.dataset;
    var path = _el$dataset.path;
    var line = _el$dataset.line;
    var column = _el$dataset.column;

    line = Number(line) - 1;
    // column number is optional
    column = column ? Number(column) - 1 : 0;

    atom.workspace.open(path, {
      initialLine: line,
      initialColumn: column
    });
  });
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9saW5rLXBhdGhzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7O0FBR1osSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNeEYsSUFBTSxRQUFRLEdBQUcsK0VBQStFLENBQUM7O3FCQUVsRixTQUFTLEdBQUcsVUFBQSxLQUFLO1NBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO0NBQUE7O0FBRWxFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBQSxVQUFVO1NBQzNCLFVBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZO0FBQ2xELFFBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztzQkFDYSxFQUFFLENBQUMsT0FBTztRQUFqQyxJQUFJLGVBQUosSUFBSTtRQUFFLElBQUksZUFBSixJQUFJO1FBQUUsTUFBTSxlQUFOLE1BQU07O0FBQ3hCLFFBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV4QixVQUFNLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV6QyxRQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDeEIsaUJBQVcsRUFBRSxJQUFJO0FBQ2pCLG1CQUFhLEVBQUUsTUFBTTtLQUN0QixDQUFDLENBQUM7R0FDSixDQUFDO0NBQUEsQ0FBQyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvbGluay1wYXRocy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1tdWx0aS1zdHIsIHByZWZlci1jb25zdCwgZnVuYy1uYW1lcyAqL1xubGV0IGxpbmtQYXRocztcbmNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCg/OlxcXFx3Oik/Lz8oPzpbLVxcXFx3Ll0rLykqWy1cXFxcdy5dKyk6KFxcXFxkKykoPzo6KFxcXFxkKykpPycsICdnJyk7XG4vLyAoKD86XFx3Oik/Lz8gICAgICAgICAgICAjIFByZWZpeCBvZiB0aGUgcGF0aCBlaXRoZXIgJy8nIG9yICdDOi8nIChvcHRpb25hbClcbi8vICg/OlstXFx3Ll0rLykqWy1cXHcuXSspICAjIFRoZSBwYXRoIG9mIHRoZSBmaWxlIHNvbWUvZmlsZS9wYXRoLmV4dFxuLy8gOihcXGQrKSAgICAgICAgICAgICAgICAgIyBMaW5lIG51bWJlciBwcmVmaXhlZCB3aXRoIGEgY29sb25cbi8vICg/OjooXFxkKykpPyAgICAgICAgICAgICMgQ29sdW1uIG51bWJlciBwcmVmaXhlZCB3aXRoIGEgY29sb24gKG9wdGlvbmFsKVxuXG5jb25zdCB0ZW1wbGF0ZSA9ICc8YSBjbGFzcz1cIi1saW5rZWQtcGF0aFwiIGRhdGEtcGF0aD1cIiQxXCIgZGF0YS1saW5lPVwiJDJcIiBkYXRhLWNvbHVtbj1cIiQzXCI+JCY8L2E+JztcblxuZXhwb3J0IGRlZmF1bHQgbGlua1BhdGhzID0gbGluZXMgPT4gbGluZXMucmVwbGFjZShyZWdleCwgdGVtcGxhdGUpO1xuXG5saW5rUGF0aHMubGlzdGVuID0gcGFyZW50VmlldyA9PlxuICBwYXJlbnRWaWV3Lm9uKCdjbGljaycsICcuLWxpbmtlZC1wYXRoJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsID0gdGhpcztcbiAgICBsZXQgeyBwYXRoLCBsaW5lLCBjb2x1bW4gfSA9IGVsLmRhdGFzZXQ7XG4gICAgbGluZSA9IE51bWJlcihsaW5lKSAtIDE7XG4gICAgLy8gY29sdW1uIG51bWJlciBpcyBvcHRpb25hbFxuICAgIGNvbHVtbiA9IGNvbHVtbiA/IE51bWJlcihjb2x1bW4pIC0gMSA6IDA7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGgsIHtcbiAgICAgIGluaXRpYWxMaW5lOiBsaW5lLFxuICAgICAgaW5pdGlhbENvbHVtbjogY29sdW1uLFxuICAgIH0pO1xuICB9KTtcbiJdfQ==