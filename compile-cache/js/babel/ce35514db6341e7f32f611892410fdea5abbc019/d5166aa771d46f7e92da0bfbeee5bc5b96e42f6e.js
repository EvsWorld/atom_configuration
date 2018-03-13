Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var Status = (0, _mobxReact.observer)(function (_ref) {
  var status = _ref.status;
  var style = _ref.style;

  switch (status) {
    case "running":
      return _react2["default"].createElement(
        "div",
        { className: "inline-container spinner", style: style },
        _react2["default"].createElement("div", { className: "rect1" }),
        _react2["default"].createElement("div", { className: "rect2" }),
        _react2["default"].createElement("div", { className: "rect3" }),
        _react2["default"].createElement("div", { className: "rect4" }),
        _react2["default"].createElement("div", { className: "rect5" })
      );
    case "ok":
      return _react2["default"].createElement("div", { className: "inline-container icon icon-check", style: style });
    case "empty":
      return _react2["default"].createElement("div", { className: "inline-container icon icon-zap", style: style });
    default:
      return _react2["default"].createElement("div", { className: "inline-container icon icon-x", style: style });
  }
});

exports["default"] = Status;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztxQkFFa0IsT0FBTzs7Ozt5QkFDQSxZQUFZOztBQUlyQyxJQUFNLE1BQU0sR0FBRyx5QkFBUyxVQUFDLElBQWlCLEVBQVk7TUFBM0IsTUFBTSxHQUFSLElBQWlCLENBQWYsTUFBTTtNQUFFLEtBQUssR0FBZixJQUFpQixDQUFQLEtBQUs7O0FBQ3RDLFVBQVEsTUFBTTtBQUNaLFNBQUssU0FBUztBQUNaLGFBQ0U7O1VBQUssU0FBUyxFQUFDLDBCQUEwQixFQUFDLEtBQUssRUFBRSxLQUFLLEFBQUM7UUFDckQsMENBQUssU0FBUyxFQUFDLE9BQU8sR0FBRztRQUN6QiwwQ0FBSyxTQUFTLEVBQUMsT0FBTyxHQUFHO1FBQ3pCLDBDQUFLLFNBQVMsRUFBQyxPQUFPLEdBQUc7UUFDekIsMENBQUssU0FBUyxFQUFDLE9BQU8sR0FBRztRQUN6QiwwQ0FBSyxTQUFTLEVBQUMsT0FBTyxHQUFHO09BQ3JCLENBQ047QUFBQSxBQUNKLFNBQUssSUFBSTtBQUNQLGFBQU8sMENBQUssU0FBUyxFQUFDLGtDQUFrQyxFQUFDLEtBQUssRUFBRSxLQUFLLEFBQUMsR0FBRyxDQUFDO0FBQUEsQUFDNUUsU0FBSyxPQUFPO0FBQ1YsYUFBTywwQ0FBSyxTQUFTLEVBQUMsZ0NBQWdDLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLENBQUM7QUFBQSxBQUMxRTtBQUNFLGFBQU8sMENBQUssU0FBUyxFQUFDLDhCQUE4QixFQUFDLEtBQUssRUFBRSxLQUFLLEFBQUMsR0FBRyxDQUFDO0FBQUEsR0FDekU7Q0FDRixDQUFDLENBQUM7O3FCQUVZLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9zdGF0dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5cbnR5cGUgUHJvcHMgPSB7IHN0YXR1czogc3RyaW5nLCBzdHlsZTogT2JqZWN0IH07XG5cbmNvbnN0IFN0YXR1cyA9IG9ic2VydmVyKCh7IHN0YXR1cywgc3R5bGUgfTogUHJvcHMpID0+IHtcbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIFwicnVubmluZ1wiOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtY29udGFpbmVyIHNwaW5uZXJcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVjdDFcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVjdDJcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVjdDNcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVjdDRcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVjdDVcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgY2FzZSBcIm9rXCI6XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtY29udGFpbmVyIGljb24gaWNvbi1jaGVja1wiIHN0eWxlPXtzdHlsZX0gLz47XG4gICAgY2FzZSBcImVtcHR5XCI6XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtY29udGFpbmVyIGljb24gaWNvbi16YXBcIiBzdHlsZT17c3R5bGV9IC8+O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtY29udGFpbmVyIGljb24gaWNvbi14XCIgc3R5bGU9e3N0eWxlfSAvPjtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1cztcbiJdfQ==