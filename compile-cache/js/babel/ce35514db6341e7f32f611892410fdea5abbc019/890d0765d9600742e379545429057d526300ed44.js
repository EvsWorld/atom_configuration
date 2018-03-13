Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _nteractTransforms = require("@nteract/transforms");

var _utils = require("./../utils");

var displayOrder = ["text/html", "text/markdown", "text/plain"];

function hide() {
  atom.workspace.hide(_utils.INSPECTOR_URI);
  return null;
}

var Inspector = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.store.kernel;

  if (!kernel) return hide();

  var bundle = kernel.inspector.bundle;
  var mimetype = (0, _nteractTransforms.richestMimetype)(bundle, displayOrder, _nteractTransforms.transforms);

  if (!mimetype) return hide();
  var Transform = _nteractTransforms.transforms[mimetype];
  return _react2["default"].createElement(
    "div",
    {
      className: "native-key-bindings",
      tabIndex: "-1",
      style: {
        fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
      }
    },
    _react2["default"].createElement(Transform, { data: bundle[mimetype] })
  );
});

exports["default"] = Inspector;
module.exports = exports["default"];
/* $FlowFixMe React element `Transform`. Expected React component instead of Transform*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvaW5zcGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztxQkFFa0IsT0FBTzs7Ozt5QkFDQSxZQUFZOztpQ0FDTyxxQkFBcUI7O3FCQUVuQyxZQUFZOztBQUUxQyxJQUFNLFlBQVksR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBTWxFLFNBQVMsSUFBSSxHQUFHO0FBQ2QsTUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHNCQUFlLENBQUM7QUFDbkMsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxJQUFNLFNBQVMsR0FBRyx5QkFBUyxVQUFDLElBQXFCLEVBQVk7TUFBdEIsTUFBTSxHQUFqQixJQUFxQixDQUFuQixLQUFLLENBQUksTUFBTTs7QUFDM0MsTUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDOztBQUUzQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUN2QyxNQUFNLFFBQVEsR0FBRyx3Q0FBZ0IsTUFBTSxFQUFFLFlBQVksZ0NBQWEsQ0FBQzs7QUFFbkUsTUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLE1BQU0sU0FBUyxHQUFHLDhCQUFXLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFNBQ0U7OztBQUNFLGVBQVMsRUFBQyxxQkFBcUI7QUFDL0IsY0FBUSxFQUFDLElBQUk7QUFDYixXQUFLLEVBQUU7QUFDTCxnQkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywrQkFBK0IsSUFBSSxTQUFTO09BQ3RFLEFBQUM7O0lBR0YsaUNBQUMsU0FBUyxJQUFDLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLEFBQUMsR0FBRztHQUNqQyxDQUNOO0NBQ0gsQ0FBQyxDQUFDOztxQkFFWSxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvaW5zcGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IHsgcmljaGVzdE1pbWV0eXBlLCB0cmFuc2Zvcm1zIH0gZnJvbSBcIkBudGVyYWN0L3RyYW5zZm9ybXNcIjtcblxuaW1wb3J0IHsgSU5TUEVDVE9SX1VSSSB9IGZyb20gXCIuLy4uL3V0aWxzXCI7XG5cbmNvbnN0IGRpc3BsYXlPcmRlciA9IFtcInRleHQvaHRtbFwiLCBcInRleHQvbWFya2Rvd25cIiwgXCJ0ZXh0L3BsYWluXCJdO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4vLi4va2VybmVsXCI7XG5cbnR5cGUgUHJvcHMgPSB7IHN0b3JlOiB7IGtlcm5lbDogP0tlcm5lbCB9IH07XG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG4gIGF0b20ud29ya3NwYWNlLmhpZGUoSU5TUEVDVE9SX1VSSSk7XG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBJbnNwZWN0b3IgPSBvYnNlcnZlcigoeyBzdG9yZTogeyBrZXJuZWwgfSB9OiBQcm9wcykgPT4ge1xuICBpZiAoIWtlcm5lbCkgcmV0dXJuIGhpZGUoKTtcblxuICBjb25zdCBidW5kbGUgPSBrZXJuZWwuaW5zcGVjdG9yLmJ1bmRsZTtcbiAgY29uc3QgbWltZXR5cGUgPSByaWNoZXN0TWltZXR5cGUoYnVuZGxlLCBkaXNwbGF5T3JkZXIsIHRyYW5zZm9ybXMpO1xuXG4gIGlmICghbWltZXR5cGUpIHJldHVybiBoaWRlKCk7XG4gIGNvbnN0IFRyYW5zZm9ybSA9IHRyYW5zZm9ybXNbbWltZXR5cGVdO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBmb250U2l6ZTogYXRvbS5jb25maWcuZ2V0KGBIeWRyb2dlbi5vdXRwdXRBcmVhRm9udFNpemVgKSB8fCBcImluaGVyaXRcIlxuICAgICAgfX1cbiAgICA+XG4gICAgICB7LyogJEZsb3dGaXhNZSBSZWFjdCBlbGVtZW50IGBUcmFuc2Zvcm1gLiBFeHBlY3RlZCBSZWFjdCBjb21wb25lbnQgaW5zdGVhZCBvZiBUcmFuc2Zvcm0qL31cbiAgICAgIDxUcmFuc2Zvcm0gZGF0YT17YnVuZGxlW21pbWV0eXBlXX0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbnNwZWN0b3I7XG4iXX0=