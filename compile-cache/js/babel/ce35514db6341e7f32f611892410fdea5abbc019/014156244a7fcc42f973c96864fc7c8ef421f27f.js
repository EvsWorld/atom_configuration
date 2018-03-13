Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var StatusBar = (0, _mobxReact.observer)(function (_ref) {
  var _ref$store = _ref.store;
  var kernel = _ref$store.kernel;
  var configMapping = _ref$store.configMapping;
  var onClick = _ref.onClick;

  if (!kernel || configMapping.get("Hydrogen.statusBarDisable")) return null;
  return _react2["default"].createElement(
    "a",
    { onClick: onClick },
    kernel.displayName,
    " | ",
    kernel.executionState
  );
});

exports["default"] = StatusBar;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvc3RhdHVzLWJhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7eUJBQ0EsWUFBWTs7QUFVckMsSUFBTSxTQUFTLEdBQUcseUJBQ2hCLFVBQUMsSUFBNkMsRUFBWTttQkFBekQsSUFBNkMsQ0FBM0MsS0FBSztNQUFJLE1BQU0sY0FBTixNQUFNO01BQUUsYUFBYSxjQUFiLGFBQWE7TUFBSSxPQUFPLEdBQTNDLElBQTZDLENBQVQsT0FBTzs7QUFDMUMsTUFBSSxDQUFDLE1BQU0sSUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDM0UsU0FDRTs7TUFBRyxPQUFPLEVBQUUsT0FBTyxBQUFDO0lBQ2pCLE1BQU0sQ0FBQyxXQUFXOztJQUFLLE1BQU0sQ0FBQyxjQUFjO0dBQzNDLENBQ0o7Q0FDSCxDQUNGLENBQUM7O3FCQUVhLFNBQVMiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9zdGF0dXMtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4vLi4va2VybmVsXCI7XG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLy4uL3N0b3JlXCI7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHN0b3JlOiB7IGtlcm5lbDogP0tlcm5lbCwgY29uZmlnTWFwcGluZzogTWFwPHN0cmluZywgbWl4ZWQ+IH0sXG4gIG9uQ2xpY2s6IEZ1bmN0aW9uXG59O1xuXG5jb25zdCBTdGF0dXNCYXIgPSBvYnNlcnZlcihcbiAgKHsgc3RvcmU6IHsga2VybmVsLCBjb25maWdNYXBwaW5nIH0sIG9uQ2xpY2sgfTogUHJvcHMpID0+IHtcbiAgICBpZiAoIWtlcm5lbCB8fCBjb25maWdNYXBwaW5nLmdldChcIkh5ZHJvZ2VuLnN0YXR1c0JhckRpc2FibGVcIikpIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoXG4gICAgICA8YSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAge2tlcm5lbC5kaXNwbGF5TmFtZX0gfCB7a2VybmVsLmV4ZWN1dGlvblN0YXRlfVxuICAgICAgPC9hPlxuICAgICk7XG4gIH1cbik7XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c0JhcjtcbiJdfQ==