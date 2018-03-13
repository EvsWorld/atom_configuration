Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports.toggleInspector = toggleInspector;

var _utils = require("./utils");

var _codeManager = require("./code-manager");

function toggleInspector(store) {
  var editor = store.editor;
  var kernel = store.kernel;

  if (!editor || !kernel) {
    atom.notifications.addInfo("No kernel running!");
    return;
  }

  var _getCodeToInspect = (0, _codeManager.getCodeToInspect)(editor);

  var _getCodeToInspect2 = _slicedToArray(_getCodeToInspect, 2);

  var code = _getCodeToInspect2[0];
  var cursorPos = _getCodeToInspect2[1];

  if (!code || cursorPos === 0) {
    atom.notifications.addInfo("No code to introspect!");
    return;
  }

  kernel.inspect(code, cursorPos, function (result) {
    (0, _utils.log)("Inspector: Result:", result);

    if (!result.found) {
      atom.workspace.hide(_utils.INSPECTOR_URI);
      atom.notifications.addInfo("No introspection available!");
      return;
    }

    kernel.setInspectorResult(result.data, editor);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbW1hbmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUVpRCxTQUFTOzsyQkFDekIsZ0JBQWdCOztBQUkxQyxTQUFTLGVBQWUsQ0FBQyxLQUFZLEVBQUU7TUFDcEMsTUFBTSxHQUFhLEtBQUssQ0FBeEIsTUFBTTtNQUFFLE1BQU0sR0FBSyxLQUFLLENBQWhCLE1BQU07O0FBQ3RCLE1BQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDdEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNqRCxXQUFPO0dBQ1I7OzBCQUV5QixtQ0FBaUIsTUFBTSxDQUFDOzs7O01BQTNDLElBQUk7TUFBRSxTQUFTOztBQUN0QixNQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7QUFDNUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxXQUFPO0dBQ1I7O0FBRUQsUUFBTSxDQUFDLE9BQU8sQ0FDWixJQUFJLEVBQ0osU0FBUyxFQUNULFVBQUMsTUFBTSxFQUF1QztBQUM1QyxvQkFBSSxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDakIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHNCQUFlLENBQUM7QUFDbkMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUMxRCxhQUFPO0tBQ1I7O0FBRUQsVUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDaEQsQ0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBsb2csIHJlYWN0RmFjdG9yeSwgSU5TUEVDVE9SX1VSSSB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBnZXRDb2RlVG9JbnNwZWN0IH0gZnJvbSBcIi4vY29kZS1tYW5hZ2VyXCI7XG5cbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUluc3BlY3RvcihzdG9yZTogc3RvcmUpIHtcbiAgY29uc3QgeyBlZGl0b3IsIGtlcm5lbCB9ID0gc3RvcmU7XG4gIGlmICghZWRpdG9yIHx8ICFrZXJuZWwpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIk5vIGtlcm5lbCBydW5uaW5nIVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBbY29kZSwgY3Vyc29yUG9zXSA9IGdldENvZGVUb0luc3BlY3QoZWRpdG9yKTtcbiAgaWYgKCFjb2RlIHx8IGN1cnNvclBvcyA9PT0gMCkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiTm8gY29kZSB0byBpbnRyb3NwZWN0IVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBrZXJuZWwuaW5zcGVjdChcbiAgICBjb2RlLFxuICAgIGN1cnNvclBvcyxcbiAgICAocmVzdWx0OiB7IGRhdGE6IE9iamVjdCwgZm91bmQ6IEJvb2xlYW4gfSkgPT4ge1xuICAgICAgbG9nKFwiSW5zcGVjdG9yOiBSZXN1bHQ6XCIsIHJlc3VsdCk7XG5cbiAgICAgIGlmICghcmVzdWx0LmZvdW5kKSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmhpZGUoSU5TUEVDVE9SX1VSSSk7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiTm8gaW50cm9zcGVjdGlvbiBhdmFpbGFibGUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGtlcm5lbC5zZXRJbnNwZWN0b3JSZXN1bHQocmVzdWx0LmRhdGEsIGVkaXRvcik7XG4gICAgfVxuICApO1xufVxuIl19