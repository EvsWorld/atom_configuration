Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _nteractDisplayArea = require("@nteract/display-area");

var _transforms = require("./transforms");

var ScrollList = (function (_React$Component) {
  _inherits(ScrollList, _React$Component);

  function ScrollList() {
    _classCallCheck(this, _ScrollList);

    _get(Object.getPrototypeOf(_ScrollList.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ScrollList, [{
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (!this.el) return;
      var scrollHeight = this.el.scrollHeight;
      var height = this.el.clientHeight;
      var maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.scrollToBottom();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollToBottom();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      if (this.props.outputs.length === 0) return null;
      return _react2["default"].createElement(
        "div",
        {
          className: "scroll-list multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          },
          ref: function (el) {
            _this.el = el;
          }
        },
        _react2["default"].createElement(_nteractDisplayArea.Display, {
          outputs: (0, _mobx.toJS)(this.props.outputs),
          displayOrder: _transforms.displayOrder,
          transforms: _transforms.transforms,
          theme: "light",
          models: {},
          expanded: true
        })
      );
    }
  }]);

  var _ScrollList = ScrollList;
  ScrollList = (0, _mobxReact.observer)(ScrollList) || ScrollList;
  return ScrollList;
})(_react2["default"].Component);

exports["default"] = ScrollList;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9ldmFuaGVuZHJpeDEvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt5QkFDQSxZQUFZOztvQkFDaEIsTUFBTTs7a0NBQ0gsdUJBQXVCOzswQkFDTixjQUFjOztJQU9qRCxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzs7Ozs7ZUFBVixVQUFVOztXQUdBLDBCQUFHO0FBQ2YsVUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTztBQUNyQixVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztBQUMxQyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztBQUNwQyxVQUFNLFlBQVksR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztLQUN6RDs7O1dBRWlCLDhCQUFHO0FBQ25CLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRUssa0JBQUc7OztBQUNQLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNqRCxhQUNFOzs7QUFDRSxtQkFBUyxFQUFDLHFEQUFxRDtBQUMvRCxrQkFBUSxFQUFDLElBQUk7QUFDYixlQUFLLEVBQUU7QUFDTCxvQkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywrQkFBK0IsSUFBSSxTQUFTO1dBQ3RFLEFBQUM7QUFDRixhQUFHLEVBQUUsVUFBQSxFQUFFLEVBQUk7QUFDVCxrQkFBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO1dBQ2QsQUFBQzs7UUFFRjtBQUNFLGlCQUFPLEVBQUUsZ0JBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQUFBQztBQUNsQyxzQkFBWSwwQkFBZTtBQUMzQixvQkFBVSx3QkFBYTtBQUN2QixlQUFLLEVBQUMsT0FBTztBQUNiLGdCQUFNLEVBQUUsRUFBRSxBQUFDO0FBQ1gsa0JBQVEsRUFBRSxJQUFJLEFBQUM7VUFDZjtPQUNFLENBQ047S0FDSDs7O29CQTFDRyxVQUFVO0FBQVYsWUFBVSw0QkFBVixVQUFVLEtBQVYsVUFBVTtTQUFWLFVBQVU7R0FBUyxtQkFBTSxTQUFTOztxQkE2Q3pCLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2V2YW5oZW5kcml4MS8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSBcIkBudGVyYWN0L2Rpc3BsYXktYXJlYVwiO1xuaW1wb3J0IHsgdHJhbnNmb3JtcywgZGlzcGxheU9yZGVyIH0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuXG5pbXBvcnQgdHlwZSB7IElPYnNlcnZhYmxlQXJyYXkgfSBmcm9tIFwibW9ieFwiO1xuXG50eXBlIFByb3BzID0geyBvdXRwdXRzOiBJT2JzZXJ2YWJsZUFycmF5PE9iamVjdD4gfTtcblxuQG9ic2VydmVyXG5jbGFzcyBTY3JvbGxMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzPiB7XG4gIGVsOiA/SFRNTEVsZW1lbnQ7XG5cbiAgc2Nyb2xsVG9Cb3R0b20oKSB7XG4gICAgaWYgKCF0aGlzLmVsKSByZXR1cm47XG4gICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5lbC5zY3JvbGxIZWlnaHQ7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3QgbWF4U2Nyb2xsVG9wID0gc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0O1xuICAgIHRoaXMuZWwuc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wID4gMCA/IG1heFNjcm9sbFRvcCA6IDA7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm91dHB1dHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJzY3JvbGwtbGlzdCBtdWx0aWxpbmUtY29udGFpbmVyIG5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgICB0YWJJbmRleD1cIi0xXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmb250U2l6ZTogYXRvbS5jb25maWcuZ2V0KGBIeWRyb2dlbi5vdXRwdXRBcmVhRm9udFNpemVgKSB8fCBcImluaGVyaXRcIlxuICAgICAgICB9fVxuICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxEaXNwbGF5XG4gICAgICAgICAgb3V0cHV0cz17dG9KUyh0aGlzLnByb3BzLm91dHB1dHMpfVxuICAgICAgICAgIGRpc3BsYXlPcmRlcj17ZGlzcGxheU9yZGVyfVxuICAgICAgICAgIHRyYW5zZm9ybXM9e3RyYW5zZm9ybXN9XG4gICAgICAgICAgdGhlbWU9XCJsaWdodFwiXG4gICAgICAgICAgbW9kZWxzPXt7fX1cbiAgICAgICAgICBleHBhbmRlZD17dHJ1ZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsTGlzdDtcbiJdfQ==