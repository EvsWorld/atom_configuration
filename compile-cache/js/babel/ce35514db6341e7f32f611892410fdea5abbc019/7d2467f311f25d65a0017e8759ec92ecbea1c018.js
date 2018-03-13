Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _nteractDisplayArea = require("@nteract/display-area");

var _nteractTransforms = require("@nteract/transforms");

var _reactRangeslider = require("react-rangeslider");

var _reactRangeslider2 = _interopRequireDefault(_reactRangeslider);

var _transforms = require("./transforms");

var counterStyle = {
  position: "absolute",
  pointerEvents: "none",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)"
};

var History = (0, _mobxReact.observer)(function (_ref) {
  var store = _ref.store;
  return (function () {
    var output = store.outputs[store.index];
    return output ? _react2["default"].createElement(
      "div",
      { className: "history" },
      _react2["default"].createElement(
        "div",
        { className: "slider" },
        _react2["default"].createElement("div", {
          className: "btn btn-xs icon icon-chevron-left",
          style: { position: "absolute", left: "0px" },
          onClick: store.decrementIndex
        }),
        _react2["default"].createElement(_reactRangeslider2["default"], {
          min: 0,
          max: store.outputs.length - 1,
          value: store.index,
          onChange: store.setIndex,
          tooltip: false
        }),
        _react2["default"].createElement(
          "div",
          { style: counterStyle },
          store.index + 1,
          "/",
          store.outputs.length
        ),
        _react2["default"].createElement("div", {
          className: "btn btn-xs icon icon-chevron-right",
          style: { position: "absolute", right: "0px" },
          onClick: store.incrementIndex
        })
      ),
      _react2["default"].createElement(
        "div",
        {
          className: "multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          }
        },
        _react2["default"].createElement(_nteractDisplayArea.Output, {
          output: (0, _mobx.toJS)(output),
          displayOrder: _transforms.displayOrder,
          transforms: _transforms.transforms,
          theme: "light",
          models: {},
          expanded: true
        })
      )
    ) : null;
  })();
});

