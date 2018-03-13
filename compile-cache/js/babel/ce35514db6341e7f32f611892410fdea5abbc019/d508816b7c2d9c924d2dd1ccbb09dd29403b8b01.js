Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _watch = require("./watch");

var _watch2 = _interopRequireDefault(_watch);

var _utils = require("../../utils");

var Watches = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.store.kernel;

  if (!kernel) {
    if (atom.config.get("Hydrogen.outputAreaDock")) {
      return _react2["default"].createElement(_utils.EmptyMessage, null);
    } else {
      atom.workspace.hide(_utils.WATCHES_URI);
      return null;
    }
  }

  return _react2["default"].createElement(
    "div",
    { className: "sidebar watch-sidebar" },
    kernel.watchesStore.watches.map(function (watch) {
      return _react2["default"].createElement(_watch2["default"], { key: watch.editor.id, store: watch });
    }),
    _react2["default"].createElement(
      "div",
      { className: "btn-group" },
      _react2["default"].createElement(
        "button",
        {
          className: "btn btn-primary icon icon-plus",
          onClick: kernel.watchesStore.addWatch
        },
        "Add watch"
      ),
      _react2["default"].createElement(
        "button",
        {
          className: "btn btn-error icon icon-trashcan",
          onClick: kernel.watchesStore.removeWatch
        },
        "Remove watch"
      )
    )
  );
});

exports["default"] = Watches;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvd2F0Y2gtc2lkZWJhci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3FCQUN4QixPQUFPOzs7O3lCQUNBLFlBQVk7O3FCQUVuQixTQUFTOzs7O3FCQUNlLGFBQWE7O0FBS3ZELElBQU0sT0FBTyxHQUFHLHlCQUFTLFVBQUMsSUFBcUIsRUFBdUI7TUFBakMsTUFBTSxHQUFqQixJQUFxQixDQUFuQixLQUFLLENBQUksTUFBTTs7QUFDekMsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRTtBQUM5QyxhQUFPLDJEQUFnQixDQUFDO0tBQ3pCLE1BQU07QUFDTCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksb0JBQWEsQ0FBQztBQUNqQyxhQUFPLElBQUksQ0FBQztLQUNiO0dBQ0Y7O0FBRUQsU0FDRTs7TUFBSyxTQUFTLEVBQUMsdUJBQXVCO0lBQ25DLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7YUFDcEMsdURBQU8sR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxBQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHO0tBQzlDLENBQUM7SUFDRjs7UUFBSyxTQUFTLEVBQUMsV0FBVztNQUN4Qjs7O0FBQ0UsbUJBQVMsRUFBQyxnQ0FBZ0M7QUFDMUMsaUJBQU8sRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQUFBQzs7O09BRy9CO01BQ1Q7OztBQUNFLG1CQUFTLEVBQUMsa0NBQWtDO0FBQzVDLGlCQUFPLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLEFBQUM7OztPQUdsQztLQUNMO0dBQ0YsQ0FDTjtDQUNILENBQUMsQ0FBQzs7cUJBRVksT0FBTyIsImZpbGUiOiIvVXNlcnMvZXZhbmhlbmRyaXgxLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3dhdGNoLXNpZGViYXIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcblxuaW1wb3J0IFdhdGNoIGZyb20gXCIuL3dhdGNoXCI7XG5pbXBvcnQgeyBXQVRDSEVTX1VSSSwgRW1wdHlNZXNzYWdlIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi8uLi9rZXJuZWxcIjtcbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uLy4uL3N0b3JlXCI7XG5cbmNvbnN0IFdhdGNoZXMgPSBvYnNlcnZlcigoeyBzdG9yZTogeyBrZXJuZWwgfSB9OiB7IHN0b3JlOiBzdG9yZSB9KSA9PiB7XG4gIGlmICgha2VybmVsKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLm91dHB1dEFyZWFEb2NrXCIpKSB7XG4gICAgICByZXR1cm4gPEVtcHR5TWVzc2FnZSAvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS53b3Jrc3BhY2UuaGlkZShXQVRDSEVTX1VSSSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZWJhciB3YXRjaC1zaWRlYmFyXCI+XG4gICAgICB7a2VybmVsLndhdGNoZXNTdG9yZS53YXRjaGVzLm1hcCh3YXRjaCA9PiAoXG4gICAgICAgIDxXYXRjaCBrZXk9e3dhdGNoLmVkaXRvci5pZH0gc3RvcmU9e3dhdGNofSAvPlxuICAgICAgKSl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGljb24gaWNvbi1wbHVzXCJcbiAgICAgICAgICBvbkNsaWNrPXtrZXJuZWwud2F0Y2hlc1N0b3JlLmFkZFdhdGNofVxuICAgICAgICA+XG4gICAgICAgICAgQWRkIHdhdGNoXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1lcnJvciBpY29uIGljb24tdHJhc2hjYW5cIlxuICAgICAgICAgIG9uQ2xpY2s9e2tlcm5lbC53YXRjaGVzU3RvcmUucmVtb3ZlV2F0Y2h9XG4gICAgICAgID5cbiAgICAgICAgICBSZW1vdmUgd2F0Y2hcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBXYXRjaGVzO1xuIl19