exports["default"] = History;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7b0JBQ0osTUFBTTs7eUJBQ0YsWUFBWTs7a0NBQ2QsdUJBQXVCOztpQ0FDZCxxQkFBcUI7O2dDQUNsQyxtQkFBbUI7Ozs7MEJBRUcsY0FBYzs7QUFJdkQsSUFBTSxZQUFZLEdBQUc7QUFDbkIsVUFBUSxFQUFFLFVBQVU7QUFDcEIsZUFBYSxFQUFFLE1BQU07QUFDckIsTUFBSSxFQUFFLEtBQUs7QUFDWCxLQUFHLEVBQUUsS0FBSztBQUNWLFdBQVMsRUFBRSx1QkFBdUI7Q0FDbkMsQ0FBQzs7QUFFRixJQUFNLE9BQU8sR0FBRyx5QkFBUyxVQUFDLElBQVM7TUFBUCxLQUFLLEdBQVAsSUFBUyxDQUFQLEtBQUs7c0JBQStCO0FBQzlELFFBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFdBQU8sTUFBTSxHQUNYOztRQUFLLFNBQVMsRUFBQyxTQUFTO01BQ3RCOztVQUFLLFNBQVMsRUFBQyxRQUFRO1FBQ3JCO0FBQ0UsbUJBQVMsRUFBQyxtQ0FBbUM7QUFDN0MsZUFBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEFBQUM7QUFDN0MsaUJBQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxBQUFDO1VBQzlCO1FBQ0Y7QUFDRSxhQUFHLEVBQUUsQ0FBQyxBQUFDO0FBQ1AsYUFBRyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQUFBQztBQUM5QixlQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQUFBQztBQUNuQixrQkFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEFBQUM7QUFDekIsaUJBQU8sRUFBRSxLQUFLLEFBQUM7VUFDZjtRQUNGOztZQUFLLEtBQUssRUFBRSxZQUFZLEFBQUM7VUFDdEIsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDOztVQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTTtTQUNuQztRQUNOO0FBQ0UsbUJBQVMsRUFBQyxvQ0FBb0M7QUFDOUMsZUFBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEFBQUM7QUFDOUMsaUJBQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxBQUFDO1VBQzlCO09BQ0U7TUFDTjs7O0FBQ0UsbUJBQVMsRUFBQyx5Q0FBeUM7QUFDbkQsa0JBQVEsRUFBQyxJQUFJO0FBQ2IsZUFBSyxFQUFFO0FBQ0wsb0JBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsK0JBQStCLElBQUksU0FBUztXQUN0RSxBQUFDOztRQUVGO0FBQ0UsZ0JBQU0sRUFBRSxnQkFBSyxNQUFNLENBQUMsQUFBQztBQUNyQixzQkFBWSwwQkFBZTtBQUMzQixvQkFBVSx3QkFBYTtBQUN2QixlQUFLLEVBQUMsT0FBTztBQUNiLGdCQUFNLEVBQUUsRUFBRSxBQUFDO0FBQ1gsa0JBQVEsTUFBQTtVQUNSO09BQ0U7S0FDRixHQUNKLElBQUksQ0FBQztHQUNWO0NBQUEsQ0FBQyxDQUFDOztxQkFFWSxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvaGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHRvSlMgfSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIkBudGVyYWN0L2Rpc3BsYXktYXJlYVwiO1xuaW1wb3J0IHsgcmljaGVzdE1pbWV0eXBlIH0gZnJvbSBcIkBudGVyYWN0L3RyYW5zZm9ybXNcIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcInJlYWN0LXJhbmdlc2xpZGVyXCI7XG5cbmltcG9ydCB7IHRyYW5zZm9ybXMsIGRpc3BsYXlPcmRlciB9IGZyb20gXCIuL3RyYW5zZm9ybXNcIjtcblxuaW1wb3J0IHR5cGUgT3V0cHV0U3RvcmUgZnJvbSBcIi4uLy4uL3N0b3JlL291dHB1dFwiO1xuXG5jb25zdCBjb3VudGVyU3R5bGUgPSB7XG4gIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICBsZWZ0OiBcIjUwJVwiLFxuICB0b3A6IFwiNTAlXCIsXG4gIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIlxufTtcblxuY29uc3QgSGlzdG9yeSA9IG9ic2VydmVyKCh7IHN0b3JlIH06IHsgc3RvcmU6IE91dHB1dFN0b3JlIH0pID0+IHtcbiAgY29uc3Qgb3V0cHV0ID0gc3RvcmUub3V0cHV0c1tzdG9yZS5pbmRleF07XG4gIHJldHVybiBvdXRwdXQgPyAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJoaXN0b3J5XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNsaWRlclwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBpY29uIGljb24tY2hldnJvbi1sZWZ0XCJcbiAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBsZWZ0OiBcIjBweFwiIH19XG4gICAgICAgICAgb25DbGljaz17c3RvcmUuZGVjcmVtZW50SW5kZXh9XG4gICAgICAgIC8+XG4gICAgICAgIDxTbGlkZXJcbiAgICAgICAgICBtaW49ezB9XG4gICAgICAgICAgbWF4PXtzdG9yZS5vdXRwdXRzLmxlbmd0aCAtIDF9XG4gICAgICAgICAgdmFsdWU9e3N0b3JlLmluZGV4fVxuICAgICAgICAgIG9uQ2hhbmdlPXtzdG9yZS5zZXRJbmRleH1cbiAgICAgICAgICB0b29sdGlwPXtmYWxzZX1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17Y291bnRlclN0eWxlfT5cbiAgICAgICAgICB7c3RvcmUuaW5kZXggKyAxfS97c3RvcmUub3V0cHV0cy5sZW5ndGh9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi14cyBpY29uIGljb24tY2hldnJvbi1yaWdodFwiXG4gICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgcmlnaHQ6IFwiMHB4XCIgfX1cbiAgICAgICAgICBvbkNsaWNrPXtzdG9yZS5pbmNyZW1lbnRJbmRleH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJtdWx0aWxpbmUtY29udGFpbmVyIG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmb250U2l6ZTogYXRvbS5jb25maWcuZ2V0KGBIeWRyb2dlbi5vdXRwdXRBcmVhRm9udFNpemVgKSB8fCBcImluaGVyaXRcIlxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8T3V0cHV0XG4gICAgICAgICAgb3V0cHV0PXt0b0pTKG91dHB1dCl9XG4gICAgICAgICAgZGlzcGxheU9yZGVyPXtkaXNwbGF5T3JkZXJ9XG4gICAgICAgICAgdHJhbnNmb3Jtcz17dHJhbnNmb3Jtc31cbiAgICAgICAgICB0aGVtZT1cImxpZ2h0XCJcbiAgICAgICAgICBtb2RlbHM9e3t9fVxuICAgICAgICAgIGV4cGFuZGVkXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKSA6IG51bGw7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeTtcbiJdfQ==